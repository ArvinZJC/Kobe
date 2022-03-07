<!--
 * @Description: the search result view
 * @Version: 1.1.0.20220307
 * @Author: Arvin Zhao
 * @Date: 2021-12-27 20:38:08
 * @Last Editors: Arvin Zhao
 * @LastEditTime: 2022-03-07 15:29:26
-->

<template>
  <main>
    <!-- The search bar. -->
    <SearchForm
      :endDate="endDate"
      :isBarLayout="true"
      :startDate="startDate"
      :stockSymbol="stockSymbol"
    />
    <div class="container-view px-block pb-4 pt-16">
      <!-- The search result grid component. -->
      <SearchResultGrid
        :endDate="endDate"
        :startDate="startDate"
        :stockName="stockName"
        :stockSymbol="stockSymbol"
      />
    </div>
  </main>
</template>

<script>
import SearchForm from "../components/SearchForm.vue";
import SearchResultGrid from "../components/SearchResultGrid.vue";
import global from "../lib/global.js";

export default {
  components: {
    SearchForm,
    SearchResultGrid,
  },
  props: {
    endDate: String,
    startDate: String,
    stockName: String,
    stockSymbol: String,
  },
  data() {
    return { global };
  },
  mounted() {
    const dateRange =
      this.startDate +
      (this.startDate === this.endDate ? "" : ` - ${this.endDate}`);

    document.title = `${
      this.stockName === "" ? this.stockSymbol : this.stockName
    }（${dateRange}）`;
  },
};
</script>
