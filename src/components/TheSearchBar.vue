<!--
 * @Description: the search bar component
 * @Version: 1.0.0.20211218
 * @Author: Arvin Zhao
 * @Date: 2021-12-12 05:44:32
 * @Last Editors: Arvin Zhao
 * @LastEditTime: 2021-12-18 22:31:44
-->

<template>
  <form class="space-y-6" action="#" method="POST">
    <!-- The stock symbol autocomplete. -->
    <div class="flex flex-row space-x-2">
      <ejs-autocomplete
        :dataSource="stockList"
        :fields="{ value: global.common.STOCK_SYMBOL_KEY }"
        :itemTemplate="stockListItemTemplate"
        :noRecordsTemplate="stockListNoRecordsTemplate"
        :placeholder="locale.STOCK_SYMBOL_PLACEHOLDER"
        autofill="true"
        highlight="true"
      />
      <ejs-tooltip
        :content="locale.STOCK_SYMBOL_TOOLTIP"
        class="flex items-center"
      >
        <span class="e-circle-help e-icons text-secondary"></span>
      </ejs-tooltip>
    </div>
    <!-- The date range picker. -->
    <div class="flex flex-row space-x-2">
      <ejs-daterangepicker
        :max="maxDate"
        :min="new Date(global.common.MIN_DATE)"
        :placeholder="locale.DATE_RANGE_PLACEHOLDER"
        :renderDayCell="disableWeekends"
      ></ejs-daterangepicker>
      <ejs-tooltip
        :content="locale.DATE_RANGE_TOOLTIP"
        class="flex items-center"
      >
        <span class="e-circle-help e-icons text-secondary"></span>
      </ejs-tooltip>
    </div>
    <ejs-button
      :content="locale.SEARCH"
      cssClass="e-block"
      iconCss="e-icons e-search"
      isPrimary="true"
    ></ejs-button>
  </form>
</template>

<script>
import { L10n, setCulture } from "@syncfusion/ej2-base";
import { AutoCompleteComponent } from "@syncfusion/ej2-vue-dropdowns";
import { ButtonComponent } from "@syncfusion/ej2-vue-buttons";
import { DateRangePickerComponent } from "@syncfusion/ej2-vue-calendars";
import { TooltipComponent } from "@syncfusion/ej2-vue-popups";
import { createApp } from "vue";

import global from "../lib/global.js";

const stockListItemT = createApp().component("stockListItemTemplate", {
  data() {
    return { global, data: {} };
  },
  template: `
  <div class="flex justify-between">
    <span class="text-primary">{{ data[global.common.STOCK_SYMBOL_KEY] }}</span>
    <span class="text-content">{{ data[global.common.STOCK_NAME_KEY] }}</span>
  </div>`,
});

export default {
  components: {
    "ejs-autocomplete": AutoCompleteComponent,
    "ejs-button": ButtonComponent,
    "ejs-daterangepicker": DateRangePickerComponent,
    "ejs-tooltip": TooltipComponent,
  },
  methods: {
    /**
     * Disable the weekends in the date range picker.
     */
    disableWeekends: function (args) {
      if (args.date.getDay() === 0 || args.date.getDay() === 6) {
        args.isDisabled = true;
      } // end if
    },
  },
  data() {
    return {
      global,
      locale: global.locale,
      maxDate: new Date(),
      stockList: this.stockList,
      stockListItemTemplate: () => {
        return {
          template: stockListItemT,
        };
      },
    };
  },
  mounted() {
    window[global.common.IPC_RENDERER_API_KEY].receive(
      global.common.IPC_RECEIVE,
      (data) => {
        this.stockList = data;
      }
    );
    window[global.common.IPC_RENDERER_API_KEY].send(
      global.common.IPC_SEND,
      global.common.GET_STOCK_LIST
    );
    L10n.load({
      "zh-CN": {
        daterangepicker: {
          applyText: "确认",
        },
      },
    });
    setCulture("zh-CN");
  },
};
</script>
