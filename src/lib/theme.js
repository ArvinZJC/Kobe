/*
 * @Description: the script applying the theme to the app
 * @Version: 1.0.0.20220115
 * @Author: Arvin Zhao
 * @Date: 2022-01-12 08:06:11
 * @Last Editors: Arvin Zhao
 * @LastEditTime: 2022-01-15 00:04:54
 */

import global from "./global.js";

const DARK = "dark"; // TODO: global
const LIGHT = "light"; // TODO: global
const THEME = "theme"; // TODO: The key to store the theme info in the local storage.

export { DARK, LIGHT, THEME };

/**
 * Apply the light/dark theme according to the corresponding user/system preference.
 * @param {MediaQueryList} mql a MediaQueryList object containing the results of detecting the system theme
 */
export function applyTheme(mql) {
  const syncfusionStyles = document.getElementsByClassName(
    global.common.SF_STYLES
  );

  if (
    localStorage.getItem(THEME) === DARK ||
    (localStorage.getItem(THEME) === null && mql.matches) // TODO: localStorage?
  ) {
    document.documentElement.classList.add(DARK);
    Array.prototype.forEach.call(syncfusionStyles, (element) => {
      element.href = element.href.replace(
        global.common.SF_TAILWIND,
        global.common.SF_TAILWIND_DARK
      );
    });
  } else {
    document.documentElement.classList.remove(DARK);
    Array.prototype.forEach.call(syncfusionStyles, (element) => {
      element.href = element.href.replace(
        global.common.SF_TAILWIND_DARK,
        global.common.SF_TAILWIND
      );
    });
  } // end if...else
} // end function applyTheme
