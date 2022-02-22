<!--
 * @Description: the search result grid component with a search status area
 * @Version: 1.1.1.20220223
 * @Author: Arvin Zhao
 * @Date: 2021-12-12 05:41:38
 * @Last Editors: Arvin Zhao
 * @LastEditTime: 2022-02-23 00:42:19
-->

<template>
  <!-- The trick container. -->
  <div
    :id="global.common.TRICK_CONTAINER_ID"
    class="h-screen hidden w-screen"
  />
  <!-- The search result area. -->
  <div
    :id="global.common.SEARCH_RESULT_AREA_ID"
    class="px-block h-screen pb-20 pt-4"
  >
    <!-- The search status area. -->
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
          <LoadingIcon v-else aria-hidden="true" class="animate-spin h-6" />
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
    <!-- The trick input. -->
    <input :id="global.common.TRICK_INPUT_ID" class="hidden" />
    <!-- The grid needs "invisible" rather than "hidden" to ensure a correct column header format. -->
    <div :class="[shouldShowGrid ? '' : 'h-0 invisible overflow-hidden']">
      <!-- The search result grid component. -->
      <ejs-grid
        @actionComplete="patchGridBorder"
        @created="searchGridImmediately"
        @dataBound="adjustGrid"
        @load="buildGrid"
        @toolbarClick="handleToolbarClick"
        :allowExcelExport="true"
        :allowFiltering="true"
        :allowResizing="true"
        :allowSorting="true"
        :clipMode="global.common.SF_ELLIPSIS_WITH_TOOLTIP"
        :dataSource="searchResultData"
        :enableHeaderFocus="true"
        :enableStickyHeader="true"
        :filterSettings="{ type: global.common.SF_MENU }"
        :frozenColumns="2"
        :gridLines="global.common.SF_BOTH"
        :ref="global.common.SEARCH_RESULT_GRID_NAME"
        :searchSettings="{ operator: global.common.SF_EQUAL }"
        :selectionSettings="{
          mode: global.common.SF_BOTH,
          type: global.common.SF_MULTIPLE,
        }"
        :showColumnChooser="true"
        :showColumnMenu="true"
        :toolbar="searchResultGridToolbar"
      />
    </div>
  </div>
</template>

<script>
import { GridComponent } from "@syncfusion/ej2-vue-grids";

import LoadingIcon from "./svg/LoadingIcon.vue";
import global from "../lib/global.js";
import { toDateStr, toVolumeUnitText } from "../lib/utils";
import * as syncfusion from "../locales/syncfusion.json";
import * as zhCN from "../locales/zh-CN.json";

