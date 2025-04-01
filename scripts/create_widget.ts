const fs = require('fs');
const path = require('path');
const { exec } = require('child_process')

const TEMPLATE_DIR = path.resolve(__dirname, '../templates/widget')
const PACKAGES_DIR = path.resolve(__dirname, '../packages')

const args = process.argv.slice(2)
const rawName = args[0]

if (!rawName) {
  console.error('❌ Widget name is required，e.g. yarn create:widget button')
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


copyTemplateFile('app.tsx.tpl', 'src/app.tsx')
copyTemplateFile('component.stories.tsx.tpl', `${nameKebab}.stories.tsx`)
copyTemplateFile('context.ts.tpl', 'src/context.ts')
copyTemplateFile('index.html.tpl', 'index.html')
copyTemplateFile('index.tsx.tpl', 'src/index.tsx')
copyTemplateFile('package.json.tpl', 'package.json')
copyTemplateFile('tsconfig.json.tpl', 'tsconfig.json')
copyTemplateFile('type.ts.tpl', 'src/type.ts')
copyTemplateFile('vite.config.ts.tpl', 'vite.config.ts')

console.log(`✅ packages/${nameKebab} created successfully`);

exec(`git add ${targetDir}`, (err, _stdout, stderr) => {
  if (err) {
    console.warn(`⚠️ git add failed: ${err.message}`);
    return;
  }
  if (stderr) {
    console.warn(`⚠️ git add stderr: ${stderr}`);
  }
  console.log(`📦 Added ${nameKebab} to git`);
});

