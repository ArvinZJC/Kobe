<!--
 * @Description: the preference view
 * @Version: 1.0.0.20220121
 * @Author: Arvin Zhao
 * @Date: 2022-01-16 12:59:49
 * @Last Editors: Arvin Zhao
 * @LastEditTime: 2022-01-21 10:51:51
-->

<template>
  <main class="container-view">
    <div class="h-screen">
      <ejs-tab
        :animation="{
          previous: {
            effect: global.common.SF_FADE_IN,
            duration: global.common.ANIMATION_DURATION,
            easing: global.common.EASE,
          },
          next: {
            effect: global.common.SF_FADE_IN,
            duration: global.common.ANIMATION_DURATION,
            easing: global.common.EASE,
          },
        }"
        headerPlacement="Left"
      >
        <e-tabitems>
          <e-tabitem :content="content0" :header="headerGeneral" />
          <e-tabitem :content="content1" :header="headerSearchEngine" />
        </e-tabitems>
      </ejs-tab>
    </div>
  </main>
</template>

<script>
import {
  TabComponent,
  TabItemsDirective,
  TabItemDirective,
} from "@syncfusion/ej2-vue-navigations";

import global from "../lib/global.js";
import * as zhCN from "../locales/zh-CN.json";

export default {
  components: {
    "e-tabitem": TabItemDirective,
    "e-tabitems": TabItemsDirective,
    "ejs-tab": TabComponent,
  },
  data() {
    return {
      content0:
        "ASP.NET is an open-source server-side web application framework designed for web development to produce " +
        "dynamic web pages. It was developed by Microsoft to allow programmers to build dynamic web sites, web applications " +
        "and web services. It was first released in January 2002 with version 1.0 of the .NET Framework, and is the successor " +
        "to Microsoft's Active Server Pages (ASP) technology. ASP.NET is built on the Common Language Runtime (CLR), allowing " +
        "programmers to write ASP.NET code using any supported .NET language. The ASP.NET SOAP extension framework allows " +
        "ASP.NET components to process SOAP messages.",
      content1:
        "The ASP.NET MVC is a web application framework developed by Microsoft, which implements the " +
        "model–view–controller (MVC) pattern. It is open-source software, apart from the ASP.NET Web Forms component which is " +
        "proprietary. In the later versions of ASP.NET, ASP.NET MVC, ASP.NET Web API, and ASP.NET Web Pages (a platform using " +
        "only Razor pages) will merge into a unified MVC 6.The project is called ASP.NET vNext.",
      global,
      headerGeneral: {
        iconCss: "e-settings",
        text: zhCN.default.generalSection,
      },
      headerSearchEngine: {
        iconCss: "e-eye",
        text: zhCN.default.searchEngineSection,
      },
    };
  },
  mounted() {
    document.title = zhCN.default.preferences;
  },
};
</script>
