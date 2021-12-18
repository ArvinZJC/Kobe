<!--
 * @Description: the root component
 * @Version: 1.0.0.20211218
 * @Author: Arvin Zhao
 * @Date: 2021-12-06 21:52:09
 * @Last Editors: Arvin Zhao
 * @LastEditTime: 2021-12-18 22:09:31
-->

<template>
  <transition
    enter-active-class="motion-safe:transition-opacity-300 ease-out"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="motion-safe:transition-opacity-300 ease-in"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <main class="container-view">
      <Home />
    </main>
  </transition>
</template>

<script>
import Home from "./views/Home.vue";

export default {
  components: {
    Home,
  },
};
</script>

<!-- AutoComplete, Button, DateRangePicker, and Tooltip. -->
<style>
@import "../node_modules/@syncfusion/ej2-base/styles/tailwind.css";
@import "../node_modules/@syncfusion/ej2-buttons/styles/tailwind.css";
@import "../node_modules/@syncfusion/ej2-inputs/styles/tailwind.css";
@import "../node_modules/@syncfusion/ej2-lists/styles/tailwind.css";
@import "../node_modules/@syncfusion/ej2-popups/styles/tailwind.css";
@import "../node_modules/@syncfusion/ej2-vue-buttons/styles/tailwind.css";
@import "../node_modules/@syncfusion/ej2-vue-calendars/styles/tailwind.css";
@import "../node_modules/@syncfusion/ej2-vue-dropdowns/styles/tailwind.css";
@import "../node_modules/@syncfusion/ej2-vue-grids/styles/tailwind.css";
@import "../node_modules/@syncfusion/ej2-vue-popups/styles/tailwind.css";
</style>
