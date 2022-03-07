<!--
 * @Description: the preference view
 * @Version: 1.0.8.20220307
 * @Author: Arvin Zhao
 * @Date: 2022-01-16 12:59:49
 * @Last Editors: Arvin Zhao
 * @LastEditTime: 2022-03-07 14:33:56
-->

<template>
  <main
    :id="global.common.PREFERENCE_VIEW_ID"
    class="container-view max-w-[60rem]"
  >
    <!-- The preference tab component. -->
    <ejs-tab
      :animation="{
        previous: {
          effect: global.common.SF_FADE_IN,
          duration: global.common.ANIMATION_DURATION,
          easing: global.common.EASE,
        },
        next: {
          effect: global.common.SF_FADE_IN,
          duration: global.common.ANIMATION_DURATION,
          easing: global.common.EASE,
        },
      }"
      :ref="global.common.PREFERENCE_TABS_NAME"
      headerPlacement="Left"
    >
      <e-tabitems>
        <e-tabitem :content="contentGeneral" :header="headerGeneral" />
        <e-tabitem
          :content="contentSearchEngine"
          :header="headerSearchEngine"
        />
        <e-tabitem
          :content="contentResultDisplay"
          :header="headerResultDisplay"
        />
      </e-tabitems>
    </ejs-tab>
    <!-- The button component for resetting all preferences. -->
    <ejs-button
      @click="resetPreferences"
      :content="zhCN.default.reset"
      :target="global.common.PREFERENCE_VIEW_ID"
      :title="zhCN.default.resetPreferencesButtonTitle"
      cssClass="btn-action-left !text-red-600 dark:!text-red-400 bottom-4"
      iconCss="e-icons e-refresh"
    />
  </main>
</template>

<script>
import { ButtonComponent } from "@syncfusion/ej2-vue-buttons";
import {
  TabComponent,
  TabItemsDirective,
  TabItemDirective,
} from "@syncfusion/ej2-vue-navigations";
import { createApp } from "vue";

import General from "../components/preferences/General.vue";
import ResultDisplay from "../components/preferences/ResultDisplay.vue";
import SearchEngine from "../components/preferences/SearchEngine.vue";
import global from "../lib/global.js";
import * as zhCN from "../locales/zh-CN.json";

export default {
  components: {
    "e-tabitem": TabItemDirective,
    "e-tabitems": TabItemsDirective,
    "ejs-button": ButtonComponent,
    "ejs-tab": TabComponent,
  },
  methods: {
    /**
     * Reset all preferences.
     */
    resetPreferences() {
      window[global.common.IPC_RENDERER_API_KEY].send(
        global.common.IPC_SEND,
        global.common.RESET_PREFERENCES
      );
    }, // end function resetPreferences
  },
  data() {
    return {
      contentGeneral: () => {
        return { template: createApp().component("contentGeneral", General) };
      },
      contentResultDisplay: () => {
        return {
          template: createApp().component(
            "contentResultDisplay",
            ResultDisplay
          ),
        };
      },
      contentSearchEngine: () => {
        return {
          template: createApp().component("contentSearchEngine", SearchEngine),
        };
      },
      global,
      headerGeneral: {
        iconCss: "e-settings",
        text: zhCN.default.generalSection,
      },
      headerResultDisplay: {
        iconCss: "e-table",
        text: zhCN.default.resultDisplaySection,
      },
      headerSearchEngine: {
        iconCss: "e-eye",
        text: zhCN.default.searchEngineSection,
      },
      zhCN,
    };
  },
  mounted() {
    document.title = zhCN.default.preferences;
    window.addEventListener("load", () => {
      for (const indicator of document.getElementsByClassName(
        global.common.SF_INDICATOR_CLASS
      )) {
        const tabItemStyles = getComputedStyle(
          this.$refs[global.common.PREFERENCE_TABS_NAME].ej2Instances.tbItem[0]
        );

        indicator.style.height = `${
          parseInt(tabItemStyles.borderBottomWidth) +
          parseInt(tabItemStyles.borderTopWidth) +
          this.$refs[global.common.PREFERENCE_TABS_NAME].ej2Instances.tbItem[0]
            .clientHeight
        }px`;
        indicator.style.top = 0;
      } // end for
    }); // Set the styles of the first tab item's indicator after loading the view to avoid possible strange appearance.
  },
};
</script>
