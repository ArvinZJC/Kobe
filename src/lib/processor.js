/*
 * @Description: the search result data processor to manage the stock's strike prices and volumes
 * @Version: 1.0.0.20220111
 * @Author: Arvin Zhao
 * @Date: 2022-01-05 21:24:48
 * @Last Editors: Arvin Zhao
 * @LastEditTime: 2022-01-11 14:18:04
 */

import fetch from "electron-fetch";
import { DomUtils, parseDocument } from "htmlparser2";
import iconv from "iconv-lite";

import global from "./global.js";

// TODO: comments
export async function getSearchResultData(endDate, startDate, stockSymbol) {
  var dayVolumes = {};
  var searchResultData = [];
  var totalVolumes = {};

  try {
    const response = await fetch(
      `http://market.finance.sina.com.cn/pricehis.php?symbol=${stockSymbol.toLowerCase()}&startdate=${startDate}&enddate=${endDate}`
    );
    const buffer = await response.arrayBuffer();
    const dom = parseDocument(
      iconv.decode(Buffer.from(buffer), "gb2312").toString() // Decode using GB2312 rather than UTF-8 to avoid garbled characters due to the original character set used by the above API.
    );
    const tbody = DomUtils.getElementsByTagName("tbody", dom.children)[0];
    const trArray = DomUtils.getElementsByTagName("tr", tbody.children);

    Array.prototype.forEach.call(trArray, (tr) => {
      var strikePrice;
      const tdArray = DomUtils.getElementsByTagName("td", tr.children);
      var volume;

      Array.prototype.forEach.call(tdArray, (td, tdIndex) => {
        if (tdIndex === 0) {
          strikePrice = DomUtils.innerText(td.children);
        } else if (tdIndex === 1) {
          volume = DomUtils.innerText(td.children);
        } else {
          return; // Ignore the columns "占比" (Index 2) and “占比图” (Index 3).
        } // end nested if...else
      });
      totalVolumes[strikePrice] = volume;
    });
  } catch (e) {
    console.log(e); // TODO:
  } // end try...catch

  var index = 0;
  var rowData;

  // No need to retrive the day volumes if the start date is also the end date.
  if (endDate === startDate) {
    for (const strikePrice in totalVolumes) {
      rowData = {};
      rowData[global.common.STRIKE_PRICE_KEY] = strikePrice;
      rowData[global.common.TOTAL_VOLUME_KEY] = totalVolumes[strikePrice];
      rowData[startDate] = totalVolumes[strikePrice];
      searchResultData[index++] = rowData;
    } // end for

    return searchResultData;
  } // end if

  for (
    var dateArray = [], date = new Date(startDate);
    date <= new Date(endDate);

  ) {
    const day = date.getDay();

    if (day !== 0 && day !== 6) {
      dateArray.push(new Date(date)); // It is necessary to avoid pushing date directly due to variable pointers.
    } // end if

    date.setDate(date.getDate() + 1);
    date.setHours(0);
  } // end for

  index = 0;

  for (const currentDate of dateArray) {
    try {
      const dateStr = [
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        currentDate.getDate(),
      ].join("-");
      const response = await fetch(
        `http://market.finance.sina.com.cn/pricehis.php?symbol=${stockSymbol.toLowerCase()}&startdate=${dateStr}&enddate=${dateStr}`
      );
      const buffer = await response.arrayBuffer();
      const dom = parseDocument(
        iconv.decode(Buffer.from(buffer), "gb2312").toString()
      );
      const tbody = DomUtils.getElementsByTagName("tbody", dom.children)[0];
      const trArray = DomUtils.getElementsByTagName("tr", tbody.children);
      var dayVolume = {};

      Array.prototype.forEach.call(trArray, (tr) => {
        var strikePrice;
        const tdArray = DomUtils.getElementsByTagName("td", tr.children);
        var volume;

        Array.prototype.forEach.call(tdArray, (td, tdIndex) => {
          if (tdIndex === 0) {
            strikePrice = DomUtils.innerText(td.children);
          } else if (tdIndex === 1) {
            volume = DomUtils.innerText(td.children);
          } else {
            return; // Ignore the columns "占比" (Index 2) and “占比图” (Index 3).
          } // end nested if...else
        });
        dayVolume[strikePrice] = volume;
        dayVolumes[dateStr] = dayVolume;
      });
    } catch (e) {
      console.log(e); // TODO:
    } // end try...catch

    // Sleep for 10 sec for each 10 requests to mitigate blocking frequent website crawling.
    if (++index % 10 === 0) {
      await new Promise((resolve) => setTimeout(resolve, 10000));
    } // end if
  }

  index = 0;

  for (const strikePrice in totalVolumes) {
    rowData = {};
    rowData[global.common.STRIKE_PRICE_KEY] = strikePrice;
    rowData[global.common.TOTAL_VOLUME_KEY] = totalVolumes[strikePrice];

    for (const dateStr in dayVolumes) {
      rowData[dateStr] = dayVolumes[dateStr][strikePrice];
    } // end for

    searchResultData[index++] = rowData;
  } // end for

  return searchResultData;
} // end function getSearchResultData
