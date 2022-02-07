<!--
 * @Description: the search form component
 * @Version: 1.0.0.20220207
 * @Author: Arvin Zhao
 * @Date: 2021-12-12 05:44:32
 * @Last Editors: Arvin Zhao
 * @LastEditTime: 2022-02-07 20:41:13
-->

<template>
  <div
    :class="['w-full', hasBarLayout ? 'flex space-x-4' : 'max-w-md space-y-8']"
  >
    <!-- The app logo. -->
    <div
      @click="goHome"
      :class="[
        'text-primary flex items-center',
        hasBarLayout ? 'cursor-pointer' : 'justify-center',
      ]"
    >
      <div :class="[hasBarLayout ? 'w-7' : 'w-24 sm:w-32 lg:w-48']">
        <img
          :class="[hasBarLayout ? 'h-7' : 'h-24 sm:h-32 lg:h-40']"
          alt="App icon"
          id="app-icon"
          src="../assets/AppIcon.png"
        />
      </div>
      <AppTextLogo
        :class="[
          hasBarLayout
            ? 'lg:block h-5 hidden ml-2'
            : 'h-12 sm:h-16 lg:h-20 ml-4',
        ]"
        aria-hidden="true"
      />
    </div>
    <form
      @submit.prevent="handleSubmit"
      :id="global.common.SEARCH_FORM_ID"
      class="w-full"
    >
      <div
        :class="[
          'form-group',
          hasBarLayout ? 'flex h-full items-center space-x-4' : 'space-y-6',
        ]"
      >
        <div
          :class="[hasBarLayout ? 'gap-4 grid grid-cols-2 grow' : 'space-y-6']"
        >
          <ejs-tooltip
            :content="zhCN.default.stockSymbolTooltip"
            :ref="global.common.STOCK_SYMBOL_TOOLTIP_NAME"
          >
            <!-- The stock symbol auto-complete component. -->
            <ejs-autocomplete
              @blur="
                removeErrorBorder(global.common.STOCK_SYMBOL_AUTO_COMPLETE_NAME)
              "
              @change="
                removeErrorBorder(global.common.STOCK_SYMBOL_AUTO_COMPLETE_NAME)
              "
              @focus="
                removeErrorBorder(global.common.STOCK_SYMBOL_AUTO_COMPLETE_NAME)
              "
              @open="patchAutoCompletePopUp"
              :autofill="true"
              :dataSource="stockList"
              :fields="{ value: global.common.STOCK_SYMBOL_KEY }"
              :highlight="true"
              :itemTemplate="stockListItemTemplate"
              :name="global.common.STOCK_SYMBOL_AUTO_COMPLETE_NAME"
              :placeholder="zhCN.default.stockSymbolPlaceholder"
              :ref="global.common.STOCK_SYMBOL_AUTO_COMPLETE_NAME"
              :value="stockSymbol"
            />
          </ejs-tooltip>
          <ejs-tooltip
            :content="`${zhCN.default.dateFormatTooltip}，${zhCN.default.dateRangeTooltip}`"
            :ref="global.common.DATE_RANGE_PICKER_TOOLTIP_NAME"
          >
            <!-- The date range picker. -->
            <ejs-daterangepicker
              @blur="removeErrorBorder(global.common.DATE_RANGE_PICKER_NAME)"
              @focus="removeErrorBorder(global.common.DATE_RANGE_PICKER_NAME)"
              @open="handleDateRangePickerOpen"
              @renderDayCell="disableWeekends"
              :dayHeaderFormat="global.common.SF_NARROW"
              :endDate="new Date(`${endDate}${global.common.DAY_TIME_START}`)"
              :max="new Date()"
              :maxDays="7 * maxDateRangeSpan"
              :min="new Date(`${minDate}${global.common.DAY_TIME_START}`)"
              :name="global.common.DATE_RANGE_PICKER_NAME"
              :placeholder="zhCN.default.dateRangePlaceholder"
              :ref="global.common.DATE_RANGE_PICKER_NAME"
              :startDate="
                new Date(`${startDate}${global.common.DAY_TIME_START}`)
              "
            />
          </ejs-tooltip>
        </div>
        <div v-if="hasBarLayout" :class="[hasBarLayout ? 'grow-0' : '']">
          <div class="block lg:hidden">
            <ejs-button
              :title="zhCN.default.search"
              iconCss="e-icons e-search"
              isPrimary="true"
              type="submit"
            />
          </div>
          <div class="lg:block hidden">
            <ejs-button
              :content="zhCN.default.search"
              iconCss="e-icons e-search"
              isPrimary="true"
              type="submit"
            />
          </div>
        </div>
        <div v-else>
          <ejs-button
            :content="zhCN.default.search"
            cssClass="e-block"
            iconCss="e-icons e-search"
            isPrimary="true"
            type="submit"
          />
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import { ButtonComponent } from "@syncfusion/ej2-vue-buttons";
import { DateRangePickerComponent } from "@syncfusion/ej2-vue-calendars";
import { AutoCompleteComponent } from "@syncfusion/ej2-vue-dropdowns";
import { FormValidator } from "@syncfusion/ej2-vue-inputs";
import { TooltipComponent } from "@syncfusion/ej2-vue-popups";
import { createApp } from "vue";

