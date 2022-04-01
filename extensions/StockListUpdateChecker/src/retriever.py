"""
'''
Description: a stock list raw data retriever
Version: 1.0.3.20220401
Author: Arvin Zhao
Date: 2021-12-16 19:54:01
Last Editors: Arvin Zhao
LastEditTime: 2022-04-01 09:09:08
'''
"""

from typing import Optional
import os

import pandas as pd
import tushare as ts


def retrieve() -> Optional[pd.DataFrame]:
    """Retrieve the stock list raw data.

    Returns
    -------
    DataFrame / None
        The stock list raw data. Return null if the Tushare Pro API token is not provided.
    """

    tushare_token = os.getenv("TUSHARE_PRO_TOKEN")

    if tushare_token is None:
        print("No Tushare Pro API token found.")
        return None

    ts_pro = ts.pro_api(
        token=tushare_token
    )  # Initialise Tushare Pro API with the token.
    return ts_pro.stock_basic(
        fields="ts_code, name"
    )  # Use the specified API to get the specified data object.


# For simple tests only.
if __name__ == "__main__":
    from dotenv import load_dotenv

    load_dotenv()
    print(retrieve())
