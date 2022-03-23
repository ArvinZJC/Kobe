# [Kobe](../../../..)/stock-list

[简体中文](./README-zhCN.md) | **English**

Stock List is a Python script extension. This extension can retrieve and store a list of stocks' symbols and corresponding names in a JSON data file. The supported stock exchanges are Beijing Stock Exchange, Shanghai Stock Exchange, and Shenzhen Stock Exchange. The JSON file is essential and processed to provide the autocomplete functionality of Kobe's auto-complete component to input the stock symbol.

## ❗ ATTENTION

> May I have your attention pls? 🔥

1. By 23 March 2022, everything looks good with Visual Studio Code (Version: 1.65.2) + Python 3.10.2. Additionaly, I would like to thankfully acknowledge [TuShare Pro](https://tushare.pro/) for its valuabale data.
2. The primary packages of the project are listed in the following table. For more information, please refer to [`requirements.txt`](./requirements.txt).

   | Name          | Version |
   | :------------ | :-----: |
   | pandas        |  1.4.0  |
   | python-dotenv | 0.19.2  |
   | tushare       | 1.2.83  |

3. If all configurations are set properly, the script `updater.py` can be executed successfully to generate/update the JSON data file as per the search results.
