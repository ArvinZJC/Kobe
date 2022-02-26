/*
 * @Description: Vue configuration
 * @Version: 1.0.5.20220226
 * @Author: Arvin Zhao
 * @Date: 2021-12-09 00:57:09
 * @Last Editors: Arvin Zhao
 * @LastEditTime: 2022-02-26 21:04:09
 */

module.exports = {
  configureWebpack: {
    devtool: "source-map",
  },
  pluginOptions: {
    electronBuilder: {
      builderOptions: {
        appId: "com.isarvin.kobe",
        artifactName: "${name}_${version}_${os}_${arch}.${ext}",
        generateUpdatesFilesForAllChannels: true,
        mac: {
          category: "public.app-category.utilities",
          target: [
            {
              arch: ["arm64", "x64"],
              target: "default", // Squirrel.Mac requires the zip target. Reference: https://www.electron.build/auto-update#quick-setup-guide
            },
          ],
        },
        nsis: {
          allowToChangeInstallationDirectory: true,
          createDesktopShortcut: "always",
          installerLanguages: "zh_CN",
          language: "2052",
          oneClick: false,
          perMachine: true,
          runAfterFinish: false,
        },
      },
      preload: "./src/preload.js",
    },
  },
  runtimeCompiler: true,
};
