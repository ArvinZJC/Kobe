/*
 * @Description: the global variables for the scripts
 * @Version: 1.0.13.20220307
 * @Author: Arvin Zhao
 * @Date: 2021-12-13 19:19:29
 * @Last Editors: Arvin Zhao
 * @LastEditTime: 2022-03-07 22:29:14
 */

global.common = {
  ANIMATION_DURATION: 300,
  API_ACCESS_DENIED_PAGE_TITLE: "拒绝访问",
  APP_MENU_BUTTON_ID: "app-menu-button",
  APP_MENU_POSITION_KEY: "appMenuPosition",
  APP_SCHEME: "app",
  APPEARANCE_KEY: "appearance",
  AUTHOR: "ArvinZJC",
  AUTO_UPDATE_AND_DOWNLOAD_KEY: "autoUpdateAndDownload",
  BAIDU_ID: "baidu",
  BAIDU_SEARCH_KEY: "wd",
  BAIDU_SEARCH_URL: "https://www.baidu.com/s",
  BETA: "beta",
  BOARD_LOT_1: 100,
  BOARD_LOT_10: 1000,
  BOARD_LOT_100: 10000,
  BOARD_LOT_1000: 100000,
  BOARD_LOT_10000: 1000000,
  BUTTON_GROUP: "buttonGroup",
  CLOSE_TAB_ITEM: "close-tab",
  CLOSE_WIN: "closeWin",
  CONFIRM_CLOSING_MULTIPLE_TABS_KEY: "confirmClosingMultipleTabs",
  CORRECT_WIN_COLOUR: "correctWinColour",
  DARK_MODE_ID: "dark",
  DARK_WIN_COLOUR: "#000",
  DATE_PICKER: "datePicker",
  DATE_RANGE_PICKER_NAME: "dateRangePickerDateRange",
  DATE_RANGE_PICKER_TOOLTIP_NAME: "tooltipDateRange",
  DAY_TIME_START: " 00:00:00",
  DAY_VOLUME_DECIMAL_POINTS_KEY: "dayVolumeDecimalPoints",
  DAY_VOLUME_UNIT_KEY: "dayVolumeUnit",
  DEFAULT_AUTO_UPDATE_AND_DOWNLOAD: true,
  DEFAULT_CONFIRM_CLOSING_MULTIPLE_TABS: true,
  DEFAULT_DAY_VOLUME_DECIMAL_POINTS: 2,
  DEFAULT_INCLUDE_HIDDEN_COLUMNS: false,
  DEFAULT_MAX_DATE_RANGE_SPAN: 10,
  DEFAULT_PAGE_SIZE: 15,
  DEFAULT_RECEIVE_TEST_UPDATES: false,
  DEFAULT_TOTAL_VOLUME_DECIMAL_POINTS: 4,
  DEV: "development",
  DROP_DOWN_LIST: "dropDownList",
  ENABLE_SEARCH_FORM: "enableSearchForm",
  END_DATE_KEY: "endDate",
  ENTER_FULL_SCREEN: "enterFullScreen",
  EXIT_FULL_SCREEN: "exitFullScreen",
  FAST_MODE_ID: "fast",
  FILE_HEADER_FONT_SIZE: 14,
  GET_APPEARANCE: "getAppearance",
  GET_AUTO_UPDATE_AND_DOWNLOAD: "getAutoUpdateAndDownload",
  GET_CONFIRM_CLOSING_MULTIPLE_TABS: "getConfirmClosingMultipleTabs",
  GET_DAY_VOLUME_DECIMAL_POINTS: "getDayVolumeDecimalPoints",
  GET_DAY_VOLUME_UNIT: "getDayVolumeUnit",
  GET_INCLUDE_HIDDEN_COLUMNS: "getIncludeHiddenColumns",
  GET_MAX_DATE_RANGE_SPAN: "getMaxDateRangeSpan",
  GET_MIN_DATE: "getMinDate",
  GET_NEW_TAB_ITEM_ID: "getNewTabItemId",
  GET_ONLINE_SEARCH: "getOnlineSearch",
  GET_PLATFORM: "getPlatform",
  GET_RECEIVE_TEST_UPDATES: "getReceiveTestUpdates",
  GET_SEARCH_ENGINE_MODE: "getSearchEngineMode",
  GET_SEARCH_RESULT_DATA: "getSearchResultData",
  GET_START_TAB_ITEM_ID: "getStartTabItemId",
  GET_STOCK_LIST: "getStockList",
  GET_TOTAL_VOLUME_DECIMAL_POINTS: "getTotalVolumeDecimalPoints",
  GET_TOTAL_VOLUME_UNIT: "getTotalVolumeUnit",
  GET_VOLUME_FORMAT: "getVolumeFormat",
  GITEE_KOBE: "https://gitee.com/ArvinZJC/Kobe",
  GITHUB_KOBE: "https://github.com/ArvinZJC/Kobe",
  GITHUB_KOBE_ISSUES: "https://github.com/ArvinZJC/Kobe/issues",
  GITHUB_KOBE_RELEASES: "https://github.com/ArvinZJC/Kobe/releases",
  GOOGLE_ID: "google",
  GOOGLE_SEARCH_KEY: "q",
  GOOGLE_SEARCH_URL: "https://www.google.com/search",
  HOME_VIEW: "home",
  INCLUDE_HIDDEN_COLUMNS_KEY: "includeHiddenColumns",
  IPC_RECEIVE: "fromMain",
  IPC_RENDERER_API_KEY: "ipcRenderer",
  IPC_SEND: "toMain",
  LIGHT_MODE_ID: "light",
  LIGHT_WIN_COLOUR: "#FFF",
  MACOS: "darwin",
  MAX_DATE_RANGE_SPAN_KEY: "maxDateRangeSpan",
  MAX_DECIMAL_POINTS: 6,
  MAX_MAX_DATE_RANGE_SPAN: 10,
  MAX_PREFERENCE_OPTION_WIDTH: 215,
  MAXIMISE_OR_RESTORE_WIN: "maximiseOrRestoreWin",
  MAXIMISE_WIN: "maximiseWin", // TODO: titleBarOverlay temp workaround.
  MIN_COLUMN_WIDTH: 50,
  MIN_DATE_KEY: "minDate",
  MIN_DATE_PICKER_TOOLTIP_NAME: "tooltipMinDate",
  MIN_DECIMAL_POINTS: 0,
  MIN_LOG_LEVEL: "info",
  MIN_MAX_DATE_RANGE_SPAN: 1,
  MIN_MIN_DATE: "1990-12-03",
  MIN_WIN_HEIGHT: 600,
  MIN_WIN_WIDTH: 800,
  MINIMISE_WIN: "minimiseWin", // TODO: titleBarOverlay temp workaround.
  NEW_TAB_ITEM: "new-tab",
  NEW_TAB_ITEM_INDEX_KEY: "newTabItemIndex",
  ONLINE_SEARCH_KEY: "onlineSearch",
  PAGE_SIZES: [5, 10, 15, 20, 25],
  PATCH_EXIT_FULL_SCREEN: "patchExitFullScreen",
  POP_UP_APP_MENU: "popUpAppMenu",
  RECEIVE_TEST_UPDATES_KEY: "receiveTestUpdates",
  PREFERENCE_TABS_NAME: "preferenceTabs",
  PREFERENCE_VIEW: "preferences",
  PREFERENCE_VIEW_ID: "preference-view",
  PROCESSOR_ERROR_KEY: "processorError",
  RESET_PREFERENCES: "resetPreferences",
  RESET_PREFERENCES_CONFIRMATION_DIALOGUE_NAME:
    "dialogueResetPreferencesConfirmation",
  RESTORE_WIN: "restoreWin", // TODO: titleBarOverlay temp workaround.
  SEARCH_ENGINE_MODE_KEY: "searchEngineMode",
  SEARCH_FORM_ID: "search-form",
  SEARCH_RESULT_AREA_ID: "search-result-area",
  SEARCH_RESULT_GRID_NAME: "gridSearchResults",
  SEARCH_RESULT_VIEW: "searchResults",
  SEARCH_STATUS_AREA_ID: "search-status-area",
  SEPARATOR: "separator",
  SET_APPEARANCE: "setAppearance",
  SET_AUTO_UPDATE_AND_DOWNLOAD: "setAutoUpdateAndDownload",
  SET_CONFIRM_CLOSING_MULTIPLE_TABS: "setConfirmClosingMultipleTabs",
  SET_DAY_VOLUME_DECIMAL_POINTS: "setDayVolumeDecimalPoints",
  SET_DAY_VOLUME_UNIT: "setDayVolumeUnit",
  SET_INCLUDE_HIDDEN_COLUMNS: "setIncludeHiddenColumns",
  SET_MAX_DATE_RANGE_SPAN: "setMaxDateRangeSpan",
  SET_MIN_DATE: "setMinDate",
  SET_ONLINE_SEARCH: "setOnlineSearch",
  SET_RECEIVE_TEST_UPDATES: "setReceiveTestUpdates",
  SET_SEARCH_ENGINE_MODE: "setSearchEngineMode",
  SET_TOTAL_VOLUME_DECIMAL_POINTS: "setTotalVolumeDecimalPoints",
  SET_TOTAL_VOLUME_UNIT: "setTotalVolumeUnit",
  SF_ALIGN_CENTRE: "Center",
  SF_ALIGN_LEFT: "Left",
  SF_ALIGN_RIGHT: "Right",
  SF_AUTO_COMPLETE_INPUT_CLASSES: "e-autocomplete e-input",
  SF_AUTO_COMPLETE_POP_UP_CLASSES: "e-ddl e-popup e-popup-open",
  SF_AFTER: "After",
  SF_BOTH: "Both",
  SF_CONTENT_CLASS: "e-content",
  SF_CULTURE: "zh-Hans",
  SF_DATE_RANGE_PICKER_POP_UP_CLASSES: "e-daterangepicker e-popup e-popup-open",
  SF_ELLIPSIS_WITH_TOOLTIP: "EllipsisWithTooltip",
  SF_EQUAL: "equal",
  SF_ERROR_CLASS: "e-error",
  SF_FADE_IN: "FadeIn",
  SF_INDICATOR_CLASS: "e-indicator",
  SF_MENU: "Menu",
  SF_MOVABLE_CONTENT_CLASS: "e-movablecontent",
  SF_MULTIPLE: "Multiple",
  SF_NARROW: "Narrow",
  SF_NUM: "number",
  SF_SCROLL_BAR_CLASS: "e-scrollbar",
  SF_SCROLL_RIGHT_NAV_CLASS: "e-scroll-right-nav",
  SF_STYLES: "syncfusionStyles",
  SF_TAILWIND: "tailwind",
  SF_TAILWIND_DARK: "tailwind-dark",
  SHARE_1: 1,
  SHOW_PREFERENCE_TAB_ITEM: "showPreferenceTabItem",
  SLIDER: "slider",
  STABLE: "latest",
  STABLE_MODE_ID: "stable",
  START_DATE_KEY: "startDate",
  STOCK_NAME_KEY: "name",
  STOCK_SYMBOL_AUTO_COMPLETE_NAME: "autoCompleteStockSymbol",
  STOCK_SYMBOL_KEY: "ts_code",
  STOCK_SYMBOL_TOOLTIP_NAME: "tooltipStockSymbol",
  STRIKE_PRICE_KEY: "strikePrice",
  SWITCH: "switch",
  SWITCH_TAB_ITEM: "switch-tab",
  SYSTEM_DEFAULT_MODE_ID: "system",
  TAB_BAR_AREA_ID: "tab-bar-area",
  TAB_BAR_BUTTON_AREA_ID: "tab-bar-button-area",
  TAB_BAR_HEIGHT: 40,
  TAB_BAR_READY: "control-ready",
  TAB_BAR_TAB_AREA_ID: "tab-bar-tab-area",
  TAB_BAR_TABS_NAME: "tabsTabBar",
  TAB_BAR_TABS_UPDATE: "tabs-update",
  TAB_BAR_VIEW: "tabBar",
  TAB_ITEM_COUNT_KEY: "tabItemCount",
  TAG_KEY: "tag",
  TITLE_BAR_OVERLAY_COLOUR: "#0f172a",
  TOTAL_VOLUME_DECIMAL_POINTS_KEY: "totalVolumeDecimalPoints",
  TOTAL_VOLUME_KEY: "totalVolume",
  TOTAL_VOLUME_UNIT_KEY: "totalVolumeUnit",
  TRICK_INPUT_ID: "trick-input",
  UNKNOWN: "Unknown",
  WIN_CONTROL_AREA_ID: "win-control-area",
  WINDOWS: "win32",
};

export default global;
