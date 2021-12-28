<!--
 * @Description: the search form component
 * @Version: 1.0.0.20211228
 * @Author: Arvin Zhao
 * @Date: 2021-12-12 05:44:32
 * @Last Editors: Arvin Zhao
 * @LastEditTime: 2021-12-28 12:45:07
-->

<template>
  <form @submit.prevent="submitSearchForm" :id="searchFormId">
    <div class="form-group space-y-6">
      <!-- The stock symbol auto-complete component. -->
      <div class="flex flex-row space-x-2">
        <ejs-autocomplete
          @blur="removeErrorBorder(stockSymbolAutoCompleteName)"
          @change="removeErrorBorder(stockSymbolAutoCompleteName)"
          :dataSource="stockList"
          :fields="{ value: global.common.STOCK_SYMBOL_KEY }"
          :itemTemplate="stockListItemTemplate"
          :name="stockSymbolAutoCompleteName"
          :placeholder="locale.stockSymbolPlaceholder"
          :ref="stockSymbolAutoCompleteName"
          autofill="true"
          highlight="true"
        />
        <ejs-tooltip
          :content="locale.stockSymbolTooltip"
          class="flex items-center"
        >
          <span class="e-circle-help e-icons text-secondary"></span>
        </ejs-tooltip>
      </div>
      <!-- The date range picker. -->
      <div class="flex flex-row space-x-2">
        <ejs-daterangepicker
          @blur="removeErrorBorder(dateRangePickerName)"
          @focus="removeErrorBorder(dateRangePickerName)"
          @open="removeErrorBorder(dateRangePickerName)"
          @renderDayCell="disableWeekends"
          :max="new Date()"
          :min="new Date(global.common.MIN_DATE)"
          :name="dateRangePickerName"
          :placeholder="locale.dateRangePlaceholder"
          :ref="dateRangePickerName"
          dayHeaderFormat="Narrow"
        />
        <ejs-tooltip
          :content="locale.dateRangeTooltip"
          class="flex items-center"
        >
          <span class="e-circle-help e-icons text-secondary"></span>
        </ejs-tooltip>
      </div>
      <ejs-button
        :content="locale.search"
        cssClass="e-block"
        iconCss="e-icons e-search"
        isPrimary="true"
        type="submit"
      />
    </div>
  </form>
</template>

<script>
import { FormValidator } from "@syncfusion/ej2-inputs";
import { AutoCompleteComponent } from "@syncfusion/ej2-vue-dropdowns";
import { ButtonComponent } from "@syncfusion/ej2-vue-buttons";
import { DateRangePickerComponent } from "@syncfusion/ej2-vue-calendars";
import { TooltipComponent } from "@syncfusion/ej2-vue-popups";
import { createApp } from "vue";

import global from "../lib/global.js";
import * as zhCN from "../locales/zh-CN.json";

const stockListItemT = createApp().component("stockListItemTemplate", {
  template: `
  <div class="flex justify-between">
    <span class="text-primary">{{ data[global.common.STOCK_SYMBOL_KEY] }}</span>
    <span class="text-content">{{ data[global.common.STOCK_NAME_KEY] }}</span>
  </div>`,
  data() {
    return { data: {}, global };
  },
});
const stockSymbolRegex = /^\s*([Bb][Jj]|[Ss][HhZz])\d{6}\s*$/;

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
     * @param args the event arguments of rendering day cells.
     */
    disableWeekends(args) {
      if (args.date.getDay() === 0 || args.date.getDay() === 6) {
        args.isDisabled = true;
      } // end if
    }, // end function disableWeekends

    /**
     * Remove the form Syncfusion element's error border if applicable.
     * @param ref the element reference.
     */
    removeErrorBorder(ref) {
      var elementObj = this.$refs[ref].ej2Instances;

      if (elementObj.element.parentElement != null) {
        var hasNoError = false;

        if (ref === this.dateRangePickerName) {
          if (elementObj.previousEleValue.trim() === "") {
            hasNoError = true;
          } // end if
        } // end if

        if (ref === this.stockSymbolAutoCompleteName) {
          if (
            elementObj.value == null ||
            elementObj.value.match(stockSymbolRegex) != null
          ) {
            hasNoError = true;
          } // end if
        } // end if

        if (hasNoError) {
          setTimeout(() => {
            elementObj.element.parentElement.classList.remove(
              global.common.SYNCFUSION_ERROR_CLASS
            );
          }); // Set the timeout to avoid competing with the Syncfusion form validator who adds the error class.
        } // end if
      } // end if
    }, // end function removeErrorBorder

    /**
     * Submit the search form if applicable.
     * @param args the event arguments.
     */
    submitSearchForm(args) {
      // Execute if the form values satisfy the predefined Syncfusion form validator.
      if (this.formValidatorSearch.validate()) {
        var dateRangePickerDateRangeParentElement =
          this.$refs[this.dateRangePickerName].ej2Instances.element
            .parentElement;

        // Revoke the event if the date range picker has the error border.
        if (
          dateRangePickerDateRangeParentElement != null &&
          dateRangePickerDateRangeParentElement.classList.contains(
            global.common.SYNCFUSION_ERROR_CLASS
          )
        ) {
          args.preventDefault();
          return;
        } // end if

        const dateRange =
          this.$refs[this.dateRangePickerName].ej2Instances.value;

        this.$router.push({
          name: global.common.SEARCH_RESULTS_VIEW,
          query: {
            endDate: [
              dateRange[1].getFullYear(),
              dateRange[1].getMonth() + 1,
              dateRange[1].getDate(),
            ].join("-"),
            startDate: [
              dateRange[0].getFullYear(),
              dateRange[0].getMonth() + 1,
              dateRange[0].getDate(),
            ].join("-"),
            stockSymbol:
              this.$refs[this.stockSymbolAutoCompleteName].ej2Instances.value,
          },
        });
      } // end if
    }, // end function submitSearchForm
  },
  data() {
    return {
      dateRangePickerName: "dateRangePickerDateRange",
      global,
      locale: zhCN.default,
      searchFormId: "form-search",
      stockList: [],
      stockListItemTemplate: () => {
        return {
          template: stockListItemT,
        };
      },
      stockSymbolAutoCompleteName: "autoCompleteStockSymbol",
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

    var rules = {}; // The rules for the Syncfusion form validator.

    rules[this.dateRangePickerName] = {
      required: true,
    };
    rules[this.stockSymbolAutoCompleteName] = {
      regex: stockSymbolRegex,
    };
    this.formValidatorSearch = new FormValidator(`#${this.searchFormId}`, {
      customPlacement: function (formElement) {
        if (formElement.parentElement != null) {
          formElement.parentElement.classList.add(
            global.common.SYNCFUSION_ERROR_CLASS
          );
        } // end if
      },
      rules,
    });
  },
};
</script>
