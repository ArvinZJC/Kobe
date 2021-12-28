<!--
 * @Description: the search result grid component
 * @Version: 1.0.0.20211228
 * @Author: Arvin Zhao
 * @Date: 2021-12-12 05:41:38
 * @Last Editors: Arvin Zhao
 * @LastEditTime: 2021-12-28 12:51:13
-->

<template>
  <ejs-grid :dataSource="data">
    <e-columns>
      <e-column
        field="OrderID"
        headerText="Order ID"
        textAlign="Right"
        :isPrimaryKey="true"
        width="100"
      ></e-column>
      <e-column
        field="CustomerID"
        headerText="Customer ID"
        width="80"
      ></e-column>
      <e-column
        field="ShipCountry"
        headerText="Ship Country"
        width="90"
      ></e-column>
    </e-columns>
  </ejs-grid>
</template>

<script>
import {
  ColumnDirective,
  ColumnsDirective,
  GridComponent,
} from "@syncfusion/ej2-vue-grids";

export default {
  components: {
    "e-column": ColumnDirective,
    "e-columns": ColumnsDirective,
    "ejs-grid": GridComponent,
  },
  data() {
    return {
      data: [
        {
          OrderID: 10248,
          CustomerID: "VINET",
          ShipCountry: "France",
        },
        {
          OrderID: 10249,
          CustomerID: "TOMSP",
          ShipCountry: "Germany",
        },
      ],
    };
  },
};
</script>
