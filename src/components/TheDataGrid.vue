<!--
 * @Description: the data grid component
 * @Version: 1.0.0.20211212
 * @Author: Arvin Zhao
 * @Date: 2021-12-12 05:41:38
 * @Last Editors: Arvin Zhao
 * @LastEditTime: 2021-12-12 10:13:28
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
  GridComponent,
  ColumnsDirective,
  ColumnDirective,
} from "@syncfusion/ej2-vue-grids";

export default {
  components: {
    "ejs-grid": GridComponent,
    "e-columns": ColumnsDirective,
    "e-column": ColumnDirective,
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
