<!--
 * @Description: the preferences' search engine section component
 * @Version: 1.1.3.20220913
 * @Author: Arvin Zhao
 * @Date: 2022-01-21 11:18:56
 * @Last Editors: Arvin Zhao
 * @LastEditTime: 2022-09-13 01:49:03
-->

<template>
  <div
    :id="global.common.SEARCH_ENGINE_SECTION_ID"
    class="container-view overflow-auto"
  >
    <div class="container-preferences">
      <!-- Search engine mode. -->
      <Preference
        :explanation="zhHansCn.default.searchEngineModeExplanation"
        :options="options.searchEngineMode"
        :selectionChangedHandler="changeSearchEngineMode"
        :subtitle="zhHansCn.default.searchEngineModeTitle"
        :type="global.common.BUTTON_GROUP"
      />
      <!-- Min date. -->
      <Preference
        :explanation="zhHansCn.default.minDateExplanation"
        :options="options.minDate"
        :subtitle="zhHansCn.default.minDateTitle"
        :type="global.common.DATE_PICKER"
        :value="new Date(`${minDate}${global.common.DAY_TIME_START}`)"
      />
      <!-- Max date range span. -->
      <Preference
        :explanation="zhHansCn.default.maxDateRangeSpanExplanation"
        :options="options.maxDateRangeSpan"
        :subtitle="zhHansCn.default.maxDateRangeSpanTitle"
        :type="global.common.SLIDER"
        :value="maxDateRangeSpan"
      />
    </div>
  </div>
  <ScrollToTopButton
    :isDismissed="isScrollToTopDismissed"
    :target="scrollToTopTarget"
  />
</template>

<script>
import { BoltIcon } from "@heroicons/vue/24/outline";

import Preference from "./Preference.vue";
import global from "../../lib/global.js";
import { changePreference, checkOption } from "../../lib/preferences.js";
import * as zhHansCn from "../../locales/zh-Hans-CN.json";
import ScrollToTopButton from "../ScrollToTopButton.vue";
import TurtleIcon from "../svg/TurtleIcon.vue";

export default {
  components: { Preference, ScrollToTopButton },
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
              global.common.MAX_DATE_RANGE_SPAN_KEY
            )
          ) {
            this.maxDateRangeSpan = data[global.common.MAX_DATE_RANGE_SPAN_KEY];
          } // end if

          if (
            typeof data === "object" &&
            Object.prototype.hasOwnProperty.call(
              data,
              global.common.MIN_DATE_KEY
            )
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
    }, // end function invokeIpc
  },
  data() {
    return {
      data: {},
      global,
      isScrollToTopDismissed: true,
      maxDateRangeSpan: null,
      minDate: global.common.MIN_MIN_DATE,
      scrollToTopTarget: null,
      zhHansCn,
    };
  },
  mounted() {
    this.invokeIpc();
    this.scrollToTopTarget = document.getElementById(
      global.common.SEARCH_ENGINE_SECTION_ID
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
            value: zhHansCn.default.stableMode,
          }, // Stable mode.
          {
            icon: BoltIcon,
            id: global.common.FAST_MODE_ID,
            value: zhHansCn.default.fastMode,
          }, // Fast mode.
        ],
      },
    };
  },
};
</script>
