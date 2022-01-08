<!--
 * @Description: the search result grid component
 * @Version: 1.0.0.20220108
 * @Author: Arvin Zhao
 * @Date: 2021-12-12 05:41:38
 * @Last Editors: Arvin Zhao
 * @LastEditTime: 2022-01-08 03:16:34
-->

<template>
  <ejs-grid
    :dataSource="searchResultData"
    :enableStickyHeader="true"
    gridLines="Both"
  />
</template>

<script>
import { GridComponent } from "@syncfusion/ej2-vue-grids";

export default {
  components: { "ejs-grid": GridComponent },
  props: {
    endDate: String,
    startDate: String,
    stockSymbol: String,
  },
  data() {
    return { searchResultData: null };
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
          Object.prototype.hasOwnProperty.call(data[0], "StrikePrice")
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
