const fs = require('fs');
const path = require('path');
const readline = require('readline');
const child_process = require('child_process');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
})

const askYesNo = (question: string): Promise<boolean> => {
    return new Promise((resolve) => {
        rl.question(`${question} (y/N): `, (answer) => {
            rl.close()
            resolve(answer.trim().toLowerCase() === 'y')
        })
    })
}

const args = process.argv.slice(2)
const widgetName = args[0]

if (!widgetName) {
    console.error('❌ Widget Name is Required，e.g：yarn build:widget button')
    process.exit(1)
}

const rootDir = path.resolve(__dirname, '..')
const distDir = path.join(rootDir, 'dist')
const distCommonDir = path.join(distDir, 'dist_common')

if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true })
    console.log('📁 Created dist in root directory')
}

const main = async () => {
    let shouldBuildCommon = false

    if (!fs.existsSync(distCommonDir)) {
        console.log('⚠️ dist_common not exist，creating @hulk/common...')
        shouldBuildCommon = true
    } else {
        shouldBuildCommon = await askYesNo('rebuild @hulk/common？')
    }

    if (shouldBuildCommon) {
        console.log(`🚧 building @hulk/common...`)
        child_process.execSync('yarn workspace @hulk/common build', { stdio: 'inherit' })

        const commonDistFrom = path.join(rootDir, 'packages/common/dist_common')
        const commonDistTo = path.join(distDir, 'dist_common')

        if (fs.existsSync(commonDistTo)) fs.rmSync(commonDistTo, { recursive: true })
        fs.renameSync(commonDistFrom, commonDistTo)

        if (fs.existsSync(commonDistFrom)) {
            fs.rmSync(commonDistFrom, { recursive: true })
            console.log(`🧹 Clearing ：packages/common/dist_common`)
        }

        console.log(`✅ @hulk/common build done`)
    } else {
        console.log('✅ skip build @hulk/common')
    }


    console.log(`🚧 building ${widgetName}...`)
    child_process.execSync(`yarn workspace ${widgetName} build`, { stdio: 'inherit' })

    const widgetDistFrom = path.join(rootDir, `packages/${widgetName}/dist_${widgetName}`)
    const widgetDistTo = path.join(distDir, `dist_${widgetName}`)

    if (fs.existsSync(widgetDistTo)) fs.rmSync(widgetDistTo, { recursive: true })
    fs.renameSync(widgetDistFrom, widgetDistTo)

    if (fs.existsSync(widgetDistFrom)) {
        fs.rmSync(widgetDistFrom, { recursive: true })
        console.log(`🧹 Clearing：packages/${widgetName}/dist_${widgetName}`)
    }

    const indexHtmlPath = path.join(widgetDistTo, 'index.html')
    if (fs.existsSync(indexHtmlPath)) {
        let html = fs.readFileSync(indexHtmlPath, 'utf-8')

        const importMapScript = `<script type="importmap">
    {
        "imports": {
            "@hulk/common": "/dist_common/common.umd.js"
        }
    }
  </script>`

        // const importMapScript = `<script type="application/javascript" src="/dist_common/common.umd.js"></script>`

        if (!html.includes(importMapScript)) {
            const moduleScriptRegex = /<script\s+type="module"[^>]*>/i

            if (moduleScriptRegex.test(html)) {

                html = html.replace(moduleScriptRegex, `${importMapScript}\n$&`)
            } else {

                html = html.replace('</head>', `  ${importMapScript}\n</head>`)
            }

            fs.writeFileSync(indexHtmlPath, html, 'utf-8')
            console.log(`🔗 Injected importmap into ${widgetName}/index.html`)
        }
    }


    console.log(`✅ build：dist/dist_${widgetName} done`)

    process.exit(0)
}

main()