export default {
  components: { "ejs-grid": GridComponent, LoadingIcon },
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

      const heightScreenClass = "h-screen";
      const minHeightScreenClass = "min-h-screen";

      if (this.searchResultData == null) {
        searchResultArea.classList.add(heightScreenClass);
        searchResultArea.classList.remove(minHeightScreenClass);
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
        const movableContentAreas = document.getElementsByClassName(
          global.common.SF_MOVABLE_CONTENT_CLASS
        );

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
        searchResultArea.classList.add(minHeightScreenClass);
        searchResultArea.classList.remove(heightScreenClass);
        this.shouldShowGrid = true;
      } // end if...else

      this.patchGridStackedHeaderAndToolbar();
      setTimeout(() => this.styleSearchBarBg(), 50);
    }, // end function adjustGrid

    /**
     * Build the grid.
     */
    buildGrid() {
      var dayVolumeColumns = [];

      for (
        var date = new Date(`${this.startDate}${global.common.DAY_TIME_START}`);
        date <= new Date(`${this.endDate}${global.common.DAY_TIME_START}`);

      ) {
        const day = date.getDay();

        if (day !== 0 && day !== 6) {
          const dateStr = toDateStr(date);
          var dayStr = "";

          switch (day) {
            case 1: {
              dayStr = zhCN.default.monday;
              break;
            }
            case 2: {
              dayStr = zhCN.default.tuesday;
              break;
            }
            case 3: {
              dayStr = zhCN.default.wednesday;
              break;
            }
            case 4: {
              dayStr = zhCN.default.thursday;
              break;
            }
            case 5: {
              dayStr = zhCN.default.friday;
              break;
            }
            default: {
              dayStr = zhCN.default.unknown;
            }
          } // end switch-case

          dayVolumeColumns.push({
            field: dateStr,
            format: `N${global.common.DEFAULT_DAY_VOLUME_DECIMAL_POINTS}`,
            headerText: `${dateStr}（${dayStr}）`,
            headerTextAlign: global.common.SF_ALIGN_LEFT,
            minWidth: global.common.MIN_COLUMN_WIDTH,
            textAlign: global.common.SF_ALIGN_RIGHT,
            type: global.common.SF_NUM,
          });
        } // end if

        date.setDate(date.getDate() + 1);
      } // end for

      const columns = [
        {
          field: global.common.STRIKE_PRICE_KEY,
          format: "N2",
          headerText: zhCN.default.strikePriceColumnHeader,
          headerTextAlign: global.common.SF_ALIGN_LEFT,
          minWidth: global.common.MIN_COLUMN_WIDTH,
          textAlign: global.common.SF_ALIGN_RIGHT,
          type: global.common.SF_NUM,
        },
        {
          field: global.common.TOTAL_VOLUME_KEY,
          format: `N${global.common.DEFAULT_TOTAL_VOLUME_DECIMAL_POINTS}`,
          headerText: zhCN.default.totalVolumeColumnHeader,
          headerTextAlign: global.common.SF_ALIGN_LEFT,
          minWidth: global.common.MIN_COLUMN_WIDTH,
          textAlign: global.common.SF_ALIGN_RIGHT,
          type: global.common.SF_NUM,
        },
        {
          columns: dayVolumeColumns,
          headerText: zhCN.default.dayVolumeStackedColumnHeader,
          textAlign: global.common.SF_ALIGN_CENTRE,
        },
      ];

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
          includeHiddenColumn: this.includeHiddenColumns,
        });
      } // end if

      if (args.item.text === zhCN.default.autoFitAllColumnsName) {
        this.$refs[global.common.SEARCH_RESULT_GRID_NAME].autoFitColumns([]);
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
     * Patch the grid component's border to avoid strange appearance.
     */
    patchGridBorder() {
      for (const tableSection of document.getElementsByClassName(
        global.common.SF_TABLE_CLASSES
      )) {
        tableSection.classList.add(global.common.SF_TABLE_BORDER_CLASS);
      } // end for
    }, // end function patchGridBorder

    /**
     * Patch the grid component's stacked header and toolbar to avoid strange appearance.
     */
    patchGridStackedHeaderAndToolbar() {
      Array.prototype.forEach.call(
        Array.prototype.concat.call(
          document.getElementsByClassName(
            global.common.SF_GRID_STACKED_HEADER_CLASSES
          )[0],
          document.getElementsByClassName(global.common.SF_TOOLBAR_CLASSES)[0]
        ),
        (element) => element.classList.add("!w-auto")
      );
    }, // end function patchGridToolbarHeader

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
     * Apply the search bar's blur effect if applicable.
     */
    styleSearchBarBg() {
      const searchBar = document.getElementById(global.common.SEARCH_BAR_ID);
      const trickContainer = document.getElementById(
        global.common.TRICK_CONTAINER_ID
      );

      if (searchBar != null && trickContainer != null) {
        // Remove the search bar's blur effect if the view is not scrollable.
        if (document.body.offsetHeight > trickContainer.offsetHeight) {
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
      includeHiddenColumns: global.common.DEFAULT_INCLUDE_HIDDEN_COLUMNS,
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
    this.invokeIpc();
    window.addEventListener("resize", () => this.styleSearchBarBg);
    window.addEventListener("scroll", () => {
      const trickInput = document.getElementById(global.common.TRICK_INPUT_ID);

      // The trick input is used to close any grid pop-up to avoid strange appearance when scrolling.
      if (trickInput != null) {
        trickInput.click();
      } // end if
    });
  },
};
</script>
