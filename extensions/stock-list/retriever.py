"""
'''
Description: a stock list raw data retriever
Version: 1.0.1.20220325
Author: Arvin Zhao
Date: 2021-12-16 19:54:01
Last Editors: Arvin Zhao
LastEditTime: 2022-03-25 13:21:26
'''
"""

from typing import Optional
import os

from dotenv import load_dotenv
import pandas as pd
import tushare as ts


def retrieve() -> Optional[pd.DataFrame]:
    """Retrieve the stock list raw data.

    Returns
    -------
    DataFrame / None
        The stock list raw data. Return null if Tushare Pro API token is not provided.
    """
    load_dotenv()
    token = os.getenv("TUSHARE_PRO_TOKEN")  # Tushare Pro API token.

    if token is None:
        print("Failed to retrieve the stock list raw data.")
        return None

    ts_pro = ts.pro_api(token=token)  # Initialise Tushare Pro API with the token.
    return ts_pro.stock_basic(
        fields="ts_code, name"
    )  # Use the specified API to get the specified data object.


# For simple tests only.
if __name__ == "__main__":
    print(retrieve())
