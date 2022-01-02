<!--
 * @Description: the search result view
 * @Version: 1.0.0.20220102
 * @Author: Arvin Zhao
 * @Date: 2021-12-27 20:38:08
 * @Last Editors: Arvin Zhao
 * @LastEditTime: 2022-01-02 16:39:09
-->

<template>
  <main class="container-view">
    <!-- The search bar. -->
    <div
      class="container-navbar motion-safe:transition-300 bg-opacity-0 dark:bg-opacity-0"
      id="search-bar"
    >
      <div class="container-block">
        <div class="flex h-16 justify-between">
          <SearchForm
            :endDate="this.$route.query.endDate"
            :isBarLayout="true"
            :startDate="this.$route.query.startDate"
            :stockSymbol="this.$route.query.stockSymbol"
          />
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import SearchForm from "../components/SearchForm.vue";

export default {
  components: {
    SearchForm,
  },
};
</script>
