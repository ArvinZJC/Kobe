<!--
 * @Description: the preferences' general section component
 * @Version: 1.0.0.20220129
 * @Author: Arvin Zhao
 * @Date: 2022-01-19 15:33:02
 * @Last Editors: Arvin Zhao
 * @LastEditTime: 2022-01-29 20:32:02
-->

<template>
  <div class="px-block py-block gap-4 grid grid-cols-3">
    <!-- Appearance. -->
    <div class="col-span-2 flex flex-col space-y-1">
      <h1 class="text-primary font-bold text-base">
        {{ zhCN.default.appearanceHeader }}
      </h1>
      <p class="text-secondary">{{ zhCN.default.appearanceExplanation }}</p>
    </div>
    <div class="flex items-end justify-end">
      <div class="e-btn-group">
        <ButtonGroupMember
          v-for="appearanceOption in options.appearance"
          @selectionChanged="changeAppearance"
          :group="zhCN.default.appearanceHeader"
          :id="appearanceOption.id"
          :key="appearanceOption.id"
          :value="appearanceOption.value"
        />
      </div>
    </div>
    <!-- External search. -->
    <div class="col-span-2 flex flex-col space-y-1">
      <h1 class="text-primary font-bold text-base">
        {{ zhCN.default.externalSearchHeader }}
      </h1>
      <p class="text-secondary">{{ zhCN.default.externalSearchExplanation }}</p>
    </div>
    <div class="flex items-end justify-end">
      <div class="e-btn-group">
        <ButtonGroupMember
          v-for="externalSearchOption in options.externalSearch"
          :group="zhCN.default.externalSearchHeader"
          :id="externalSearchOption.id"
          :key="externalSearchOption.id"
          :value="externalSearchOption.value"
        />
      </div>
    </div>
  </div>
</template>

<script>
import ButtonGroupMember from "./ButtonGroupMember.vue";
import global from "../../lib/global.js";
import * as zhCN from "../../locales/zh-CN.json";

export default {
  components: { ButtonGroupMember },
  methods: {
    /**
     * Change the appearance mode.
     * @param {DOMElement} element the appearance option element.
     */
    changeAppearance(element) {
      var appearanceChange = {};

      appearanceChange[global.common.TAG_KEY] = global.common.SET_APPEARANCE;
      appearanceChange[global.common.APPEARANCE_KEY] = element.id;
      window[global.common.IPC_RENDERER_API_KEY].send(
        global.common.IPC_SEND,
        appearanceChange
      );
    }, // end function changeAppearance

    /**
     * Check a radio button.
     * @param {string} id the radio button ID.
     */
    checkOption(id) {
      const option = document.getElementById(id);

      if (option != null) {
        option.checked = true;
      } // end if
    }, // end function checkOption
  },
  data() {
    return {
      currentAppearance: null,
      currentExternalSearch: null,
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
          this.currentAppearance = data[global.common.APPEARANCE_KEY];
          this.checkOption(this.currentAppearance);
        } // end if

        if (
          typeof data === "object" &&
          Object.prototype.hasOwnProperty.call(
            data,
            global.common.EXTERNAL_SEARCH_KEY
          )
        ) {
          this.currentExternalSearch = data[global.common.EXTERNAL_SEARCH_KEY];
          this.checkOption(this.currentExternalSearch);
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
            id: global.common.SYSTEM_DEFAULT_MODE_ID,
            value: zhCN.default.systemDefault,
          }, // System default.
          { id: global.common.LIGHT_MODE_ID, value: zhCN.default.light }, // Light.
          { id: global.common.DARK_MODE_ID, value: zhCN.default.dark }, // Dark.
        ],
        externalSearch: [
          { id: global.common.BAIDU_ID, value: zhCN.default.baidu }, // Baidu.
          { id: global.common.GOOGLE_ID, value: zhCN.default.google }, // Google.
        ],
      },
    };
  },
};
</script>
