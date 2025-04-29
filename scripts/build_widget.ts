#!/usr/bin/env ts-node

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const child_process = require('child_process');
const execSync = require('child_process').execSync;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const askYesNo = (question: string): Promise<boolean> => {
  return new Promise((resolve) => {
    rl.question(`${question} (y/N): `, (answer) => {
      resolve(answer.trim().toLowerCase() === 'y');
    });
  });
};

const printHelp = () => {
  console.log(`
使用说明:

用法: yarn build:widget [widgetName] [options]

参数说明:
  [widgetName]         可选。指定要构建的 widget 名称。如果不指定，则构建所有 /packages 目录下（排除 common）。

  -y                   自动构建 @hulk/common，无需询问。若 dist/dist_common 不存在，则自动构建。
  -n                   跳过构建 @hulk/common，无需询问。
  --schema <langs>     针对每个构建生成的 configs.schema.json，调用 quicktype 生成对应语言的类文件。
                       支持以下语言：
                         • cpp            → C++ 头文件（.hpp）
                         • csharp (cs)    → C# 源文件（.cs）
                         • java           → Java 类（.java）
                         • typescript (ts)→ TypeScript 接口（.ts）
  -h, --help           显示本帮助文档。

示例:
  yarn build:widget
      # 构建所有 widget，并询问是否构建 @hulk/common

  yarn build:widget widget1
      # 构建指定 widget，并询问是否构建 @hulk/common

  yarn build:widget -y
      # 构建所有 widget，并自动构建 @hulk/common

  yarn build:widget widget1 -n
      # 构建指定 widget，并跳过构建 @hulk/common

  yarn build:widget --schema cpp csharp
      # 构建所有 widget，并为每个 widget 生成 C++ (.hpp) 和 C# (.cs) schema 类文件

  yarn build:widget widget1 --schema java ts
      # 构建 widget1，并为其生成 Java (.java) 以及 TypeScript (.ts) 的 schema 类文件
`);
};


const rawArgs = process.argv.slice(2);
if (rawArgs.includes('--help') || rawArgs.includes('-h')) {
  printHelp();
  process.exit(0);
}


let schemaLangs: string[] = [];
const schemaFlagIndex = rawArgs.indexOf('--schema');
if (schemaFlagIndex !== -1) {
  // Collect languages after --schema (until another flag or end of args)
  for (let i = schemaFlagIndex + 1; i < rawArgs.length; i++) {
    const arg = rawArgs[i];
    if (arg.startsWith('--') || arg.startsWith('-')) break;
    schemaLangs.push(arg.toLowerCase());
  }
  if (schemaLangs.length === 0) {
    console.warn('Warning: --schema flag provided without specifying languages. Skipping schema generation.');
    // No languages specified, treat as no schema generation
    printHelp();
    process.exit(1);
  }
}

let forceBuildCommon: boolean | null = null;
const nonFlagArgs: string[] = [];

for (const arg of rawArgs) {
  if (arg === '-y') {
    forceBuildCommon = true;
  } else if (arg === '-n') {
    forceBuildCommon = false;
  } else {
    nonFlagArgs.push(arg);
  }
}

// 如果用户传入了 widget 名称，则只构建指定的 widget；否则构建所有 widget（排除 common）
const specifiedWidget = nonFlagArgs[0];

const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');
const distCommonDir = path.join(distDir, 'dist_common');

// 如果 dist 目录不存在则创建
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, {recursive: true});
  console.log('📁 Created dist in root directory');
}

const getAllWidgets = () => {
  const packagesDir = path.join(rootDir, 'packages');
  const widgets = fs
    .readdirSync(packagesDir)
    .filter((name: string) => {
      const fullPath = path.join(packagesDir, name);
      const isDir = fs.statSync(fullPath).isDirectory();
      return isDir && name !== 'common';
    });
  return widgets;
};

