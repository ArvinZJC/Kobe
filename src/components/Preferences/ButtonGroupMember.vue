<!--
 * @Description: a member component of a button group enabling single selection
 * @Version: 1.0.0.20220130
 * @Author: Arvin Zhao
 * @Date: 2022-01-24 12:26:24
 * @Last Editors: Arvin Zhao
 * @LastEditTime: 2022-01-30 22:35:16
-->

<template>
  <input
    @change="$emit('selectionChanged', $event.target.id)"
    :id="id"
    :name="group"
    :value="value"
    type="radio"
  />
  <label :for="id" class="e-btn">
    <div class="flex items-center">
      <component :is="icon" class="h-4 mr-1 w-4" />
      <span>{{ value }}</span>
    </div>
  </label>
</template>

<script>
export default {
  emits: ["selectionChanged"],
  props: {
    group: String,
    icon: Object,
    id: String,
    value: String,
  },
};
</script>
