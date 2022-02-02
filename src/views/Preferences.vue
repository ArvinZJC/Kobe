<!--
 * @Description: the preference view
 * @Version: 1.0.0.20220131
 * @Author: Arvin Zhao
 * @Date: 2022-01-16 12:59:49
 * @Last Editors: Arvin Zhao
 * @LastEditTime: 2022-01-31 21:28:01
-->

<template>
  <main class="container-view">
    <div class="h-screen">
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
    </div>
  </main>
</template>

<script>
import {
  TabComponent,
  TabItemsDirective,
  TabItemDirective,
} from "@syncfusion/ej2-vue-navigations";
import { createApp } from "vue";

import General from "../components/Preferences/General.vue";
import ResultDisplay from "../components/Preferences/ResultDisplay.vue";
import SearchEngine from "../components/Preferences/SearchEngine.vue";
import global from "../lib/global.js";
import * as zhCN from "../locales/zh-CN.json";

export default {
  components: {
    "e-tabitem": TabItemDirective,
    "e-tabitems": TabItemsDirective,
    "ejs-tab": TabComponent,
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
    };
  },
  mounted() {
    document.title = zhCN.default.preferences;
  },
};
</script>
