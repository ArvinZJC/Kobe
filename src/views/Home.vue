<!--
 * @Description: the home view
 * @Version: 1.0.0.20211213
 * @Author: Arvin Zhao
 * @Date: 2021-12-11 18:56:32
 * @Last Editors: Arvin Zhao
 * @LastEditTime: 2021-12-13 23:32:33
-->

<template>
  <div
    class="container-block flex h-screen items-center justify-center py-4 sm:py-6 lg:py-8"
  >
    <div class="max-w-md space-y-8 w-full">
      <img
        :src="logo"
        alt="App icon"
        class="h-24 sm:h-32 lg:h-40 mx-auto w-auto"
      />
      <TheSearchBar />
    </div>
  </div>
</template>

<script>
import Logo from "../assets/logo.png";
import LogoDark from "../assets/logo_dark.png";
import TheSearchBar from "../components/TheSearchBar.vue";

export default {
  components: {
    TheSearchBar,
  },
  data() {
    return { logo: LogoDark };
  },
  mounted() {
    this.logo = Logo; // TODO: dark mode
  },
};
</script>
