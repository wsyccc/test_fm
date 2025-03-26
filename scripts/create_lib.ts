const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2)
const libName = args[0]

if (!libName) {
    console.error('❌ 请输入 lib 名，例如：yarn create:lib DataManager')
    process.exit(1)
}

const baseDir = path.resolve(__dirname, '../packages/common')
const libDir = path.join(baseDir, libName)
const libIndex = path.join(libDir, 'index.ts')
const commonIndex = path.join(baseDir, 'index.ts')


if (fs.existsSync(libDir)) {
    console.error(`❌ Exist：${libName}`)
    process.exit(1)
}

fs.mkdirSync(libDir)
fs.writeFileSync(
    libIndex,
    `// ${libName} Lib\n\nexport class ${libName} {\n  static getMessage() {\n    return '${libName} ready';\n  }\n}\n`
)

console.log(`✅ lib created: ${libDir}`)

console.log(`🚀 add export to common/index.ts`)

const exportLine = `export * from './${libName}';`
let indexContent = ''

if (fs.existsSync(commonIndex)) {
    indexContent = fs.readFileSync(commonIndex, 'utf-8')
    if (indexContent.includes(exportLine)) {
        console.log(`ℹ️ lib exist in index.ts: ${exportLine}`)
    } else {
        indexContent += `\n${exportLine}\n`
        fs.writeFileSync(commonIndex, indexContent, 'utf-8')
        console.log(`✅ add export in index.ts success common/index.ts`)
    }
} else {
    fs.writeFileSync(commonIndex, `${exportLine}\n`)
    console.log(`✅ created common/index.ts`)
}
