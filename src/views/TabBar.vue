<!--
 * @Description: the tab bar view
 * @Version: 1.0.0.20220224
 * @Author: Arvin Zhao
 * @Date: 2022-02-19 14:17:56
 * @Last Editors: Arvin Zhao
 * @LastEditTime: 2022-02-24 12:07:10
-->

<template>
  <main :id="global.common.TAB_BAR_AREA_ID" class="container-tab-bar">
    <!-- The window control area on macOS. -->
    <div
      v-if="platform === global.common.MACOS"
      :id="global.common.WIN_CONTROL_AREA_ID"
      class="flex-none w-20"
    />
    <!-- The tab bar tab area. -->
    <div :id="global.common.TAB_BAR_TAB_AREA_ID" class="grow">
      <!-- The tab component. -->
      <ejs-tab
        @onDragStart="dragTabItem"
        @removed="closeTabItem"
        @selected="selectTabItem"
        :allowDragAndDrop="true"
        :dragArea="`#${global.common.TAB_BAR_TAB_AREA_ID}`"
        :ref="global.common.TAB_BAR_TABS_NAME"
        :showCloseButton="true"
        :width="tabBarTabWidth"
      >
        <e-tabitems>
          <e-tabitem
            :header="{ text: zhCN.default.newTabItem }"
            :id="startTabItemId"
            cssClass="non-draggable-area"
          />
        </e-tabitems>
      </ejs-tab>
    </div>
    <!-- The tab bar button area. -->
    <div :id="global.common.TAB_BAR_BUTTON_AREA_ID" class="flex">
      <!-- Preserved for ensuring the frameless window's dragging area. -->
      <div class="w-10" />
      <!-- The button for opening a new tab item. -->
      <button
        @click="openNewTabItem(null)"
        :title="`${zhCN.default.open}${zhCN.default.newTabItem}`"
        class="btn-tab-bar e-icons e-plus mr-2"
      />
      <!-- The button for opening the app menu. -->
      <button
        @click="popUpAppMenu"
        v-if="platform === global.common.WINDOWS"
        :id="global.common.APP_MENU_BUTTON_ID"
        :title="`${zhCN.default.open}${zhCN.default.appMenu}`"
        class="btn-tab-bar e-icons e-menu"
      />
    </div>
    <!-- The window control area on Windows. -->
    <div
      v-if="platform === global.common.WINDOWS"
      :id="global.common.WIN_CONTROL_AREA_ID"
      class="flex-none w-36"
    />
  </main>
</template>

<script>
import {
  TabComponent,
  TabItemDirective,
  TabItemsDirective,
} from "@syncfusion/ej2-vue-navigations";

import global from "../lib/global.js";
import * as zhCN from "../locales/zh-CN.json";

