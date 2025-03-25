const fs = require('fs');
const path = require('path');
const { exec } = require('child_process')

const TEMPLATE_DIR = path.resolve(__dirname, '../templates/widget')
const PACKAGES_DIR = path.resolve(__dirname, '../packages')

const args = process.argv.slice(2)
const rawName = args[0]

if (!rawName) {
  console.error('❌ Widget name is required，e.g. yarn create:widget MyWidget')
  process.exit(1)
}

const namePascal = rawName.replace(/^\w/, s => s.toUpperCase())
const nameKebab = rawName.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
const targetDir = path.join(PACKAGES_DIR, nameKebab)

if (fs.existsSync(targetDir)) {
  console.error(`❌ Directory ${targetDir} already exists`)
  process.exit(1)
}

const replaceTemplateVars = (content: string) => {
  return content
    .replace(/{{namePascal}}/g, namePascal)
    .replace(/{{nameKebab}}/g, nameKebab)
    .replace(/___OUT_DIR___/g, `dist_${nameKebab}`)
}


const ensureDir = (dir: string) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
}

const copyTemplateFile = (tplName: string, targetRelPath: string) => {
  const tplPath = path.join(TEMPLATE_DIR, tplName)
  const destPath = path.join(targetDir, targetRelPath)
  const content = fs.readFileSync(tplPath, 'utf-8')
  fs.writeFileSync(destPath, replaceTemplateVars(content), 'utf-8')
}

console.log(`🚀 Creating ${nameKebab}...`)

ensureDir(path.join(targetDir, 'src'))

copyTemplateFile('package.json.tpl', 'package.json')
copyTemplateFile('vite.config.ts.tpl', 'vite.config.ts')
copyTemplateFile('tsconfig.json.tpl', 'tsconfig.json')
copyTemplateFile('index.tsx.tpl', 'src/index.tsx')


copyTemplateFile('component.stories.tsx.tpl', `${nameKebab}.stories.tsx`)

console.log(`✅ packages/${nameKebab} created successfully`);

