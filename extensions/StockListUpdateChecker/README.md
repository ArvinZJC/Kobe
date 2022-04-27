# [Kobe](../../../..)/[extensions](../)/Stock List Update Checker

[简体中文](./README_zhCN.md) | **English**

Stock List Update Checker is a Python script extension. This extension can retrieve and store a list of stocks' symbols and corresponding names in a JSON data file. The supported stock exchanges are Beijing Stock Exchange, Shanghai Stock Exchange, and Shenzhen Stock Exchange. The JSON file is essential and processed to provide the autocomplete functionality of Kobe's auto-complete component to input the stock symbol.

## ❗ ATTENTION

> May I have your attention pls? 🔥

1. By 27 April 2022, everything looks good with Visual Studio Code (Version: 1.66.2) + Python 3.6. Additionaly, I would like to thankfully acknowledge [Tushare Pro](https://tushare.pro/) for its valuabale data.
2. The primary packages of the extension are listed in the following table. For more info, please refer to [`requirements.txt` under the extension's `src` directory](./src/requirements.txt).

   | Name          | Version |
   | :------------ | :-----: |
   | onepush       |  1.1.1  |
   | pandas        |  1.1.5  |
   | python-dotenv | 0.19.2  |
   | tushare       | 1.2.83  |

3. You could manually create a file named `.env` under the extension's `src` directory and contain the following content. Please note that it is _optional_, and that **the project should work well without it**.

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

   If all configurations are in place, the script `updater.py` under the extension's `src` directory can be executed successfully to generate/update the JSON data file as per the search results.

4. The extension is designed to deploy on [Tencent SCF](https://cloud.tencent.com/product/scf) to check if any update is available for the stock list. A configuration file template is provided as follows for deployment convenience. You may refer to [the relevant official documents of Tencent SCF](https://cloud.tencent.com/document/product/583/44751) to use it if you want.

   ```YAML
   app: StockListUpdateChecker
   component: scf
   inputs:
   description: My stock list update checker.
   eip: false
   # environment:
      # variables:
         # TG_BOT_TOKEN: <your Telegram bot token>
         # TG_USER_ID: <your Telegram user ID>
         # TUSHARE_PRO_TOKEN: <your Tushare Pro token>
   events:
      - timer:
         parameters:
            cronExpression: 0 0 6 * * * *
            enable: true
            qualifier: $DEFAULT
   handler: index.main_handler
   initTimeout: 65
   memorySize: 128
   msgTTL: 21600
   name: StockListUpdateChecker
   namespace: default
   publicAccess: true
   region: ap-hongkong
   retryNum: 2
   runtime: Python3.6
   src:
      exclude:
         - '.env'
         - '__pycache__'
      src: ./src
   timeout: 3
   type: event
   name: ap-hongkong_default_StockListUpdateChecker
   stage: dev
   # When using this configuration file for deployment, make sure the file name is "serverless.yaml".
   # For more info: https://github.com/serverless-components/tencent-scf/blob/master/docs/configure.md
   ```
