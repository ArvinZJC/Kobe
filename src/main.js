/*
 * @Description: the app initialiser
 * @Version: 1.1.0.20220404
 * @Author: Arvin Zhao
 * @Date: 2021-12-06 21:52:09
 * @Last Editors: Arvin Zhao
 * @LastEditTime: 2022-04-04 18:35:19
 */

import { registerLicense } from "@syncfusion/ej2-base";
import { createApp } from "vue";
import { createRouter, createWebHashHistory } from "vue-router";
import smoothscroll from "smoothscroll-polyfill";

import App from "./App.vue";
import global from "./lib/global.js";

registerLicense(process.env.VUE_APP_SF_LICENSE);
smoothscroll.polyfill();
createApp(App)
  .use(
    createRouter({
      history: createWebHashHistory(),
      routes: [
        {
          component: () => import("./views/Home.vue"),
          name: global.common.HOME_VIEW,
          path: "/",
        },
        {
          component: () => import("./views/Preferences.vue"),
          name: global.common.PREFERENCE_VIEW,
          path: `/${global.common.PREFERENCE_VIEW}`,
        },
        {
          component: () => import("./views/SearchResults.vue"),
          name: global.common.SEARCH_RESULT_VIEW,
          path: `/${global.common.SEARCH_RESULT_VIEW}`,
          props: (route) => ({
            endDate: route.query.endDate,
            startDate: route.query.startDate,
            stockName: route.query.stockName,
            stockSymbol: route.query.stockSymbol,
          }),
        },
        {
          component: () => import("./views/TabBar.vue"),
          name: global.common.TAB_BAR_VIEW,
          path: `/${global.common.TAB_BAR_VIEW}`,
        },
        { path: "/:pathMatch(.*)*", redirect: "/" },
      ],
    })
  )
  .mount(`#${global.common.APP_SCHEME}`);
