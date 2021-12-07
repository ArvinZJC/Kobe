/*
 * @Description: Tailwind CSS configuration
 * @Version: 1.0.0.20211206
 * @Author: Arvin Zhao
 * @Date: 2021-12-06 22:03:53
 * @Last Editors: Arvin Zhao
 * @LastEditTime: 2021-12-06 22:54:30
 */

const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  darkMode: "class",
  mode: "jit",
  purge: ["./public/**/*.html", "./src/**/*.{js,vue}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter var", ...defaultTheme.fontFamily.sans],
      },
    },
  },
};
