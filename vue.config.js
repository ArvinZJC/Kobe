/*
 * @Description: Vue configuration
 * @Version: 1.0.0.20211218
 * @Author: Arvin Zhao
 * @Date: 2021-12-09 00:57:09
 * @Last Editors: Arvin Zhao
 * @LastEditTime: 2021-12-23 20:00:40
 */

module.exports = {
  configureWebpack: {
    devtool: "source-map",
  },
  pluginOptions: {
    electronBuilder: {
      builderOptions: {
        appId: "com.isarvin.kobe",
        mac: {
          category: "public.app-category.utilities",
          target: "dmg",
        },
        nsis: {
          allowToChangeInstallationDirectory: true,
          artifactName: "${productName} ${version} 安装程序.${ext}",
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
