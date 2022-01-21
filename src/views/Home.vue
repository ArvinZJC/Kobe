<!--
 * @Description: the home view
 * @Version: 1.0.0.20220120
 * @Author: Arvin Zhao
 * @Date: 2021-12-11 18:56:32
 * @Last Editors: Arvin Zhao
 * @LastEditTime: 2022-01-20 13:46:02
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

export default {
  components: {
    SearchForm,
  },
  mounted() {
    window[global.common.IPC_RENDERER_API_KEY].receive(
      global.common.IPC_RECEIVE,
      (data) => {
        if (typeof data === "string") {
          document.title = data;
        } // end if
      }
    );
    window[global.common.IPC_RENDERER_API_KEY].send(
      global.common.IPC_SEND,
      global.common.GET_APP_NAME
    );
  },
};
</script>
