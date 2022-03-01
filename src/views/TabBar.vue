<!--
 * @Description: the tab bar view
 * @Version: 1.1.0.20220301
 * @Author: Arvin Zhao
 * @Date: 2022-02-19 14:17:56
 * @Last Editors: Arvin Zhao
 * @LastEditTime: 2022-03-01 14:24:49
-->

<template>
  <main :id="global.common.TAB_BAR_AREA_ID" class="container-tab-bar">
    <!-- The window control area on macOS. -->
    <div
      v-if="platform === global.common.MACOS && !isFullScreen"
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
      <!-- The button for opening a new tab item. -->
      <button
        @click="openNewTabItem(null)"
        :class="[
          'e-icons e-plus ml-10',
          platform === global.common.MACOS
            ? 'btn-tab-bar-mac mr-2 rounded'
            : 'btn-tab-bar-win',
        ]"
        :title="`${zhCN.default.open}${zhCN.default.newTabItem}`"
      />
      <!-- The button for opening the app menu. -->
      <button
        @click="popUpAppMenu"
        v-if="platform === global.common.WINDOWS"
        :id="global.common.APP_MENU_BUTTON_ID"
        :title="`${zhCN.default.open}${zhCN.default.appMenu}`"
        class="btn-tab-bar-win e-icons e-menu"
      />
    </div>
    <!-- The window control area on Windows. -->
    <div
      v-if="platform === global.common.WINDOWS && !isFullScreen"
      :id="global.common.WIN_CONTROL_AREA_ID"
      class="flex-none w-[137.4px]"
    >
      <!-- TODO: titleBarOverlay temp workaround. -->
      <div class="flex">
        <button
          @click="minimiseWin"
          :title="zhCN.default.minimise"
          class="btn-tab-bar-win e-icons e-intermediate-state"
          tabindex="-1"
        />
        <button
          @click="maximiseOrRestoreWin"
          :title="maximiseOrRestoreButtonTitle"
          class="btn-tab-bar-win flex items-center justify-center"
          tabindex="-1"
        >
          <img
            :alt="maximiseOrRestoreButtonTitle"
            :src="maximiseOrRestoreButtonImage"
            class="h-4"
            draggable="false"
          />
        </button>
        <button
          @click="closeWin"
          :title="zhCN.default.close"
          class="btn-tab-bar-win focus:bg-[#901326] hover:bg-[#e81123] e-close e-icons"
          tabindex="-1"
        />
      </div>
    </div>
  </main>
</template>

<script>
import {
  TabComponent,
  TabItemDirective,
  TabItemsDirective,
} from "@syncfusion/ej2-vue-navigations";

