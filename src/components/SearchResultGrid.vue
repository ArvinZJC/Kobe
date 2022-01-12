<!--
 * @Description: the search result grid component
 * @Version: 1.0.0.20220112
 * @Author: Arvin Zhao
 * @Date: 2021-12-12 05:41:38
 * @Last Editors: Arvin Zhao
 * @LastEditTime: 2022-01-12 22:23:47
-->

<template>
  <ejs-grid
    :allowExcelExport="true"
    :allowFiltering="true"
    :allowPdfExport="true"
    :allowResizing="true"
    :allowSorting="true"
    :dataBound="adjustGrid"
    :dataSource="searchResultData"
    :enableStickyHeader="true"
    :filterSettings="searchResultGridFilterSettings"
    :frozenColumns="2"
    :load="buildGrid"
    :pdfHeaderQueryCellInfo="adjustPdfExport"
    :ref="searchResultGridName"
    :selectionSettings="searchResultGridSelectionSettings"
    :showColumnChooser="true"
    :showColumnMenu="true"
    :toolbar="searchResultGridToolbar"
    :toolbarClick="handleToolbarClick"
    clipMode="EllipsisWithTooltip"
    gridLines="Both"
  />
</template>

<script>
import { GridComponent } from "@syncfusion/ej2-vue-grids";

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
      this.$refs[this.searchResultGridName].autoFitColumns([]);

      const movableContentAreas =
        document.getElementsByClassName("e-movablecontent");

      // Hide the scrollbar if the content is not overflown horizontally.
      if (
        movableContentAreas != null &&
        movableContentAreas.length > 0 &&
        movableContentAreas[0].clientWidth >= movableContentAreas[0].scrollWidth
      ) {
        this.$refs[this.searchResultGridName].hideScroll();
      } // end if

      this.styleSearchBarBg();
    }, // end function adjustGrid

    /**
     * Adjust PDF export properties.
     * @param {object} args event arguments.
     */
    adjustPdfExport(args) {
      args.cell.row.pdfGrid.repeatHeader = true;
    }, // end function adjustPdfExport

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

        case syncfusion.default["zh-Hans"].grid.Pdfexport:
          this.$refs[this.searchResultGridName].pdfExport({
            fileName: `${this.filename}.pdf`,
            footer: {
              contents: [
                {
                  format: "{$current}", // TODO: optional?
                  pageNumberType: "Number",
                  position: { x: 0, y: 0 },
                  style: { hAlign: global.common.SF_ALIGN_CENTRE },
                  type: "PageNumber",
                },
              ],
              fromBottom: 0,
              height: 60,
            },
            header: {
              contents: [
                {
                  position: { x: 0, y: 0 },
                  style: { hAlign: global.common.SF_ALIGN_CENTRE },
                  type: "Text",
                  value: this.fileHeader,
                },
              ],
              fromTop: 0,
              height: 60,
            },
            pageOrientation: "Landscape",
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
        global.common.PDF_EXPORT_KEY,
        global.common.PRINT_KEY,
        {
          prefixIcon: "e-auto-fit-content",
          text: zhCN.default.autoFitAllColumnsName,
          tooltipText: zhCN.default.autoFitAllColumnsTooltip,
        },
      ],
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
};
</script>
