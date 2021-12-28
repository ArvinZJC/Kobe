/*
 * @Description: the app initialiser
 * @Version: 1.0.1.20211227
 * @Author: Arvin Zhao
 * @Date: 2021-12-06 21:52:09
 * @Last Editors: Arvin Zhao
 * @LastEditTime: 2021-12-28 12:53:52
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
import Home from "./views/Home.vue";
import SearchResults from "./views/SearchResults.vue";

smoothscroll.polyfill();
createApp(App)
  .use(
    createRouter({
      history: process.env.IS_ELECTRON
        ? createWebHashHistory()
        : createWebHistory(),
      routes: [
        { path: "/", component: Home, name: global.common.HOME_VIEW },
        {
          path: `/${global.common.SEARCH_RESULTS_VIEW}`,
          component: SearchResults,
          name: global.common.SEARCH_RESULTS_VIEW,
        },
      ],
    })
  )
  .mount("#app");
