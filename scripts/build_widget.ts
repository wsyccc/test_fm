import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'

const args = process.argv.slice(2)
const widgetName = args[0]
const forceBuildCommon = args[1] === 'yes'

if (!widgetName) {
    console.error('❌ 组件名不能为空，例如：yarn build:widget button [yes]')
    process.exit(1)
}

const rootDir = path.resolve(__dirname, '..')
const distDir = path.join(rootDir, 'dist')
const distCommonDir = path.join(distDir, 'dist_common')

// 检查是否需要构建 common
const shouldBuildCommon = forceBuildCommon || !fs.existsSync(distCommonDir)

if (shouldBuildCommon) {
    console.log(`🚧 正在构建 @hulk/common...`)
    execSync('yarn workspace @hulk/common build', { stdio: 'inherit' })

    // 将 common/dist 移动到根 dist 目录下
    const commonDistFrom = path.join(rootDir, 'packages/common/dist')
    const commonDistTo = path.join(distDir, 'dist_common')

    if (fs.existsSync(commonDistTo)) fs.rmSync(commonDistTo, { recursive: true })
    fs.renameSync(commonDistFrom, commonDistTo)

    console.log(`✅ 已构建 @hulk/common 并移动到 dist/dist_common`)
} else {
    console.log('✅ 已存在 dist/dist_common，跳过构建 common')
}

// 构建指定 widget
console.log(`🚧 正在构建组件 ${widgetName}...`)
execSync(`yarn workspace ${widgetName} build`, { stdio: 'inherit' })

// 移动 widget 输出目录到根 dist 目录下
const widgetDistFrom = path.join(rootDir, `packages/${widgetName}/dist_${widgetName}`)
const widgetDistTo = path.join(distDir, `dist_${widgetName}`)

if (fs.existsSync(widgetDistTo)) fs.rmSync(widgetDistTo, { recursive: true })
fs.renameSync(widgetDistFrom, widgetDistTo)

console.log(`✅ 构建完成：dist/dist_${widgetName}`)
