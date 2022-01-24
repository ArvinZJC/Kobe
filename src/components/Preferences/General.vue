<!--
 * @Description: the preferences' general section component
 * @Version: 1.0.0.20220124
 * @Author: Arvin Zhao
 * @Date: 2022-01-19 15:33:02
 * @Last Editors: Arvin Zhao
 * @LastEditTime: 2022-01-24 13:52:43
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
  data() {
    return { data: {}, global, zhCN };
  },
  setup() {
    const options = {
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
    };

    return { options };
  },
};
</script>
