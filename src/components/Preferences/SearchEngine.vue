<!--
 * @Description: the preferences' search engine section component
 * @Version: 1.0.0.20220130
 * @Author: Arvin Zhao
 * @Date: 2022-01-21 11:18:56
 * @Last Editors: Arvin Zhao
 * @LastEditTime: 2022-01-30 23:18:18
-->

<template>
  <div class="container-preferences">
    <!-- Search engine mode. -->
    <div class="container-preference">
      <h1 class="text-primary-header">
        {{ zhCN.default.searchEngineModeHeader }}
      </h1>
      <p class="text-secondary-explanation">
        {{ zhCN.default.searchEngineModeExplanation }}
      </p>
    </div>
    <div class="align-br">
      <div class="e-btn-group">
        <ButtonGroupMember
          v-for="searchEngineModeOption in options.searchEngineMode"
          @selectionChanged="changeSearchEngineMode"
          :group="zhCN.default.searchEngineModeHeader"
          :icon="searchEngineModeOption.icon"
          :id="searchEngineModeOption.id"
          :key="searchEngineModeOption.id"
          :value="searchEngineModeOption.value"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { LightningBoltIcon } from "@heroicons/vue/outline";

import ButtonGroupMember from "./ButtonGroupMember.vue";
import { changePreference, checkOption } from "../../lib/preferences.js";
import * as zhCN from "../../locales/zh-CN.json";
import TurtleIcon from "../SVG/TurtleIcon.vue";

export default {
  components: { ButtonGroupMember },
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
    return { data: {}, zhCN };
  },
  mounted() {
    window[global.common.IPC_RENDERER_API_KEY].receive(
      global.common.IPC_RECEIVE,
      (data) => {
        if (
          typeof data === "object" &&
          Object.prototype.hasOwnProperty.call(
            data,
            global.common.SEARCH_ENGINE_MODE_KEY
          )
        ) {
          this.currentSearchEngineMode =
            data[global.common.SEARCH_ENGINE_MODE_KEY];
          checkOption(this.currentSearchEngineMode);
        } // end if
      }
    );
    window[global.common.IPC_RENDERER_API_KEY].send(
      global.common.IPC_SEND,
      global.common.GET_SEARCH_ENGINE_MODE
    );
  },
  setup() {
    return {
      options: {
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
