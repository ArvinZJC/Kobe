<!--
 * @Description: the preference component
 * @Version: 1.0.0.20220205
 * @Author: Arvin Zhao
 * @Date: 2022-02-01 15:19:10
 * @Last Editors: Arvin Zhao
 * @LastEditTime: 2022-02-05 20:53:49
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
    <!-- Drop down list preference options. -->
    <ejs-dropdownlist
      v-if="type === global.common.DROP_DOWN_LIST"
      @change="changeItemValue"
      :dataSource="options.data"
      :fields="{ text: 'text', value: 'value' }"
      :ref="options.id"
      :value="value"
    />
    <!-- Slider preference options. -->
    <ejs-slider
      v-if="type === global.common.SLIDER"
      @changed="changeItemValue"
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
    <!-- Date picker preference options. -->
    <ejs-tooltip
      v-if="type === global.common.DATE_PICKER"
      :content="`${zhCN.default.dateFormatTooltip}，${zhCN.default.minDateTooltip}`"
    >
      <ejs-datepicker
        @change="changeDate"
        @renderDayCell="disableWeekends"
        :allowEdit="false"
        :dayHeaderFormat="global.common.SF_NARROW"
        :max="new Date()"
        :min="
          new Date(
            `${global.common.MIN_MIN_DATE}${global.common.DAY_TIME_START}`
          )
        "
        :ref="options.id"
        :showClearButton="false"
        :value="value"
      />
    </ejs-tooltip>
  </div>
</template>

<script>
import { DatePickerComponent } from "@syncfusion/ej2-vue-calendars";
import { DropDownListComponent } from "@syncfusion/ej2-vue-dropdowns";
import { SliderComponent } from "@syncfusion/ej2-vue-inputs";
import { TooltipComponent } from "@syncfusion/ej2-vue-popups";

import ButtonGroupMember from "./ButtonGroupMember.vue";
import global from "../../lib/global.js";
import { toDateStr } from "../../lib/utils";
import { changePreference } from "../../lib/preferences.js";
import * as zhCN from "../../locales/zh-CN.json";

export default {
  components: {
    ButtonGroupMember,
    "ejs-datepicker": DatePickerComponent,
    "ejs-dropdownlist": DropDownListComponent,
    "ejs-slider": SliderComponent,
    "ejs-tooltip": TooltipComponent,
  },
  methods: {
    /**
     * Change the date.
     */
    changeDate() {
      changePreference(
        toDateStr(this.$refs[this.options.id].ej2Instances.value),
        this.options.id,
        this.options.value
      );
    }, // end function changeDate

    /**
     * Change the selected item value.
     */
    changeItemValue() {
      changePreference(
        this.$refs[this.options.id].ej2Instances.value,
        this.options.id,
        this.options.value
      );
    }, // end function changeItemValue

    /**
     * Disable the weekends in the date range picker.
     * @param args the event arguments of rendering day cells.
     */
    disableWeekends(args) {
      if (args.date.getDay() === 0 || args.date.getDay() === 6) {
        args.isDisabled = true;
      } // end if
    }, // end function disableWeekends

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
