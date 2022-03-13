<!--
 * @Description: the preferences' result display section component
 * @Version: 1.1.0.20220313
 * @Author: Arvin Zhao
 * @Date: 2022-01-31 17:53:47
 * @Last Editors: Arvin Zhao
 * @LastEditTime: 2022-03-13 13:49:33
-->

<template>
  <div class="container-view overflow-auto">
    <div class="container-preferences">
      <!-- Total volume. -->
      <!-- Unit. -->
      <Preference
        :explanation="zhCN.default.totalVolumeUnitExplanation"
        :options="options.totalVolumeUnit"
        :subtitle="zhCN.default.unitTitle"
        :title="zhCN.default.totalVolumeColumnHeader"
        :type="global.common.DROP_DOWN_LIST"
        :value="totalVolumeUnit"
      />
      <!-- The number of decimal points. -->
      <Preference
        :explanation="zhCN.default.totalVolumeDecimalPointsExplanation"
        :options="options.totalVolumeDecimalPoints"
        :subtitle="zhCN.default.decimalPointsTitle"
        :type="global.common.SLIDER"
        :value="totalVolumeDecimalPoints"
      />
      <div class="col-span-full h-4" />
      <!-- Day volume. -->
      <!-- Unit. -->
      <Preference
        :explanation="zhCN.default.dayVolumeUnitExplanation"
        :options="options.dayVolumeUnit"
        :subtitle="zhCN.default.unitTitle"
        :title="zhCN.default.dayVolumeStackedColumnHeader"
        :type="global.common.DROP_DOWN_LIST"
        :value="dayVolumeUnit"
      />
      <!-- The number of decimal points. -->
      <Preference
        :explanation="zhCN.default.dayVolumeDecimalPointsExplanation"
        :options="options.dayVolumeDecimalPoints"
        :subtitle="zhCN.default.decimalPointsTitle"
        :type="global.common.SLIDER"
        :value="dayVolumeDecimalPoints"
      />
      <div class="col-span-full h-4" />
      <!-- Excel export. -->
      <!-- Include hidden columns. -->
      <Preference
        :explanation="zhCN.default.includeHiddenColumnsExplanation"
        :options="options.includeHiddenColumns"
        :subtitle="zhCN.default.includeHiddenColumnsTitle"
        :title="syncfusion.default['zh-Hans'].grid.Excelexport"
        :type="global.common.SWITCH"
        :value="includeHiddenColumns"
      />
    </div>
  </div>
</template>

<script>
import Preference from "./Preference.vue";
import global from "../../lib/global.js";
import * as syncfusion from "../../locales/syncfusion.json";
import * as zhCN from "../../locales/zh-CN.json";

