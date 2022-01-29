/*
 * @Description: the app initialiser
 * @Version: 1.0.0.20220129
 * @Author: Arvin Zhao
 * @Date: 2021-12-06 21:52:09
 * @Last Editors: Arvin Zhao
 * @LastEditTime: 2022-01-29 18:04:16
 */

import { createApp } from "vue";
import { createRouter, createWebHashHistory } from "vue-router";
import smoothscroll from "smoothscroll-polyfill";

import App from "./App.vue";
import global from "./lib/global.js";

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
        },
      ],
    })
  )
  .mount(`#${global.common.APP_SCHEME}`);
