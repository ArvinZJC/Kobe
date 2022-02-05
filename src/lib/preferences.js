/*
 * @Description: the preference initialiser
 * @Version: 1.0.0.20220205
 * @Author: Arvin Zhao
 * @Date: 2022-01-29 14:55:14
 * @Last Editors: Arvin Zhao
 * @LastEditTime: 2022-02-05 19:49:29
 */

import global from "./global.js";

/**
 * Change the preference in the renderer process.
 * @param {Date | string} id the preference option ID.
 * @param {string} key the preference key.
 * @param {string} tag the preference tag.
 */
export function changePreference(id, key, tag) {
  var change = {};

  change[global.common.TAG_KEY] = tag;
  change[key] = id;
  window[global.common.IPC_RENDERER_API_KEY].send(
    global.common.IPC_SEND,
    change
  );
} // end function changePreference

/**
 * Check the radio button reflecting the user preference in the renderer process.
 * @param {string} id the radio button ID.
 */
export function checkOption(id) {
  const option = document.getElementById(id);

  if (option != null) {
    option.checked = true;
  } // end if
} // end function checkOption

/**
 * Get the user preference in the main process.
 * @param {string} key the preference key.
 * @returns an object using the preference key as the key and the user preference as the value.
 */
export async function getPreference(key) {
  const settings = require("electron-settings"); // It is necessary to import the module here because this script contains functions for both the main process and the renderer processes.

  var preference = {};

  preference[key] = await settings.get(key);
  return preference;
} // end function getPreference

/**
 * Initialise the app preferences in the main process.
 */
export async function initialisePreferences() {
  // It is necessary to import modules here because this script contains functions for both the main process and the renderer processes.
  const { nativeTheme } = require("electron");
  const settings = require("electron-settings");

  var preferences = await settings.get();

  // Initialise the appearance preference to default if the user preference does not exist or is illegal.
  if (
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
  const volumeUnitValues = [
    global.common.BOARD_LOT_1,
    global.common.BOARD_LOT_10,
    global.common.BOARD_LOT_100,
    global.common.BOARD_LOT_1000,
    global.common.BOARD_LOT_10000,
    global.common.SHARE_1,
  ];

  // Initialise the day volume unit preference to default if the user preference does not exist or is illegal.
  if (
    !volumeUnitValues.includes(preferences[global.common.DAY_VOLUME_UNIT_KEY])
  ) {
    await settings.set(
      global.common.DAY_VOLUME_UNIT_KEY,
      global.common.BOARD_LOT_1
    );
  } // end if

  // Initialise the external search preference to default if the user preference does not exist or is illegal.
  if (
    ![global.common.BAIDU_ID, global.common.GOOGLE_ID].includes(
      preferences[global.common.EXTERNAL_SEARCH_KEY]
    )
  ) {
    await settings.set(
      global.common.EXTERNAL_SEARCH_KEY,
      global.common.BAIDU_ID
    );
  } // end if

  // Initialise the max date range span preference to default if the user preference does not exist or is illegal.
  if (
    !Array.from({ length: 8 }, (_, i) => i + 1).includes(
      preferences[global.common.MAX_DATE_RANGE_SPAN_KEY]
    )
  ) {
    await settings.set(
      global.common.MAX_DATE_RANGE_SPAN_KEY,
      global.common.DEFAULT_MAX_DATE_RANGE_SPAN
    );
  } // end if

  // Initialise the min date preference to default if the user preference does not exist or is illegal.
  const minDateValue = new Date(
    `${preferences[global.common.MIN_DATE_KEY]}${global.common.DAY_TIME_START}`
  ).getTime();

  if (
    preferences[global.common.MIN_DATE_KEY] == null ||
    minDateValue <
      new Date(
        `${global.common.MIN_MIN_DATE}${global.common.DAY_TIME_START}`
      ).getTime() ||
    minDateValue > new Date().getTime()
  ) {
    await settings.set(global.common.MIN_DATE_KEY, global.common.MIN_MIN_DATE);
  } // end if

  // Initialise the search engine mode preference to default if the user preference does not exist or is illegal.
  if (
    ![global.common.STABLE_MODE_ID, global.common.FAST_MODE_ID].includes(
      preferences[global.common.SEARCH_ENGINE_MODE_KEY]
    )
  ) {
    await settings.set(
      global.common.SEARCH_ENGINE_MODE_KEY,
      global.common.STABLE_MODE_ID
    );
  } // end if

  // Initialise the total volume unit preference to default if the user preference does not exist or is illegal.
  if (
    !volumeUnitValues.includes(preferences[global.common.TOTAL_VOLUME_UNIT_KEY])
  ) {
    await settings.set(
      global.common.TOTAL_VOLUME_UNIT_KEY,
      global.common.BOARD_LOT_100
    );
  } // end if
} // end function initialisePreferences

/**
 * Reset all preferences.
 */
export async function resetPreferences() {
  const settings = require("electron-settings"); // It is necessary to import the module here because this script contains functions for both the main process and the renderer processes.

  await settings.unset();
  await initialisePreferences();
} // end function resetPreferences
