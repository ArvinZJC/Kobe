<!--
 * @Description: the root component
 * @Version: 1.0.0.20220129
 * @Author: Arvin Zhao
 * @Date: 2021-12-06 21:52:09
 * @Last Editors: Arvin Zhao
 * @LastEditTime: 2022-01-29 18:12:46
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
      <component :is="Component" />
    </transition>
  </router-view>
</template>

<script>
import { L10n, loadCldr, setCulture } from "@syncfusion/ej2-base";
import {
  ColumnChooser,
  ColumnMenu,
  ExcelExport,
  Filter,
  Freeze,
  Resize,
  Search,
  Sort,
  Toolbar,
} from "@syncfusion/ej2-vue-grids";
import * as caGregorian from "cldr-data/main/zh-Hans/ca-gregorian.json";
import * as numbers from "cldr-data/main/zh-Hans/numbers.json";
import * as timeZoneNames from "cldr-data/main/zh-Hans/timeZoneNames.json";
import * as numberingSystems from "cldr-data/supplemental/numberingSystems.json";
import * as weekData from "cldr-data/supplemental/weekData.json";

import { applyAppearance } from "./lib/appearance.js";
import global from "./lib/global.js";
import * as syncfusionLocale from "./locales/syncfusion.json";

var syncfusionZhCN = {};

syncfusionZhCN[global.common.SF_CULTURE] =
  syncfusionLocale.default[global.common.SF_CULTURE];
loadCldr(
  caGregorian.default,
  numbers.default,
  numberingSystems.default,
  timeZoneNames.default,
  weekData.default
);
L10n.load(syncfusionZhCN);
setCulture(global.common.SF_CULTURE);

export default {
  provide: {
    grid: [
      ColumnChooser,
      ColumnMenu,
      ExcelExport,
      Filter,
      Freeze,
      Resize,
      Search,
      Sort,
      Toolbar,
    ],
  },
  mounted() {
    const darkModeMql = window.matchMedia("(prefers-color-scheme: dark)"); // A MediaQueryList object containing the results of detecting the system appearance.

    applyAppearance(darkModeMql);
    darkModeMql.addEventListener("change", applyAppearance); // Listen to the change of the system appearance.
  },
};
</script>