import AppTextLogo from "./SVG/AppTextLogo.vue";
import global from "../lib/global.js";
import { toDateStr } from "../lib/utils";
import * as zhCN from "../locales/zh-CN.json";

const popUpBottom = "50px";
const stockSymbolRegex = /^\s*([Bb][Jj]|[Ss][HhZz])\d{6}\s*$/;

export default {
  components: {
    AppTextLogo,
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
     * Navigate to the home view.
     */
    goHome() {
      this.$router.push({ name: global.common.HOME_VIEW });
    }, // end function goHome

    /**
     * Handle the event when the date range picker is opened.
     */
    handleDateRangePickerOpen() {
      this.patchDateRangePickerPopUp();
      this.removeErrorBorder(global.common.DATE_RANGE_PICKER_NAME);
    }, // end function handleDateRangePickerOpen

    /**
     * Handle the form submission.
     * @param args the event arguments.
     */
    handleSubmit(args) {
      // Execute if the form values satisfy the predefined Syncfusion form validator.
      if (this.formValidatorSearch.validate()) {
        const dateRangePickerDateRangeParentElement =
          this.$refs[global.common.DATE_RANGE_PICKER_NAME].ej2Instances.element
            .parentElement;

        // Revoke the event if the date range picker has the error border.
        if (
          dateRangePickerDateRangeParentElement != null &&
          dateRangePickerDateRangeParentElement.classList.contains(
            global.common.SF_ERROR_CLASS
          )
        ) {
          args.preventDefault();
          return;
        } // end if

        const dateRange =
          this.$refs[global.common.DATE_RANGE_PICKER_NAME].ej2Instances.value;
        const endDate = toDateStr(dateRange[1]);
        const startDate = toDateStr(dateRange[0]);
        const stockSymbol =
          this.$refs[global.common.STOCK_SYMBOL_AUTO_COMPLETE_NAME].ej2Instances
            .value;

        // Ensure the tooltip pop-ups are closed before navigating to the search result view.
        this.$refs[global.common.DATE_RANGE_PICKER_TOOLTIP_NAME].close();
        this.$refs[global.common.STOCK_SYMBOL_TOOLTIP_NAME].close();
        this.submitSearchForm(endDate, startDate, stockSymbol);
      } // end if
    }, // end function handleSubmit

    /**
     * Patch the auto-complete component's pop-up if necessary to avoid strange appearance.
     */
    patchAutoCompletePopUp() {
      if (this.hasBarLayout) {
        setTimeout(() => {
          const autoCompletePopUpArray = document.getElementsByClassName(
            global.common.SF_AUTO_COMPLETE_POP_UP_CLASSES
          );

          Array.prototype.forEach.call(autoCompletePopUpArray, (element) => {
            element.classList.add("e-popup-fixed");
            element.style.bottom = popUpBottom;
            element.style.top = null;
          });
        }, 50);
      } // end if
    }, // end function patchAutoCompletePopUp

    /**
     * Patch the date range picker's pop-up if necessary to avoid stange appearance.
     */
    patchDateRangePickerPopUp() {
      if (this.hasBarLayout) {
        setTimeout(() => {
          const dateRangePickerPopUpArray = document.getElementsByClassName(
            global.common.SF_DATE_RANGE_PICKER_POP_UP_CLASSES
          );

          Array.prototype.forEach.call(dateRangePickerPopUpArray, (element) => {
            element.style.bottom = popUpBottom;
            element.style.top = null;
          });
        }, 50);
      } // end if
    }, // end function patchDateRangePickerPopUp

    /**
     * Remove the form Syncfusion element's error border if applicable.
     * @param ref the element reference.
     */
    removeErrorBorder(ref) {
      const elementObj = this.$refs[ref].ej2Instances;

      if (elementObj.element.parentElement != null) {
        var hasNoError = false;

        // The element is not expected to have an error border if it has no input. Additionally, the stock symbol auto-complete component has no error if the input satisfies the format.
        if (
          (ref === global.common.DATE_RANGE_PICKER_NAME &&
            elementObj.value == null &&
            elementObj.element.value.trim() === "") ||
          (ref === global.common.STOCK_SYMBOL_AUTO_COMPLETE_NAME &&
            (elementObj.value == null ||
              elementObj.value.match(stockSymbolRegex) != null))
        ) {
          hasNoError = true;
        } // end if

        if (hasNoError) {
          setTimeout(() =>
            elementObj.element.parentElement.classList.remove(
              global.common.SF_ERROR_CLASS
            )
          ); // Set the timeout to avoid competing with the Syncfusion form validator who adds the error class.
        } // end if
      } // end if
    }, // end function removeErrorBorder

    /**
     * Submit the search form.
     * @param {string} endDate the end date of the date range.
     * @param {string} startDate the start date of the date range.
     * @param {string} stockSymbol the stock symbol.
     */
    submitSearchForm(endDate, startDate, stockSymbol) {
      // Reload the page to resubmit the form if the query has no changes and the search status area is not hidden.
      if (
        endDate === this.endDate &&
        startDate === this.startDate &&
        stockSymbol.toLowerCase() === this.stockSymbol.toLowerCase()
      ) {
        const searchStatusArea = document.getElementById(
          global.common.SEARCH_STATUS_AREA_ID
        );

        if (
          searchStatusArea != null &&
          !searchStatusArea.classList.contains("hidden")
        ) {
          window.location.reload();
        } // end if
      } else {
        var stockName = "";

        for (const stock of this.stockList) {
          if (stock[global.common.STOCK_SYMBOL_KEY] === stockSymbol) {
            stockName = stock[global.common.STOCK_NAME_KEY];
            break;
          } // end if
        } // end for

        this.$router.push({
          name: global.common.SEARCH_RESULT_VIEW,
          query: { endDate, startDate, stockName, stockSymbol },
        });
      } // end if...else
    }, // end function submitSearchForm
  },
  props: {
    endDate: String,
    isBarLayout: Boolean,
    startDate: String,
    stockSymbol: String,
  },
  created() {
    // A workaround to force vue-router to perform navigation in the search result view.
    this.$watch(
      () => this.$route.query,
      () => {
        if (this.hasBarLayout) {
          window.location.reload();
        } // end if
      }
    );
  },
  data() {
    return {
      global,
      hasBarLayout: this.isBarLayout,
      maxDateRangeSpan: global.common.DEFAULT_MAX_DATE_RANGE_SPAN,
      minDate: global.common.MIN_MIN_DATE,
      stockList: [],
      stockListItemTemplate: () => {
        return {
          template: createApp().component("stockListItemTemplate", {
            template: `
              <div class="flex justify-between">
                <span class="text-primary">{{ data[global.common.STOCK_SYMBOL_KEY] }}</span>
                <span class="text-content">{{ data[global.common.STOCK_NAME_KEY] }}</span>
              </div>`,
            data() {
              return { data: {}, global };
            },
          }),
        };
      },
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
            global.common.MAX_DATE_RANGE_SPAN_KEY
          )
        ) {
          this.maxDateRangeSpan = data[global.common.MAX_DATE_RANGE_SPAN_KEY];
        } // end if

        if (
          typeof data === "object" &&
          Object.prototype.hasOwnProperty.call(data, global.common.MIN_DATE_KEY)
        ) {
          this.minDate = data[global.common.MIN_DATE_KEY];
        } // end if

        if (
          Array.isArray(data) &&
          typeof data[0] == "object" &&
          Object.prototype.hasOwnProperty.call(
            data[0],
            global.common.STOCK_SYMBOL_KEY
          )
        ) {
          this.stockList = data;
        } // end if
      }
    );
    window[global.common.IPC_RENDERER_API_KEY].send(
      global.common.IPC_SEND,
      global.common.GET_MAX_DATE_RANGE_SPAN
    );
    window[global.common.IPC_RENDERER_API_KEY].send(
      global.common.IPC_SEND,
      global.common.GET_MIN_DATE
    );
    window[global.common.IPC_RENDERER_API_KEY].send(
      global.common.IPC_SEND,
      global.common.GET_STOCK_LIST
    );
    window.addEventListener("resize", () => {
      const dateRangePickerPopUpArray = document.getElementsByClassName(
        global.common.SF_DATE_RANGE_PICKER_POP_UP_CLASSES
      );

      Array.prototype.forEach.call(dateRangePickerPopUpArray, () => {
        this.$refs[global.common.DATE_RANGE_PICKER_NAME].hide();
        this.removeErrorBorder(global.common.DATE_RANGE_PICKER_NAME);
      });
      this.$refs[global.common.STOCK_SYMBOL_AUTO_COMPLETE_NAME].hidePopup();
    });
    window.addEventListener("scroll", () => {
      this.patchAutoCompletePopUp();
      this.patchDateRangePickerPopUp();
    });

    // Avoid the strange appearance of the auto-complete component's pop-up when the pop-up already shows.
    if (this.hasBarLayout) {
      const autoCompleteInputArray = document.getElementsByClassName(
        global.common.SF_AUTO_COMPLETE_INPUT_CLASSES
      );

      Array.prototype.forEach.call(autoCompleteInputArray, (element) => {
        element.addEventListener("input", this.patchAutoCompletePopUp);
        element.addEventListener("keyup", this.patchAutoCompletePopUp);
      });
    } // end if

    var rules = {}; // The rules for the Syncfusion form validator.

    rules[global.common.DATE_RANGE_PICKER_NAME] = {
      required: true,
    };
    rules[global.common.STOCK_SYMBOL_AUTO_COMPLETE_NAME] = {
      regex: stockSymbolRegex,
    };
    this.formValidatorSearch = new FormValidator(
      `#${global.common.SEARCH_FORM_ID}`,
      {
        customPlacement(formElement) {
          if (formElement.parentElement != null) {
            formElement.parentElement.classList.add(
              global.common.SF_ERROR_CLASS
            );
          } // end if
        },
        rules,
      }
    );
  },
};
</script>
