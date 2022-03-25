"""
'''
Description: a stock list data updater
Version: 1.0.1.20220325
Author: Arvin Zhao
Date: 2021-12-16 20:36:26
Last Editors: Arvin Zhao
LastEditTime: 2022-03-25 15:47:09
'''
"""

from typing import List
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
            with open(data_filename) as output:
                data_new: List = json.loads(data.to_json(orient="records"))
                data_old: List = json.load(output)
                is_same = sorted(data_new, key=lambda x: x["ts_code"]) == sorted(
                    data_old, key=lambda x: x["ts_code"]
                )

        print("Same data?", is_same)

        if not is_same:
            data.to_json(data_filename, orient="records")


if __name__ == "__main__":
    update()
