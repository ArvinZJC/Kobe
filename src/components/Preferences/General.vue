<!--
 * @Description: the preferences' general section component
 * @Version: 1.0.0.20220122
 * @Author: Arvin Zhao
 * @Date: 2022-01-19 15:33:02
 * @Last Editors: Arvin Zhao
 * @LastEditTime: 2022-01-22 19:04:45
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
        <!-- System default. -->
        <input
          :id="global.common.SYSTEM_DEFAULT_MODE_ID"
          :name="zhCN.default.appearanceHeader"
          :value="zhCN.default.systemDefault"
          type="radio"
        />
        <label :for="global.common.SYSTEM_DEFAULT_MODE_ID" class="e-btn">{{
          zhCN.default.systemDefault
        }}</label>
        <!-- Light. -->
        <input
          :id="global.common.LIGHT_MODE_ID"
          :name="zhCN.default.appearanceHeader"
          :value="zhCN.default.light"
          type="radio"
        />
        <label :for="global.common.LIGHT_MODE_ID" class="e-btn">{{
          zhCN.default.light
        }}</label>
        <!-- Dark. -->
        <input
          :id="global.common.DARK_MODE_ID"
          :name="zhCN.default.appearanceHeader"
          :value="zhCN.default.dark"
          type="radio"
        />
        <label :for="global.common.DARK_MODE_ID" class="e-btn">{{
          zhCN.default.dark
        }}</label>
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
        <!-- Baidu. -->
        <input
          :id="global.common.BAIDU_ID"
          :name="zhCN.default.externalSearchHeader"
          :value="zhCN.default.baidu"
          type="radio"
        />
        <label :for="global.common.BAIDU_ID" class="e-btn">{{
          zhCN.default.baidu
        }}</label>
        <!-- Google. -->
        <input
          :id="global.common.GOOGLE_ID"
          :name="zhCN.default.externalSearchHeader"
          :value="zhCN.default.google"
          type="radio"
        />
        <label :for="global.common.GOOGLE_ID" class="e-btn">{{
          zhCN.default.google
        }}</label>
      </div>
    </div>
  </div>
</template>

<script>
import global from "../../lib/global.js";
import * as zhCN from "../../locales/zh-CN.json";

export default {
  data() {
    return { data: {}, global, zhCN };
  },
};
</script>
