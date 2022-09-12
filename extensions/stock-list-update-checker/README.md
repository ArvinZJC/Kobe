# [Kobe](../../../..)/[extensions](../)/Stock List Update Checker

**English (United Kingdom)** | [中文（简体，中国）](./README_zh-Hans-CN.md)

Stock List Update Checker is a Python script extension. This extension can retrieve and store a list of stocks' symbols and corresponding names in a JSON data file. The supported stock exchanges are Beijing Stock Exchange, Shanghai Stock Exchange, and Shenzhen Stock Exchange. The JSON file is essential and processed to provide the autocomplete functionality of Kobe's auto-complete component to input the stock symbol.

## ❗ ATTENTION

> May I have your attention pls? 🔥

1. By 12 September 2022, everything looks good with Visual Studio Code (Version: 1.71.0) + Python 3.9. Additionally, I would like to thankfully acknowledge [Tushare Pro](https://tushare.pro/) for its valuabale data.
2. The primary packages of the extension are listed in the following table. For more info, please refer to [`requirements.txt`](./requirements.txt).

   | Name          | Version |
   | :------------ | :-----: |
   | onepush       |  1.1.1  |
   | pandas        |  1.4.2  |
   | python-dotenv | 0.21.0  |
   | tushare       | 1.2.85  |

3. You could manually create a file named `.env` under the extension's root directory and contain the following content. Please note that it is _optional_, and that **the extension should work well without it**.

   ```sh
   # Set the following environment variables to allow sending messages to your Telegram bot.
   TG_BOT_TOKEN=<your Telegram bot token>
   TG_USER_ID=<your Telegram user ID>

   TUSHARE_PRO_TOKEN=<your Tushare Pro token>  # Set this environment variable to allow retrieving data from Tushare Pro.
   ```

   You may find the following links useful.

   - [How to create a Telegram bot?](https://core.telegram.org/bots#3-how-do-i-create-a-bot)
   - [How to get the Telegram user ID?](https://bigone.zendesk.com/hc/en-us/articles/360008014894-How-to-get-the-Telegram-user-ID-)
   - [How to get a Tushare Pro token?](https://tushare.pro/document/1?doc_id=39)

   If all configurations are in place, the script `updater.py` can be executed successfully to generate/update the JSON data file as per the search results.

4. The extension is designed to deploy on [the Aliyun FC](https://www.aliyun.com/product/fc) to check dialy if any update is available for the stock list. Please note that the package `python-dotenv` is not required in this case, and you need to configure the environment variables in your function configurations. You can refer to [`requirements_fc.txt`](./requirements_fc.txt) to install packages via the online IDE using the following command.

   ```sh
   pip3 install -r requirements_fc.txt -t .
   ```
