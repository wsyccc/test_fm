#!/usr/bin/env ts-node

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

function printHelp() {
    console.log(`
使用说明:

用法: yarn install:lib <lib1> [lib2] ... [options]

参数说明:
  <lib>           要安装的库名称，可以一次传入多个库。
  -D              将库作为开发依赖安装到根目录（使用 yarn add -D -W）。
  --<targetName>  指定安装目标包的名称，例如：
                   --barchart 将安装到 packages/barchart
                   --linchart 将安装到 packages/linchart

示例:
  yarn install:lib dayjs
  yarn install:lib echarts echarts-stat echarts-for-react
  yarn install:lib echarts echarts-stat echarts-for-react --barchart
  yarn install:lib dayjs -D

说明:
  - 默认情况下，库会安装到 packages/common，并自动在 packages/common/index.ts 文件中追加对应的导出语句。
  - 使用 -D 标记时，库会作为开发依赖安装到项目根目录（带 -W 工作区标记）。
  - 使用 --<targetName> 标记时，库会安装到 packages/<targetName> 目录下，不会自动追加导出语句。
  - 如果指定的 target package 目录不存在，请检查目录名称是否正确。
`);
}

const args = process.argv.slice(2);

if (args.length === 0) {
    console.error('❌ 错误：未提供任何参数。');
    printHelp();
    process.exit(1);
}

// 判断是否为开发依赖
const isDev = args.includes('-D');

// 筛选出所有以 "--" 开头的目标包标记（例如 --barchart 或 --linchart），并只取第一个
const targetFlags = args.filter(arg => arg.startsWith('--'));
let targetName: string | null = null;
if (targetFlags.length > 0) {
    targetName = targetFlags[0].substring(2);
}

// 排除掉所有标记（-D 和 -- 开头）的参数，剩下的即为库名
const libNames = args.filter(arg => arg !== '-D' && !arg.startsWith('--'));
if (libNames.length === 0) {
    console.error('❌ 错误：未提供库名。');
    printHelp();
    process.exit(1);
}

const rootDir = path.resolve(__dirname, '..');

if (targetName) {
    const targetDir = path.join(rootDir, 'packages', targetName);
    if (!fs.existsSync(targetDir)) {
        console.error(`❌ 错误：目标包目录 packages/${targetName} 不存在。`);
        printHelp();
        process.exit(1);
    }
    console.log(`📦 正在安装 ${libNames.join(' ')} 到 packages/${targetName}`);
    try {
        execSync(`yarn add ${libNames.join(' ')}`, {
            cwd: targetDir,
            stdio: 'inherit'
        });
    } catch (error) {
        console.error('❌ 安装过程中出现错误，请检查包名是否正确。');
        printHelp();
        process.exit(1);
    }
} else if (isDev) {
    console.log(`📦 正在以开发依赖方式安装 ${libNames.join(' ')} 到根目录 (-D -W)`);
    try {
        execSync(`yarn add ${libNames.join(' ')} -D -W`, {
            cwd: rootDir,
            stdio: 'inherit'
        });
    } catch (error) {
        console.error('❌ 安装过程中出现错误，请检查包名是否正确。');
        printHelp();
        process.exit(1);
    }
} else {
    // 默认安装到 packages/common 并自动追加导出语句
    const commonDir = path.join(rootDir, 'packages/common');
    const indexPath = path.join(commonDir, 'index.ts');
    console.log(`📦 正在安装 ${libNames.join(' ')} 到 packages/common`);
    try {
        execSync(`yarn add ${libNames.join(' ')}`, {
            cwd: commonDir,
            stdio: 'inherit'
        });
    } catch (error) {
        console.error('❌ 安装过程中出现错误，请检查包名是否正确。');
        printHelp();
        process.exit(1);
    }

    // 读取 packages/common/index.ts 的内容
    let content = fs.readFileSync(indexPath, 'utf-8');
    libNames.forEach(libName => {
        const exportLine = `export * from '${libName}';`;
        if (content.includes(exportLine)) {
            console.log(`✅ packages/common/index.ts 中已存在 ${libName} 的导出`);
        } else {
            fs.appendFileSync(indexPath, `\n${exportLine}\n`);
            console.log(`✨ 已自动在 index.ts 中添加：\n${exportLine}`);
            console.warn(`\n❗️ 强提醒：请立即检查并修改该导出方式！`);
            console.warn(`   当前默认使用 "export * from '${libName}'"，可能不适用于所有库：`);
            console.warn(`   - 某些库可能是 default 导出（如：dayjs、classnames）`);
            console.warn(`   - 某些库需要命名导出或额外封装`);
            console.warn(`   - 若不修改，组件引用该库可能报错或类型错误 ⚠️`);
            console.warn(`\n🚨 示例建议修改方式：`);
            console.warn(`   // 推荐命名导出：\n   import _dayjs from 'dayjs';\n   export const dayjs = _dayjs;`);
            console.warn(`   // 或默认导出：\n   export { default as dayjs } from 'dayjs';`);
        }
        // 重新读取文件内容，防止重复追加
        content = fs.readFileSync(indexPath, 'utf-8');
    });
}