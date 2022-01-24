<!--
 * @Description: a member component of a button group enabling single selection
 * @Version: 1.0.0.20220124
 * @Author: Arvin Zhao
 * @Date: 2022-01-24 12:26:24
 * @Last Editors: Arvin Zhao
 * @LastEditTime: 2022-01-24 13:49:30
-->

<template>
  <input :id="id" :name="group" :value="value" type="radio" />
  <label :for="id" class="e-btn">{{ value }}</label>
</template>

<script>
export default {
  props: {
    group: String,
    id: String,
    value: String,
  },
};
</script>