import MaximiseIcon from "../assets/maximise.png";
import RestoreIcon from "../assets/restore.png";
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
        this.closeWin();
      } else {
        window[global.common.IPC_RENDERER_API_KEY].send(
          global.common.CLOSE_TAB_ITEM,
          Number(args.removedItem.dataset.id)
        );
      } // end if...else
    }, // end function closeTabItem

    /**
     * Close the app window.
     * TODO: titleBarOverlay temp workaround.
     * @param {object} args the click event arguments.
     */
    closeWin(args) {
      if (args != null) {
        args.target.blur();
      } // end if

      window[global.common.IPC_RENDERER_API_KEY].send(
        global.common.IPC_SEND,
        global.common.CLOSE_WIN
      );
    }, // end function closeWin

    /**
     * Drag a tab item.
     * @param {object} args the drag event arguments.
     */
    dragTabItem(args) {
      this.switchTabItem(Number(args.draggedItem.dataset.id));
    }, // end function dragTabItem

    /**
     * Maximise or restore the app window.
     * TODO: titleBarOverlay temp workaround.
     * @param {object} args the click event arguments.
     */
    maximiseOrRestoreWin(args) {
      args.target.nodeName === "BUTTON"
        ? args.target.blur()
        : args.target.parentElement.blur();
      window[global.common.IPC_RENDERER_API_KEY].send(
        global.common.IPC_SEND,
        global.common.MAXIMISE_OR_RESTORE_WIN
      );
    }, // end function maximiseOrRestoreWin

    /**
     * Minimise the app window.
     * TODO: titleBarOverlay temp workaround.
     * @param {object} args the click event arguments.
     */
    minimiseWin(args) {
      args.target.blur();
      window[global.common.IPC_RENDERER_API_KEY].send(
        global.common.IPC_SEND,
        global.common.MINIMISE_WIN
      );
    }, // end function minimiseWin

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

    /**
     * Pop up the app menu.
     */
    popUpAppMenu() {
      const appMenuButton = document.getElementById(
        global.common.APP_MENU_BUTTON_ID
      );

      if (appMenuButton != null) {
        const appMenuButtonRect = appMenuButton.getBoundingClientRect();
        const appMenuPosition = {};

        appMenuPosition[global.common.TAG_KEY] = global.common.POP_UP_APP_MENU;
        appMenuPosition[global.common.APP_MENU_POSITION_KEY] = {
          x: Math.round(appMenuButtonRect.left),
          y: Math.round(appMenuButtonRect.bottom),
        };
        window[global.common.IPC_RENDERER_API_KEY].send(
          global.common.IPC_SEND,
          appMenuPosition
        );
      } // end if
    }, // end function popUpAppMenu

    /**
     * React to the behaviour of maximising or restoring the window
     * TODO: titleBarOverlay temp workaround.
     * @param {string} data the ID data sent via the IPC channel.
     */
    reactToMaximiseOrRestore(data) {
      if (data === global.common.MAXIMISE_WIN) {
        this.maximiseOrRestoreButtonImage = RestoreIcon;
        this.maximiseOrRestoreButtonTitle = zhCN.default.restore;
      } // end if

      if (data === global.common.RESTORE_WIN) {
        this.maximiseOrRestoreButtonImage = MaximiseIcon;
        this.maximiseOrRestoreButtonTitle = zhCN.default.maximise;
      } // end if
    }, // end function reactToMaximiseOrRestore

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
      const winControlArea = this.isFullScreen
        ? { offsetWidth: 0 }
        : document.getElementById(global.common.WIN_CONTROL_AREA_ID);

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

      /* Programmatically scroll the scroll bar's to the right end to avoid preventing dragging the app window. */
      for (const scrollRightNav of document.getElementsByClassName(
        global.common.SF_SCROLL_RIGHT_NAV_CLASS
      )) {
        scrollRightNav.click();
      } // end for
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
      isFullScreen: false,
      maximiseOrRestoreButtonImage: MaximiseIcon, // TODO: titleBarOverlay temp workaround.
      maximiseOrRestoreButtonTitle: zhCN.default.maximise, // TODO: titleBarOverlay temp workaround.
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
        this.reactToMaximiseOrRestore(data); // TODO: titleBarOverlay temp workaround.

        if (data === global.common.ENTER_FULL_SCREEN) {
          this.isFullScreen = true;
        } // end if

        if (data === global.common.EXIT_FULL_SCREEN) {
          this.isFullScreen = false;
          setTimeout(
            () =>
              window[global.common.IPC_RENDERER_API_KEY].send(
                global.common.IPC_SEND,
                global.common.PATCH_EXIT_FULL_SCREEN
              ),
            50
          );
        } // end if

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
    window.addEventListener("dblclick", (args) => {
      if (this.platform === global.common.MACOS) {
        var isNonDraggable = false;

        for (const elementPath of args.path) {
          if (
            elementPath.classList != null &&
            (elementPath.classList.contains("btn-tab-bar-mac") ||
              elementPath.classList.contains("non-draggable-area"))
          ) {
            isNonDraggable = true;
            break;
          } // end if
        } // end for

        if (!isNonDraggable) {
          window[global.common.IPC_RENDERER_API_KEY].send(
            global.common.IPC_SEND,
            global.common.MAXIMISE_OR_RESTORE_WIN
          );
        } // end if
      } // end if
    });
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
