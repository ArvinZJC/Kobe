<!--
 * @Description: the search result view
 * @Version: 1.0.6.20220305
 * @Author: Arvin Zhao
 * @Date: 2021-12-27 20:38:08
 * @Last Editors: Arvin Zhao
 * @LastEditTime: 2022-03-05 23:50:43
-->

<template>
  <main class="container-view">
    <!-- The search result grid component. -->
    <SearchResultGrid
      :endDate="this.$route.query.endDate"
      :startDate="this.$route.query.startDate"
      :stockSymbol="this.$route.query.stockSymbol"
    />
    <!-- The button for scrolling to the top. -->
    <transition
      enter-active-class="motion-safe:transition-300 ease-out"
      enter-from-class="float-down-1"
      enter-to-class="float-up"
      leave-active-class="motion-safe:transition-300 ease-in"
      leave-from-class="float-up"
      leave-to-class="float-down-1"
    >
      <button
        v-if="!isScrollToTopDismissed"
        @click="scrollToTop"
        :title="zhCN.default.scrollToTopButtonTitle"
        class="btn-action-right btn-round bottom-20 bg-opacity-90 dark:bg-opacity-90 shadow-xl"
        id="scroll-to-top"
        type="button"
      >
        <span class="e-arrow-up e-btn-icon e-icons text-lg" />
      </button>
    </transition>
    <!-- The search bar. -->
    <div
      :id="global.common.SEARCH_BAR_ID"
      class="container-bbar motion-safe:transition-300"
    >
      <div class="px-block">
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
import SearchResultGrid from "../components/SearchResultGrid.vue";
import global from "../lib/global.js";
import * as zhCN from "../locales/zh-CN.json";

export default {
  components: {
    SearchForm,
    SearchResultGrid,
  },
  methods: {
    /**
     * Handle scrolling behaviour.
     */
    handleScroll() {
      // Adjust the backdrop blur filter and box shadow to the search bar if the view is scrolled vertically for a specified distance.
      if (
        this.searchBar != null &&
        window.innerHeight + window.scrollY <
          document.body.offsetHeight - this.searchBar.offsetHeight / 4
      ) {
        this.searchBar.classList.add("bg-blur", "shadow-xl-reverse");
        this.searchBar.classList.remove("bg-opacity-0", "dark:bg-opacity-0");
      } else {
        this.searchBar.classList.add("bg-opacity-0", "dark:bg-opacity-0");
        this.searchBar.classList.remove("bg-blur", "shadow-xl-reverse");
      } // end if...else

      var temp; // A temp record of the expected dismissing status of the button for scrolling to the top.

      // Show the button for scrolling to the top if the view is scrolled vertically for a specified distance.
      if (window.scrollY < screen.height / 3) {
        temp = true;
      } else {
        temp = false;
      } // end if...else

      // Assign the value only if it is different to avoid potential animation loss.
      if (this.isScrollToTopDismissed !== temp) {
        this.isScrollToTopDismissed = temp;
      } // end if
    }, // end function handleScroll

    /**
     * Scroll to the top.
     */
    scrollToTop() {
      window.scroll({ top: 0, left: 0, behavior: global.common.SMOOTH_SCROLL });
    }, // end function scrollToTop
  },
  props: {
    endDate: String,
    startDate: String,
    stockName: String,
    stockSymbol: String,
  },
  data() {
    return {
      appName: "",
      global,
      isScrollToTopDismissed: true,
      searchBar: null,
      zhCN,
    };
  },
  mounted() {
    const dateRange =
      this.startDate +
      (this.startDate === this.endDate ? "" : ` - ${this.endDate}`);

    document.title = `${
      this.stockName === "" ? this.stockSymbol : this.stockName
    }（${dateRange}）`;
    this.searchBar = document.getElementById(global.common.SEARCH_BAR_ID);
    window.addEventListener("scroll", this.handleScroll);
  },
};
</script>
