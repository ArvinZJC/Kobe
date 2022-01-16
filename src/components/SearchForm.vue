<!--
 * @Description: the search form component
 * @Version: 1.0.0.20220116
 * @Author: Arvin Zhao
 * @Date: 2021-12-12 05:44:32
 * @Last Editors: Arvin Zhao
 * @LastEditTime: 2022-01-16 11:27:00
-->

<template>
  <div
    :class="['w-full', hasBarLayout ? 'flex space-x-4' : 'max-w-md space-y-8']"
  >
    <!-- The app logo. -->
    <div
      :class="[
        'text-primary flex items-center',
        hasBarLayout ? '' : 'justify-center',
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
      <component
        :class="[
          hasBarLayout
            ? 'lg:block h-5 hidden ml-2'
            : 'h-12 sm:h-16 lg:h-20 ml-4',
        ]"
        :is="textLogo"
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
            :content="locale.stockSymbolTooltip"
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
              @open="patchAutoCompletePopup"
              :autofill="true"
              :dataSource="stockList"
              :fields="{ value: global.common.STOCK_SYMBOL_KEY }"
              :highlight="true"
              :itemTemplate="stockListItemTemplate"
              :name="global.common.STOCK_SYMBOL_AUTO_COMPLETE_NAME"
              :placeholder="locale.stockSymbolPlaceholder"
              :ref="global.common.STOCK_SYMBOL_AUTO_COMPLETE_NAME"
              :value="stockSymbolValue"
            />
          </ejs-tooltip>
          <ejs-tooltip
            :content="locale.dateRangeTooltip"
            :ref="global.common.DATE_RANGE_PICKER_TOOLTIP_NAME"
          >
            <!-- The date range picker. -->
            <ejs-daterangepicker
              @blur="removeErrorBorder(global.common.DATE_RANGE_PICKER_NAME)"
              @focus="removeErrorBorder(global.common.DATE_RANGE_PICKER_NAME)"
              @open="handleDateRangePickerOpen"
              @renderDayCell="disableWeekends"
              :endDate="endDateValue"
              :max="new Date()"
              :min="new Date(global.common.MIN_DATE)"
              :name="global.common.DATE_RANGE_PICKER_NAME"
              :placeholder="locale.dateRangePlaceholder"
              :ref="global.common.DATE_RANGE_PICKER_NAME"
              :startDate="startDateValue"
              :strictMode="true"
              dayHeaderFormat="Narrow"
              maxDays="28"
            />
          </ejs-tooltip>
        </div>
        <div v-if="hasBarLayout" :class="[hasBarLayout ? 'grow-0' : '']">
          <div class="block lg:hidden">
            <ejs-button
              :title="locale.search"
              iconCss="e-search e-icons"
              isPrimary="true"
              type="submit"
            />
          </div>
          <div class="lg:block hidden">
            <ejs-button
              :content="locale.search"
              iconCss="e-search e-icons"
              isPrimary="true"
              type="submit"
            />
          </div>
        </div>
        <div v-else>
          <ejs-button
            :content="locale.search"
            cssClass="e-block"
            iconCss="e-search e-icons"
            isPrimary="true"
            type="submit"
          />
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import { FormValidator } from "@syncfusion/ej2-inputs";
import { AutoCompleteComponent } from "@syncfusion/ej2-vue-dropdowns";
import { ButtonComponent } from "@syncfusion/ej2-vue-buttons";
import { DateRangePickerComponent } from "@syncfusion/ej2-vue-calendars";
import { TooltipComponent } from "@syncfusion/ej2-vue-popups";
import { createApp, defineComponent, h } from "vue";

import global from "../lib/global.js";
import * as zhCN from "../locales/zh-CN.json";

