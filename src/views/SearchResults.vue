<!--
 * @Description: the search result view
 * @Version: 1.0.0.20211228
 * @Author: Arvin Zhao
 * @Date: 2021-12-27 20:38:08
 * @Last Editors: Arvin Zhao
 * @LastEditTime: 2021-12-28 12:52:47
-->

<template>
  <div
    class="container-block flex h-screen items-center justify-center py-4 sm:py-6 lg:py-8"
  >
    <div class="max-w-md space-y-8 w-full">
      <img
        :src="logo"
        alt="App logo"
        class="h-24 sm:h-32 lg:h-40 mx-auto w-auto"
      />
      <SearchForm />
    </div>
  </div>
</template>

<script>
import Logo from "../assets/logo.png";
import LogoDark from "../assets/logo_dark.png";
import SearchForm from "../components/SearchForm.vue";

export default {
  components: {
    SearchForm,
  },
  data() {
    return { logo: null };
  },
  mounted() {
    this.logo = LogoDark;
    this.logo = Logo; // TODO: dark mode
    console.log(this.$route.query);
  },
};
</script>
