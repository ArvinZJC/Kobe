<!--
 * @Description: the preferences' general section component
 * @Version: 1.0.0.20220206
 * @Author: Arvin Zhao
 * @Date: 2022-01-19 15:33:02
 * @Last Editors: Arvin Zhao
 * @LastEditTime: 2022-02-06 13:59:54
-->

<template>
  <div class="container-preferences">
    <!-- Appearance. -->
    <Preference
      :explanation="zhCN.default.appearanceExplanation"
      :options="options.appearance"
      :selectionChangedHandler="changeAppearance"
      :title="zhCN.default.appearanceTitle"
      :type="global.common.BUTTON_GROUP"
    />
    <!-- External search. -->
    <Preference
      :explanation="zhCN.default.externalSearchExplanation"
      :options="options.externalSearch"
      :selectionChangedHandler="changeExternalSearch"
      :title="zhCN.default.externalSearchTitle"
      :type="global.common.BUTTON_GROUP"
    />
  </div>
</template>

<script>
import { DesktopComputerIcon, MoonIcon, SunIcon } from "@heroicons/vue/outline";

import Preference from "./Preference.vue";
import global from "../../lib/global.js";
import { changePreference, checkOption } from "../../lib/preferences.js";
import * as zhCN from "../../locales/zh-CN.json";
import BaiduIcon from "../SVG/BaiduIcon.vue";
import GoogleIcon from "../SVG/GoogleIcon.vue";

export default {
  components: { Preference },
  methods: {
    /**
     * Change the appearance.
     * @param {string} id the appearance option ID.
     */
    changeAppearance(id) {
      changePreference(
        id,
        global.common.APPEARANCE_KEY,
        global.common.SET_APPEARANCE
      );
    }, // end function changeAppearance

    /**
     * Change the external search.
     * @param {string} id the external search option ID.
     */
    changeExternalSearch(id) {
      changePreference(
        id,
        global.common.EXTERNAL_SEARCH_KEY,
        global.common.SET_EXTERNAL_SEARCH
      );
    }, // end function changeExternalSearch
  },
  data() {
    return { data: {}, global, zhCN };
  },
  mounted() {
    window[global.common.IPC_RENDERER_API_KEY].receive(
      global.common.IPC_RECEIVE,
      (data) => {
        if (
          typeof data === "object" &&
          Object.prototype.hasOwnProperty.call(
            data,
            global.common.APPEARANCE_KEY
          )
        ) {
          checkOption(data[global.common.APPEARANCE_KEY]);
        } // end if

        if (
          typeof data === "object" &&
          Object.prototype.hasOwnProperty.call(
            data,
            global.common.EXTERNAL_SEARCH_KEY
          )
        ) {
          checkOption(data[global.common.EXTERNAL_SEARCH_KEY]);
        } // end if
      }
    );
    window[global.common.IPC_RENDERER_API_KEY].send(
      global.common.IPC_SEND,
      global.common.GET_APPEARANCE
    );
    window[global.common.IPC_RENDERER_API_KEY].send(
      global.common.IPC_SEND,
      global.common.GET_EXTERNAL_SEARCH
    );
  },
  setup() {
    return {
      options: {
        appearance: [
          {
            icon: DesktopComputerIcon,
            id: global.common.SYSTEM_DEFAULT_MODE_ID,
            value: zhCN.default.systemDefault,
          }, // System default.
          {
            icon: MoonIcon,
            id: global.common.LIGHT_MODE_ID,
            value: zhCN.default.light,
          }, // Light.
          {
            icon: SunIcon,
            id: global.common.DARK_MODE_ID,
            value: zhCN.default.dark,
          }, // Dark.
        ],
        externalSearch: [
          {
            icon: BaiduIcon,
            id: global.common.BAIDU_ID,
            value: zhCN.default.baidu,
          }, // Baidu.
          {
            icon: GoogleIcon,
            id: global.common.GOOGLE_ID,
            value: zhCN.default.google,
          }, // Google.
        ],
      },
    };
  },
};
</script>
