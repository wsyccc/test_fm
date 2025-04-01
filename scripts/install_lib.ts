#!/usr/bin/env ts-node

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const args = process.argv.slice(2);

if (args.length === 0) {
    console.error('❌ Please enter lib name e.g.: yarn install:lib dayjs [-D]');
    process.exit(1);
}

const libName = args[0];
const isDev = args.includes('-D');


const rootDir = path.resolve(__dirname, '..');
const commonDir = path.join(rootDir, 'packages/common');
const indexPath = path.join(commonDir, 'index.ts');

if (isDev) {
    console.log(`📦 install dev dependencies ${libName} to root packages（-D -W）`);
    execSync(`yarn add ${libName} -D -W`, {
        cwd: rootDir,
        stdio: 'inherit'
    });
} else {
    console.log(`📦 install ${libName} to packages/common`);
    execSync(`yarn add ${libName}`, {
        cwd: commonDir,
        stdio: 'inherit'
    });

    const exportLine = `export * from '${libName}';`;

    const content = fs.readFileSync(indexPath, 'utf-8');
    if (content.includes(exportLine)) {
        console.log(`✅ exist ${libName} exports in packages/common/index.ts`);
    } else {
        fs.appendFileSync(indexPath, `\n${exportLine}\n`);
        console.log(`✨ 已自动在 index.ts 中添加：\n${exportLine}`);
        console.warn(`\n❗️ 强提醒：请立即检查并修改该导出方式！`);
        console.warn(`   当前默认使用 "export * from '${libName}'"，可能不适用于所有库：`);
        console.warn(`   - 某些库可能是 default 导出（如：dayjs、classnames）`);
        console.warn(`   - 某些库需要命名导出，或额外封装`);
        console.warn(`   - 若不修改，组件引用该库可能报错或类型错误 ⚠️`);
        console.warn(`\n🚨 示例建议修改方式：`);
        console.warn(`   // 推荐命名导出：\n   import _dayjs from 'dayjs';\n   export const dayjs = _dayjs;`);
        console.warn(`   // 或默认导出：\n   export { default as dayjs } from 'dayjs';`);
    }
}
