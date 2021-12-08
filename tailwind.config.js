/*
 * @Description: Tailwind CSS configuration
 * @Version: 1.0.0.20211208
 * @Author: Arvin Zhao
 * @Date: 2021-12-08 00:32:57
 * @Last Editors: Arvin Zhao
 * @LastEditTime: 2021-12-08 00:36:39
 */

const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  darkMode: "class",
  purge: ["./public/**/*.html", "./src/**/*.{js,vue}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter var", ...defaultTheme.fontFamily.sans],
      },
    },
  },
};