const buildWidget = (widgetName: string) => {
  console.log(`🚧 building ${widgetName}...`);
  child_process.execSync(`yarn workspace ${widgetName} build`, {stdio: 'inherit'});

  const widgetDistFrom = path.join(rootDir, `packages/${widgetName}/dist_${widgetName}`);
  const widgetDistTo = path.join(distDir, `dist_${widgetName}`);

  if (fs.existsSync(widgetDistTo)) fs.rmSync(widgetDistTo, {recursive: true});
  fs.renameSync(widgetDistFrom, widgetDistTo);

  if (fs.existsSync(widgetDistFrom)) {
    fs.rmSync(widgetDistFrom, {recursive: true});
    console.log(`🧹 Clearing：packages/${widgetName}/dist_${widgetName}`);
  }

  const indexHtmlPath = path.join(widgetDistTo, 'index.html');
  if (fs.existsSync(indexHtmlPath)) {
    let html = fs.readFileSync(indexHtmlPath, 'utf-8');

    const importMapScript = `<script type="importmap">
    {
        "imports": {
            "@hulk/common": "/dist_common/common.index.es.js"
        }
    }
  </script>`;

    if (!html.includes(importMapScript)) {
      const moduleScriptRegex = /<script\s+type="module"[^>]*>/i;

      if (moduleScriptRegex.test(html)) {
        html = html.replace(moduleScriptRegex, `${importMapScript}\n$&`);
      } else {
        html = html.replace('</head>', `  ${importMapScript}\n</head>`);
      }

      fs.writeFileSync(indexHtmlPath, html, 'utf-8');
      console.log(`🔗 Injected importmap into ${widgetName}/index.html`);
    }
  }

  const schemaFile = path.join(widgetDistTo, 'configs.schema.json');
  if (!fs.existsSync(schemaFile)) {
    console.warn(`Warning: ${widgetName} - configs.schema.json not found, skipping schema generation.`);
  } else {
    console.log(`${widgetName}: Generating schema classes for languages [${schemaLangs.join(', ')}]...`);
    if (schemaLangs.length === 0) schemaLangs.push('cpp');
    for (const lang of schemaLangs) {
      // Map input language to quicktype language code and file extension
      let qtLang: string;
      let fileExt: string;
      switch (lang) {
        case 'cpp':
          qtLang = 'c++';
          fileExt = 'hpp';
          break;
        case 'csharp':
        case 'cs':
          qtLang = 'csharp';
          fileExt = 'cs';
          break;
        case 'java':
          qtLang = 'java';
          fileExt = 'java';
          break;
        case 'ts':
        case 'typescript':
          qtLang = 'typescript';
          fileExt = 'ts';
          break;
        case 'python':
        case 'py':
          qtLang = 'python';
          fileExt = 'py';
          break;
        // Add more languages here as needed (e.g., swift, go, etc.)
        default:
          console.warn(`⚠️  ${widgetName}: unsupported schema lang "${lang}"，Skip!`);
          continue;
      }

      // Determine output file path
      const widgetNameCamel = widgetName.charAt(0).toUpperCase() + widgetName.slice(1);
      const outputFile = path.join(widgetDistTo, `${widgetNameCamel}Schema_${lang}.${fileExt}`);
      const topLevelName = `${widgetNameCamel}Schema`;

      try {
        // Run quicktype to generate code from JSON Schema
        // using --src-lang schema to indicate the input is a JSON Schema&#8203;:contentReference[oaicite:2]{index=2}
        const flags = [
          'quicktype',
          '--quiet',
          `--lang ${qtLang}`,
          '--src-lang schema',
          '--all-properties-optional',
          '--type-style camel-case',
          '--member-style underscore-case',
          '--enumerator-style camel-case',
          `--top-level ${topLevelName}`,
          '--just-types',
          `--namespace ${widgetNameCamel}`,
          `-o ${outputFile}`,
          schemaFile
        ];
        execSync(flags.join(' '),
          {stdio: 'inherit'}  // capture output/errors
        );
        console.log(`  ✔ Generated schema for ${lang}: ${path.basename(outputFile)}`);
      } catch (error) {
        // If quicktype is not installed or fails, throw a descriptive error
        if ((error as any).code === 'ENOENT') {
          throw new Error(`Quicktype CLI not found. Please install 'quicktype' to generate schema classes.`);
        }
        const stderr = (error as any).stderr?.toString().trim();
        const errMsg = stderr || (error as any).message;
        throw new Error(`${widgetName}: Failed to generate schema for language "${lang}". ${errMsg}`);
      }
    }
  }

  console.log(`✅ build：dist/dist_${widgetName} done`);
};

const main = async () => {
  // 如果没有指定 widget，则询问是否构建所有 widget（排除 common）
  if (!specifiedWidget) {
    const confirmed = await askYesNo(
      `⚠️  You are about to build ALL widgets under /packages (excluding 'common'). Confirm to continue?`
    );
    if (!confirmed) {
      console.log('❌ Cancelled.');
      rl.close();
      process.exit(0);
    }
  }

  // 判断是否需要构建 @hulk/common：如果命令行传入了 -y 或 -n 则直接使用，否则再进行询问
  let shouldBuildCommon: boolean;
  if (forceBuildCommon !== null) {
    shouldBuildCommon = forceBuildCommon;
  } else {
    if (!fs.existsSync(distCommonDir)) {
      console.log('⚠️ dist_common not exist，creating @hulk/common...');
      shouldBuildCommon = true;
    } else {
      shouldBuildCommon = await askYesNo('rebuild @hulk/common？');
    }
  }

  if (shouldBuildCommon) {
    console.log(`🚧 building @hulk/common...`);
    child_process.execSync('yarn workspace @hulk/common build', {stdio: 'inherit'});

    const commonDistFrom = path.join(rootDir, 'packages/common/dist_common');
    const commonDistTo = path.join(distDir, 'dist_common');

    if (fs.existsSync(commonDistTo)) fs.rmSync(commonDistTo, {recursive: true});
    fs.renameSync(commonDistFrom, commonDistTo);

    if (fs.existsSync(commonDistFrom)) {
      fs.rmSync(commonDistFrom, {recursive: true});
      console.log(`🧹 Clearing ：packages/common/dist_common`);
    }

    console.log(`✅ @hulk/common build done`);
  } else {
    console.log('✅ skip build @hulk/common');
  }

  const widgetsToBuild = specifiedWidget ? [specifiedWidget] : getAllWidgets();

  for (const widgetName of widgetsToBuild) {
    buildWidget(widgetName);
  }

  const publicSrc = path.join(rootDir, 'public');
  const publicDest = path.join(distDir, 'public');
  if (fs.existsSync(publicSrc)) {
    if (fs.existsSync(publicDest)) {
      fs.rmSync(publicDest, {recursive: true, force: true});
    }
    fs.cpSync(publicSrc, publicDest, {recursive: true});
    console.log(`✅ Copied public folder from root to ${publicDest}`);
  } else {
    console.log(`⚠️ No public folder found in root directory.`);
  }

  console.log(`🎉 All Widget Built！${widgetsToBuild.join(', ')}`);
  rl.close();
  process.exit(0);
};

main();
