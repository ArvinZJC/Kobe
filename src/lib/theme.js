/*
 * @Description: the script applying the theme to the app
 * @Version: 1.0.0.20220113
 * @Author: Arvin Zhao
 * @Date: 2022-01-12 08:06:11
 * @Last Editors: Arvin Zhao
 * @LastEditTime: 2022-01-13 04:15:09
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
  var syncfusionStyles = document.getElementsByClassName(
    global.common.SF_STYLES
  );

  if (
    localStorage.getItem(THEME) === DARK ||
    (localStorage.getItem(THEME) === null && mql.matches) // TODO: localStorage?
  ) {
    document.documentElement.classList.add(DARK);

    for (var syncfusionDark of syncfusionStyles) {
      syncfusionDark.href = syncfusionDark.href.replace(
        global.common.SF_TAILWIND,
        global.common.SF_TAILWIND_DARK
      );
    } // end for
  } else {
    document.documentElement.classList.remove(DARK);

    for (var syncfusionLight of syncfusionStyles) {
      syncfusionLight.href = syncfusionLight.href.replace(
        global.common.SF_TAILWIND_DARK,
        global.common.SF_TAILWIND
      );
    } // end for
  } // end if...else
} // end function applyTheme
