<!--
 * @Description: the preferences' general section component
 * @Version: 1.0.5.20220304
 * @Author: Arvin Zhao
 * @Date: 2022-01-19 15:33:02
 * @Last Editors: Arvin Zhao
 * @LastEditTime: 2022-03-04 12:52:26
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
    <!-- Online search. -->
    <Preference
      :explanation="zhCN.default.onlineSearchExplanation"
      :options="options.onlineSearch"
      :selectionChangedHandler="changeOnlineSearch"
      :title="zhCN.default.onlineSearchTitle"
      :type="global.common.BUTTON_GROUP"
    />
    <!-- Confirm closing multiple tabs. -->
    <Preference
      :explanation="zhCN.default.confirmClosingMultipleTabsExplanation"
      :options="options.confirmClosingMultipleTabs"
      :title="zhCN.default.confirmClosingMultipleTabsTitle"
      :type="global.common.SWITCH"
      :value="confirmClosingMultipleTabs"
    />
  </div>
</template>

<script>
import { DesktopComputerIcon, MoonIcon, SunIcon } from "@heroicons/vue/outline";

import Preference from "./Preference.vue";
import global from "../../lib/global.js";
import { changePreference, checkOption } from "../../lib/preferences.js";
import * as zhCN from "../../locales/zh-CN.json";
import BaiduIcon from "../svg/BaiduIcon.vue";
import GoogleIcon from "../svg/GoogleIcon.vue";

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
     * Change the online search.
     * @param {string} id the online search option ID.
     */
    changeOnlineSearch(id) {
      changePreference(
        id,
        global.common.ONLINE_SEARCH_KEY,
        global.common.SET_ONLINE_SEARCH
      );
    }, // end function changeOnlineSearch
  },
  data() {
    return {
      confirmClosingMultipleTabs:
        global.common.DEFAULT_CONFIRM_CLOSING_MULTIPLE_TABS,
      data: {},
      global,
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
            global.common.APPEARANCE_KEY
          )
        ) {
          checkOption(data[global.common.APPEARANCE_KEY]);
        } // end if

        if (
          typeof data === "object" &&
          Object.prototype.hasOwnProperty.call(
            data,
            global.common.CONFIRM_CLOSING_MULTIPLE_TABS_KEY
          )
        ) {
          this.confirmClosingMultipleTabs =
            data[global.common.CONFIRM_CLOSING_MULTIPLE_TABS_KEY];
        } // end if

        if (
          typeof data === "object" &&
          Object.prototype.hasOwnProperty.call(
            data,
            global.common.ONLINE_SEARCH_KEY
          )
        ) {
          checkOption(data[global.common.ONLINE_SEARCH_KEY]);
        } // end if
      }
    );
    window[global.common.IPC_RENDERER_API_KEY].send(
      global.common.IPC_SEND,
      global.common.GET_APPEARANCE
    );
    window[global.common.IPC_RENDERER_API_KEY].send(
      global.common.IPC_SEND,
      global.common.GET_CONFIRM_CLOSING_MULTIPLE_TABS
    );
    window[global.common.IPC_RENDERER_API_KEY].send(
      global.common.IPC_SEND,
      global.common.GET_ONLINE_SEARCH
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
            icon: SunIcon,
            id: global.common.LIGHT_MODE_ID,
            value: zhCN.default.light,
          }, // Light.
          {
            icon: MoonIcon,
            id: global.common.DARK_MODE_ID,
            value: zhCN.default.dark,
          }, // Dark.
        ],
        confirmClosingMultipleTabs: {
          id: global.common.CONFIRM_CLOSING_MULTIPLE_TABS_KEY,
          value: global.common.SET_CONFIRM_CLOSING_MULTIPLE_TABS,
        },
        onlineSearch: [
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
