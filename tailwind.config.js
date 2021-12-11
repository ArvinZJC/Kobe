/*
 * @Description: Tailwind CSS configuration
 * @Version: 1.0.1.20211211
 * @Author: Arvin Zhao
 * @Date: 2021-12-08 00:32:57
 * @Last Editors: Arvin Zhao
 * @LastEditTime: 2021-12-11 18:33:38
 */

const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  darkMode: "class",
  content: ["./public/**/*.html", "./src/**/*.{js,vue}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter var", ...defaultTheme.fontFamily.sans],
      },
    },
  },
};
