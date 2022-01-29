/*
 * @Description: the script applying the app appearance
 * @Version: 1.0.0.20220129
 * @Author: Arvin Zhao
 * @Date: 2022-01-12 08:06:11
 * @Last Editors: Arvin Zhao
 * @LastEditTime: 2022-01-29 17:48:37
 */

import global from "./global.js";

/**
 * Apply the light/dark mode in the renderer process according to the corresponding user/system preference.
 * @param {MediaQueryList} mql a MediaQueryList object containing the results of detecting the system appearance
 */
export function applyAppearance(mql) {
  window[global.common.IPC_RENDERER_API_KEY].receive(
    global.common.IPC_RECEIVE,
    (data) => {
      if (
        typeof data === "object" &&
        Object.prototype.hasOwnProperty.call(data, global.common.APPEARANCE_KEY)
      ) {
        const appearance = data[global.common.APPEARANCE_KEY];
        const syncfusionStyles = document.getElementsByClassName(
          global.common.SF_STYLES
        );

        if (syncfusionStyles != null) {
          if (
            appearance === global.common.DARK_MODE_ID ||
            (appearance === global.common.SYSTEM_DEFAULT_MODE_ID && mql.matches)
          ) {
            document.documentElement.classList.add(global.common.DARK_MODE_ID);
            Array.prototype.forEach.call(syncfusionStyles, (element) => {
              if (!element.href.includes(global.common.SF_TAILWIND_DARK)) {
                element.href = element.href.replace(
                  global.common.SF_TAILWIND,
                  global.common.SF_TAILWIND_DARK
                );
              } // end if
            });
          } else {
            document.documentElement.classList.remove(
              global.common.DARK_MODE_ID
            );
            Array.prototype.forEach.call(
              syncfusionStyles,
              (element) =>
                (element.href = element.href.replace(
                  global.common.SF_TAILWIND_DARK,
                  global.common.SF_TAILWIND
                ))
            );
          } // end if...else
        } // end if
      } // end if
    }
  );
  window[global.common.IPC_RENDERER_API_KEY].send(
    global.common.IPC_SEND,
    global.common.GET_APPEARANCE
  );
} // end function applyAppearance
