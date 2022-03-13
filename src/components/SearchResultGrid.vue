<!--
 * @Description: the search result grid component with a search status area
 * @Version: 1.2.1.20220313
 * @Author: Arvin Zhao
 * @Date: 2021-12-12 05:41:38
 * @Last Editors: Arvin Zhao
 * @LastEditTime: 2022-03-13 12:39:52
-->

<template>
  <!-- The search result area. -->
  <div :id="global.common.SEARCH_RESULT_AREA_ID" class="h-full overflow-hidden">
    <!-- The search status area. -->
    <div
      v-if="!shouldShowGrid"
      class="flex h-full items-center justify-center"
      :id="global.common.SEARCH_STATUS_AREA_ID"
    >
      <div class="max-w-card flex flex-col justify-center text-center">
        <div class="flex items-center justify-center">
          <span
            v-if="hasSearchError"
            class="text-primary-red e-circle-info e-icons text-2xl"
          />
          <LoadingIcon v-else aria-hidden="true" class="animate-spin h-6" />
          <span
            :class="[
              'font-medium leading-6 ml-2 text-lg',
              hasSearchError ? 'text-primary-red' : 'text-primary',
            ]"
            >{{ searchStatusTitle }}</span
          >
        </div>
        <p class="text-conent mt-2">{{ searchStatusMessage }}</p>
      </div>
    </div>
    <!-- The trick input. -->
    <input :id="global.common.TRICK_INPUT_ID" class="hidden" />
    <!-- The grid needs "invisible" rather than "hidden" to ensure a correct column header format. -->
    <div :class="[shouldShowGrid ? '' : 'h-0 invisible overflow-hidden']">
      <!-- The search result grid component. -->
      <ejs-grid
        v-if="isColumnsReady"
        @columnMenuClick="handleColumnMenuClick"
        @created="searchGridImmediately"
        @dataBound="adjustGrid"
        @excelQueryCellInfo="processExcelData"
        @load="buildGrid"
        @toolbarClick="handleToolbarClick"
        :allowExcelExport="true"
        :allowFiltering="true"
        :allowPaging="true"
        :allowSorting="true"
        :clipMode="global.common.SF_ELLIPSIS_WITH_TOOLTIP"
        :columnMenuItems="[
          'Filter',
          'SortAscending',
          'SortDescending',
          { text: cancelSorting },
        ]"
        :dataSource="searchResultData"
        :enableHeaderFocus="true"
        :filterSettings="{ type: global.common.SF_MENU }"
        :frozenColumns="2"
        :gridLines="global.common.SF_BOTH"
        :pageSettings="{
          pageSize: global.common.DEFAULT_PAGE_SIZE,
          pageSizes: global.common.PAGE_SIZES,
        }"
        :ref="global.common.SEARCH_RESULT_GRID_NAME"
        :searchSettings="{ operator: global.common.SF_EQUAL }"
        :selectionSettings="{ type: global.common.SF_MULTIPLE }"
        :showColumnMenu="true"
        :toolbar="['ExcelExport', 'Search']"
      />
    </div>
  </div>
</template>

<script>
import { GridComponent } from "@syncfusion/ej2-vue-grids";

import LoadingIcon from "./svg/LoadingIcon.vue";
import global from "../lib/global.js";
import { toVolumeUnitText } from "../lib/utils.js";
import * as syncfusion from "../locales/syncfusion.json";
import * as zhCN from "../locales/zh-CN.json";

