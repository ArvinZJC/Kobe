<!--
 * @Description: the home view
 * @Version: 1.0.0.20211229
 * @Author: Arvin Zhao
 * @Date: 2021-12-11 18:56:32
 * @Last Editors: Arvin Zhao
 * @LastEditTime: 2021-12-29 00:29:35
-->

<template>
  <main class="container-view">
    <div
      class="container-block flex h-screen items-center justify-center py-4 sm:py-6 lg:py-8"
    >
      <SearchForm />
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
