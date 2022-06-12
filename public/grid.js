/*
 * @Description: the grid extension
 * @Version: 1.0.1.20220612
 * @Author: Arvin Zhao
 * @Date: 2022-03-06 19:55:23
 * @Last Editors: Arvin Zhao
 * @LastEditTime: 2022-06-12 17:32:36
 */

self.addEventListener(
  "message",
  (e) => {
    const commonColumnOptions = {
      autoFit: true,
      headerTextAlign: e.data.global.SF_ALIGN_LEFT,
      maxWidth: e.data.global.MAX_COLUMN_WIDTH,
      minWidth: e.data.global.MIN_COLUMN_WIDTH,
      textAlign: e.data.global.SF_ALIGN_RIGHT,
      type: e.data.global.SF_NUM,
      width: e.data.global.MIN_COLUMN_WIDTH,
    };
    const dayVolumeColumns = [];

    for (
      var date = new Date(`${e.data.startDate}${e.data.global.DAY_TIME_START}`);
      date <= new Date(`${e.data.endDate}${e.data.global.DAY_TIME_START}`);

    ) {
      const day = date.getDay();

      if (day !== 0 && day !== 6) {
        const dateStr = [
          date.getFullYear(),
          date.getMonth() + 1,
          date.getDate(),
        ].join("-");
        var dayStr = "";

        switch (day) {
          case 1: {
            dayStr = e.data.zhHansCn.default.monday;
            break;
          }
          case 2: {
            dayStr = e.data.zhHansCn.default.tuesday;
            break;
          }
          case 3: {
            dayStr = e.data.zhHansCn.default.wednesday;
            break;
          }
          case 4: {
            dayStr = e.data.zhHansCn.default.thursday;
            break;
          }
          case 5: {
            dayStr = e.data.zhHansCn.default.friday;
            break;
          }
          default: {
            dayStr = e.data.zhHansCn.default.unknown;
          }
        } // end switch-case

        dayVolumeColumns.push({
          ...commonColumnOptions,
          field: dateStr,
          format: `N${e.data.global.DEFAULT_DAY_VOLUME_DECIMAL_POINTS}`,
          headerText: `${dateStr}（${dayStr}）`,
        });
      } // end if

      date.setDate(date.getDate() + 1);
    } // end for

    self.postMessage({
      columns: [
        {
          ...commonColumnOptions,
          field: e.data.global.STRIKE_PRICE_KEY,
          format: "N2",
          headerText: e.data.zhHansCn.default.strikePriceColumnHeader,
        },
        {
          ...commonColumnOptions,
          field: e.data.global.TOTAL_VOLUME_KEY,
          format: `N${e.data.global.DEFAULT_TOTAL_VOLUME_DECIMAL_POINTS}`,
          headerText: e.data.zhHansCn.default.totalVolumeColumnHeader,
        },
        {
          columns: dayVolumeColumns,
          headerText: e.data.zhHansCn.default.dayVolumeStackedColumnHeader,
          textAlign: e.data.global.SF_ALIGN_CENTRE,
        },
      ],
    });
  },
  false
);
