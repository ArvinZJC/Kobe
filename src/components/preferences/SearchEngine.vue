<!--
 * @Description: the preferences' search engine section component
 * @Version: 1.0.2.20220308
 * @Author: Arvin Zhao
 * @Date: 2022-01-21 11:18:56
 * @Last Editors: Arvin Zhao
 * @LastEditTime: 2022-03-08 10:19:40
-->

<template>
  <div class="container-view overflow-auto">
    <div class="container-preferences">
      <!-- Search engine mode. -->
      <Preference
        :explanation="zhCN.default.searchEngineModeExplanation"
        :options="options.searchEngineMode"
        :selectionChangedHandler="changeSearchEngineMode"
        :title="zhCN.default.searchEngineModeTitle"
        :type="global.common.BUTTON_GROUP"
      />
      <!-- Min date. -->
      <Preference
        :explanation="zhCN.default.minDateExplanation"
        :options="options.minDate"
        :title="zhCN.default.minDateTitle"
        :type="global.common.DATE_PICKER"
        :value="new Date(`${minDate}${global.common.DAY_TIME_START}`)"
      />
      <!-- Max date range span. -->
      <Preference
        :explanation="zhCN.default.maxDateRangeSpanExplanation"
        :options="options.maxDateRangeSpan"
        :title="zhCN.default.maxDateRangeSpanTitle"
        :type="global.common.SLIDER"
        :value="maxDateRangeSpan"
      />
    </div>
  </div>
</template>

<script>
import { LightningBoltIcon } from "@heroicons/vue/outline";

import Preference from "./Preference.vue";
import global from "../../lib/global.js";
import { changePreference, checkOption } from "../../lib/preferences.js";
import * as zhCN from "../../locales/zh-CN.json";
import TurtleIcon from "../svg/TurtleIcon.vue";

export default {
  components: { Preference },
  methods: {
    /**
     * Change the search engine mode.
     * @param {string} id the search engine mode option ID.
     */
    changeSearchEngineMode(id) {
      changePreference(
        id,
        global.common.SEARCH_ENGINE_MODE_KEY,
        global.common.SET_SEARCH_ENGINE_MODE
      );
    }, // end function changeSearchEngineMode
  },
  data() {
    return {
      data: {},
      global,
      maxDateRangeSpan: null,
      minDate: global.common.MIN_MIN_DATE,
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
            global.common.MAX_DATE_RANGE_SPAN_KEY
          )
        ) {
          this.maxDateRangeSpan = data[global.common.MAX_DATE_RANGE_SPAN_KEY];
        } // end if

        if (
          typeof data === "object" &&
          Object.prototype.hasOwnProperty.call(data, global.common.MIN_DATE_KEY)
        ) {
          this.minDate = data[global.common.MIN_DATE_KEY];
        } // end if

        if (
          typeof data === "object" &&
          Object.prototype.hasOwnProperty.call(
            data,
            global.common.SEARCH_ENGINE_MODE_KEY
          )
        ) {
          checkOption(data[global.common.SEARCH_ENGINE_MODE_KEY]);
        } // end if
      }
    );
    window[global.common.IPC_RENDERER_API_KEY].send(
      global.common.IPC_SEND,
      global.common.GET_MAX_DATE_RANGE_SPAN
    );
    window[global.common.IPC_RENDERER_API_KEY].send(
      global.common.IPC_SEND,
      global.common.GET_MIN_DATE
    );
    window[global.common.IPC_RENDERER_API_KEY].send(
      global.common.IPC_SEND,
      global.common.GET_SEARCH_ENGINE_MODE
    );
  },
  setup() {
    return {
      options: {
        maxDateRangeSpan: {
          id: global.common.MAX_DATE_RANGE_SPAN_KEY,
          largeStep: 1,
          max: global.common.MAX_MAX_DATE_RANGE_SPAN,
          min: global.common.MIN_MAX_DATE_RANGE_SPAN,
          smallStep: 1,
          value: global.common.SET_MAX_DATE_RANGE_SPAN,
        },
        minDate: {
          id: global.common.MIN_DATE_KEY,
          value: global.common.SET_MIN_DATE,
        },
        searchEngineMode: [
          {
            icon: TurtleIcon,
            id: global.common.STABLE_MODE_ID,
            value: zhCN.default.stableMode,
          }, // Stable mode.
          {
            icon: LightningBoltIcon,
            id: global.common.FAST_MODE_ID,
            value: zhCN.default.fastMode,
          }, // Fast mode.
        ],
      },
    };
  },
};
</script>
