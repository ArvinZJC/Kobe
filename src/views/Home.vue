<!--
 * @Description: the home view
 * @Version: 1.0.4.20220612
 * @Author: Arvin Zhao
 * @Date: 2021-12-11 18:56:32
 * @Last Editors: Arvin Zhao
 * @LastEditTime: 2022-06-12 17:41:03
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
import * as zhHansCn from "../locales/zh-Hans-CN.json";

export default {
  components: { SearchForm },
  mounted() {
    document.title = zhHansCn.default.home;
  },
};
</script>