export default {
  components: {
    "e-tabitem": TabItemDirective,
    "e-tabitems": TabItemsDirective,
    "ejs-tab": TabComponent,
  },
  methods: {
    /**
     * Close a tab item.
     * @param {object} args the remove event arguments.
     */
    closeTabItem(args) {
      if (
        this.$refs[global.common.TAB_BAR_TABS_NAME].ej2Instances.items
          .length === 0
      ) {
        window[global.common.IPC_RENDERER_API_KEY].send(
          global.common.IPC_SEND,
          global.common.CLOSE_WIN
        );
      } else {
        window[global.common.IPC_RENDERER_API_KEY].send(
          global.common.CLOSE_TAB_ITEM,
          Number(args.removedItem.dataset.id)
        );
      } // end if...else
    }, // end function closeTabItem

    /**
     * Drag a tab item.
     * @param {object} args the drag event arguments.
     */
    dragTabItem(args) {
      this.switchTabItem(Number(args.draggedItem.dataset.id));
    }, // end function dragTabItem

    /**
     * Open a new tab item.
     * @param {string} url the URL to load.
     */
    openNewTabItem(url) {
      var cssClass = "non-draggable-area";
      const newTabItemIndex =
        this.$refs[global.common.TAB_BAR_TABS_NAME].ej2Instances.items.length;

      window[global.common.IPC_RENDERER_API_KEY].send(
        global.common.NEW_TAB_ITEM,
        url
      );

      if (
        typeof url === "string" &&
        url.includes(global.common.PREFERENCE_VIEW)
      ) {
        cssClass += ` ${global.common.PREFERENCE_VIEW_ID}`;
      } // end if

      this.$refs[global.common.TAB_BAR_TABS_NAME].ej2Instances.addTab(
        [{ cssClass, header: { text: zhCN.default.newTabItem } }],
        newTabItemIndex
      );
      this.$refs[global.common.TAB_BAR_TABS_NAME].ej2Instances.select(
        newTabItemIndex
      );

      const newTabItemId = {};

      newTabItemId[global.common.TAG_KEY] = global.common.GET_NEW_TAB_ITEM_ID;
      newTabItemId[global.common.NEW_TAB_ITEM_INDEX_KEY] = newTabItemIndex;
      window[global.common.IPC_RENDERER_API_KEY].send(
        global.common.IPC_SEND,
        newTabItemId
      );
    }, // end function openNewTabItem

    popUpAppMenu() {
      const appMenuButton = document.getElementById(
        global.common.APP_MENU_BUTTON_ID
      );

      if (appMenuButton != null) {
        const appMenuButtonRect = appMenuButton.getBoundingClientRect();
        const appMenuPosition = {};

        appMenuPosition[global.common.TAG_KEY] = global.common.POP_UP_APP_MENU;
        appMenuPosition[global.common.APP_MENU_POSITION_KEY] = {
          x: appMenuButtonRect.left,
          y: appMenuButtonRect.bottom + 1,
        };
        window[global.common.IPC_RENDERER_API_KEY].send(
          global.common.IPC_SEND,
          appMenuPosition
        );
      } // end if
    }, // end function popUpAppMenu

    /**
     * Select a tab item.
     * @param {object} args the select event arguments.
     */
    selectTabItem(args) {
      this.switchTabItem(Number(args.selectedItem.dataset.id));
    }, // end function selectTabItem

    /**
     * Switch to the specified tab item.
     * @param {number} tabItemId the tab item to switch to.
     */
    switchTabItem(tabItemId) {
      window[global.common.IPC_RENDERER_API_KEY].send(
        global.common.SWITCH_TAB_ITEM,
        tabItemId
      );
    }, // end function switchTabItem

    /**
     * Update the tab bar tab width.
     */
    updateTabBarTabWidth() {
      const tabBarArea = document.getElementById(global.common.TAB_BAR_AREA_ID);
      const tabBarButtonArea = document.getElementById(
        global.common.TAB_BAR_BUTTON_AREA_ID
      );
      const winControlArea = document.getElementById(
        global.common.WIN_CONTROL_AREA_ID
      );

      if (
        tabBarArea != null &&
        tabBarButtonArea != null &&
        winControlArea != null
      ) {
        this.tabBarTabWidth =
          tabBarArea.offsetWidth -
          tabBarButtonArea.offsetWidth -
          winControlArea.offsetWidth; // Using the tab bar tab area's width is inapplicable.
      } // end if
    }, // end function updateTabBarTabWidth

    /**
     * Update the tab item title.
     * @param {number} tabItemId the tab item ID.
     * @param {string} title the title to update.
     */
    updateTabItemTitle(tabItemId, title) {
      for (const tabItem of this.$refs[global.common.TAB_BAR_TABS_NAME]
        .ej2Instances.items) {
        if (tabItem.id === tabItemId) {
          if (tabItem.header.text !== title) {
            tabItem.header.text = title;
            this.$refs[global.common.TAB_BAR_TABS_NAME].ej2Instances.refresh();
          } // end if

          break;
        } // end if
      } // end for
    }, // end function updateTabItemTitle
  },
  data() {
    return {
      global,
      platform: global.common.UNKNOWN,
      startTabItemId: null,
      tabBarTabWidth: "100%",
      zhCN,
    };
  },
  mounted() {
    window[global.common.IPC_RENDERER_API_KEY].receive(
      global.common.IPC_RECEIVE,
      (data) => {
        if (
          typeof data === "object" &&
          Object.prototype.hasOwnProperty.call(
            data,
            global.common.GET_NEW_TAB_ITEM_ID
          )
        ) {
          this.$refs[global.common.TAB_BAR_TABS_NAME].ej2Instances.items[
            data[global.common.NEW_TAB_ITEM_INDEX_KEY]
          ].id = data[global.common.GET_NEW_TAB_ITEM_ID];
          this.$refs[global.common.TAB_BAR_TABS_NAME].ej2Instances.refresh();
        } // end if

        if (
          typeof data === "object" &&
          Object.prototype.hasOwnProperty.call(data, global.common.GET_PLATFORM)
        ) {
          this.platform = data[global.common.GET_PLATFORM];
          this.updateTabBarTabWidth();
        } // end if

        if (
          typeof data === "object" &&
          Object.prototype.hasOwnProperty.call(
            data,
            global.common.SHOW_PREFERENCE_TAB_ITEM
          )
        ) {
          var preferenceTabItemIndex = null;

          for (
            var i = 0;
            i <
            this.$refs[global.common.TAB_BAR_TABS_NAME].ej2Instances.items
              .length;
            i++
          ) {
            if (
              this.$refs[global.common.TAB_BAR_TABS_NAME].ej2Instances.items[
                i
              ].cssClass.includes(global.common.PREFERENCE_VIEW_ID)
            ) {
              preferenceTabItemIndex = i;
              break;
            } // end if
          } // end for

          preferenceTabItemIndex == null
            ? this.openNewTabItem(data[global.common.SHOW_PREFERENCE_TAB_ITEM])
            : this.$refs[global.common.TAB_BAR_TABS_NAME].ej2Instances.select(
                preferenceTabItemIndex
              );
        } // end if
      }
    );
    window[global.common.IPC_RENDERER_API_KEY].receive(
      global.common.TAB_BAR_TABS_UPDATE,
      (tabOptions) => {
        Array.prototype.forEach.call(tabOptions.tabs, (element) => {
          if (tabOptions.confs[element] != null) {
            if (
              tabOptions.confs[element].title !== "" &&
              tabOptions.confs[element].title != null
            ) {
              this.updateTabItemTitle(element, tabOptions.confs[element].title);
            } // end if
          } // end if
        });
      }
    );
    window.addEventListener("load", () => {
      window[global.common.IPC_RENDERER_API_KEY].receive(
        global.common.IPC_RECEIVE,
        (data) => {
          if (
            typeof data === "object" &&
            Object.prototype.hasOwnProperty.call(
              data,
              global.common.GET_START_TAB_ITEM_ID
            )
          ) {
            this.$refs[global.common.TAB_BAR_TABS_NAME].ej2Instances.items[
              this.$refs[
                global.common.TAB_BAR_TABS_NAME
              ].ej2Instances.selectedItem
            ].id = data[global.common.GET_START_TAB_ITEM_ID];
            this.$refs[global.common.TAB_BAR_TABS_NAME].ej2Instances.refresh();
          } // end if
        }
      );
      window[global.common.IPC_RENDERER_API_KEY].send(
        global.common.TAB_BAR_READY
      );
      window[global.common.IPC_RENDERER_API_KEY].send(
        global.common.IPC_SEND,
        global.common.GET_START_TAB_ITEM_ID
      );
    });
    window.addEventListener("resize", () => this.updateTabBarTabWidth());
    window[global.common.IPC_RENDERER_API_KEY].send(
      global.common.IPC_SEND,
      global.common.GET_PLATFORM
    );
  },
};
</script>
