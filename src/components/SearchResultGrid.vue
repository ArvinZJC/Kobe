<!--
 * @Description: the search result grid component
 * @Version: 1.0.0.20220109
 * @Author: Arvin Zhao
 * @Date: 2021-12-12 05:41:38
 * @Last Editors: Arvin Zhao
 * @LastEditTime: 2022-01-09 04:48:24
-->

<template>
  <ejs-grid
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
    clipMode="EllipsisWithTooltip"
    gridLines="Both"
  />
</template>

<script>
import { GridComponent } from "@syncfusion/ej2-vue-grids";

import global from "../lib/global.js";
import * as zhCN from "../locales/zh-CN.json";

export default {
  components: { "ejs-grid": GridComponent },
  methods: {
    /**
     * Adjust the grid when the data source is populated.
     */
    adjustGrid() {
      this.$refs[this.searchResultGridName].autoFitColumns([]); // Auto-fit all columns.
    }, // end method adjustGrid

    /**
     * Build the grid.
     */
    buildGrid() {
      for (
        var dayVolumeColumns = [], date = new Date(this.startDate);
        date <= new Date(this.endDate);

      ) {
        var day = date.getDay();

        if (day !== 0 && day !== 6) {
          var dateStr = [
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

      var columns = [
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
          textAlign: global.common.SF_ALIGN_CENTER,
        },
      ];

      for (var column of columns) {
        this.$refs[this.searchResultGridName].ej2Instances.columns.push(column);
      } // end for
    }, // end method buildGrid
  },
  props: {
    endDate: String,
    startDate: String,
    stockSymbol: String,
  },
  data() {
    return {
      searchResultData: null,
      searchResultGridFilterSettings: { type: "Menu" },
      searchResultGridName: "gridSearchResults",
      searchResultGridSelectionSettings: { mode: "Both", type: "Multiple" },
      searchResultGridToolbar: ["ColumnChooser"],
    };
  },
  mounted() {
    var searchData = {};

    searchData[global.common.END_DATE_KEY] = this.endDate;
    searchData[global.common.START_DATE_KEY] = this.startDate;
    searchData[global.common.STOCK_SYMBOL_KEY] = this.stockSymbol;
    searchData[global.common.TAG_KEY] = global.common.GET_SEARCH_RESULT_DATA;
    window[global.common.IPC_RENDERER_API_KEY].receive(
      global.common.IPC_RECEIVE,
      (data) => {
        if (
          Array.isArray(data) &&
          typeof data[0] === "object" &&
          Object.prototype.hasOwnProperty.call(
            data[0],
            global.common.STRIKE_PRICE_KEY
          )
        ) {
          this.searchResultData = data;
        } // end if
      }
    );
    window[global.common.IPC_RENDERER_API_KEY].send(
      global.common.IPC_SEND,
      searchData
    );
  },
};
</script>
