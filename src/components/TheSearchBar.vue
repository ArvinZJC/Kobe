<!--
 * @Description: the search bar component
 * @Version: 1.0.0.20211213
 * @Author: Arvin Zhao
 * @Date: 2021-12-12 05:44:32
 * @Last Editors: Arvin Zhao
 * @LastEditTime: 2021-12-16 16:55:42
-->

<template>
  <form class="space-y-6" action="#" method="POST">
    <ejs-autocomplete placeholder="股票代码" />
  </form>
</template>

<script>
import { AutoCompleteComponent } from "@syncfusion/ej2-vue-dropdowns";

export default {
  components: {
    "ejs-autocomplete": AutoCompleteComponent,
  },
};
</script>
