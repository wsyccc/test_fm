import { React } from "@hulk/common";
import * as THREE from "three";
import { OrbitControls } from "@hulk/common";
// 各种加载器
import { TransformControls, GLTFLoader, FBXLoader, MTLLoader, OBJLoader, STLLoader, gsap } from "@hulk/common";
import type { GLTF } from "@hulk/common";
import { Col, Row, Spin } from "@hulk/common";
import { SpeedThreeDPropsInterface } from "./type";
import { useSpeedThreeDCommon } from "./context";
import defaultConfigs from "./configs.ts";

const domId = "speed-3d-dom"

const SpeedThreeD: React.FC = (props: SpeedThreeDPropsInterface | {}) => {
  const { widgetData } = useSpeedThreeDCommon();

  const { useState, useRef, useEffect, useMemo } = React;

  const data: SpeedThreeDPropsInterface = useMemo(() => {
    return {
      ...defaultConfigs,
      ...props,
      ...widgetData,
    };
  }, [props, widgetData]);

  const [loading, setLoading] = useState<boolean>(true);
  const mountRef = useRef<HTMLDivElement | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);

  // 加载模型文件
  const [externalGeometry, setExternalGeometry] = useState<
    THREE.BufferGeometry | THREE.Object3D | ArrayBuffer | GLTF
    | null
  >(null);
  // 记录模型类型
  const [externalObjectType, setExternalObjectType] = useState<string>("");
  const [children, setChildren] = useState<THREE.Mesh<any, any, any>[]>([]);
  const [highlighted, setHighlighted] = useState<number>(0);

  // 材质文件
  const [currentMaterial, setCurrentMaterial] = useState<MTLLoader.MaterialCreator | null>(null);
  const [originalMaterials, setOriginalMaterials] = useState(new Map());


  const wheelTimeoutRef = useRef<number | null>(null);
  // const [cameraPosition, setCameraPosition] = useState(data.cameraPosition ?? {
  //   x: 0,
  //   y: 0,
  //   z: 0
  // })

  // const [controlsTarget, setControlsTarget] = useState(data.controlsTarget ?? {
  //   x: 0,
  //   y: 0,
  //   z: 0
  // })

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
            setOriginalMaterials(materialsMap);
            setChildren(tempChildren);
          });
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
      camera.position.copy(data.cameraPosition ?? {
        x: 0,
        y: 0,
        z: 0
      })
      camera.lookAt(data.controlsTarget?.x ?? 0, data.controlsTarget?.y ?? 0, data.controlsTarget?.z ?? 0);
      cameraRef.current = camera;
      // 创建渲染器
      const renderer = new THREE.WebGLRenderer({
        antialias: true,
      });
      renderer.setSize(typeof data.width === "number" ? data.width : 300, typeof data.height === "number" ? data.height : 300);
      mountRef.current.appendChild(renderer.domElement);

      const gridHelper = new THREE.GridHelper(100, 100);
      gridHelper.rotation.y = Math.PI / 2;
      scene.add(gridHelper);


      // 创建一个组 (Group)，将所有物体添加到该组中
      const sceneGroup = new THREE.Group();

      sceneGroup.position.set(0, 0, 0);
      sceneGroup.rotation.set(0, 0, 0);
      sceneGroup.scale.set(1, 1, 1)

      scene.background = createGradientTexture();

      const controls = new OrbitControls(camera, renderer.domElement);

      controls.update();
      controlsRef.current = controls;

      const handleWheel = (event: WheelEvent) => {
        event.preventDefault();

        // 根据滚轮滚动的方向调整相机的位置
        const delta = event.deltaY * 0.01; // 调整滚轮灵敏度
        camera.position.z += delta; // 例如，沿 Z 轴移动相机

        if (wheelTimeoutRef.current) {
          clearTimeout(wheelTimeoutRef.current); // 清除之前的超时
        }
      };

      const transformControls = new TransformControls(camera, renderer.domElement);
      transformControls.visible = false;
      scene.add(transformControls);

      renderer.domElement.addEventListener("wheel", handleWheel);


      if (externalObjectType === "stl" && externalGeometry) {
        console.log(externalGeometry, "stl外部模型加载成功");

        // 创建材质
        const material = new THREE.MeshPhysicalMaterial({
          color: 0xffffff,
          metalness: 0.4, // 金属感
          roughness: 0.4, // 粗糙度
          reflectivity: 0.5, // 反射率
          clearcoat: 1.0, // 漆面
          clearcoatRoughness: 0.1, // 漆面粗糙度
          emissive: 0x000000, // 自发光
          transmission: 0.3, // 透光性
          flatShading: true,
          wireframe: false,
          transparent: false,
          opacity: 0.3,
        });

        const mesh = new THREE.Mesh(externalGeometry as THREE.BufferGeometry, material);
        sceneGroup.add(mesh);

        // 调整模型的位置、旋转和缩放（可选）
        mesh.position.set(0, 0, 0);
        mesh.scale.set(0.02, 0.02, 0.02); // 根据模型大小进行缩放
      } else if (externalObjectType === "gltf" && externalGeometry) {
        console.log(externalGeometry, "gltf外部模型加载成功");
        // @ts-ignore
        sceneGroup.add(externalGeometry.scene);
      } else if (externalObjectType === "obj" && externalGeometry) {

        const updatedConfigsMap = new Map(
          (data.updatedConfigs ?? []).map(({ name, ...rest }) => [name, rest])
        );
        console.log(externalGeometry, "obj外部模型加载成功");

        (externalGeometry as THREE.Object3D).traverse((child) => {
          if (child instanceof THREE.Mesh) {
            const childUpdateConfig = updatedConfigsMap.get(child.name);
            // 如果找到这个updateConfig那就应用变动

            if (childUpdateConfig?.position) {
              child.position.copy(childUpdateConfig.position);

            }
            if (childUpdateConfig?.scale) {
              child.scale.copy(childUpdateConfig.scale);

            }
            if (childUpdateConfig?.rotation) {
              child.rotation.x = childUpdateConfig.rotation.x;
              child.rotation.y = childUpdateConfig.rotation.y;
              child.rotation.z = childUpdateConfig.rotation.z;
            }


            if (childUpdateConfig?.color) {
              child.material = new THREE.MeshPhysicalMaterial({
                color: childUpdateConfig?.color,
                // 如果开启下面的设定，包括自发光、透明、反射、金属漆等等，颜色不会严格变成用户设定的颜色
                // metalness: 0.4,
                // roughness: 0.4,
                // reflectivity: 0.5,
                // clearcoat: 1.0,
                // clearcoatRoughness: 0.1,
                // emissive: 0xff0000,
                // transmission: 0.3,
                // flatShading: true,
                // wireframe: false,
                // transparent: false,
                // opacity: 0.3,
              });
            } else if (currentMaterial === null) {
              child.material = new THREE.MeshPhysicalMaterial({
                color: 0xffffff
              });
            } else {
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
      const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
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
    setHighlighted((p) => (p % 10) + 1);

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
  }, [externalGeometry, data.width, data.height, data.updatedConfigs]);

  useEffect(() => {
    // data.focusItemName变动时，camera视角会变动
    if (data.focusItemName && cameraRef.current && controlsRef.current) {
      const focusItem = children.find(child => child.name === data.focusItemName)
      if (focusItem) {
        const objectWorldPosition = new THREE.Vector3();
        focusItem.getWorldPosition(objectWorldPosition);

        // 获取当前朝向，保持朝向不变的情况下移动相机
        const objectWorldDirection = new THREE.Vector3();
        objectWorldDirection.subVectors(controlsRef.current.target, cameraRef.current.position).normalize();

        // 根据物体大小决定相机和它的相对距离，物体/图层越小距离越近
        const box = new THREE.Box3().setFromObject(focusItem);
        const size = box.getSize(new THREE.Vector3()).length();
        const distance = size * 1.4;
        const finalCameraPosition = objectWorldPosition.clone().sub(objectWorldDirection.multiplyScalar(distance));

        // 视角转动动画
        const duration = 1.2;
        gsap.to(cameraRef.current.position, {
          x: finalCameraPosition.x,
          y: finalCameraPosition.y,
          z: finalCameraPosition.z,
          duration,
          onUpdate: () => {
            if (controlsRef.current)
              controlsRef.current.update(); // 保证 OrbitControls 正确更新
          },
          onComplete: () => {
            cameraRef.current!.position.copy(finalCameraPosition)
          }
        });

        // 动画 controls.target
        gsap.to(controlsRef.current.target, {
          x: objectWorldPosition.x,
          y: objectWorldPosition.y,
          z: objectWorldPosition.z,
          duration,
          onUpdate: () => {
            controlsRef.current!.update();
          },
          onComplete: () => {
            if (controlsRef.current)
              controlsRef.current.target.copy(objectWorldPosition)
          }
        });
      }

    }
  }, [highlighted, data.focusItemName])

  useEffect(() => {
    if (data.cameraPosition) {
      cameraRef.current?.position.copy(data.cameraPosition)
    }
    if (data.controlsTarget) {
      controlsRef.current?.target.copy(data.controlsTarget)
    }
  }, [data.cameraPosition, data.controlsTarget])

  useEffect(() => {
    console.log('send back', data);
  }, [])

  return (
    <Row>

      <Col span={16}>
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

    </Row>
  );
}

export default SpeedThreeD;
