<!--
 * @Description: the home view
 * @Version: 1.0.3.20220307
 * @Author: Arvin Zhao
 * @Date: 2021-12-11 18:56:32
 * @Last Editors: Arvin Zhao
 * @LastEditTime: 2022-03-07 14:33:26
-->

<template>
  <main
    class="container-view px-block py-block flex items-center justify-center"
  >
    <SearchForm :isBarLayout="false" />
  </main>
</template>

<script>
import SearchForm from "../components/SearchForm.vue";
import * as zhCN from "../locales/zh-CN.json";

export default {
  components: { SearchForm },
  mounted() {
    document.title = zhCN.default.home;
  },
};
</script>
