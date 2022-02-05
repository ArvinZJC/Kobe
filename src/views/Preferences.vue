<!--
 * @Description: the preference view
 * @Version: 1.0.0.20220205
 * @Author: Arvin Zhao
 * @Date: 2022-01-16 12:59:49
 * @Last Editors: Arvin Zhao
 * @LastEditTime: 2022-02-05 19:06:38
-->

<template>
  <main :id="global.common.PREFERENCE_VIEW_ID" class="container-view">
    <div class="h-screen">
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
    <!-- The button component for resetting all preferences. -->
    <ejs-button
      @click="openResetPreferencesConfirmationDialogue"
      :content="zhCN.default.reset"
      :target="global.common.PREFERENCE_VIEW_ID"
      :title="zhCN.default.resetPreferencesButtonTitle"
      cssClass="btn-action-left !text-red-600 dark:!text-red-400 bottom-4"
      iconCss="e-icons e-refresh"
    />
    <!-- The confirmation dialogue for resetting all preferences.-->
    <ejs-dialog
      @overlayClick="hideResetPreferencesConfirmationDialogue"
      :buttons="[
        {
          click: resetPreferences,
          buttonModel: { content: zhCN.default.confirm, isPrimary: true },
        },
        {
          click: hideResetPreferencesConfirmationDialogue,
          buttonModel: { content: zhCN.default.cancel },
        },
      ]"
      :content="zhCN.default.resetPreferencesConfirmationDialogueContent"
      :header="zhCN.default.resetPreferencesConfirmationDialogueHeader"
      :isModal="true"
      :ref="global.common.RESET_PREFERENCES_CONFIRMATION_DIALOGUE_NAME"
      :showCloseIcon="true"
      :visible="false"
      width="40%"
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
import { DialogComponent } from "@syncfusion/ej2-vue-popups";
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
    "ejs-button": ButtonComponent,
    "ejs-dialog": DialogComponent,
    "ejs-tab": TabComponent,
  },
  methods: {
    /**
     * Hide the confirmation dialogue for resetting all preferences.
     */
    hideResetPreferencesConfirmationDialogue() {
      this.$refs[
        global.common.RESET_PREFERENCES_CONFIRMATION_DIALOGUE_NAME
      ].hide();
    }, // end function hideResetPreferencesConfirmationDialogue

    /**
     * Open the confirmation dialogue for resetting all preferences.
     */
    openResetPreferencesConfirmationDialogue() {
      this.$refs[
        global.common.RESET_PREFERENCES_CONFIRMATION_DIALOGUE_NAME
      ].show();
    }, // end function openResetPreferencesConfirmationDialogue

    /**
     * Reset all preferences.
     */
    resetPreferences() {
      this.hideResetPreferencesConfirmationDialogue();
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
  },
};
</script>
