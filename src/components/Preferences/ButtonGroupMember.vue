<!--
 * @Description: a member component of a button group enabling single selection
 * @Version: 1.0.0.20220129
 * @Author: Arvin Zhao
 * @Date: 2022-01-24 12:26:24
 * @Last Editors: Arvin Zhao
 * @LastEditTime: 2022-01-29 22:13:51
-->

<template>
  <input
    @change="$emit('selectionChanged', $event.target.id)"
    :id="id"
    :name="group"
    :value="value"
    type="radio"
  />
  <label :for="id" class="e-btn">{{ value }}</label>
</template>

<script>
export default {
  emits: ["selectionChanged"],
  props: {
    group: String,
    id: String,
    value: String,
  },
};
</script>
