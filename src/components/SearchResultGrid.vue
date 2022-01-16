<!--
 * @Description: the search result grid component
 * @Version: 1.0.0.20220116
 * @Author: Arvin Zhao
 * @Date: 2021-12-12 05:41:38
 * @Last Editors: Arvin Zhao
 * @LastEditTime: 2022-01-16 11:44:53
-->

<template>
  <div
    :class="[
      shouldShowGrid ? 'hidden' : 'flex h-full items-center justify-center',
    ]"
    :id="global.common.SEARCH_STATUS_AREA_ID"
  >
    <div class="flex flex-col justify-center max-w-sm text-center">
      <div class="flex items-center justify-center">
        <span
          v-if="hasSearchError"
          class="text-primary-red e-circle-info e-icons text-2xl"
        />
        <component
          v-else
          :is="loadingIcon"
          aria-hidden="true"
          class="text-primary animate-spin fill-[none] h-6"
        />
        <span
          :class="[
            'font-medium leading-6 ml-2 text-lg',
            hasSearchError ? 'text-primary-red' : 'text-primary',
          ]"
          >{{ searchStatusTitle }}</span
        >
      </div>
      <p class="text-conent mt-2 text-sm">{{ searchStatusMessage }}</p>
    </div>
  </div>
  <input :id="global.common.TRICK_INPUT_ID" class="hidden" />
  <!-- The grid needs "invisible" rather than "hidden" to ensure a correct column header format. -->
  <div :class="[shouldShowGrid ? '' : 'h-0 invisible overflow-hidden']">
    <ejs-grid
      @created="searchGridImmediately"
      @dataBound="adjustGrid"
      @load="buildGrid"
      :allowExcelExport="true"
      :allowFiltering="true"
      :allowResizing="true"
      :allowSorting="true"
      :dataSource="searchResultData"
      :enableStickyHeader="true"
      :filterSettings="{ type: 'Menu' }"
      :frozenColumns="2"
      :ref="global.common.SEARCH_RESULT_GRID_NAME"
      :searchSettings="{ operator: 'equal' }"
      :selectionSettings="{ mode: 'Both', type: 'Multiple' }"
      :showColumnChooser="true"
      :showColumnMenu="true"
      :toolbar="searchResultGridToolbar"
      :toolbarClick="handleToolbarClick"
      clipMode="EllipsisWithTooltip"
      gridLines="Both"
    />
  </div>
</template>

<script>
import { GridComponent } from "@syncfusion/ej2-vue-grids";
import { defineComponent, h } from "vue";

import global from "../lib/global.js";
import * as syncfusion from "../locales/syncfusion.json";
import * as zhCN from "../locales/zh-CN.json";

