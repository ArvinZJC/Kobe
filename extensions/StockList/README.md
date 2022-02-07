# [Kobe](../../../..)/StockList

**简体中文** | [English](./README-en.md)

股票列表是一个 Python 脚本插件。此插件用于查询北交所、上交所和深交所上市的股票代码和相应的股票名称，并将它们保存在一个 JSON 数据文件中。这个数据文件是神户座的股票代码输入框的自动补全功能必不可少的数据来源。

## ❗ 注意

> 敲黑板了！敲黑板了！🔥

1. 截至 2022 年 2 月 7 日，使用 Visual Studio Code（版本：1.64.0）和 Python 3.10.2 开发表现良好。此外，我要特别感谢 [TuShare Pro](https://tushare.pro/) 提供的宝贵数据。
2. 插件主要的包参见下面的表格。更多信息请参见 [`requirements.txt`](./requirements.txt)。

   | 名称          |  版本  |
   | :------------ | :----: |
   | pandas        | 1.4.0  |
   | python-dotenv | 0.19.2 |
   | tushare       | 1.2.83 |

3. 若一切配置妥当，则应可成功执行 `updater.py` 脚本来根据查询结果生成/更新 JSON 数据文件。
