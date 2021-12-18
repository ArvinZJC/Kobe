"""
'''
Description: a stock list data updater
Version: 1.0.0.20211218
Author: Arvin Zhao
Date: 2021-12-16 20:36:26
Last Editors: Arvin Zhao
LastEditTime: 2021-12-18 03:33:33
'''
"""

import json
import os

from retriever import retrieve


def update():
    """Update the stock list data if necessary."""
    data = retrieve()

    if data is not None:
        data_filename = "StockList.json"
        is_same = False  # A flag indicating if the data file pending comparison contains the latest data.

        if os.path.exists(data_filename):
            data_new = json.loads(data.to_json(orient="records"))
            data_old = json.load(open(data_filename, encoding="mbcs"))
            is_same = sorted(data_new, key=lambda x: x["ts_code"]) == sorted(
                data_old, key=lambda x: x["ts_code"]
            )

        print("Same data?", is_same)

        if not is_same:
            data.to_json("StockList.json", orient="records")


if __name__ == "__main__":
    update()
