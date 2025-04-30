/**
 * Have to use 3rd-party lib from @hulk/common
 *
 * @description
 * 1. use the script
 * ```sh
 * yarn install:lib <lib_name>
 * ```
 * The script will install the lib to @hulk/common
 *
 * 2. add the lib export in @hulk/common/index.ts, remember to use the specific import for 3-rd package you need.
 * ```ts
 * export { Button } from "antd";
 * ```
 * 3. add the lib import in the component
 * ```ts
 * import { Button } from "@hulk/common";
 * ```
 */
import { React } from "@hulk/common";
import { useThreeDCommon } from "./context";
import { alarmType, ThreeDPropsInterface, updateConfigObjectType } from "./type.ts";
import { BaseTriggerActions } from "@hulk/common";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
// 各种加载器
import { TransformControls, GLTFLoader, FBXLoader, MTLLoader, OBJLoader, STLLoader } from "@hulk/common";
import type { GLTF } from "@hulk/common";
import { Button, Col, Collapse, Form, Input, InputNumber, Row, Slider, Spin, Switch, Tree } from "@hulk/common";
import "./index.css";
import defaultConfigs from "./configs.ts";

const { DirectoryTree } = Tree;
const domId = "3d-dom"

const ThreeD: React.FC = (props: ThreeDPropsInterface | {}) => {
  const { widgetData, updateWidgetData, resetWidgetData, triggerAction } = useThreeDCommon();

  const { useState, useRef, useEffect, useMemo } = React;

  const data: ThreeDPropsInterface = useMemo(() => {
    return {
      ...defaultConfigs,
      ...props,
      ...widgetData,
    };
  }, [props, widgetData]);

  // determine isStorybook(Dev) or Production(Built)
  const isStorybook = data.isStorybook ?? false;

  const [loading, setLoading] = useState<boolean>(true);
  const mountRef = useRef<HTMLDivElement | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const transformControlsRef = useRef<TransformControls | null>(null);

  // 加载模型文件
  const [externalGeometry, setExternalGeometry] = useState<
    THREE.BufferGeometry | THREE.Object3D | ArrayBuffer | GLTF
    | null
  >(null);
  // 记录模型类型
  const [externalObjectType, setExternalObjectType] = useState<string>("");
  const [children, setChildren] = useState<THREE.Mesh<any, any, any>[]>([]);

  const wheelTimeoutRef = useRef<number | null>(null);
  const [cameraPosition, setCameraPosition] = useState({
    x: 0,
    y: 0,
    z: 0
  })

  const [controlsTarget, setControlsTarget] = useState({
    x: 0,
    y: 0,
    z: 0
  })

  // 控制模式
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  // 整理逻辑
  // highlightedObjectRef用于当前操作物体
  // highlightedObjects在加载时记录所有object，用于物体变动后复位
  // highlightedObjectMaterialRef用于使选择的高亮物体在非高亮时切换回原来材质
  // highlightedEdge用于高亮选择的边
  const highlightedObjectRef = useRef<THREE.Object3D | THREE.Mesh | null>(null);
  const [highlightedObjects, setHighlightedObjects] = useState<
    Map<string, THREE.Object3D | THREE.Mesh>
  >(new Map());
  const [highlighted, setHighlighted] = useState<number>(0);
  const highlightedObjectMaterialRef = useRef<THREE.Material | THREE.Material[] | null>(null);

  // 选择的物体的八面体
  const octahedronRef = useRef<THREE.LineSegments | null>(null);
  const [controlForm] = Form.useForm();
  const [objectForm] = Form.useForm();
  const [materialForm] = Form.useForm();
  const [currentMaterial, setCurrentMaterial] = useState<MTLLoader.MaterialCreator | null>(null);
  const [originalMaterial, setOriginalMaterial] = useState(null);
  const [originalMaterials, setOriginalMaterials] = useState(new Map());
  const [transformControlMode, setTransformControlMode] = useState<
    "translate" | "rotate" | "scale"
  >("translate");

  const onChange = (changed: Record<string, any>) => {
    const key = Object.keys(changed)[0];
    // TODO
    updateWidgetData({
      [key]: changed[key]
    }, isStorybook)
    // setParams(p => {
    //   return {
    //     ...p,
    //     [key]: changed[key]
    //   }
    // })
  };

  const handleObjectValueChange = (changed: Record<string, any>) => {
    const key = Object.keys(changed)[0];
    const obj = highlightedObjectRef.current ? highlightedObjectRef.current as any : externalGeometry as any;

    if (key in obj) {
      if (typeof changed[key] === "object") {
        const subKey = Object.keys(changed[key])[0];
        if (subKey in obj[key]) {
          (obj[key] as any)[subKey] = changed[key][subKey];
        }
      } else {
        (obj as any)[key] = changed[key];
      }
    }

  };

  // 创建渐变纹理
  function createGradientTexture() {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    canvas.width = typeof data.width === "number" ? data.width : 300; // 设置较小的尺寸
    canvas.height = typeof data.height === "number" ? data.height : 300

    // 创建线性渐变，上浅蓝，下白色
    const gradient = context!.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, "#87CEFA"); // 浅蓝色
    gradient.addColorStop(1, "#FFFFFF"); // 白色

    context!.fillStyle = gradient;
    context!.fillRect(0, 0, canvas.width, canvas.height);

    const texture = new THREE.CanvasTexture(canvas);
    texture.magFilter = THREE.LinearFilter; // 设置纹理过滤
    texture.minFilter = THREE.LinearFilter;

    return texture;
  }

  // 计算八面体和旋转轴心
  // @ts-ignore
  const createOctahedronAroundObject = (object) => {
    // 计算物体的包围盒
    const boundingBox = new THREE.Box3().setFromObject(object);
    const min = boundingBox.min;
    const max = boundingBox.max;

    // 计算八面体顶点
    const vertices = [
      new THREE.Vector3(min.x, min.y, min.z), // 顶点 1
      new THREE.Vector3(max.x, min.y, min.z), // 顶点 2
      new THREE.Vector3(min.x, max.y, min.z), // 顶点 3
      new THREE.Vector3(max.x, max.y, min.z), // 顶点 4
      new THREE.Vector3(min.x, min.y, max.z), // 顶点 5
      new THREE.Vector3(max.x, min.y, max.z), // 顶点 6
      new THREE.Vector3(min.x, max.y, max.z), // 顶点 7
      new THREE.Vector3(max.x, max.y, max.z), // 顶点 8
    ];

    // 定义八面体的所有边（顶点索引对）
    const edgesIndices = [
      [0, 1],
      [0, 2],
      [0, 4],
      [1, 3],
      [1, 5],
      [2, 3],
      [2, 6],
      [3, 7],
      [4, 5],
      [4, 6],
      [5, 7],
      [6, 7],
    ];

    // 创建八面体几何体
    const octahedronGeometry = new THREE.BufferGeometry();
    const verticesArray = new Float32Array(vertices.flatMap((v) => [v.x, v.y, v.z]));
    octahedronGeometry.setAttribute("position", new THREE.BufferAttribute(verticesArray, 3));

    // 八面体的边索引
    const edgeIndicesArray = new Uint16Array(edgesIndices.flat());
    const indexAttribute = new THREE.BufferAttribute(edgeIndicesArray, 1);
    octahedronGeometry.setIndex(indexAttribute);
    // 创建边线对象
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x00ff00 });
    const octahedronEdges = new THREE.LineSegments(octahedronGeometry, lineMaterial);

    // 返回八面体
    return { octahedronEdges };
  };

  const cancelHighLightedObject = () => {
    if (highlightedObjectRef.current && highlightedObjectMaterialRef.current) {
      // @ts-ignore
      (highlightedObjectRef.current as THREE.Mesh).material =
        highlightedObjectMaterialRef.current;
      highlightedObjectMaterialRef.current = null; // 清空原始材质引用
    } else if (highlightedObjectRef.current) {
      (
        (highlightedObjectRef.current as THREE.Mesh).material as THREE.MeshBasicMaterial
      ).color.set(0xffffff);
    }

    highlightedObjectRef.current = null; // 清空高亮对象引用
    if (transformControlsRef.current) {
      transformControlsRef.current.detach();
      transformControlsRef.current.visible = false;
    }

    // 重新打开整个视图的控制
    if (controlsRef.current) controlsRef.current.enabled = true;
    setHighlighted(0);
  }

  // 鼠标交互，检查有没有点击到物体
  const onDocumentMouseClick = (event: MouseEvent, canvasRect: DOMRect) => {
    // enableObjectEdit为false表示处于可选物体和取消可选状态
    // 为true表示物体处于编辑状态
    event.preventDefault();
    event.stopPropagation();
    if (cameraRef.current && sceneRef.current && !isStorybook) {
      const rect = mountRef.current?.getBoundingClientRect()
      mouse.x = ((event.clientX - (rect?.left || 0) - ((rect?.width || 0) - (canvasRect?.width ?? 0)) / 2) / (typeof data.width === "number" ? data.width : 300)) * 2 - 1;
      mouse.y =
        -((event.clientY - (rect?.top || 0) - ((rect?.top || 0) - (canvasRect?.top ?? 0)) / 2) / (typeof data.height === "number" ? data.height : 300)) * 2 + 1;

      // 更新 raycaster 的位置和方向
      raycaster.setFromCamera(mouse, cameraRef.current);

      // 获取与场景中所有物体的交集
      const intersects = raycaster
        .intersectObjects(sceneRef.current.children, true)
        .filter(
          (s) =>
            s.object.name !== "" &&
            !["X", "Y", "Z", "XZ", "YZ", "XY", "XYZ", "XYZE", "DELTA", "AXIS"].includes(
              s.object.name,
            ),
        );
      if (intersects.length > 0) {
        // 获取第一个被点击的对象
        const intersectedObject = intersects[0].object;

        // 如果有上一个高亮的对象，恢复原色
        if (highlightedObjectRef.current && highlightedObjectMaterialRef.current) {
          // @ts-ignore
          (highlightedObjectRef.current as THREE.Mesh).material =
            highlightedObjectMaterialRef.current;
        } else if (highlightedObjectRef.current) {
          (
            (highlightedObjectRef.current as THREE.Mesh).material as THREE.MeshBasicMaterial
          ).color.set(0xffffff);
        }

        if (intersectedObject instanceof THREE.Mesh) {
          highlightedObjectMaterialRef.current = intersectedObject.material.clone();
          highlightedObjectRef.current = intersectedObject;
          // 暂停整个视图的控制
          if (controlsRef.current) controlsRef.current.enabled = false;
          // 设置高亮色
          const highlightMaterial = new THREE.MeshBasicMaterial({
            color: "#1890ff",
            transparent: intersectedObject.material.transparent,
            opacity: intersectedObject.material.opacity,
          });

          // 将目标对象的材质设置为高亮材质
          (intersectedObject.material as THREE.Material) = highlightMaterial;
        }
        setHighlighted((p) => (p % 10) + 1);
      } else {
        cancelHighLightedObject()
      }
    }
  };


  useEffect(() => {
    setLoading(true);

    const link = data.externalSourceLink
    const objectType =
      link?.toLowerCase().endsWith(".glb") || link?.toLowerCase().endsWith(".gltf")
        ? "gltf"
        : link?.toLowerCase().endsWith(".obj")
          ? "obj"
          : link?.toLowerCase().endsWith(".fbx")
            ? "fbx"
            : link?.toLowerCase().endsWith(".stl")
              ? "stl"
              : "other";
    setExternalObjectType(objectType);

    const loader =
      objectType === "gltf"
        ? new GLTFLoader()
        : objectType === "obj"
          ? new OBJLoader()
          : objectType === "fbx"
            ? new FBXLoader()
            : new STLLoader();

    if (objectType === "obj") {
      const materialLoader = new MTLLoader();
      try {
        if (link) materialLoader.load(link?.replace(".obj", ".mtl"), (materials) => {
          materials.preload();
          setCurrentMaterial(materials);
          (loader as OBJLoader).setMaterials(materials);
        });
      } catch (e) {
        console.error(e);
      }
      if (link) loader.load(
        link,
        (example) => {
          setExternalGeometry(example);
          const tempChildren = [] as THREE.Mesh<any, any, any>[];
          const materialsMap = new Map();
          (example as THREE.Object3D).traverse((child) => {
            if (child instanceof THREE.Mesh) {
              // 由于每个mesh都会存在自己的几何中心，所以无法在外面创建
              // 如果用默认的几何中心进行旋转会出错
              // 所以需要在遍历时重新计算几何中心，再将中心移动到局部原点
              // 然后设为child的自身中心
              if (!children.find((c) => c.uuid === child.uuid)) {
                const boundingBox = new THREE.Box3().setFromObject(child);
                const geometryCenter = boundingBox.getCenter(new THREE.Vector3());
                child.geometry.translate(
                  -geometryCenter.x,
                  -geometryCenter.y,
                  -geometryCenter.z,
                );

                // 将几何中心设为自身中心
                child.position.copy(geometryCenter);
              }

              materialsMap.set(child.uuid, child.material);

              tempChildren.push(child);
            }
          });
          setOriginalMaterials(materialsMap);
          setChildren(tempChildren);
        },
        undefined,
        (error) => {
          console.error("An error occurred loading the glTF model:", error);
        },
      );
    } else
      if (link) loader.load(
        link,
        (example) => {
          if (objectType === "stl") {
            // 细分
            // const tessellateModifier = new TessellateModifier(1); // 可以根据模型大小调整这个值
            // const tessellatedGeometry = tessellateModifier.modify(example as THREE.BufferGeometry);
            // stl目前来看全是法线，导入材质没什么问题
          }

          setExternalGeometry(example);
          setCurrentMaterial(null);
        },
        undefined,
        (error) => {
          console.error("An error occurred loading the glTF model:", error);
        },
      );

  }, [data.externalSourceLink]);

  useEffect(() => {
    if (mountRef.current) {
      // 创建场景
      const scene = new THREE.Scene();

      sceneRef.current = scene;
      // 创建相机
      const camera = new THREE.PerspectiveCamera(
        75,
        (typeof data.width === "number" ? data.width : 300) / (typeof data.height === "number" ? data.height : 300),
        0.1,
        1000,
      );
      camera.position.set(cameraPosition.x, cameraPosition.y, cameraPosition.z)
      camera.lookAt(controlsTarget.x, controlsTarget.y, controlsTarget.z);
      cameraRef.current = camera;
      // 创建渲染器
      const renderer = new THREE.WebGLRenderer({
        antialias: true,
      });
      renderer.setSize(typeof data.width === "number" ? data.width : 300, typeof data.height === "number" ? data.height : 300);
      mountRef.current.appendChild(renderer.domElement);

      // 创建 100x100 的网格
      if (data.grid) {
        const gridHelper = new THREE.GridHelper(100, 100);
        gridHelper.rotation.y = Math.PI / 2;
        scene.add(gridHelper);
      }

      // 创建一个组 (Group)，将所有物体添加到该组中
      const sceneGroup = new THREE.Group();

      sceneGroup.position.set(0, 0, 0);
      sceneGroup.rotation.set(0, 0, 0);
      sceneGroup.scale.set(data.xScale || 1, data.yScale || 1, data.zScale || 1)


      if (data.shallowTheme) {
        scene.background = createGradientTexture();

      }

      const controls = new OrbitControls(camera, renderer.domElement);

      controls.update();
      controlsRef.current = controls;

      const handleMouseUp = () => {
        setCameraPosition({
          x: camera.position.x,
          y: camera.position.y,
          z: camera.position.z,
        });
        setControlsTarget({
          x: controls.target.x,
          y: controls.target.y,
          z: controls.target.z,
        });

      };

      const handleWheel = (event: WheelEvent) => {
        event.preventDefault();

        // 根据滚轮滚动的方向调整相机的位置
        const delta = event.deltaY * 0.01; // 调整滚轮灵敏度
        camera.position.z += delta; // 例如，沿 Z 轴移动相机

        if (wheelTimeoutRef.current) {
          clearTimeout(wheelTimeoutRef.current); // 清除之前的超时
        }

        setCameraPosition({
          x: camera.position.x,
          y: camera.position.y,
          z: camera.position.z,
        });
        setControlsTarget({
          x: controls.target.x,
          y: controls.target.y,
          z: controls.target.z,
        });

      };

      const transformControls = new TransformControls(camera, renderer.domElement);
      transformControls.visible = false;
      scene.add(transformControls);
      transformControlsRef.current = transformControls;

      renderer.domElement.addEventListener("mouseup", handleMouseUp);
      renderer.domElement.addEventListener("wheel", handleWheel);
      renderer.domElement.addEventListener("mousedown", (event) => {
        onDocumentMouseClick(event, renderer.domElement.getBoundingClientRect());
      });

      if (externalObjectType === "stl" && externalGeometry) {
        console.log(externalGeometry, "stl外部模型加载成功");
        // 如果透明开启，表示查看内部，这时候外面材质参数要取消，否则里面太细碎
        const disabledExternalMaterialConfigs = data.transparent
          ? {}
          : {
            metalness: 0.4, // 金属感
            roughness: 0.4, // 粗糙度
            reflectivity: 0.5, // 反射率
            clearcoat: 1.0, // 漆面
            clearcoatRoughness: 0.1, // 漆面粗糙度
            emissive: 0xff0000, // 自发光
            transmission: 0.3, // 透光性
          };
        // 创建材质
        const material = new THREE.MeshPhysicalMaterial({
          color: 0xffffff,
          ...disabledExternalMaterialConfigs,
          flatShading: true,
          wireframe: data.transparent,
          transparent: data.transparent,
          opacity: 0.3,
        });

        // 创建网格并添加到场景
        const mesh = new THREE.Mesh(externalGeometry as THREE.BufferGeometry, material);
        sceneGroup.add(mesh);

        // 调整模型的位置、旋转和缩放（可选）
        mesh.position.set(0, 0, 0);
        mesh.rotation.set(-Math.PI / 2, 0, 0); // 将模型摆正
        mesh.scale.set(0.02, 0.02, 0.02); // 根据模型大小进行缩放
      } else if (externalObjectType === "gltf" && externalGeometry) {
        console.log(externalGeometry, "gltf外部模型加载成功");
        // @ts-ignore
        sceneGroup.add(externalGeometry.scene);
      } else if (externalObjectType === "obj" && externalGeometry) {
        console.log(externalGeometry, "obj外部模型加载成功");
        const disabledExternalMaterialConfigs = data.transparent
          ? {}
          : {
            metalness: 0.4, // 金属感
            roughness: 0.4, // 粗糙度
            reflectivity: 0.5, // 反射率
            clearcoat: 1.0, // 漆面
            clearcoatRoughness: 0.1, // 漆面粗糙度
            emissive: 0xff0000, // 自发光
            transmission: 0.3, // 透光性
          };

        (externalGeometry as THREE.Object3D).traverse((child) => {
          if (child instanceof THREE.Mesh) {
            // 设置透明材质
            const alarmIndex = (data.alarms as alarmType[])?.findIndex((al) => al.name === child.name)

            if (data.alarms?.length && alarmIndex > -1) {
              child.material = new THREE.MeshPhysicalMaterial({
                color: data.alarms[alarmIndex].color,
                metalness: 0.4,
                roughness: 0.4,
                reflectivity: 0.5,
                clearcoat: 1.0,
                clearcoatRoughness: 0.1,
                emissive: 0xff0000,
                transmission: 0.3,
                flatShading: true,
                wireframe: false,
                transparent: false,
                opacity: 0.3,
              });
            } else if (currentMaterial === null || data.wireframe) {
              child.material = new THREE.MeshPhysicalMaterial({
                color: 0xffffff,
                ...disabledExternalMaterialConfigs,
                flatShading: true,
                wireframe: data.transparent,
                transparent: data.transparent,
                opacity: 0.3,
              });
            } else if (!data.wireframe) {
              const originalMat = originalMaterials.get(child.uuid);
              if (child.material) {
                if (Array.isArray(child.material)) {
                  child.material.forEach(m => m.dispose());
                } else {
                  child.material.dispose();
                }
              }
              child.material = originalMat;
            }
          }
        });

        (externalGeometry as THREE.Object3D).scale.set(0.02, 0.02, 0.02);

        sceneGroup.add(externalGeometry as THREE.Object3D);
      } else if (externalObjectType === "fbx" && externalGeometry) {
        console.log(externalGeometry, "fbx外部模型加载成功");
        // @ts-ignore
        sceneGroup.add(externalGeometry);
        // 如果模型带有动画，可以通过以下方式播放动画
        // @ts-ignore
        if (externalGeometry.animations && externalGeometry.animations.length > 0) {
          // @ts-ignore
          const mixer = new THREE.AnimationMixer(externalGeometry);
          // @ts-ignore
          externalGeometry.animations.forEach((clip) => {
            mixer.clipAction(clip).play();
          });

          // 动画更新函数
          const clock = new THREE.Clock();
          const animate = () => {
            requestAnimationFrame(animate);
            const delta = clock.getDelta();
            mixer.update(delta);
            renderer.render(scene, camera);
          };
          animate();
        } else {
          // 无动画的情况下，仅渲染模型
          const animate = () => {
            requestAnimationFrame(animate);
            renderer.render(scene, camera);
          };
          animate();
        }
      }

      // 添加环境光
      const ambientLight = new THREE.AmbientLight(0xffffff, data.ambientLight);
      sceneGroup.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
      directionalLight.position.set(10, 10, 10);
      directionalLight.castShadow = true; // 开启阴影
      sceneGroup.add(directionalLight);

      // 添加点光源
      const pointLight = new THREE.PointLight(0xffffff, 2);
      pointLight.position.set(5, 5, 5);
      sceneGroup.add(pointLight);
      scene.add(sceneGroup); // 将组添加到场景中

      // 动画循环
      const animate = () => {
        requestAnimationFrame(animate);
        controls.update();

        renderer.setViewport(0, 0, typeof data.width === "number" ? data.width : 300, typeof data.height === "number" ? data.height : 300); // 恢复主场景视口到全屏
        renderer.clear(); // 清除整个屏幕
        renderer.render(scene, camera); // 渲染主场景

        renderer.clearDepth(); // 清除深度缓存，以确保小视口不受主视口的影响
      };
      // 注意fbx有自己的动画载入
      if (externalObjectType !== "fbx") animate();
    }

    if (loading) {
      setLoading(false);
    }

    // 清理函数，卸载时删除渲染器的 DOM 元素
    return () => {
      if (sceneRef.current) {
        // 遍历场景中的每个对象并释放资源
        sceneRef.current.traverse((object) => {
          if (object instanceof THREE.Mesh) {
            // 清理几何体
            if (object.geometry) object.geometry.dispose();
            if (object.material) {
              // 清理材质
              if (Array.isArray(object.material)) {
                object.material.forEach((material) => material.dispose());
              } else {
                object.material.dispose();
              }
            }
          }
        });
        // 删除场景
        sceneRef.current.clear();
        sceneRef.current = null;
      }

      if (controlsRef.current) {
        // 释放控制器
        controlsRef.current.dispose();
        controlsRef.current = null;
      }

      // 清理 DOM 元素
      if (mountRef.current) {
        while (mountRef.current.firstChild) {
          mountRef.current.removeChild(mountRef.current.firstChild);
        }
      }
    };
  }, [externalGeometry, data.width, data.height, data.ambientLight, data.shallowTheme, data.wireframe, data.transparent, data.grid, data.xScale, data.yScale, data.zScale, data.alarms]);


  useEffect(() => {
    if (cameraRef.current && controlsRef.current) {
      cameraRef.current.position.set(
        cameraPosition.x,
        cameraPosition.y,
        cameraPosition.z,
      );
      controlsRef.current.target.set(
        controlsTarget.x,
        controlsTarget.y,
        controlsTarget.z,
      );
    }

    if (externalObjectType === "obj" && externalGeometry) {
      // 应用变动
      const updatedConfigsMap = new Map<string, updateConfigObjectType>(
        // JSON.parse(configs?.updatedConfigs.data ?? []),
        []
      );

      (externalGeometry as THREE.Object3D).traverse((child) => {
        if (child instanceof THREE.Mesh) {
          // 将记录下来的变动应用到每个child上
          const childUpdateConfig = updatedConfigsMap.get(child.name);
          // 如果找到这个updateConfig那就应用变动
          if (childUpdateConfig) {
            child.position.copy(childUpdateConfig.position);
            child.scale.copy(childUpdateConfig.scale);
            child.rotation.x = childUpdateConfig.rotation.x;
            child.rotation.y = childUpdateConfig.rotation.y;
            child.rotation.z = childUpdateConfig.rotation.z;
          } else {
            // 如果没找到，说明这个object应该在它原来的位置上，由于这个object可能已经变动过了，需要把它set回去，不然undo没有效果
            const originChild = highlightedObjects.get(child.name);

            if (originChild) {
              child.position.copy(originChild.position);
              child.scale.copy(originChild.scale);
              child.rotation.x = originChild.rotation.x;
              child.rotation.y = originChild.rotation.y;
              child.rotation.z = originChild.rotation.z;
            }
          }
        }
      });
    }

    // 清除旧八面体
    if (octahedronRef.current && sceneRef.current) {
      sceneRef.current.remove(octahedronRef.current);
      octahedronRef.current.geometry.dispose();
      (octahedronRef.current.material as THREE.Material).dispose();
      octahedronRef.current = null;
    }
    // 有highlighted的object就去找configs?.updatedConfigs.data
    // 如果configs?.updatedConfigs.data里没有就set 0；
    // 如果没有highlighted的object也去set 0
    if (
      highlighted &&
      highlightedObjectRef.current &&
      sceneRef.current
    ) {
      const updatedConfigsMap = new Map<string, updateConfigObjectType>(
        // JSON.parse(configs?.updatedConfigs.data ?? []),
        []
      );
      if (transformControlsRef.current) {
        if (highlightedObjectRef.current) {
          transformControlsRef.current.setMode(transformControlMode);
          transformControlsRef.current.attach(highlightedObjectRef.current);

          transformControlsRef.current.visible = true;
        } else {
          transformControlsRef.current.detach();

          transformControlsRef.current.visible = false;
        }
      }

      const formConfig = updatedConfigsMap.get(highlightedObjectRef.current.name);

      // 创建八面体并添加到场景中
      const { octahedronEdges } = createOctahedronAroundObject(highlightedObjectRef.current);

      sceneRef.current.add(octahedronEdges);
      octahedronRef.current = octahedronEdges;

      const originalMat = originalMaterials.get(highlightedObjectRef.current.uuid);
      setOriginalMaterial(originalMat);

      objectForm.setFieldsValue(highlightedObjectRef.current);
      materialForm.setFieldsValue(originalMat)
      if (formConfig) {
        controlForm.setFieldsValue({
          xScenePosition: formConfig.position.x,
          yScenePosition: formConfig.position.y,
          zScenePosition: formConfig.position.z,

          xSceneRotation: formConfig.rotation.x,
          ySceneRotation: formConfig.rotation.y,
          zSceneRotation: formConfig.rotation.z,

          xScale: formConfig.scale.x,
          yScale: formConfig.scale.y,
          zScale: formConfig.scale.z,
        });
      } else {
        controlForm.setFieldsValue({
          xScenePosition: 0,
          yScenePosition: 0,
          zScenePosition: 0,

          xSceneRotation: 0,
          ySceneRotation: 0,
          zSceneRotation: 0,

          xScale: 1,
          yScale: 1,
          zScale: 1,
        });
      }
    } else {
      objectForm.setFieldsValue(externalGeometry);
      setOriginalMaterial(null);
      materialForm.setFieldsValue(null)

      // const formConfig = form?.configs;

      // if (formConfig) {
      //   controlForm.setFieldsValue({
      //     xScenePosition: formConfig.xScenePosition.data,
      //     yScenePosition: formConfig.yScenePosition.data,
      //     zScenePosition: formConfig.zScenePosition.data,

      //     xSceneRotation: formConfig.xSceneRotation.data,
      //     ySceneRotation: formConfig.ySceneRotation.data,
      //     zSceneRotation: formConfig.zSceneRotation.data,

      //     xScale: formConfig.xScale.data,
      //     yScale: formConfig.yScale.data,
      //     zScale: formConfig.zScale.data,
      //   });
      // }
    }




    return () => { };
  }, [cameraPosition, controlsTarget, highlighted,
    highlightedObjects,]);

  useEffect(() => {

    controlForm.setFieldsValue(data)
  }, [data])

  return (
    <Row>
      <Col span={3}>
        <Collapse
          collapsible="icon"
          defaultActiveKey={"3DController"}
          style={{
            position: "absolute",
            backgroundColor: "white",
            padding: "0px 5px",
            opacity: 0.7,
            width: "100%",
          }}
          items={[
            {
              key: "3DController",
              label: (
                <span className="Card" style={{ width: "100%", display: "block" }}>
                  3D Controller
                </span>
              ),
              children: highlightedObjectRef.current ? (
                <>
                  <Row>
                    <Col className="three-controller" span={24}>
                      <Button
                        size="small"
                        disabled={transformControlMode === "translate"}
                        onClick={() => {
                          setTransformControlMode("translate");
                        }}
                      >
                        移动模式
                      </Button>
                    </Col>
                    <Col className="three-controller" span={24}>
                      <Button
                        size="small"
                        disabled={transformControlMode === "rotate"}
                        onClick={() => {
                          setTransformControlMode("rotate");
                        }}
                      >
                        旋转模式
                      </Button>
                    </Col>
                    <Col className="three-controller" span={24}>
                      <Button
                        size="small"
                        disabled={transformControlMode === "scale"}
                        onClick={() => {
                          setTransformControlMode("scale");
                        }}
                      >
                        缩放
                      </Button>
                    </Col>
                    <Col className="three-controller" span={24}>
                      <Button size="small"
                        onClick={() => cancelHighLightedObject()}>取消选择</Button>
                    </Col>
                  </Row>
                </>
              ) : (
                <Row>
                  <Col span={24}>
                    <Form form={controlForm} onValuesChange={onChange}>
                      <Row>
                        {/* <Col className="three-controller" span={24}>
                            <Form.Item label="x轴移动" name="xScenePosition">
                              <InputNumber size="small" />
                            </Form.Item>
                          </Col>
                          <Col className="three-controller" span={24}>
                            <Form.Item label="y轴移动" name="yScenePosition">
                              <InputNumber size="small" />
                            </Form.Item>
                          </Col>
                          <Col className="three-controller" span={24}>
                            <Form.Item label="z轴移动" name="zScenePosition">
                              <InputNumber size="small" />
                            </Form.Item>
                          </Col>

                          <Col className="three-controller" span={24}>
                            <Form.Item label="x轴旋转" name="xSceneRotation">
                              <InputNumber size="small" step={0.01} />
                            </Form.Item>
                          </Col>
                          <Col className="three-controller" span={24}>
                            <Form.Item label="y轴旋转" name="ySceneRotation">
                              <InputNumber size="small" step={0.01} />
                            </Form.Item>
                          </Col>
                          <Col className="three-controller" span={24}>
                            <Form.Item label="z轴旋转" name="zSceneRotation">
                              <InputNumber size="small" step={0.01} />
                            </Form.Item>
                          </Col> */}
                        <Col className="three-controller" span={24}>
                          <Form.Item label="x轴缩放" name="xScale">
                            <InputNumber size="small" />
                          </Form.Item>
                        </Col>
                        <Col className="three-controller" span={24}>
                          <Form.Item label="y轴缩放" name="yScale">
                            <InputNumber size="small" />
                          </Form.Item>
                        </Col>
                        <Col className="three-controller" span={24}>
                          <Form.Item label="z轴缩放" name="zScale">
                            <InputNumber size="small" />
                          </Form.Item>
                        </Col>
                        <Col className="three-controller" span={24}>
                          <Form.Item label="浅色背景" name="shallowTheme">
                            <Switch />
                          </Form.Item>
                        </Col>
                        {data.externalSourceLink && (
                          <>
                            <Col className="three-controller" span={24}>
                              <Form.Item label="环境光" name="ambientLight">
                                <Slider min={0.01} max={5} step={0.1} />
                              </Form.Item>
                            </Col>
                            {/* <Col className="three-controller" span={24}>
                                <Form.Item label="方向光" name="directionalLight">
                                  <Slider min={0.01} max={5} step={0.1} />
                                </Form.Item>
                              </Col> */}
                            <Col className="three-controller" span={24}>
                              <Form.Item label="线框模式" name="wireframe">
                                <Switch />
                              </Form.Item>
                            </Col>
                            <Col className="three-controller" span={24}>
                              <Form.Item label="透明" name="transparent">
                                <Switch />
                              </Form.Item>
                            </Col>
                            <Col className="three-controller" span={24}>
                              <Form.Item label="网格" name="grid">
                                <Switch />
                              </Form.Item>
                            </Col>
                            {/* <Col className="three-controller" span={24}>
                                <Form.Item label="透明度" name="opacityPercent">
                                  <Slider min={0.1} max={1} step={0.1} />
                                </Form.Item>
                              </Col> */}
                          </>
                        )}

                      </Row>
                    </Form>
                  </Col>
                </Row>
              ),
            },
          ]}
        />
      </Col>
      <Col span={15}>
        {loading ? <Spin /> : <div
          ref={mountRef}
          id={domId}
          style={{
            width: data.width,
            height: data.height,
            alignItems: "top",
            justifyContent: "center",
            display: "flex",
            visibility: loading ? "hidden" : "visible",
          }}
        />}
      </Col>
      {externalObjectType == "obj" && <>
        <Col span={3}>
          <Collapse
            collapsible="icon"
            defaultActiveKey={"3DStructure"}
            style={{
              position: "absolute",
              backgroundColor: "white",
              padding: "0px 5px",
              opacity: 0.7,
              width: "100%",
            }}

            items={[
              {
                key: "3DStructure",
                label: (
                  <span className="Card" style={{ width: "100%", display: "block" }}>
                    3D Structure
                  </span>
                ),
                children:
                  <>
                    {/* <List>
                      {children?.map((item) => {
                        return (
                          <List.Item key={`${item.name}`}
                            style={{
                              border: highlightedObjectRef.current?.name === item.name ? "1px solid red" : "",
                              paddingLeft: "8px"
                            }}
                            actions={[
                              <Button
                                type="link"
                                style={{ width: "100%", color: "#1890ff" }}
                                onClick={() => {
                                  setCurrentEditItem(item);
                                  // setChildEditorModalVisible(true);

                                  // 如果有上一个高亮的对象，恢复原色
                                  if (
                                    highlightedObjectRef.current &&
                                    highlightedObjectMaterialRef.current
                                  ) {
                                    // @ts-ignore
                                    (highlightedObjectRef.current as THREE.Mesh).material =
                                      highlightedObjectMaterialRef.current;
                                  } else if (highlightedObjectRef.current) {
                                    (
                                      (highlightedObjectRef.current as THREE.Mesh)
                                        .material as THREE.MeshBasicMaterial
                                    ).color.set(0xffffff);
                                  }

                                  highlightedObjectMaterialRef.current = item.material.clone();
                                  highlightedObjectRef.current = item;
                                  if (controlsRef.current) controlsRef.current.enabled = false;


                                  // 设置高亮色
                                  const highlightMaterial = new THREE.MeshBasicMaterial({
                                    color: 0xff0000,
                                    transparent: item.material.transparent,
                                    opacity: item.material.opacity,
                                  });

                                  // 将目标对象的材质设置为高亮材质
                                  (item.material as THREE.Material) = highlightMaterial;

                                  setHighlighted((p) => (p % 10) + 1);
                                }}
                              >
                                Select
                              </Button>
                            ]}>

                            {item.name}

                          </List.Item>
                        );
                      })}
                    </List> */}
                    <DirectoryTree
                      treeData={children.length === 0 ? [] : [...children.map((c) => {
                        return {
                          title: c.name,
                          key: c.uuid,
                          children: c.children.map((cc) => {
                            return {
                              title: cc.name,
                              key: cc.uuid,
                              objectRef: cc
                            }
                          }),
                          objectRef: c
                        }
                      })]}
                      defaultExpandAll
                      onSelect={(_, { selectedNodes }) => {
                        if (selectedNodes[0]?.objectRef) {
                          const item = selectedNodes[0]?.objectRef;
                          // 如果有上一个高亮的对象，恢复原色
                          if (
                            highlightedObjectRef.current &&
                            highlightedObjectMaterialRef.current
                          ) {
                            // @ts-ignore
                            (highlightedObjectRef.current as THREE.Mesh).material =
                              highlightedObjectMaterialRef.current;
                          } else if (highlightedObjectRef.current) {
                            (
                              (highlightedObjectRef.current as THREE.Mesh)
                                .material as THREE.MeshBasicMaterial
                            ).color.set(0xffffff);
                          }

                          highlightedObjectMaterialRef.current = item.material.clone();
                          highlightedObjectRef.current = item;
                          if (controlsRef.current) controlsRef.current.enabled = false;


                          // 设置高亮色
                          const highlightMaterial = new THREE.MeshBasicMaterial({
                            color: "#1890ff",
                            transparent: item.material.transparent,
                            opacity: item.material.opacity,
                          });

                          // 将目标对象的材质设置为高亮材质
                          (item.material as THREE.Material) = highlightMaterial;

                          setHighlighted((p) => (p % 10) + 1);
                        } else {
                          highlightedObjectRef.current = null
                        }
                      }}
                    />
                  </>
              }]}
          />

        </Col>
        <Col span={3}>
          <Collapse
            collapsible="icon"
            defaultActiveKey={"Properties"}
            style={{
              position: "absolute",
              backgroundColor: "white",
              padding: "0px 5px",
              opacity: 0.7,
              width: "100%",
            }}
            items={[
              {
                key: "Properties",
                label: (
                  <span className="Card" style={{ width: "100%", display: "block" }}>
                    Object Properties
                  </span>
                ),
                children:
                  <>
                    <Form form={objectForm} onValuesChange={handleObjectValueChange}>
                      <Row>
                        <Col className="three-controller" span={24}>
                          <Form.Item label="名称" name={"name"}>
                            <Input disabled size="small" />
                          </Form.Item>
                        </Col>
                        <Col className="three-controller" span={24}>
                          <Form.Item label="x轴移动" name={["position", "x"]}>
                            <InputNumber size="small" />
                          </Form.Item>
                        </Col>
                        <Col className="three-controller" span={24}>
                          <Form.Item label="y轴移动" name={["position", "y"]}>
                            <InputNumber size="small" />
                          </Form.Item>
                        </Col>
                        <Col className="three-controller" span={24}>
                          <Form.Item label="z轴移动" name={["position", "z"]}>
                            <InputNumber size="small" />
                          </Form.Item>
                        </Col>
                        <Col className="three-controller" span={24}>
                          <Form.Item label="x轴旋转" name={["rotation", "x"]}>
                            <InputNumber size="small" step={0.02} />
                          </Form.Item>
                        </Col>
                        <Col className="three-controller" span={24}>
                          <Form.Item label="y轴旋转" name={["rotation", "y"]}>
                            <InputNumber size="small" step={0.02} />
                          </Form.Item>
                        </Col>
                        <Col className="three-controller" span={24}>
                          <Form.Item label="z轴旋转" name={["rotation", "z"]}>
                            <InputNumber size="small" step={0.02} />
                          </Form.Item>
                        </Col>
                        <Col className="three-controller" span={24}>
                          <Form.Item label="x轴缩放" name={["scale", "x"]}>
                            <InputNumber size="small" step={0.02} />
                          </Form.Item>
                        </Col>
                        <Col className="three-controller" span={24}>
                          <Form.Item label="y轴缩放" name={["scale", "y"]}>
                            <InputNumber size="small" step={0.02} />
                          </Form.Item>
                        </Col>
                        <Col className="three-controller" span={24}>
                          <Form.Item label="z轴缩放" name={["scale", "z"]}>
                            <InputNumber size="small" step={0.02} />
                          </Form.Item>
                        </Col>


                      </Row>
                    </Form>
                    {originalMaterial && <Form form={materialForm}>
                      <Col className="three-controller" span={24}>
                        <Form.Item label="材质名称" name={"name"}>
                          <Input disabled size="small" />
                        </Form.Item>
                      </Col>
                      <Col className="three-controller" span={24}>
                        <Form.Item label="材质颜色R" name={["color", "r"]}>
                          <InputNumber size="small" disabled />
                        </Form.Item>
                      </Col>
                      <Col className="three-controller" span={24}>
                        <Form.Item label="材质颜色G" name={["color", "g"]}>
                          <InputNumber size="small" disabled />
                        </Form.Item>
                      </Col>
                      <Col className="three-controller" span={24}>
                        <Form.Item label="材质颜色B" name={["color", "b"]}>
                          <InputNumber size="small" disabled />
                        </Form.Item>
                      </Col>
                    </Form>}
                  </>
              }]}
          />
        </Col>
      </>}
    </Row>
  );
}

export default ThreeD;
