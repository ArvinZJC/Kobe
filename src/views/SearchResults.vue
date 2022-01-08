<!--
 * @Description: the search result view
 * @Version: 1.0.0.20220108
 * @Author: Arvin Zhao
 * @Date: 2021-12-27 20:38:08
 * @Last Editors: Arvin Zhao
 * @LastEditTime: 2022-01-08 09:39:45
-->

<template>
  <main class="container-view">
    <!-- The search result area. -->
    <div class="container-block py-4">
      <SearchResultGrid
        :endDate="this.$route.query.endDate"
        :startDate="this.$route.query.startDate"
        :stockSymbol="this.$route.query.stockSymbol"
      />
    </div>
    <!-- Added for the search bar area. -->
    <div class="h-16 w-full" />
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
        class="btn-action btn-round bottom-20 shadow-xl"
        id="scroll-to-top"
        type="button"
      >
        <span class="e-arrow-up e-btn-icon e-icons text-lg" />
      </button>
    </transition>
    <!-- The search bar. -->
    <div
      :id="searchBarId"
      class="bg-blur container-bbar shadow-xl-reverse motion-safe:transition-300"
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
import SearchResultGrid from "../components/SearchResultGrid.vue";

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
      // Apply the backdrop blur filter and box shadow to the search bar if the view is scrolled vertically for a specified distance.
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
      window.scroll({ top: 0, left: 0, behavior: "smooth" });
    }, // end function scrollToTop
  },
  data() {
    return {
      isScrollToTopDismissed: true,
      searchBar: null,
      searchBarId: "search-bar",
    };
  },
  mounted() {
    this.searchBar = document.getElementById(this.searchBarId);
    window.addEventListener("scroll", this.handleScroll);
    // TODO: remove the blur effect if the view is not scrollable after loading the search results; scroll to the top
  },
};
</script>
