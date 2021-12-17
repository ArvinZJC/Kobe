<!--
 * @Description: the search bar component
 * @Version: 1.0.0.20211217
 * @Author: Arvin Zhao
 * @Date: 2021-12-12 05:44:32
 * @Last Editors: Arvin Zhao
 * @LastEditTime: 2021-12-17 23:37:12
-->

<template>
  <form class="space-y-6" action="#" method="POST">
    <ejs-autocomplete
      :dataSource="stockList"
      :fields="field"
      :placeholder="locale.STOCK_SYMBOL"
    />
  </form>
</template>

<script>
import { AutoCompleteComponent } from "@syncfusion/ej2-vue-dropdowns";
import global from "../lib/global.js";

export default {
  components: {
    "ejs-autocomplete": AutoCompleteComponent,
  },
  data() {
    return {
      field: { value: global.common.STOCK_SYMBOL_KEY },
      locale: global.locale,
      stockList: this.stockList,
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
  },
};
</script>
