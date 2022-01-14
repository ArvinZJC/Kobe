<!--
 * @Description: the search result grid component
 * @Version: 1.0.0.20220114
 * @Author: Arvin Zhao
 * @Date: 2021-12-12 05:41:38
 * @Last Editors: Arvin Zhao
 * @LastEditTime: 2022-01-14 08:26:24
-->

<template>
  <div
    :class="[
      shouldShowGrid
        ? 'hidden'
        : 'flex flex-col h-full items-center justify-center',
    ]"
  >
    <div class="flex items-center">
      <component
        :is="loadingIcon"
        aria-hidden="true"
        class="animate-spin fill-[none] h-5 mr-2 text-black dark:text-white"
      />
      <span class="text-primary">{{ searchResultMessage }}</span>
    </div>
  </div>
  <div :hidden="!shouldShowGrid">
    <ejs-grid
      :allowExcelExport="true"
      :allowFiltering="true"
      :allowResizing="true"
      :allowSorting="true"
      :dataBound="adjustGrid"
      :dataSource="searchResultData"
      :enableStickyHeader="true"
      :filterSettings="searchResultGridFilterSettings"
      :frozenColumns="2"
      :load="buildGrid"
      :ref="searchResultGridName"
      :selectionSettings="searchResultGridSelectionSettings"
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
        this.shouldShowGrid = false;
      } else {
        this.$refs[this.searchResultGridName].autoFitColumns([]);

        const movableContentAreas =
          document.getElementsByClassName("e-movablecontent");

        // Hide the scroll bar if the content is not overflown horizontally.
        if (
          movableContentAreas != null &&
          movableContentAreas.length > 0 &&
          movableContentAreas[0].clientWidth >=
            movableContentAreas[0].scrollWidth
        ) {
          this.$refs[this.searchResultGridName].hideScroll();
        } // end if

        searchResultArea.classList.add("min-h-screen");
        searchResultArea.classList.remove("h-screen");
        this.shouldShowGrid = true;
      } // end if...else

      setTimeout(() => {
        this.styleSearchBarBg();
      }, 50);
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
      ];

      Array.prototype.forEach.call(columns, (element) => {
        this.$refs[this.searchResultGridName].ej2Instances.columns.push(
          element
        );
      });
    }, // end function buildGrid

    /**
     * Handle the click on the toolbar item.
     * @param {object} args event arguments.
     */
    handleToolbarClick(args) {
      // TODO: if print does not need this, change to if...else
      switch (args.item.text) {
        case zhCN.default.autoFitAllColumnsName:
          this.$refs[this.searchResultGridName].autoFitColumns([]);
          break;

        case syncfusion.default["zh-Hans"].grid.Excelexport:
          this.$refs[this.searchResultGridName].excelExport({
            enableFilter: true,
            fileName: `${this.filename}.xlsx`,
            header: {
              headerRows: 1,
              rows: [
                {
                  cells: [
                    {
                      colSpan:
                        this.$refs[this.searchResultGridName].ej2Instances
                          .columns.length,
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
          break;

        default:
          return;
      } // end switch-case
    }, // end function handleToolbarClick

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
      screenHeight: null,
      searchResultData: null,
      searchResultGridFilterSettings: { type: "Menu" },
      searchResultGridName: "gridSearchResults",
      searchResultGridSelectionSettings: { mode: "Both", type: "Multiple" },
      searchResultGridToolbar: [
        global.common.COLUMN_CHOOSER_KEY,
        global.common.EXCEL_EXPORT_KEY,
        global.common.PRINT_KEY,
        {
          prefixIcon: "e-auto-fit-content",
          text: zhCN.default.autoFitAllColumnsName,
          tooltipText: zhCN.default.autoFitAllColumnsTooltip,
        },
      ],
      searchResultMessage: zhCN.default.searching,
      searchResultMessageExplanation: "", // TODO:
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
          typeof data[0] === "object" &&
          Object.prototype.hasOwnProperty.call(
            data[0],
            global.common.STRIKE_PRICE_KEY
          )
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
