/*
 * @Description: Vue configuration
 * @Version: 1.0.3.20220225
 * @Author: Arvin Zhao
 * @Date: 2021-12-09 00:57:09
 * @Last Editors: Arvin Zhao
 * @LastEditTime: 2022-02-25 23:06:59
 */

module.exports = {
  configureWebpack: {
    devtool: "source-map",
  },
  pluginOptions: {
    electronBuilder: {
      builderOptions: {
        appId: "com.isarvin.kobe",
        generateUpdatesFilesForAllChannels: true,
        mac: {
          category: "public.app-category.utilities",
          target: [
            {
              arch: ["arm64", "x64"],
              target: "dmg",
            },
          ],
        },
        nsis: {
          allowToChangeInstallationDirectory: true,
          artifactName: "${productName}-${version}-${arch}.${ext}",
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
