<!--
 * @Description: the button component for scrolling to the top
 * @Version: 1.0.0.20220313
 * @Author: Arvin Zhao
 * @Date: 2022-03-13 14:23:07
 * @Last Editors: Arvin Zhao
 * @LastEditTime: 2022-03-13 15:15:02
-->

<template>
  <transition
    enter-active-class="motion-safe:transition-300 ease-out"
    enter-from-class="float-down-1"
    enter-to-class="float-up"
    leave-active-class="motion-safe:transition-300 ease-in"
    leave-from-class="float-up"
    leave-to-class="float-down-1"
  >
    <button
      v-if="!isDismissed"
      @click="scrollToTop"
      :title="zhCN.default.scrollToTopButtonTitle"
      class="btn-action-right btn-round bottom-20 bg-opacity-90 dark:bg-opacity-90 shadow-xl"
      id="scroll-to-top"
      type="button"
    >
      <span class="e-arrow-up e-btn-icon e-icons text-lg" />
    </button>
  </transition>
</template>

<script>
import global from "../lib/global.js";
import * as zhCN from "../locales/zh-CN.json";

export default {
  methods: {
    /**
     * Scroll to the top.
     */
    scrollToTop() {
      if (this.target != null) {
        this.target.scroll({
          top: 0,
          left: 0,
          behavior: global.common.SMOOTH_SCROLL,
        });
      } // end if
    }, // end function scrollToTop
  },
  props: {
    isDismissed: Boolean,
    target: Element,
  },
  data() {
    return { zhCN };
  },
};
</script>
