/*
 * @Description: the global variables for the scripts
 * @Version: 1.0.0.20211218
 * @Author: Arvin Zhao
 * @Date: 2021-12-13 19:19:29
 * @Last Editors: Arvin Zhao
 * @LastEditTime: 2021-12-18 22:23:42
 */

global.common = {
  APP_SCHEME: "app",
  DEV: "development",
  GET_APP_NAME: "getAppName",
  GET_STOCK_LIST: "getStockList",
  IPC_RECEIVE: "fromMain",
  IPC_RENDERER_API_KEY: "ipcRenderer",
  IPC_SEND: "toMain",
  MACOS: "darwin",
  MIN_DATE: "1990-12-03",
  STOCK_NAME_KEY: "name",
  STOCK_SYMBOL_KEY: "ts_code",
  WIN_HEIGHT_MIN: 600,
  WIN_WIDTH_MIN: 800,
  WINDOWS: "win32",
};

global.locale = {
  CANCEL: "取消",
  CONFIRM: "确认",
  DATE_RANGE_PLACEHOLDER: "日期范围",
  DATE_RANGE_TOOLTIP: "点击日历图标来选择搜索的日期范围TODO",
  NO_STOCK_RECORDS: "未能匹配上市股票的代码",
  SEARCH: "搜索",
  STOCK_SYMBOL_PLACEHOLDER: "股票代码",
  STOCK_SYMBOL_TOOLTIP:
    "股票代码应以上市交易所代码开头（支持BJ、SH和SZ，大小写不限）接6位数字",
};

export default global;
