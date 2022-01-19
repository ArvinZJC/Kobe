<!--
 * @Description: the preference view
 * @Version: 1.0.0.20220119
 * @Author: Arvin Zhao
 * @Date: 2022-01-16 12:59:49
 * @Last Editors: Arvin Zhao
 * @LastEditTime: 2022-01-19 12:04:38
-->

<template>
  <main class="container-view">TEST</main>
</template>

<script>
import * as zhCN from "../locales/zh-CN.json";

export default {
  mounted() {
    document.title = zhCN.default.preferences;
  },
};
</script>
