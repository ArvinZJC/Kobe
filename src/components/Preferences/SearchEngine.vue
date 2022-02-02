<!--
 * @Description: the preferences' search engine section component
 * @Version: 1.0.0.20220201
 * @Author: Arvin Zhao
 * @Date: 2022-01-21 11:18:56
 * @Last Editors: Arvin Zhao
 * @LastEditTime: 2022-02-01 22:52:15
-->

<template>
  <div class="container-preferences">
    <!-- Search engine mode. -->
    <Preference
      :explanation="zhCN.default.searchEngineModeExplanation"
      :header="zhCN.default.searchEngineModeHeader"
      :options="options.searchEngineMode"
      :selectionChangedHandler="changeSearchEngineMode"
      :type="global.common.BUTTON_GROUP"
    />
    <!-- Min date. -->
    <Preference
      :explanation="zhCN.default.minDateExplanation"
      :header="zhCN.default.minDateHeader"
      :options="options.minDate"
      :type="global.common.DATE_PICKER"
      :value="minDate"
    />
  </div>
</template>

<script>
import { LightningBoltIcon } from "@heroicons/vue/outline";

import Preference from "./Preference.vue";
import global from "../../lib/global.js";
import { changePreference, checkOption } from "../../lib/preferences.js";
import * as zhCN from "../../locales/zh-CN.json";
import TurtleIcon from "../SVG/TurtleIcon.vue";

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
      minDate: new Date(global.common.MIN_MIN_DATE),
      zhCN,
    };
  },
  mounted() {
    window[global.common.IPC_RENDERER_API_KEY].receive(
      global.common.IPC_RECEIVE,
      (data) => {
        if (
          typeof data === "object" &&
          Object.prototype.hasOwnProperty.call(data, global.common.MIN_DATE_KEY)
        ) {
          this.minDate = new Date(data[global.common.MIN_DATE_KEY]);
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
