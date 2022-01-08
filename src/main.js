/*
 * @Description: the app initialiser
 * @Version: 1.0.3.20220105
 * @Author: Arvin Zhao
 * @Date: 2021-12-06 21:52:09
 * @Last Editors: Arvin Zhao
 * @LastEditTime: 2022-01-05 03:56:02
 */

import { createApp } from "vue";
import {
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from "vue-router";
import smoothscroll from "smoothscroll-polyfill";

import App from "./App.vue";
import global from "./lib/global.js";

smoothscroll.polyfill();
createApp(App)
  .use(
    createRouter({
      history: process.env.IS_ELECTRON
        ? createWebHashHistory()
        : createWebHistory(),
      routes: [
        {
          path: "/",
          component: () => import("./views/Home.vue"),
          name: global.common.HOME_VIEW,
        },
        {
          path: `/${global.common.SEARCH_RESULTS_VIEW}`,
          component: () => import("./views/SearchResults.vue"),
          name: global.common.SEARCH_RESULTS_VIEW,
        },
      ],
    })
  )
  .mount("#app");
