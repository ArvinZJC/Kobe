/*
 * @Description: Tailwind CSS configuration
 * @Version: 1.0.2.20220407
 * @Author: Arvin Zhao
 * @Date: 2021-12-08 00:32:57
 * @Last Editors: Arvin Zhao
 * @LastEditTime: 2022-04-07 15:07:19
 */

const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  darkMode: "class",
  content: ["./public/**/*.html", "./src/**/*.{js,jsx,ts,tsx,vue}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter var", ...defaultTheme.fontFamily.sans],
      },
    },
  },
};