export default {
  components: { "ejs-grid": GridComponent, LoadingIcon },
  methods: {
    /**
     * Adjust the grid when the data source is populated.
     */
    adjustGrid() {
      const searchResultArea = document.getElementById(
        global.common.SEARCH_RESULT_AREA_ID
      );

      if (searchResultArea != null) {
        if (this.searchResultData == null) {
          this.hasSearchError = false;
          this.searchStatusMessage = zhCN.default.searchingHint;
          this.searchStatusTitle = zhCN.default.searching;
          this.shouldShowGrid = false;
        } else if (
          this.searchResultData.length === 1 &&
          this.searchResultData[0][global.common.STRIKE_PRICE_KEY] ===
            global.common.PROCESSOR_ERROR_KEY
        ) {
          this.hasSearchError = true;
          this.searchStatusMessage =
            this.searchResultData[0][global.common.TOTAL_VOLUME_KEY];
          this.searchStatusTitle = zhCN.default.searchError;
          this.shouldShowGrid = false;
        } else {
          this.patchVScrollBar();
          this.resizeGridHeight();
          this.shouldShowGrid = true;
        } // end if...else
      } // end if
    }, // end function adjustGrid

    /**
     * Build the grid.
     */
    buildGrid() {
      this.$refs[
        global.common.SEARCH_RESULT_GRID_NAME
      ].ej2Instances.columns.push(...this.columns);
    }, // end function buildGrid

    /**
     * Click the trick input to close any pop-up to avoid strange appearance.
     */
    clickTrickInput() {
      const trickInput = document.getElementById(global.common.TRICK_INPUT_ID);

      if (trickInput != null) {
        trickInput.click();
      } // end if
    }, // end function clickTrickInput

    /**
     * Handle the click on the column menu.
     * @param {object} args event arguments.
     */
    handleColumnMenuClick(args) {
      if (args.item.text === this.cancelSorting) {
        this.$refs[global.common.SEARCH_RESULT_GRID_NAME].clearSorting();
      } // end if
    }, // end function handleColumnMenuClick

    /**
     * Handle the click on the toolbar item.
     * @param {object} args event arguments.
     */
    handleToolbarClick(args) {
      if (args.item.text === syncfusion.default["zh-Hans"].grid.Excelexport) {
        this.$refs[global.common.SEARCH_RESULT_GRID_NAME].excelExport({
          enableFilter: true,
          fileName: `${this.filename}.xlsx`,
          header: {
            headerRows: 1,
            rows: [
              {
                cells: [
                  {
                    colSpan:
                      this.$refs[
                        global.common.SEARCH_RESULT_GRID_NAME
                      ].getColumns().length,
                    index: 1,
                    style: {
                      bold: true,
                      fontSize: global.common.FILE_HEADER_FONT_SIZE,
                    },
                    value: this.fileHeader,
                  },
                ],
                index: 1,
              },
            ],
          },
          includeHiddenColumn: this.includeHiddenColumns,
        });
      } // end if
    }, // end function handleToolbarClick

    /**
     * Use the IPC channel to exchange information.
     */
    invokeIpc() {
      const searchData = {};

      searchData[global.common.END_DATE_KEY] = this.endDate;
      searchData[global.common.START_DATE_KEY] = this.startDate;
      searchData[global.common.STOCK_SYMBOL_KEY] = this.stockSymbol;
      searchData[global.common.TAG_KEY] = global.common.GET_SEARCH_RESULT_DATA;
      window[global.common.IPC_RENDERER_API_KEY].receive(
        global.common.IPC_RECEIVE,
        (data) => {
          if (
            typeof data === "object" &&
            Object.prototype.hasOwnProperty.call(
              data,
              global.common.INCLUDE_HIDDEN_COLUMNS_KEY
            )
          ) {
            this.includeHiddenColumns =
              data[global.common.INCLUDE_HIDDEN_COLUMNS_KEY];
          } // end if

          const isArray = Array.isArray(data);

          if (
            isArray &&
            typeof data[0] === "object" &&
            Object.prototype.hasOwnProperty.call(
              data[0],
              global.common.DAY_VOLUME_DECIMAL_POINTS_KEY
            )
          ) {
            this.$refs[
              global.common.SEARCH_RESULT_GRID_NAME
            ].ej2Instances.columns[1].format = `N${
              data[2][global.common.TOTAL_VOLUME_DECIMAL_POINTS_KEY]
            }`;
            this.$refs[
              global.common.SEARCH_RESULT_GRID_NAME
            ].ej2Instances.columns[1].headerText = `${
              zhCN.default.totalVolumeColumnHeader
            }（${toVolumeUnitText(
              data[3][global.common.TOTAL_VOLUME_UNIT_KEY]
            )}）`;
            Array.prototype.forEach.call(
              this.$refs[global.common.SEARCH_RESULT_GRID_NAME].ej2Instances
                .columns[2].columns,
              (element) => {
                element.format = `N${
                  data[0][global.common.DAY_VOLUME_DECIMAL_POINTS_KEY]
                }`;
              }
            );
            this.$refs[
              global.common.SEARCH_RESULT_GRID_NAME
            ].ej2Instances.columns[2].headerText = `${
              zhCN.default.dayVolumeStackedColumnHeader
            }（${toVolumeUnitText(
              data[1][global.common.DAY_VOLUME_UNIT_KEY]
            )}）`;
            setTimeout(
              () =>
                this.$refs[
                  global.common.SEARCH_RESULT_GRID_NAME
                ].refreshColumns(),
              50
            ); // Set delay to refresh columns to ensure that the relevant user preferences can be applied properly.
          } // end if

          if (
            isArray &&
            (data.length === 0 ||
              (typeof data[0] === "object" &&
                Object.prototype.hasOwnProperty.call(
                  data[0],
                  global.common.STRIKE_PRICE_KEY
                )))
          ) {
            window[global.common.IPC_RENDERER_API_KEY].send(
              global.common.IPC_SEND,
              global.common.ENABLE_SEARCH_FORM
            );
            this.searchResultData = data;
          } // end if
        }
      );
      window[global.common.IPC_RENDERER_API_KEY].send(
        global.common.IPC_SEND,
        global.common.GET_INCLUDE_HIDDEN_COLUMNS
      );
      window[global.common.IPC_RENDERER_API_KEY].send(
        global.common.IPC_SEND,
        global.common.GET_VOLUME_FORMAT
      );
      window[global.common.IPC_RENDERER_API_KEY].send(
        global.common.IPC_SEND,
        searchData
      );
    }, // end function invokeIpc

    /**
     * Patch the grid's vertical scroll bar to provide better appearance.
     */
    patchVScrollBar() {
      for (const gridContentChild of this.$refs[
        global.common.SEARCH_RESULT_GRID_NAME
      ].getContent().children) {
        if (
          gridContentChild.classList.contains(global.common.SF_CONTENT_CLASS)
        ) {
          gridContentChild.classList.add("!overflow-y-auto");
          break;
        } // end if
      } // end for
    }, // end function patchVScrollBar

    /**
     * Process the data for exporting to Excel.
     * @param {object} args event arguments.
     */
    processExcelData(args) {
      if (isNaN(args.value)) {
        args.value = null;
      } // end if
    }, // end function processExcelData

    /**
     * Resize the grid height.
     */
    resizeGridHeight() {
      const gridToolbar = document.getElementById(
        this.$refs[global.common.SEARCH_RESULT_GRID_NAME].ej2Instances.element
          .id + "_toolbarItems"
      );
      const scrollBar = document.getElementsByClassName(
        global.common.SF_SCROLL_BAR_CLASS
      );
      const searchResultArea = document.getElementById(
        global.common.SEARCH_RESULT_AREA_ID
      );

      if (
        gridToolbar != null &&
        scrollBar != null &&
        scrollBar.length > 0 &&
        searchResultArea != null
      ) {
        this.$refs[global.common.SEARCH_RESULT_GRID_NAME].ej2Instances.height =
          searchResultArea.clientHeight -
          gridToolbar.clientHeight -
          scrollBar[0].clientHeight -
          this.$refs[global.common.SEARCH_RESULT_GRID_NAME].getHeaderContent()
            .clientHeight -
          this.$refs[global.common.SEARCH_RESULT_GRID_NAME].getPager()
            .clientHeight;
        this.showOrHideScrollBar();
      } // end if
    }, // end function resizeGridHeight

    /**
     * Search the grid.
     * @param {Event | KeyboardEvent} event the object of the event invoking searching.
     */
    searchGrid(event) {
      this.$refs[global.common.SEARCH_RESULT_GRID_NAME].search(
        event.target.value
      );
    }, // end functon searchGrid

    /**
     * Search the grid immediately for any input change in the search bar.
     */
    searchGridImmediately() {
      const gridSearchBar = document.getElementById(
        this.$refs[global.common.SEARCH_RESULT_GRID_NAME].ej2Instances.element
          .id + "_searchbar"
      );

      if (gridSearchBar != null) {
        gridSearchBar.addEventListener("input", (event) =>
          this.searchGrid(event)
        );
      } // end if
    }, // end function searchGridImmediately

    /**
     * Show or hide the grid's scroll bar as per the content.
     */
    showOrHideScrollBar() {
      const content = document.getElementsByClassName(
        global.common.SF_CONTENT_CLASS
      );
      const movableContent = document.getElementsByClassName(
        global.common.SF_MOVABLE_CONTENT_CLASS
      );
      const scrollBar = document.getElementsByClassName(
        global.common.SF_SCROLL_BAR_CLASS
      );

      setTimeout(() => {
        if (content != null && content.length > 0) {
          if (content[0].clientHeight >= content[0].scrollHeight) {
            this.$refs[global.common.SEARCH_RESULT_GRID_NAME]
              .getHeaderContent()
              .classList.add("!pr-0");
          } else {
            this.$refs[global.common.SEARCH_RESULT_GRID_NAME]
              .getHeaderContent()
              .classList.remove("!pr-0");
          } // end if...else
        } // end if
      }); // The function setTimeout() is necessary to ensure it works when the grid is set to be shown.

      if (
        movableContent != null &&
        movableContent.length > 0 &&
        scrollBar != null &&
        scrollBar.length > 0
      ) {
        if (movableContent[0].clientWidth >= movableContent[0].scrollWidth) {
          scrollBar[0].classList.add("!hidden");
        } else {
          scrollBar[0].classList.remove("!hidden");
        } // end if...else
      } // end if
    }, // end function showOrHideHScrollBar
  },
  props: {
    endDate: String,
    startDate: String,
    stockName: String,
    stockSymbol: String,
  },
  data() {
    return {
      cancelSorting: `${zhCN.default.cancel}${zhCN.default.sort}`,
      fileHeader: global.common.UNKNOWN,
      filename: global.common.UNKNOWN,
      global,
      hasSearchError: false,
      includeHiddenColumns: global.common.DEFAULT_INCLUDE_HIDDEN_COLUMNS,
      isColumnsReady: false,
      searchResultData: null,
      searchStatusMessage: zhCN.default.searchingHint,
      searchStatusTitle: zhCN.default.searching,
      shouldShowGrid: false,
    };
  },
  mounted() {
    const dateRange =
      this.startDate +
      (this.startDate === this.endDate ? "" : ` - ${this.endDate}`);

    this.filename = `${
      this.stockName === "" ? this.stockSymbol : this.stockName
    }（${dateRange}）`;
    this.fileHeader = `${
      this.stockName === "" ? this.stockName : this.stockSymbol + " "
    }${this.filename}`;

    window.addEventListener("load", () => {
      setTimeout(() => {
        const worker = new Worker("/grid.js");

        worker.addEventListener("message", (e) => {
          this.columns = e.data.columns;
          worker.terminate();
          this.isColumnsReady = true;
          this.invokeIpc();
        });
        worker.postMessage({
          endDate: this.endDate,
          global: global.common,
          startDate: this.startDate,
          zhCN,
        });
      }, 500); // Set relatively enough timeout to ensure that it can enter the search result view without too much delay.
    });
    window.addEventListener("resize", () => {
      this.clickTrickInput();
      this.resizeGridHeight();
    });
  },
};
</script>