export default {
  components: {
    Preference,
  },
  data() {
    return {
      data: {},
      dayVolumeDecimalPoints: null,
      dayVolumeUnit: global.common.BOARD_LOT_1,
      global,
      includeHiddenColumns: global.common.DEFAULT_INCLUDE_HIDDEN_COLUMNS,
      syncfusion,
      totalVolumeDecimalPoints: null,
      totalVolumeUnit: global.common.BOARD_LOT_100,
      zhCN,
    };
  },
  mounted() {
    window[global.common.IPC_RENDERER_API_KEY].receive(
      global.common.IPC_RECEIVE,
      (data) => {
        if (
          typeof data === "object" &&
          Object.prototype.hasOwnProperty.call(
            data,
            global.common.DAY_VOLUME_DECIMAL_POINTS_KEY
          )
        ) {
          this.dayVolumeDecimalPoints =
            data[global.common.DAY_VOLUME_DECIMAL_POINTS_KEY];
        } // end if

        if (
          typeof data === "object" &&
          Object.prototype.hasOwnProperty.call(
            data,
            global.common.DAY_VOLUME_UNIT_KEY
          )
        ) {
          this.dayVolumeUnit = data[global.common.DAY_VOLUME_UNIT_KEY];
        } // end if

        if (
          typeof data === "object" &&
          Object.prototype.hasOwnProperty.call(
            data,
            global.common.INCLUDE_HIDDEN_COLUMNS_KEY
          )
        ) {
          this.includeHiddenColumns =
            data[global.common.INCLUDE_HIDDEN_COLUMNS_KEY];
        } // end if

        if (
          typeof data === "object" &&
          Object.prototype.hasOwnProperty.call(
            data,
            global.common.TOTAL_VOLUME_DECIMAL_POINTS_KEY
          )
        ) {
          this.totalVolumeDecimalPoints =
            data[global.common.TOTAL_VOLUME_DECIMAL_POINTS_KEY];
        } // end if

        if (
          typeof data === "object" &&
          Object.prototype.hasOwnProperty.call(
            data,
            global.common.TOTAL_VOLUME_UNIT_KEY
          )
        ) {
          this.totalVolumeUnit = data[global.common.TOTAL_VOLUME_UNIT_KEY];
        } // end if
      }
    );
    window[global.common.IPC_RENDERER_API_KEY].send(
      global.common.IPC_SEND,
      global.common.GET_DAY_VOLUME_DECIMAL_POINTS
    );
    window[global.common.IPC_RENDERER_API_KEY].send(
      global.common.IPC_SEND,
      global.common.GET_DAY_VOLUME_UNIT
    );
    window[global.common.IPC_RENDERER_API_KEY].send(
      global.common.IPC_SEND,
      global.common.GET_INCLUDE_HIDDEN_COLUMNS
    );
    window[global.common.IPC_RENDERER_API_KEY].send(
      global.common.IPC_SEND,
      global.common.GET_TOTAL_VOLUME_DECIMAL_POINTS
    );
    window[global.common.IPC_RENDERER_API_KEY].send(
      global.common.IPC_SEND,
      global.common.GET_TOTAL_VOLUME_UNIT
    );
  },
  setup() {
    const volumeUnits = [
      { text: zhCN.default.share1, value: global.common.SHARE_1 },
      { text: zhCN.default.boardLot1, value: global.common.BOARD_LOT_1 },
      { text: zhCN.default.boardLot10, value: global.common.BOARD_LOT_10 },
      { text: zhCN.default.boardLot100, value: global.common.BOARD_LOT_100 },
      { text: zhCN.default.boardLot1000, value: global.common.BOARD_LOT_1000 },
      {
        text: zhCN.default.boardLot10000,
        value: global.common.BOARD_LOT_10000,
      },
    ];

    return {
      options: {
        dayVolumeDecimalPoints: {
          id: global.common.DAY_VOLUME_DECIMAL_POINTS_KEY,
          largeStep: 1,
          max: global.common.MAX_DECIMAL_POINTS,
          min: global.common.MIN_DECIMAL_POINTS,
          smallStep: 1,
          value: global.common.SET_DAY_VOLUME_DECIMAL_POINTS,
        },
        dayVolumeUnit: {
          data: volumeUnits,
          id: global.common.DAY_VOLUME_UNIT_KEY,
          value: global.common.SET_DAY_VOLUME_UNIT,
        },
        includeHiddenColumns: {
          id: global.common.INCLUDE_HIDDEN_COLUMNS_KEY,
          value: global.common.SET_INCLUDE_HIDDEN_COLUMNS,
        },
        totalVolumeDecimalPoints: {
          id: global.common.TOTAL_VOLUME_DECIMAL_POINTS_KEY,
          largeStep: 1,
          max: global.common.MAX_DECIMAL_POINTS,
          min: global.common.MIN_DECIMAL_POINTS,
          smallStep: 1,
          value: global.common.SET_TOTAL_VOLUME_DECIMAL_POINTS,
        },
        totalVolumeUnit: {
          data: volumeUnits,
          id: global.common.TOTAL_VOLUME_UNIT_KEY,
          value: global.common.SET_TOTAL_VOLUME_UNIT,
        },
      },
    };
  },
};
</script>
