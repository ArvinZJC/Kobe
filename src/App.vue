<!--
 * @Description: the root component
 * @Version: 1.0.0.20211223
 * @Author: Arvin Zhao
 * @Date: 2021-12-06 21:52:09
 * @Last Editors: Arvin Zhao
 * @LastEditTime: 2021-12-23 21:28:59
-->

<template>
  <router-view v-slot="{ Component }">
    <transition
      enter-active-class="motion-safe:transition-opacity-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="motion-safe:transition-opacity-300 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <component :is="Component" :key="$route.name" />
    </transition>
  </router-view>
</template>

<script>
import { L10n, loadCldr, setCulture } from "@syncfusion/ej2-base";
import * as caGregorian from "cldr-data/main/zh-Hans/ca-gregorian.json";
import * as numbers from "cldr-data/main/zh-Hans/numbers.json";
import * as timeZoneNames from "cldr-data/main/zh-Hans/timeZoneNames.json";
import * as numberingSystems from "cldr-data/supplemental/numberingSystems.json";
import * as weekData from "cldr-data/supplemental/weekData.json";

import global from "./lib/global.js";
import * as syncfusionLocale from "./locales/syncfusion.json";

var syncfusionZhCN = {};

syncfusionZhCN[global.common.SYNCFUSION_CULTURE] =
  syncfusionLocale.default[global.common.SYNCFUSION_CULTURE];
loadCldr(
  caGregorian.default,
  numbers.default,
  numberingSystems.default,
  timeZoneNames.default,
  weekData.default
);
L10n.load(syncfusionZhCN);
setCulture(global.common.SYNCFUSION_CULTURE);

export default {};
</script>

<!-- AutoComplete, Button, DateRangePicker, and Tooltip. -->
<style>
@import "../node_modules/@syncfusion/ej2-base/styles/tailwind.css";
@import "../node_modules/@syncfusion/ej2-buttons/styles/tailwind.css";
@import "../node_modules/@syncfusion/ej2-inputs/styles/tailwind.css";
@import "../node_modules/@syncfusion/ej2-lists/styles/tailwind.css";
@import "../node_modules/@syncfusion/ej2-popups/styles/tailwind.css";
@import "../node_modules/@syncfusion/ej2-vue-buttons/styles/tailwind.css";
@import "../node_modules/@syncfusion/ej2-vue-calendars/styles/tailwind.css";
@import "../node_modules/@syncfusion/ej2-vue-dropdowns/styles/tailwind.css";
@import "../node_modules/@syncfusion/ej2-vue-grids/styles/tailwind.css";
@import "../node_modules/@syncfusion/ej2-vue-popups/styles/tailwind.css";
</style>