const dateRangePickerPopupClassFilter =
  "e-daterangepicker e-popup e-popup-open";
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
     * Handle the event when the date range picker is opened.
     */
    handleDateRangePickerOpen() {
      this.patchDateRangePickerPopup();
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
        const endDate = [
          dateRange[1].getFullYear(),
          dateRange[1].getMonth() + 1,
          dateRange[1].getDate(),
        ].join("-");
        const startDate = [
          dateRange[0].getFullYear(),
          dateRange[0].getMonth() + 1,
          dateRange[0].getDate(),
        ].join("-");
        const stockSymbol =
          this.$refs[global.common.STOCK_SYMBOL_AUTO_COMPLETE_NAME].ej2Instances
            .value;

        // Ensure the tooltip popups are closed before navigating to the search result view.
        this.$refs[global.common.DATE_RANGE_PICKER_TOOLTIP_NAME].close();
        this.$refs[global.common.STOCK_SYMBOL_TOOLTIP_NAME].close();
        this.submitSearchForm(endDate, startDate, stockSymbol);
      } // end if
    }, // end function handleSubmit

    /**
     * Patch the auto-complete component's popup if necessary to avoid strange appearance.
     */
    patchAutoCompletePopup() {
      if (this.hasBarLayout) {
        setTimeout(() => {
          const autoCompletePopupArray = document.getElementsByClassName(
            "e-ddl e-popup e-popup-open"
          );

          Array.prototype.forEach.call(autoCompletePopupArray, (element) => {
            element.classList.add("e-popup-fixed");
            element.style.bottom = global.common.POPUP_BOTTOM;
            element.style.top = null;
          });
        }, 50);
      } // end if
    }, // end function patchAutoCompletePopup

    /**
     * Patch the date range picker's popup if necessary to avoid stange appearance.
     */
    patchDateRangePickerPopup() {
      if (this.hasBarLayout) {
        setTimeout(() => {
          const dateRangePickerPopupArray = document.getElementsByClassName(
            dateRangePickerPopupClassFilter
          );

          Array.prototype.forEach.call(dateRangePickerPopupArray, (element) => {
            element.style.bottom = global.common.POPUP_BOTTOM;
            element.style.top = null;
          });
        }, 50);
      } // end if
    }, // end function patchDateRangePickerPopup

    /**
     * Remove the form Syncfusion element's error border if applicable.
     * @param ref the element reference.
     */
    removeErrorBorder(ref) {
      const elementObj = this.$refs[ref].ej2Instances;

      if (elementObj.element.parentElement != null) {
        var hasNoError = false;
        // The element is not expected to have an error border if it has no input.
        if (elementObj.value == null) {
          hasNoError = true;
        } else {
          // The stock symbol auto-complete component is not expected to have an error border if the input satisfies the format.
          if (
            ref === global.common.STOCK_SYMBOL_AUTO_COMPLETE_NAME &&
            elementObj.value.match(stockSymbolRegex) != null
          ) {
            hasNoError = true;
          } // end if
        } // end if...else

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
      endDateValue: new Date(this.endDate),
      global,
      hasBarLayout: this.isBarLayout,
      locale: zhCN.default,
      startDateValue: new Date(this.startDate),
      stockList: [],
      stockListItemTemplate: () => {
        return {
          template: stockListItemT,
        };
      },
      stockSymbolValue: this.stockSymbol,
    };
  },
  mounted() {
    window[global.common.IPC_RENDERER_API_KEY].receive(
      global.common.IPC_RECEIVE,
      (data) => {
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
      global.common.GET_APP_NAME
    );
    window[global.common.IPC_RENDERER_API_KEY].send(
      global.common.IPC_SEND,
      global.common.GET_STOCK_LIST
    );
    window.addEventListener("resize", () => {
      const dateRangePickerPopupArray = document.getElementsByClassName(
        dateRangePickerPopupClassFilter
      );

      Array.prototype.forEach.call(dateRangePickerPopupArray, () => {
        this.$refs[global.common.DATE_RANGE_PICKER_NAME].hide();
        this.removeErrorBorder(global.common.DATE_RANGE_PICKER_NAME);
      });
      this.$refs[global.common.STOCK_SYMBOL_AUTO_COMPLETE_NAME].hidePopup();
    });
    window.addEventListener("scroll", () => {
      this.patchAutoCompletePopup();
      this.patchDateRangePickerPopup();
    });

    // Avoid the strange appearance of the auto-complete component's popup when the popup already shows.
    if (this.hasBarLayout) {
      const autoCompleteInputArray = document.getElementsByClassName(
        "e-autocomplete e-input"
      );

      Array.prototype.forEach.call(autoCompleteInputArray, (element) => {
        element.addEventListener("input", this.patchAutoCompletePopup);
        element.addEventListener("keyup", this.patchAutoCompletePopup);
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
        customPlacement: function (formElement) {
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
  setup() {
    const textLogo = defineComponent({
      render: () =>
        h("svg", { viewBox: "0 0 1081 339" }, [
          h(
            "g",
            {
              class: "fill-current",
              transform: "translate(0,339) scale(0.1,-0.1)",
              stroke: "none",
            },
            [
              h("path", {
                d: "M2100 3263 c-35 -14 -130 -85 -130 -98 0 -7 -3 -21 -7 -31 -5 -13 -3 -16 8 -12 11 4 9 -7 -9 -42 -16 -32 -21 -55 -16 -74 6 -27 24 -36 24 -13 0 16 32 47 48 47 15 0 15 -130 2 -240 -5 -41 -14 -195 -20 -341 l-10 -267 -118 -118 c-146 -147 -239 -269 -301 -397 -56 -115 -45 -133 -102 153 -28 140 -43 198 -56 207 -26 20 -36 15 -29 -13 6 -23 4 -25 -14 -19 -22 7 -22 6 -15 -93 4 -56 4 -153 0 -216 -6 -103 -9 -116 -25 -116 -11 0 -22 -4 -25 -10 -3 -5 -16 -10 -27 -10 -31 0 -90 -67 -83 -94 8 -27 69 -80 123 -107 47 -23 49 -27 26 -70 -17 -34 -11 -65 15 -74 10 -3 27 -21 37 -41 21 -40 59 -64 102 -64 25 0 28 -3 25 -28 -2 -17 4 -36 17 -51 19 -22 26 -23 88 -19 60 5 164 39 235 79 11 6 21 8 24 5 3 -2 0 -64 -6 -137 -22 -268 -9 -829 20 -829 4 0 10 -10 12 -22 2 -13 5 5 6 40 0 34 6 62 11 62 6 0 10 16 10 35 0 64 17 36 26 -41 l9 -76 35 66 c25 48 36 62 41 49 8 -23 15 -7 23 48 4 26 16 64 27 85 35 71 118 432 140 614 16 137 29 201 40 195 5 -4 9 -12 9 -20 0 -8 16 -26 36 -41 19 -15 41 -41 48 -58 8 -17 44 -61 80 -98 36 -37 66 -69 66 -72 0 -11 74 -76 86 -76 8 0 14 -4 14 -10 0 -5 13 -16 29 -25 38 -19 109 -11 171 20 79 40 98 99 119 370 5 66 16 152 25 191 18 86 60 317 86 474 35 210 129 620 155 676 33 69 32 108 -1 137 -14 12 -70 46 -125 74 -96 51 -103 53 -157 47 -31 -4 -70 -13 -85 -21 -17 -8 -40 -11 -60 -8 -22 4 -48 0 -80 -14 -49 -21 -58 -41 -36 -82 9 -18 2 -24 -83 -64 -51 -24 -126 -63 -167 -86 l-73 -41 7 94 c3 51 13 147 21 213 8 66 14 149 14 185 0 116 -68 273 -131 306 -27 14 -119 18 -149 7z m600 -825 c0 -24 -7 -94 -17 -156 l-16 -113 -62 6 c-49 5 -64 3 -74 -9 -8 -9 -21 -16 -30 -16 -9 0 -26 -6 -37 -13 -43 -24 -103 -57 -107 -57 -8 0 -16 158 -10 214 6 55 8 59 42 73 20 8 52 22 71 31 79 34 206 81 223 82 13 0 17 -9 17 -42z m-726 -410 c-4 -40 -9 -97 -13 -126 l-6 -52 -165 -110 c-90 -60 -165 -108 -167 -106 -8 8 30 106 61 156 20 32 36 65 36 74 0 19 116 144 183 198 71 56 78 53 71 -34z m671 -30 c-7 -42 -27 -67 -53 -68 -17 0 -80 29 -88 41 -6 10 103 68 129 69 16 0 18 -5 12 -42z m-170 -165 c47 -36 85 -69 85 -72 -1 -5 -198 -169 -242 -199 -17 -12 -18 -9 -18 77 0 78 3 94 20 111 11 11 20 33 20 50 0 17 5 30 10 30 6 0 10 10 10 23 0 19 16 47 27 47 2 0 41 -30 88 -67z m80 -340 c-4 -27 -10 -52 -14 -56 -10 -10 -61 9 -61 22 0 12 64 81 75 81 4 0 4 -21 0 -47z m-694 -1 c-5 -9 -29 -36 -53 -59 -23 -23 -68 -72 -100 -110 -31 -37 -67 -81 -81 -98 l-25 -29 -12 57 c-6 31 -10 65 -8 75 2 10 39 35 91 62 48 25 97 54 109 65 57 51 96 69 79 37z m49 -107 c0 -123 1 -123 -124 -184 -94 -46 -136 -58 -136 -38 0 39 221 327 251 327 5 0 9 -46 9 -105z",
              }),
              h("path", {
                d: "M5645 3255 c-33 -8 -134 -37 -224 -64 -169 -53 -214 -60 -228 -38 -21 35 -73 17 -73 -26 0 -9 -9 -33 -21 -54 -18 -32 -19 -42 -9 -75 7 -26 19 -42 36 -48 31 -12 151 -13 158 -1 9 14 239 54 234 40 -2 -4 -68 -70 -148 -146 -174 -166 -410 -410 -410 -424 0 -6 -13 -15 -29 -20 -21 -7 -33 -21 -41 -45 -7 -19 -19 -38 -29 -43 -34 -19 -53 -138 -31 -196 14 -38 71 -95 93 -95 11 0 37 -16 58 -35 47 -42 64 -43 101 -8 15 15 28 22 28 15 0 -19 -100 -305 -114 -327 -8 -11 -46 -53 -85 -94 -70 -72 -72 -76 -66 -112 5 -26 13 -40 27 -45 16 -5 19 -12 14 -36 -6 -32 -277 -646 -305 -690 -9 -15 -57 -60 -106 -100 -90 -71 -307 -218 -324 -218 -5 0 -11 -4 -13 -8 -1 -4 -58 -48 -125 -97 -68 -49 -123 -93 -123 -98 0 -5 12 1 28 13 55 42 73 53 79 46 4 -4 -11 -21 -32 -39 -91 -74 -95 -84 -10 -29 86 56 231 135 210 114 -5 -6 -53 -38 -105 -71 -109 -70 -106 -79 6 -21 44 22 93 40 111 40 17 0 34 4 37 9 3 5 23 12 43 15 21 4 63 15 93 26 60 20 153 32 145 19 -3 -4 26 -7 64 -7 68 2 71 0 113 -37 24 -22 51 -49 61 -62 10 -13 27 -23 38 -23 11 0 33 -7 49 -15 27 -14 30 -13 58 10 17 14 37 25 45 25 20 0 32 17 47 65 7 22 22 60 32 83 16 34 19 55 14 94 -4 28 0 100 8 166 35 265 39 299 41 337 2 49 26 177 66 350 16 72 32 140 34 153 3 13 17 27 33 33 15 6 56 25 92 42 36 17 68 30 72 29 4 -1 24 7 44 19 31 17 36 18 30 4 -3 -9 -3 -15 1 -13 5 2 26 12 48 22 22 10 54 29 72 42 17 13 43 28 57 34 14 5 26 15 26 23 0 7 17 19 38 26 20 8 54 25 74 38 21 12 42 23 47 23 5 0 53 26 108 58 54 33 114 67 133 77 34 17 34 17 20 0 -16 -20 54 17 176 92 39 23 77 43 85 43 25 0 69 24 69 38 0 6 4 12 8 12 15 0 32 72 22 91 -8 15 -104 59 -129 59 -4 0 -18 11 -31 25 -28 30 -46 32 -68 5 -17 -19 -17 -19 -44 4 -27 24 -27 25 -9 48 9 13 29 44 44 69 27 47 162 199 177 199 5 0 33 26 62 57 29 31 65 69 81 85 33 35 35 69 7 133 -25 59 -127 157 -204 195 -32 16 -65 35 -73 41 -10 9 -20 9 -39 0 -14 -6 -33 -11 -43 -11 -33 0 -54 -35 -47 -80 5 -31 3 -40 -8 -40 -8 0 -17 -8 -20 -18 -4 -10 -30 -28 -59 -40 -29 -12 -89 -43 -132 -68 -44 -25 -136 -75 -205 -111 -69 -36 -170 -90 -225 -122 -55 -31 -112 -63 -127 -71 -90 -51 -131 -71 -135 -66 -11 10 172 207 292 316 95 85 202 170 215 170 14 0 139 98 170 134 47 55 57 79 48 112 -16 61 -155 96 -273 69z m371 -458 c-20 -24 -36 -48 -36 -52 0 -5 -18 -36 -39 -69 -76 -117 -144 -276 -204 -475 -19 -62 -40 -117 -48 -122 -8 -5 -30 -9 -49 -9 -19 0 -41 -4 -49 -9 -24 -15 4 -39 44 -38 23 1 39 -5 48 -17 7 -9 31 -20 55 -23 l42 -6 -48 -30 c-103 -65 -190 -116 -227 -133 -22 -10 -60 -32 -85 -50 -25 -17 -74 -47 -110 -66 -36 -19 -78 -43 -93 -53 -15 -10 -30 -16 -32 -13 -3 2 2 39 10 82 8 43 20 118 25 166 14 121 64 311 101 380 16 31 50 79 74 107 25 28 45 60 45 70 1 10 20 34 43 54 76 64 329 230 436 286 58 31 110 60 115 64 5 5 12 7 14 4 2 -2 -12 -24 -32 -48z",
              }),
              h("path", {
                d: "M8925 3254 c-56 -8 -105 -9 -130 -3 -22 5 -43 9 -47 9 -5 0 -8 -22 -8 -49 0 -43 7 -59 46 -116 l45 -67 -28 -36 c-37 -49 -387 -400 -438 -439 -22 -17 -38 -33 -35 -36 3 -3 32 7 65 23 33 15 77 35 98 44 21 9 67 39 103 66 36 28 70 50 76 50 6 0 47 18 92 40 107 52 182 71 232 59 22 -4 56 -9 77 -9 21 0 53 -7 73 -15 31 -13 37 -13 65 4 30 19 114 19 150 0 13 -6 27 2 57 35 47 51 70 132 52 180 -5 15 -10 49 -10 75 0 42 -5 54 -40 93 -38 44 -81 64 -150 72 -14 1 -36 9 -49 16 -32 16 -180 18 -296 4z",
              }),
              h("path", {
                d: "M1150 3100 c-31 -12 -47 -25 -53 -44 -6 -18 -16 -26 -33 -26 -14 0 -32 -11 -46 -30 -12 -16 -30 -30 -40 -30 -10 0 -18 -4 -18 -9 0 -10 -177 -93 -257 -120 -36 -12 -74 -18 -98 -15 -68 8 -72 -3 -29 -94 31 -64 45 -84 72 -96 39 -19 74 -20 119 -4 18 6 35 9 39 5 11 -11 -45 -87 -211 -285 -105 -125 -169 -193 -185 -197 -14 -4 -32 -9 -40 -11 -9 -2 -21 -16 -27 -31 -14 -32 -40 -76 -66 -113 -22 -32 -22 -52 3 -100 11 -22 20 -58 20 -80 0 -45 25 -101 65 -142 32 -34 74 -36 130 -7 51 27 136 95 129 102 -3 3 8 15 24 27 52 39 126 131 113 140 -10 6 -9 14 3 36 26 50 226 233 226 208 0 -5 -30 -52 -66 -104 -124 -181 -284 -426 -354 -545 -29 -49 -70 -117 -90 -150 -20 -33 -48 -82 -62 -110 -37 -73 -174 -310 -218 -377 -22 -32 -35 -58 -31 -58 5 0 16 11 25 25 9 14 20 24 25 22 14 -4 58 57 111 153 28 52 64 109 79 125 16 17 57 71 92 120 34 50 81 113 103 141 23 28 61 80 86 115 37 52 155 191 220 260 21 22 188 158 236 192 21 15 66 47 99 71 105 74 116 81 109 62 -10 -27 5 -18 75 45 37 33 79 66 92 73 157 82 169 89 176 115 3 14 12 35 19 46 27 39 5 119 -39 142 -12 6 -57 29 -100 51 -43 21 -88 48 -100 60 -36 33 -86 42 -138 25 -24 -9 -48 -21 -52 -29 -4 -8 -15 -14 -23 -14 -9 0 -31 -12 -50 -26 -28 -22 -34 -33 -34 -63 0 -36 -3 -39 -77 -81 -43 -24 -169 -101 -280 -171 -203 -129 -282 -174 -289 -166 -17 16 217 307 358 443 136 133 270 203 360 189 24 -3 76 -9 116 -11 66 -5 79 -3 128 22 63 32 75 48 77 108 3 73 -71 146 -147 146 -48 0 -126 22 -160 45 -19 13 -37 21 -40 17 -3 -3 -6 2 -6 11 0 21 -12 20 -70 -3z m-914 -2188 c-18 -16 -18 -16 -6 6 6 13 14 21 18 18 3 -4 -2 -14 -12 -24z",
              }),
              h("path", {
                d: "M9825 2728 c-30 -20 -51 -43 -55 -58 -3 -14 -14 -26 -25 -28 -72 -12 -356 -79 -481 -113 -82 -22 -297 -90 -479 -150 -181 -59 -359 -115 -395 -124 -135 -31 -234 -13 -309 58 l-33 32 6 -35 7 -35 -21 24 c-15 18 -20 19 -20 7 0 -9 -4 -16 -10 -16 -5 0 -10 -7 -10 -15 0 -8 -9 -15 -21 -15 -26 0 -22 -11 41 -142 59 -120 75 -203 66 -342 -16 -242 -137 -662 -261 -906 -74 -147 -228 -382 -393 -604 -62 -82 -110 -152 -108 -154 9 -8 47 26 114 100 163 181 271 306 336 388 77 97 229 333 262 407 20 43 46 101 59 128 12 28 25 61 29 75 7 31 23 56 30 49 8 -8 -31 -122 -71 -212 -20 -43 -34 -80 -31 -82 8 -8 89 165 117 252 27 83 31 89 74 115 25 15 79 52 119 82 70 54 103 71 79 42 -10 -12 -8 -13 9 -9 11 3 26 14 33 23 11 16 21 17 82 10 39 -4 90 -15 115 -24 56 -21 229 -127 230 -142 0 -5 -34 -27 -75 -49 -41 -21 -75 -42 -75 -46 0 -9 47 8 65 23 5 4 16 8 25 8 8 0 -14 -17 -50 -37 -75 -42 -75 -42 -69 -48 3 -2 23 4 45 14 103 50 271 107 281 97 2 -1 6 -30 9 -63 6 -54 5 -61 -12 -66 -11 -3 -91 -26 -179 -51 -88 -24 -212 -63 -275 -86 -373 -136 -360 -133 -430 -85 -45 31 -53 31 -44 3 6 -22 6 -22 -13 -6 -18 16 -19 16 -30 -1 -18 -28 3 -103 40 -146 31 -36 35 -37 97 -38 36 0 90 6 120 13 65 15 238 84 366 145 111 53 213 95 231 95 17 0 17 -25 -2 -40 -9 -7 -26 -9 -47 -5 l-33 8 28 -28 c15 -16 25 -35 23 -42 -3 -7 4 -30 15 -50 12 -21 17 -39 13 -40 -5 -2 -121 -66 -259 -144 -199 -112 -255 -139 -275 -134 -70 18 -78 17 -89 -4 -9 -15 -8 -38 4 -93 8 -40 15 -75 15 -77 0 -2 10 -1 23 2 12 4 65 11 117 17 52 7 164 25 249 41 344 65 807 85 1005 43 41 -9 20 -25 -88 -65 -100 -38 -100 -47 -1 -24 36 8 94 15 127 15 51 0 59 -2 49 -14 -19 -22 18 -29 89 -16 72 13 93 8 140 -34 75 -68 193 -96 397 -96 140 0 194 24 234 102 34 66 25 120 -31 185 -15 17 -30 37 -32 44 -2 7 -33 16 -72 20 -38 5 -84 18 -103 29 -19 11 -43 20 -54 20 -10 0 -27 8 -37 18 -21 21 -148 55 -204 55 -21 0 -50 -8 -65 -18 -43 -29 -104 -37 -126 -17 -15 13 -23 14 -51 4 -18 -7 -41 -10 -50 -6 -9 3 -39 -3 -66 -15 -44 -19 -67 -21 -239 -21 l-190 0 -6 43 c-4 24 -7 74 -8 112 l-2 69 65 33 c36 17 90 37 120 44 30 6 76 18 102 26 26 8 75 18 109 23 147 21 389 181 389 258 0 28 -42 62 -78 62 -22 0 -36 7 -47 24 -22 33 -37 37 -135 41 -100 4 -141 -9 -159 -52 -12 -29 -16 -31 -119 -47 -191 -29 -272 -39 -276 -35 -2 2 -6 40 -7 84 l-4 79 50 19 c28 10 65 21 84 23 48 6 155 39 221 68 71 31 215 76 244 76 34 0 160 69 247 136 97 75 156 155 145 199 -3 13 -30 48 -59 79 -41 44 -59 56 -83 56 -21 0 -39 10 -59 30 -16 17 -35 30 -44 30 -17 0 -75 -18 -109 -33 -17 -8 -25 -8 -31 1 -5 9 -21 11 -51 6 -33 -5 -53 -17 -79 -46 -34 -36 -41 -39 -131 -53 -77 -11 -261 -54 -352 -81 -15 -5 -18 1 -18 39 0 49 3 52 136 157 78 61 184 164 184 179 0 6 -12 16 -27 22 -16 6 -46 20 -69 31 -42 21 -64 18 -64 -8 0 -8 -7 -14 -15 -14 -7 0 -18 -8 -24 -17 -8 -15 -14 -16 -28 -7 -25 15 -68 -21 -78 -64 -10 -48 -31 -59 -55 -31 l-20 24 15 -37 c9 -23 11 -39 5 -43 -6 -3 -10 -1 -10 5 0 6 -18 30 -40 54 -22 24 -40 46 -40 49 0 18 151 73 335 122 33 9 80 22 105 30 32 10 46 11 51 3 5 -8 23 -5 59 10 63 26 125 30 116 7 -4 -12 3 -14 42 -8 60 9 166 6 208 -6 39 -11 126 8 154 34 10 9 20 30 24 46 4 22 14 34 36 42 40 15 35 34 -17 72 -23 16 -47 42 -53 57 -7 16 -25 31 -45 38 -20 7 -39 23 -50 44 -22 40 -52 48 -134 35 -33 -5 -61 -5 -72 1 -23 13 -17 15 -74 -22z m-195 -183 c0 -13 -185 -123 -287 -171 -62 -29 -139 -72 -172 -95 l-59 -41 -28 20 c-33 23 -74 37 -74 25 0 -4 16 -19 36 -33 43 -29 27 -40 -20 -15 -39 21 -126 14 -126 -11 0 -8 6 -14 14 -14 23 0 84 -79 105 -134 27 -74 53 -236 45 -287 -9 -56 -40 -119 -96 -190 l-44 -57 -59 27 c-33 15 -86 33 -117 40 -32 7 -58 16 -58 20 0 7 87 93 232 233 l49 47 -6 68 c-5 61 -9 72 -43 106 -47 48 -95 79 -130 82 -34 3 -142 37 -142 44 1 3 74 41 163 83 231 109 483 197 665 232 42 8 86 17 97 19 31 7 55 8 55 2z m-1053 -440 c25 -60 31 -111 20 -172 -8 -45 -99 -217 -149 -284 -53 -69 -207 -234 -213 -228 -2 3 5 34 16 70 65 211 83 387 55 528 -9 46 -15 85 -12 88 2 2 42 13 88 23 45 10 94 23 108 29 45 18 60 9 87 -54z m1588 -105 c3 -5 2 -10 -4 -10 -5 0 -13 5 -16 10 -3 6 -2 10 4 10 5 0 13 -4 16 -10z m-918 -112 c-2 -13 -4 -3 -4 22 0 25 2 35 4 23 2 -13 2 -33 0 -45z m420 -63 c-7 -20 -363 -282 -372 -273 -2 2 -7 49 -11 105 -8 118 -16 109 121 141 164 39 269 49 262 27z m-398 -203 c1 -60 -3 -91 -9 -87 -6 4 -10 53 -9 118 1 135 17 108 18 -31z m-1069 -232 c0 -5 -5 -10 -11 -10 -5 0 -7 5 -4 10 3 6 8 10 11 10 2 0 4 -4 4 -10z m1078 -112 l-1 -83 -7 75 c-3 41 -5 78 -2 83 9 19 12 0 10 -75z m212 -172 c0 -6 -164 -96 -174 -96 -3 0 -6 16 -6 35 0 37 -1 37 90 54 52 10 90 13 90 7z m-420 -107 c0 -23 -19 -25 -46 -5 -18 14 -18 15 6 24 30 12 40 7 40 -19z m-66 -306 c19 -56 36 -109 36 -114 0 -4 -32 -10 -72 -13 -39 -4 -152 -21 -251 -37 -100 -16 -182 -27 -184 -25 -4 4 183 103 301 158 108 51 160 60 170 31z",
              }),
              h("path", {
                d: "M1061 1727 c-18 -23 -151 -307 -151 -324 0 -9 6 -24 13 -32 7 -9 24 -45 38 -79 13 -36 33 -68 44 -74 11 -6 32 -22 48 -36 l27 -26 28 22 c15 13 35 25 44 28 9 4 24 28 33 54 14 44 14 54 0 115 -14 63 -36 122 -76 211 -11 23 -19 63 -19 92 0 53 -10 71 -29 49z",
              }),
              h("path", {
                d: "M906 1560 c-24 -22 -68 -77 -97 -122 l-54 -82 -8 65 c-4 35 -14 70 -22 78 -12 13 -16 10 -25 -15 -6 -16 -17 -36 -24 -44 -17 -19 -42 -100 -51 -160 -4 -25 -15 -60 -26 -78 -10 -18 -19 -39 -19 -47 0 -8 -11 -26 -24 -40 -14 -15 -27 -44 -31 -71 -6 -41 -4 -49 19 -73 15 -16 32 -55 44 -100 18 -65 27 -80 77 -132 l58 -57 36 19 c20 10 44 19 54 19 29 0 54 17 77 54 32 53 20 123 -35 206 -53 79 -80 172 -70 245 11 87 83 243 161 353 25 34 8 26 -40 -18z",
              }),
            ]
          ),
        ]),
    });

    return { textLogo };
  },
};
</script>
