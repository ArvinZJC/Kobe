![banner.png](./img_README/banner.png)

# 神户座（Kobe）

[![GitHub release (latest by date including pre-releases)](https://img.shields.io/github/v/release/ArvinZJC/Kobe?include_prereleases)](../../releases)
[![GitHub All Releases](https://img.shields.io/github/downloads/ArvinZJC/Kobe/total)](../../releases)
[![Codacy Badge](https://app.codacy.com/project/badge/Grade/a280d86eb52342a0a141e3421f902428)](https://www.codacy.com/gh/ArvinZJC/Kobe/dashboard?utm_source=github.com&utm_medium=referral&utm_content=ArvinZJC/Kobe&utm_campaign=Badge_Grade)
![GitHub](https://img.shields.io/github/license/ArvinZJC/Kobe)

**简体中文** | [English](./README-en.md)

> Kobe /'kəubi/
>
> **_n._** 神户（日本的一个港口城市）; **Arvin 发现的神户座**<sup id="source1">[1](#footnote1)</sup> 😜

神户座是一个 Windows/macOS 桌面应用，它用来帮助用户搜索北交所、上交所和深交所股票成交价和成交量，可看作是对分价表的组合加工。“神户”玩儿的是谐音梗，指代“沪深”。“沪深”的意思就不多说了，懂的都懂。这款应用程序实现的功能算不上太复杂，设计的目的主要是为了满足一些中国大陆用户的需求（包括家人），因而此应用程序支持的语言仅有简体中文。

事实上，此仓库并不是神户座的诞生之地。在 2020 年 7 月 23 日，神户座宣布诞生于[一个旧有仓库](https://github.com/ArvinZJC/ShSzStockHelper-Windows)。它主要使用 Windows 呈现基础（WPF，.NET Core 3.1），基本实现了家人的需求。尽管它经过几次迭代使其功能逐渐成熟，但仅支持 Windows、首次启动速度慢、搜索引擎极不稳定等缺陷带来的影响日益显著。于是，此仓库在 2021 年 12 月 7 日建立，从而打造船新的神户座。经过一段时间的重构，如今的神户座更好用、更稳定，可以说是焕然一新。

~~更多信息可参考神户座官网和使用手册。~~（稍安勿躁，还在~~摸鱼~~打造中）

![screenshot.png](./img_README/screenshot.png)

## ❗ 注意

> 敲黑板了！敲黑板了！🔥

1. 此项目使用 [GPL-3.0 协议](./LICENSE)。截至 2022 年 2 月 25 日，使用 Visual Studio Code（版本：1.64.2）、Node.js 16.13.2 和 Vue CLI 4.5.15 开发表现良好。此外，我要特别感谢 Syncfusion 提供的[强大的 Vue.js 的 UI 组件库](https://www.syncfusion.com/vue-ui-components)，以及 Tailwind 提供的[丰富、可扩展的 CSS 框架和资源](https://tailwindcss.com/resources)，这节省了许多开发时间。
2. 受 [Electron 的影响](https://www.electronjs.org/docs/latest/tutorial/support#supported-platforms)，神户座应能支持 Windows 7 及更高版本（arm64、x64 和 x86），以及 macOS 10.11（El Capitan）及更高版本（arm64 和 x64）。
3. 项目主要依赖参见下面的表格。更多信息请参见 [`package.json`](./package.json)。

   | 名称                             |    版本    |
   | :------------------------------- | :--------: |
   | @heroicons/vue                   |   1.0.5    |
   | @syncfusion/ej2-vue-buttons      |  19.4.53   |
   | @syncfusion/ej2-vue-calendars    |  19.4.52   |
   | @syncfusion/ej2-vue-dropdowns    |  19.4.52   |
   | @syncfusion/ej2-vue-grids        |  19.4.53   |
   | @syncfusion/ej2-vue-inputs       |  19.4.52   |
   | @syncfusion/ej2-vue-navigations  |  19.4.53   |
   | @syncfusion/ej2-vue-popups       |  19.4.53   |
   | @syncfusion/ej2-vue-splitbuttons |  19.4.52   |
   | cldr-data                        |   36.0.0   |
   | electron                         |   17.1.0   |
   | electron-context-menu            |   3.1.2    |
   | electron-devtools-installer      |   3.2.0    |
   | electron-fetch                   |   1.7.4    |
   | electron-log                     |   4.4.5    |
   | electron-settings                |   4.0.2    |
   | electron-updater                 |   4.6.1    |
   | htmlparser2                      |   7.2.0    |
   | iconv-lite                       |   0.6.3    |
   | smoothscroll-polyfill            |   0.4.4    |
   | tailwindcss                      |   3.0.23   |
   | vue                              |   3.2.31   |
   | vue-class-component              | 8.0.0-rc.1 |
   | vue-cli-plugin-electron-builder  |   2.1.1    |
   | vue-router                       |   4.0.12   |

4. 此项目部分 SVG 图像资源来自 [Flaticon](https://www.flaticon.com/packs/font-awesome) 和 [Iconscout](https://iconscout.com/)。
5. Vue CLI 是此项目的一个重要依赖。在项目根目录下，按如下步骤使用 npm 的命令可以在本地运行此项目。

   - 安装项目所需依赖。

     ```sh
     npm install -g @vue/cli
     npm install
     ```

   - 调试与构建。

     - 若调试项目（开发环境），则：

       ```sh
       npm run electron:serve
       # 或
       npx vue-cli-service electron:serve
       ```

     - 若构建项目（生产环境），则：

       ```sh
       npm run electron:build
       # 或
       npx vue-cli-service electron:build
       ```

     - _（推荐）_ 若使用 Visual Studio Code 的运行和调试面板, 则需要将下面内容添加至相应文件来配置此项目的调试与构建过程。

       - `.vscode/launch.json`：

       ```JSON
       {
         "compounds": [
           {
             "configurations": ["electron: main", "electron: renderer"],
             "name": "electron: debug"
           }
         ],
         "configurations": [
           {
             "name": "electron: dev",
             "request": "launch",
             "runtimeArgs": ["run", "electron:serve"],
             "runtimeExecutable": "npm",
             "skipFiles": ["<node_internals>/**"],
             "type": "node"
           },
           {
             "args": ["--remote-debugging-port=9223", "./dist_electron"],
             "name": "electron: main",
             "outFiles": ["${workspaceFolder}/dist_electron/**/*.js"],
             "preLaunchTask": "electron-debug",
             "protocol": "inspector",
             "request": "launch",
             "runtimeExecutable": "${workspaceRoot}/node_modules/.bin/electron",
             "type": "node",
             "windows": {
               "runtimeExecutable": "${workspaceRoot}/node_modules/.bin/electron.cmd"
             }
           },
           {
             // Windows 下不可构建 macOS 桌面应用，所以 Windows 下不可配置此部分。
             "name": "electron: production for macOS",
             "request": "launch",
             "runtimeArgs": ["run", "electron:build", "--", "-m"],
             "runtimeExecutable": "npm",
             "skipFiles": ["<node_internals>/**"],
             "type": "node"
           },
           {
             "name": "electron: production for Win ARM64",
             "request": "launch",
             "runtimeArgs": ["run", "electron:build", "--", "-w", "--arm64"],
             "runtimeExecutable": "npm",
             "skipFiles": ["<node_internals>/**"],
             "type": "node"
           },
           {
             "name": "electron: production for Win x64",
             "request": "launch",
             "runtimeArgs": ["run", "electron:build", "--", "-w", "--x64"],
             "runtimeExecutable": "npm",
             "skipFiles": ["<node_internals>/**"],
             "type": "node"
           },
           {
             "name": "electron: production for Win x86",
             "request": "launch",
             "runtimeArgs": ["run", "electron:build", "--", "-w", "--ia32"],
             "runtimeExecutable": "npm",
             "skipFiles": ["<node_internals>/**"],
             "type": "node"
           },
           {
             "name": "electron: renderer",
             "port": 9223,
             "request": "attach",
             "sourceMapPathOverrides": {
               "webpack:///./src/*": "${webRoot}/*"
             },
             "timeout": 30000,
             "type": "chrome",
             "urlFilter": "http://localhost:*",
             "webRoot": "${workspaceFolder}/src"
           }
         ]
       }
       ```

       - `.vscode/tasks.json`：

       ```JSON
       {
         "tasks": [
           {
             "args": ["electron:serve", "--debug"],
             "command": "./node_modules/.bin/vue-cli-service",
             "isBackground": true,
             "label": "electron-debug",
             "problemMatcher": {
               "background": {
                 "beginsPattern": "Starting development server\\.\\.\\.",
                 "endsPattern": "Not launching electron as debug argument was passed\\."
               },
               "owner": "custom",
               "pattern": {
                 "regexp": ""
               }
             },
             "type": "process",
             "windows": {
               "command": "./node_modules/.bin/vue-cli-service.cmd"
             }
           }
         ],
         "version": "2.0.0"
       }
       ```

好运哦! 💖

---

<sub id="footnote1">[1.](#source1) 不传谣，不信谣，勿当真！👮‍♂️</sub>
