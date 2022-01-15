/*
 * @Description: the search result data processor to manage the stock's strike prices and volumes
 * @Version: 1.0.0.20220115
 * @Author: Arvin Zhao
 * @Date: 2022-01-05 21:24:48
 * @Last Editors: Arvin Zhao
 * @LastEditTime: 2022-01-15 21:06:58
 */

import fetch, { FetchError } from "electron-fetch";
import { DomUtils, parseDocument } from "htmlparser2";
import iconv from "iconv-lite";

import global from "./global.js";
import * as zhCN from "../locales/zh-CN.json";

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
  var searchResultData = [];

  if (Object.keys(totalVolumes).length !== 0) {
    for (const strikePrice in totalVolumes) {
      searchResultData[index++] = generateRowData(
        dayVolumes,
        endDate,
        startDate,
        strikePrice,
        totalVolumes
      );
    } // end for
  } // end if...else

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
 * @returns an object using strike prices as keys and the corresponding volumes as values, or containing an error message.
 */
async function fetchFromApi(endDate, startDate, stockSymbol) {
  var volumes = {};

  try {
    const response = await fetch(
      `http://market.finance.sina.com.cn/pricehis.php?symbol=${stockSymbol.toLowerCase()}&startdate=${startDate}&enddate=${endDate}`
    );

    if (response.ok) {
      const buffer = await response.arrayBuffer();
      const dom = parseDocument(
        iconv.decode(Buffer.from(buffer), "gb2312").toString() // Decode using GB2312 rather than UTF-8 to avoid garbled characters due to the original character set used by the above API.
      );

      volumes = parseDom(dom);
    } else {
      console.warn(`${response.status} ${response.statusText}`);
      volumes[global.common.PROCESSOR_ERROR_KEY] = zhCN.default.responseNotOk;
    } // end if...else
  } catch (e) {
    console.error(e);

    // Reference: https://github.com/arantes555/electron-fetch/blob/master/ERROR-HANDLING.md
    if (e instanceof FetchError && e.type === "system") {
      if (e.code === "ERR_CONNECTION_RESET") {
        volumes[global.common.PROCESSOR_ERROR_KEY] = zhCN.default.responseNotOk;
      } // end if

      if (e.code === "ERR_INTERNET_DISCONNECTED") {
        volumes[global.common.PROCESSOR_ERROR_KEY] = zhCN.default.poorNet;
      } // end if
    } else {
      volumes[global.common.PROCESSOR_ERROR_KEY] = zhCN.default.processError;
    } // end if...else
  } // end try...catch

  return volumes;
} // end function fetchFromApi

/**
 * Generate the row data for the final search results.
 * @param {object} dayVolumes strike prices and volumes for each day in the date range.
 * @param {string} endDate the end date of the date range.
 * @param {string} startDate the start date of the date range.
 * @param {string} strikePrice the strike price.
 * @param {object} totalVolumes strike prices and total volumes for the date range.
 * @returns the row data.
 */
function generateRowData(
  dayVolumes,
  endDate,
  startDate,
  strikePrice,
  totalVolumes
) {
  var rowData = {};

  rowData[global.common.STRIKE_PRICE_KEY] = strikePrice;
  rowData[global.common.TOTAL_VOLUME_KEY] = totalVolumes[strikePrice];

  if (totalVolumes[global.common.PROCESSOR_ERROR_KEY] == null) {
    if (endDate === startDate) {
      rowData[startDate] = totalVolumes[strikePrice];
    } else {
      for (const dateStr in dayVolumes) {
        rowData[dateStr] = dayVolumes[dateStr][strikePrice];
      } // end for
    } // end if...else
  } // end if

  return rowData;
} // end function generateRowData

/**
 * Get the search result data for the specified grid to show.
 * @param {string} endDate the end date of the date range.
 * @param {string} startDate the start date of the date range.
 * @param {string} stockSymbol the stock symbol.
 * @returns
 */
export async function getSearchResultData(endDate, startDate, stockSymbol) {
  var dayVolumes = {};
  var totalVolumes = await fetchFromApi(endDate, startDate, stockSymbol);

  // Retrive the day volumes only if there is no error message at present and the start date does not equal the end date.
  if (
    totalVolumes[global.common.PROCESSOR_ERROR_KEY] == null &&
    endDate !== startDate
  ) {
    const dateArray = createDateArray(endDate, startDate);
    var count = 0;

    for (const currentDate of dateArray) {
      const dateStr = [
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        currentDate.getDate(),
      ].join("-");

      dayVolumes[dateStr] = await fetchFromApi(dateStr, dateStr, stockSymbol);

      if (dayVolumes[dateStr][global.common.PROCESSOR_ERROR_KEY] != null) {
        totalVolumes = dayVolumes[dateStr];
        break;
      } // end if

      // Sleep for 5 seconds for each 5 requests to mitigate blocking frequent website crawling.
      if (++count % 5 === 0 && dateArray.length > 5) {
        await new Promise((resolve) => setTimeout(resolve, 5000));
      } // end if
    } // end for
  } // end if

  return arrangeSearchResults(dayVolumes, endDate, startDate, totalVolumes);
} // end function getSearchResultData

/**
 * Parse the document.
 * @param {Document} dom the document extracted.
 * @returns an object using strike prices as keys and the corresponding volumes as values.
 */
function parseDom(dom) {
  const tbody = DomUtils.getElementsByTagName("tbody", dom.children)[0];
  var volumes = {};

  if (tbody == null) {
    const title = DomUtils.getElementsByTagName("title", dom.children)[0];
    const pageTitle = DomUtils.innerText(title.children);

    if (pageTitle === global.common.API_ACCESS_DENIED_PAGE_TITLE) {
      volumes[global.common.PROCESSOR_ERROR_KEY] = zhCN.default.accessDenied;
    } // end if
  } else {
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
  } // end if...else

  return volumes;
} // end function parseDom
