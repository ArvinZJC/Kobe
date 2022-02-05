<!--
 * @Description: the preferences' result display section component
 * @Version: 1.0.0.20220205
 * @Author: Arvin Zhao
 * @Date: 2022-01-31 17:53:47
 * @Last Editors: Arvin Zhao
 * @LastEditTime: 2022-02-05 19:49:44
-->

<template>
  <div class="container-preferences">
    <!-- Total volume unit. -->
    <Preference
      :explanation="zhCN.default.totalVolumeUnitExplanation"
      :header="zhCN.default.totalVolumeUnitHeader"
      :options="options.totalVolumeUnit"
      :type="global.common.DROP_DOWN_LIST"
      :value="totalVolumeUnit"
    />
    <!-- Day volume unit. -->
    <Preference
      :explanation="zhCN.default.dayVolumeUnitExplanation"
      :header="zhCN.default.dayVolumeUnitHeader"
      :options="options.dayVolumeUnit"
      :type="global.common.DROP_DOWN_LIST"
      :value="dayVolumeUnit"
    />
  </div>
</template>

<script>
import Preference from "./Preference.vue";
import global from "../../lib/global.js";
import * as zhCN from "../../locales/zh-CN.json";

export default {
  components: {
    Preference,
  },
  data() {
    return {
      data: {},
      dayVolumeUnit: global.common.BOARD_LOT_1,
      global,
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
            global.common.DAY_VOLUME_UNIT_KEY
          )
        ) {
          this.dayVolumeUnit = data[global.common.DAY_VOLUME_UNIT_KEY];
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
      global.common.GET_DAY_VOLUME_UNIT
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
        dayVolumeUnit: {
          data: volumeUnits,
          id: global.common.DAY_VOLUME_UNIT_KEY,
          value: global.common.SET_DAY_VOLUME_UNIT,
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