export default {
  components: { "ejs-grid": GridComponent },
  methods: {
    /**
     * Adjust the grid when the data source is populated.
     */
    adjustGrid() {
      var searchResultArea = document.getElementById(
        global.common.SEARCH_RESULT_AREA_ID
      );

      if (searchResultArea == null) {
        return;
      } // end if

      if (this.searchResultData == null) {
        searchResultArea.classList.add("h-screen");
        searchResultArea.classList.remove("min-h-screen");
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
        const movableContentAreas =
          document.getElementsByClassName("e-movablecontent");

        this.$refs[global.common.SEARCH_RESULT_GRID_NAME].autoFitColumns([]); // Auto-fit all columns to ensure that the grid's horizontal scroll bar can be added.

        // Hide the horizontal scroll bar if the content is not overflown horizontally.
        if (
          movableContentAreas != null &&
          movableContentAreas.length > 0 &&
          movableContentAreas[0].clientWidth >=
            movableContentAreas[0].scrollWidth
        ) {
          this.$refs[global.common.SEARCH_RESULT_GRID_NAME].hideScroll();
        } // end if

        this.$refs[global.common.SEARCH_RESULT_GRID_NAME].autoFitColumns([]); // Auto-fit all columns again because of the horizontal scroll bar.
        searchResultArea.classList.add("min-h-screen");
        searchResultArea.classList.remove("h-screen");
        this.shouldShowGrid = true;
      } // end if...else

      setTimeout(() => this.styleSearchBarBg(), 50);
    }, // end function adjustGrid

    /**
     * Build the grid.
     */
    buildGrid() {
      for (
        var dayVolumeColumns = [], date = new Date(this.startDate);
        date <= new Date(this.endDate);

      ) {
        const day = date.getDay();

        if (day !== 0 && day !== 6) {
          const dateStr = [
            date.getFullYear(),
            date.getMonth() + 1,
            date.getDate(),
          ].join("-");
          var dayStr = "";

          switch (day) {
            case 1:
              dayStr = zhCN.default.monday;
              break;

            case 2:
              dayStr = zhCN.default.tuesday;
              break;

            case 3:
              dayStr = zhCN.default.wednesday;
              break;

            case 4:
              dayStr = zhCN.default.thursday;
              break;

            case 5:
              dayStr = zhCN.default.friday;
              break;

            default:
              dayStr = "?";
          } // end switch-case

          dayVolumeColumns.push({
            field: dateStr,
            headerText: `${dateStr}（${dayStr}）`,
            headerTextAlign: global.common.SF_ALIGN_LEFT,
            minWidth: global.common.MIN_COLUMN_WIDTH,
            textAlign: global.common.SF_ALIGN_RIGHT,
            type: global.common.SF_NUM_COLUMN,
          });
        } // end if

        date.setDate(date.getDate() + 1);
        date.setHours(0);
      } // end for

      const columns = [
        {
          field: global.common.STRIKE_PRICE_KEY,
          format: "N2",
          headerText: zhCN.default.strikePriceColumnHeader,
          headerTextAlign: global.common.SF_ALIGN_LEFT,
          minWidth: global.common.MIN_COLUMN_WIDTH,
          textAlign: global.common.SF_ALIGN_RIGHT,
          type: global.common.SF_NUM_COLUMN,
        },
        {
          field: global.common.TOTAL_VOLUME_KEY,
          headerText: zhCN.default.totalVolumeColumnHeader,
          headerTextAlign: global.common.SF_ALIGN_LEFT,
          minWidth: global.common.MIN_COLUMN_WIDTH,
          textAlign: global.common.SF_ALIGN_RIGHT,
          type: global.common.SF_NUM_COLUMN,
        },
        {
          columns: dayVolumeColumns,
          headerText: zhCN.default.dayVolumeStackedColumnHeader,
          textAlign: global.common.SF_ALIGN_CENTRE,
        },
      ]; // TODO: unit, etc depend on preferences

      Array.prototype.forEach.call(columns, (element) =>
        this.$refs[
          global.common.SEARCH_RESULT_GRID_NAME
        ].ej2Instances.columns.push(element)
      );
    }, // end function buildGrid

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
                      this.$refs[global.common.SEARCH_RESULT_GRID_NAME]
                        .ej2Instances.columns.length,
                    index: 1,
                    value: this.fileHeader,
                    style: {
                      bold: true,
                      fontSize: global.common.FILE_HEADER_FONT_SIZE,
                      hAlign: global.common.SF_ALIGN_CENTRE,
                    },
                  },
                ],
                index: 1,
              },
            ],
          },
        });
      } // end if

      if (args.item.text === zhCN.default.autoFitAllColumnsName) {
        this.$refs[global.common.SEARCH_RESULT_GRID_NAME].autoFitColumns([]);
      } // end if
    }, // end function handleToolbarClick

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
        gridSearchBar.addEventListener("keyup", (event) =>
          this.searchGrid(event)
        );
      } // end if
    }, // end function searchGridImmediately

    /**
     * Apply the search bar's blur effect if applicable.
     */
    styleSearchBarBg() {
      var searchBar = document.getElementById(global.common.SEARCH_BAR_ID);

      window[global.common.IPC_RENDERER_API_KEY].send(
        global.common.IPC_SEND,
        global.common.GET_CONTENT_SIZE
      );

      if (searchBar != null && this.screenHeight != null) {
        // Remove the search bar's blur effect if the view is not scrollable.
        if (document.body.offsetHeight > this.screenHeight) {
          searchBar.classList.add("bg-blur", "shadow-xl-reverse");
          searchBar.classList.remove("bg-opacity-0", "dark:bg-opacity-0");
        } else {
          searchBar.classList.add("bg-opacity-0", "dark:bg-opacity-0");
          searchBar.classList.remove("bg-blur", "shadow-xl-reverse");
        } // end if...else
      } // end if
    }, // end function styleSearchBarBg
  },
  props: {
    endDate: String,
    startDate: String,
    stockSymbol: String,
  },
  data() {
    return {
      fileHeader: global.common.UNKNOWN,
      filename: global.common.UNKNOWN,
      global,
      hasSearchError: false,
      screenHeight: null,
      searchResultData: null,
      searchResultGridToolbar: [
        "ColumnChooser",
        "ExcelExport",
        "Search",
        {
          prefixIcon: "e-auto-fit-content",
          text: zhCN.default.autoFitAllColumnsName,
          tooltipText: zhCN.default.autoFitAllColumnsTooltip,
        },
      ],
      searchStatusMessage: zhCN.default.searchingHint,
      searchStatusTitle: zhCN.default.searching,
      shouldShowGrid: false,
    };
  },
  mounted() {
    const dateRange =
      this.$route.query.startDate +
      (this.$route.query.startDate === this.$route.query.endDate
        ? ""
        : ` - ${this.$route.query.endDate}`);
    var searchData = {};

    this.filename = `${
      this.$route.query.stockName === ""
        ? this.$route.query.stockSymbol
        : this.$route.query.stockName
    }（${dateRange}）`;
    this.fileHeader = `${
      this.$route.query.stockName === ""
        ? this.$route.query.stockName
        : this.$route.query.stockSymbol + " "
    }${this.filename}`;
    searchData[global.common.END_DATE_KEY] = this.endDate;
    searchData[global.common.START_DATE_KEY] = this.startDate;
    searchData[global.common.STOCK_SYMBOL_KEY] = this.stockSymbol;
    searchData[global.common.TAG_KEY] = global.common.GET_SEARCH_RESULT_DATA;
    window[global.common.IPC_RENDERER_API_KEY].receive(
      global.common.IPC_RECEIVE,
      (data) => {
        const isArray = Array.isArray(data);

        if (
          isArray &&
          (data.length === 0 ||
            (typeof data[0] === "object" &&
              Object.prototype.hasOwnProperty.call(
                data[0],
                global.common.STRIKE_PRICE_KEY
              )))
        ) {
          this.searchResultData = data;
        } // end if

        if (isArray && data.length === 2 && typeof data[0] === "number") {
          this.screenHeight = data[1];
        } //end if
      }
    );
    window[global.common.IPC_RENDERER_API_KEY].send(
      global.common.IPC_SEND,
      searchData
    );
    window.addEventListener("resize", this.styleSearchBarBg);
    window.addEventListener("scroll", () => {
      const trickInput = document.getElementById(global.common.TRICK_INPUT_ID);

      // The trick input is used to close any grid popup to avoid strange appearance when scrolling.
      if (trickInput != null) {
        trickInput.click();
      } // end if
    });
  },
  setup() {
    const loadingIcon = defineComponent({
      render: () =>
        h("svg", { viewBox: "0 0 24 24" }, [
          h("circle", {
            class: "opacity-50 stroke-[4] stroke-current",
            cx: 12,
            cy: 12,
            r: 10,
          }),
          h("path", {
            class: "fill-current opacity-50",
            d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z",
          }),
        ]),
    });

    return { loadingIcon };
  },
};
</script>
