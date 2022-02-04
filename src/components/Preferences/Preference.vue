<!--
 * @Description: the preference component
 * @Version: 1.0.0.20220204
 * @Author: Arvin Zhao
 * @Date: 2022-02-01 15:19:10
 * @Last Editors: Arvin Zhao
 * @LastEditTime: 2022-02-04 20:24:41
-->

<template>
  <div class="container-preference-text">
    <h1 class="text-primary-header">{{ header }}</h1>
    <p class="text-secondary-explanation">{{ explanation }}</p>
  </div>
  <div class="container-preference-options">
    <!-- Button group preference options. -->
    <div v-if="type === global.common.BUTTON_GROUP" class="e-btn-group">
      <ButtonGroupMember
        v-for="option in options"
        @selectionChanged="selectionChangedHandler"
        :group="header"
        :icon="option.icon"
        :id="option.id"
        :key="option.id"
        :value="option.value"
      />
    </div>
    <!-- Date picker preference options. -->
    <ejs-tooltip
      v-if="type === global.common.DATE_PICKER"
      :content="`${zhCN.default.dateFormatTooltip}，${zhCN.default.minDateTooltip}`"
    >
      <ejs-datepicker
        @change="changeDate"
        :allowEdit="false"
        :dayHeaderFormat="global.common.SF_NARROW"
        :max="new Date()"
        :min="new Date(global.common.MIN_MIN_DATE)"
        :ref="options.id"
        :showClearButton="false"
        :strictMode="true"
        :value="value"
      />
    </ejs-tooltip>
    <!-- Slider preference options. -->
    <ejs-slider
      v-if="type === global.common.SLIDER"
      @changed="changeSliderValue"
      @created="setInitialSliderValue"
      :max="options.max"
      :min="options.min"
      :ref="options.id"
      :ticks="{
        largeStep: options.largeStep,
        placement: global.common.SF_BEFORE,
        showSmallTicks: true,
        smallStep: options.smallStep,
      }"
      :value="value"
    />
  </div>
</template>

<script>
import { DatePickerComponent } from "@syncfusion/ej2-vue-calendars";
import { SliderComponent } from "@syncfusion/ej2-vue-inputs";
import { TooltipComponent } from "@syncfusion/ej2-vue-popups";

import ButtonGroupMember from "./ButtonGroupMember.vue";
import global from "../../lib/global.js";
import { changePreference } from "../../lib/preferences.js";
import * as zhCN from "../../locales/zh-CN.json";

export default {
  components: {
    ButtonGroupMember,
    "ejs-datepicker": DatePickerComponent,
    "ejs-slider": SliderComponent,
    "ejs-tooltip": TooltipComponent,
  },
  methods: {
    /**
     * Change the date.
     */
    changeDate() {
      changePreference(
        new Date(this.$refs[this.options.id].ej2Instances.value),
        this.options.id,
        this.options.value
      );
    }, // end function changeDate

    /**
     * Change the slider value.
     */
    changeSliderValue() {
      changePreference(
        this.$refs[this.options.id].ej2Instances.value,
        this.options.id,
        this.options.value
      );
    }, // end function changeSliderValue

    /**
     * Set the initial slider value.
     *
     * NOTE: the initial slider value is set here to avoid the wrong slider position while initialising the value in the template.
     */
    setInitialSliderValue() {
      this.$refs[this.options.id].ej2Instances.value = this.value;
    }, // end function setInitialSliderValue
  },
  props: {
    explanation: String,
    header: String,
    options: Object,
    selectionChangedHandler: Function,
    type: String,
    value: [Date, Number],
  },
  data() {
    return { global, zhCN };
  },
};
</script>
