<!--
 * @Description: the preferences' general section component
 * @Version: 1.1.3.20220913
 * @Author: Arvin Zhao
 * @Date: 2022-01-19 15:33:02
 * @Last Editors: Arvin Zhao
 * @LastEditTime: 2022-09-13 01:42:32
-->

<template>
  <div
    :id="global.common.GENERAL_SECTION_ID"
    class="container-view overflow-auto"
  >
    <div class="container-preferences">
      <!-- Appearance. -->
      <Preference
        :explanation="zhHansCn.default.appearanceExplanation"
        :options="options.appearance"
        :selectionChangedHandler="changeAppearance"
        :subtitle="zhHansCn.default.appearanceTitle"
        :type="global.common.BUTTON_GROUP"
      />
      <!-- Online search. -->
      <Preference
        :explanation="zhHansCn.default.onlineSearchExplanation"
        :options="options.onlineSearch"
        :selectionChangedHandler="changeOnlineSearch"
        :subtitle="zhHansCn.default.onlineSearchTitle"
        :type="global.common.BUTTON_GROUP"
      />
      <!-- Confirm closing multiple tabs. -->
      <Preference
        :explanation="zhHansCn.default.confirmClosingMultipleTabsExplanation"
        :options="options.confirmClosingMultipleTabs"
        :subtitle="zhHansCn.default.confirmClosingMultipleTabsTitle"
        :type="global.common.SWITCH"
        :value="confirmClosingMultipleTabs"
      />
      <div class="col-span-full h-4" />
      <!-- Check for updates. -->
      <!-- Update and download automatically. -->
      <Preference
        :explanation="zhHansCn.default.autoUpdateAndDownloadExplanation"
        :options="options.autoUpdateAndDownload"
        :subtitle="zhHansCn.default.autoUpdateAndDownloadTitle"
        :title="zhHansCn.default.checkForUpdates"
        :type="global.common.SWITCH"
        :value="autoUpdateAndDownload"
      />
      <!-- Receive test version updates. -->
      <Preference
        :explanation="zhHansCn.default.receiveTestUpdatesExplanation"
        :options="options.receiveTestUpdates"
        :subtitle="zhHansCn.default.receiveTestUpdatesTitle"
        :type="global.common.SWITCH"
        :value="receiveTestUpdates"
      />
    </div>
  </div>
  <ScrollToTopButton
    :isDismissed="isScrollToTopDismissed"
    :target="scrollToTopTarget"
  />
</template>

<script>
import {
  ComputerDesktopIcon,
  MoonIcon,
  SunIcon,
} from "@heroicons/vue/24/outline";

import Preference from "./Preference.vue";
import global from "../../lib/global.js";
import { changePreference, checkOption } from "../../lib/preferences.js";
import * as zhHansCn from "../../locales/zh-Hans-CN.json";
import ScrollToTopButton from "../ScrollToTopButton.vue";
import BaiduIcon from "../svg/BaiduIcon.vue";
import GoogleIcon from "../svg/GoogleIcon.vue";

export default {
  components: { Preference, ScrollToTopButton },
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

    /**
     * Use the IPC channel to exchange information.
     */
    invokeIpc() {
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
    }, // end function invokeIpc
  },
  data() {
    return {
      autoUpdateAndDownload: global.common.DEFAULT_AUTO_UPDATE_AND_DOWNLOAD,
      confirmClosingMultipleTabs:
        global.common.DEFAULT_CONFIRM_CLOSING_MULTIPLE_TABS,
      data: {},
      global,
      isScrollToTopDismissed: true,
      receiveTestUpdates: global.common.DEFAULT_RECEIVE_TEST_UPDATES,
      scrollToTopTarget: null,
      zhHansCn,
    };
  },
  mounted() {
    this.invokeIpc();
    this.scrollToTopTarget = document.getElementById(
      global.common.GENERAL_SECTION_ID
    );

    if (this.scrollToTopTarget != null) {
      this.scrollToTopTarget.addEventListener("scroll", () => {
        if (
          this.scrollToTopTarget.scrollTop <
          this.scrollToTopTarget.offsetHeight / 3
        ) {
          this.isScrollToTopDismissed = true;
        } else {
          this.isScrollToTopDismissed = false;
        } // end if...else
      });
    } // end if
  },
  setup() {
    return {
      options: {
        appearance: [
          {
            icon: ComputerDesktopIcon,
            id: global.common.SYSTEM_DEFAULT_MODE_ID,
            value: zhHansCn.default.systemDefault,
          }, // System default.
          {
            icon: SunIcon,
            id: global.common.LIGHT_MODE_ID,
            value: zhHansCn.default.light,
          }, // Light.
          {
            icon: MoonIcon,
            id: global.common.DARK_MODE_ID,
            value: zhHansCn.default.dark,
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
            value: zhHansCn.default.baidu,
          }, // Baidu.
          {
            icon: GoogleIcon,
            id: global.common.GOOGLE_ID,
            value: zhHansCn.default.google,
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
