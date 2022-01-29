/*
 * @Description: the preference initialiser
 * @Version: 1.0.0.20220129
 * @Author: Arvin Zhao
 * @Date: 2022-01-29 14:55:14
 * @Last Editors: Arvin Zhao
 * @LastEditTime: 2022-01-29 17:49:38
 */

import { nativeTheme } from "electron";
import settings from "electron-settings";

import global from "./global.js";

/**
 * Initialise the app preferences.
 *
 * NOTE: It must be executed before creating a window.
 */
export async function initialisePreferences() {
  var preferences = await settings.get();

  // Initialise the appearance preference to default if the user preference does not exist or is illegal.
  if (
    preferences[global.common.APPEARANCE_KEY] == null ||
    ![
      global.common.SYSTEM_DEFAULT_MODE_ID,
      global.common.LIGHT_MODE_ID,
      global.common.DARK_MODE_ID,
    ].includes(preferences[global.common.APPEARANCE_KEY])
  ) {
    preferences[global.common.APPEARANCE_KEY] =
      global.common.SYSTEM_DEFAULT_MODE_ID;
    await settings.set(
      global.common.APPEARANCE_KEY,
      preferences[global.common.APPEARANCE_KEY]
    );
  } // end if

  nativeTheme.themeSource = preferences[global.common.APPEARANCE_KEY];

  // Initialise the external search preference to default if the user preference does not exist or is illegal.
  if (
    preferences[global.common.EXTERNAL_SEARCH_KEY] == null ||
    ![global.common.BAIDU_ID, global.common.GOOGLE_ID].includes(
      preferences[global.common.EXTERNAL_SEARCH_KEY]
    )
  ) {
    await settings.set(
      global.common.EXTERNAL_SEARCH_KEY,
      global.common.BAIDU_ID
    );
  } // end if
} // end function initialisePreferences
