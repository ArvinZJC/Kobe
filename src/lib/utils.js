/*
 * @Description: the utility script
 * @Version: 1.0.0.20220205
 * @Author: Arvin Zhao
 * @Date: 2022-02-05 20:46:04
 * @Last Editors: Arvin Zhao
 * @LastEditTime: 2022-02-05 21:02:50
 */

import global from "./global.js";
import * as zhCN from "../locales/zh-CN.json";

/**
 * Convert a date object to a date string in the format "yyyy-M-d".
 * @param {Date} date the date object to convert.
 * @returns the converted date string.
 */
export function toDateStr(date) {
  return [date.getFullYear(), date.getMonth() + 1, date.getDate()].join("-");
} // end function toDateStr

/**
 * Convert a volume unit value to its corresponding text.
 * @param {*} volumeUnitValue the volume unit value to convert.
 * @returns the converted volume unit text.
 */
export function toVolumeUnitText(volumeUnitValue) {
  switch (volumeUnitValue) {
    case global.common.BOARD_LOT_1: {
      return zhCN.default.boardLot1;
    }
    case global.common.BOARD_LOT_10: {
      return zhCN.default.boardLot10;
    }
    case global.common.BOARD_LOT_100: {
      return zhCN.default.boardLot100;
    }
    case global.common.BOARD_LOT_1000: {
      return zhCN.default.boardLot1000;
    }
    case global.common.BOARD_LOT_10000: {
      return zhCN.default.boardLot10000;
    }
    case global.common.SHARE_1: {
      return zhCN.default.share1;
    }
    default: {
      return zhCN.default.unknown;
    }
  } // end switch-case
} // end function toVolumeUnitText
