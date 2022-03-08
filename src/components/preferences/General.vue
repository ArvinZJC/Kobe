<!--
 * @Description: the preferences' general section component
 * @Version: 1.0.8.20220308
 * @Author: Arvin Zhao
 * @Date: 2022-01-19 15:33:02
 * @Last Editors: Arvin Zhao
 * @LastEditTime: 2022-03-08 10:22:49
-->

<template>
  <div class="container-view overflow-auto">
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
      <!-- Check for updates. -->
      <!-- Update and download automatically. -->
      <Preference
        :explanation="zhCN.default.autoUpdateAndDownloadExplanation"
        :options="options.autoUpdateAndDownload"
        :subtitle="zhCN.default.autoUpdateAndDownloadTitle"
        :title="zhCN.default.checkForUpdates"
        :type="global.common.SWITCH"
        :value="autoUpdateAndDownload"
      />
      <!-- Receive test version updates. -->
      <Preference
        :explanation="zhCN.default.receiveTestUpdatesExplanation"
        :options="options.receiveTestUpdates"
        :subtitle="zhCN.default.receiveTestUpdatesTitle"
        :type="global.common.SWITCH"
        :value="receiveTestUpdates"
      />
    </div>
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
      autoUpdateAndDownload: global.common.DEFAULT_AUTO_UPDATE_AND_DOWNLOAD,
      confirmClosingMultipleTabs:
        global.common.DEFAULT_CONFIRM_CLOSING_MULTIPLE_TABS,
      data: {},
      global,
      receiveTestUpdates: global.common.DEFAULT_RECEIVE_TEST_UPDATES,
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
            global.common.AUTO_UPDATE_AND_DOWNLOAD_KEY
          )
        ) {
          this.autoUpdateAndDownload =
            data[global.common.AUTO_UPDATE_AND_DOWNLOAD_KEY];
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

        if (
          typeof data === "object" &&
          Object.prototype.hasOwnProperty.call(
            data,
            global.common.RECEIVE_TEST_UPDATES_KEY
          )
        ) {
          this.receiveTestUpdates =
            data[global.common.RECEIVE_TEST_UPDATES_KEY];
        } // end if
      }
    );
    window[global.common.IPC_RENDERER_API_KEY].send(
      global.common.IPC_SEND,
      global.common.GET_APPEARANCE
    );
    window[global.common.IPC_RENDERER_API_KEY].send(
      global.common.IPC_SEND,
      global.common.GET_AUTO_UPDATE_AND_DOWNLOAD
    );
    window[global.common.IPC_RENDERER_API_KEY].send(
      global.common.IPC_SEND,
      global.common.GET_CONFIRM_CLOSING_MULTIPLE_TABS
    );
    window[global.common.IPC_RENDERER_API_KEY].send(
      global.common.IPC_SEND,
      global.common.GET_ONLINE_SEARCH
    );
    window[global.common.IPC_RENDERER_API_KEY].send(
      global.common.IPC_SEND,
      global.common.GET_RECEIVE_TEST_UPDATES
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
        autoUpdateAndDownload: {
          id: global.common.AUTO_UPDATE_AND_DOWNLOAD_KEY,
          value: global.common.SET_AUTO_UPDATE_AND_DOWNLOAD,
        },
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
        receiveTestUpdates: {
          id: global.common.RECEIVE_TEST_UPDATES_KEY,
          value: global.common.SET_RECEIVE_TEST_UPDATES,
        },
      },
    };
  },
};
</script>
