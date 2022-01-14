/*
 * @Description: the search result data processor to manage the stock's strike prices and volumes
 * @Version: 1.0.0.20220115
 * @Author: Arvin Zhao
 * @Date: 2022-01-05 21:24:48
 * @Last Editors: Arvin Zhao
 * @LastEditTime: 2022-01-15 00:16:24
 */

import fetch from "electron-fetch";
import { DomUtils, parseDocument } from "htmlparser2";
import iconv from "iconv-lite";

import global from "./global.js";

/**
 * Arrange the search results.
 * @param {object} dayVolumes strike prices and volumes for each day in the date range.
 * @param {string} endDate the end date of the date range.
 * @param {string} startDate the start date of the date range.
 * @param {object} totalVolumes strike prices and total volumes for the date range.
 * @returns an array of search result data for the specified grid to show.
 */
function arrangeSearchResults(dayVolumes, endDate, startDate, totalVolumes) {
  var index = 0;
  var rowData;
  var searchResultData = [];

  for (const strikePrice in totalVolumes) {
    rowData = {};
    rowData[global.common.STRIKE_PRICE_KEY] = strikePrice;
    rowData[global.common.TOTAL_VOLUME_KEY] = totalVolumes[strikePrice];

    if (endDate === startDate) {
      rowData[startDate] = totalVolumes[strikePrice];
    } else {
      for (const dateStr in dayVolumes) {
        rowData[dateStr] = dayVolumes[dateStr][strikePrice];
      } // end for
    } // end if...else

    searchResultData[index++] = rowData;
  } // end for

  return searchResultData;
} // end function arrangeSearchResults

/**
 * Create an array of the working dates in the specified date range.
 * @param {string} endDate the end date of the date range.
 * @param {string} startDate the start date of the date range.
 * @returns an array of the working dates in the date range.
 */
function createDateArray(endDate, startDate) {
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

  return dateArray;
} // end function createDateArray

/**
 * Fetch strike prices and volumes from the specific API.
 * @param {string} endDate the end date of the date range.
 * @param {string} startDate the start date of the date range.
 * @param {string} stockSymbol the stock symbol.
 * @returns an object using strike prices as keys and the corresponding volumes as values.
 */
async function fetchFromApi(endDate, startDate, stockSymbol) {
  var volumes = {};

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
      volumes[strikePrice] = volume;
    });
  } catch (e) {
    console.log(e); // TODO:
  } // end try...catch

  return volumes;
} // end function fetchFromApi

/**
 * Get the search result data for the specified grid to show.
 * @param {string} endDate the end date of the date range.
 * @param {string} startDate the start date of the date range.
 * @param {string} stockSymbol the stock symbol.
 * @returns
 */
export async function getSearchResultData(endDate, startDate, stockSymbol) {
  var dayVolumes = {};
  const totalVolumes = await fetchFromApi(endDate, startDate, stockSymbol);

  // No need to retrive the day volumes if the start date is also the end date.
  if (endDate !== startDate) {
    const dateArray = createDateArray(endDate, startDate);
    var count = 0;

    for (const currentDate of dateArray) {
      const dateStr = [
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        currentDate.getDate(),
      ].join("-");

      dayVolumes[dateStr] = await fetchFromApi(dateStr, dateStr, stockSymbol);

      // Sleep for 5 seconds for each 5 requests to mitigate blocking frequent website crawling.
      if (++count % 5 === 0 && dateArray.length > 5) {
        await new Promise((resolve) => setTimeout(resolve, 5000));
      } // end if
    } // end for
  } // end if

  return arrangeSearchResults(dayVolumes, endDate, startDate, totalVolumes);
} // end function getSearchResultData
