<!--
 * @Description: the home view
 * @Version: 1.0.1.20220221
 * @Author: Arvin Zhao
 * @Date: 2021-12-11 18:56:32
 * @Last Editors: Arvin Zhao
 * @LastEditTime: 2022-02-21 21:12:34
-->

<template>
  <main class="container-view">
    <div class="px-block py-block flex h-screen items-center justify-center">
      <SearchForm :isBarLayout="false" />
    </div>
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
