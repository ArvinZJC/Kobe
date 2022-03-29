"""
'''
Description: a stock list data updater
Version: 1.1.0.20220329
Author: Arvin Zhao
Date: 2021-12-16 20:36:26
Last Editors: Arvin Zhao
LastEditTime: 2022-03-29 19:24:39
'''
"""

from typing import List
import json
import os

from onepush import notify
from retriever import retrieve


def notify_tg(is_same: bool) -> None:
    """Notify the stock list data updater's response to a specific Telegram bot.

    Parameters
    ----------
    is_same : bool, optional
        A flag indicating if the data file pending comparison contains the latest data.
    """
    tg_bot_token = os.getenv("TG_BOT_TOKEN")
    tg_user_id = os.getenv("TG_USER_ID")

    if tg_bot_token == None or tg_user_id == None:
        return

    notify(
        "telegram",
        content="Same data? {}.".format(is_same),
        title="Stock List Update Checker",
        token=tg_bot_token,
        userid=tg_user_id,
    )


def update(is_scf: bool = False) -> bool:
    """Update the stock list data if necessary.

    Parameters
    ----------
    is_scf : bool
        A flag indicating if Tencent SCF is used.

    Returns
    -------
    bool
        A flag indicating if the data file pending comparison contains the latest data.
    """
    data = retrieve()

    if data is not None:
        data_filename = "StockList.json"
        is_same = False

        if os.path.exists(data_filename):
            data_new: List = json.loads(data.to_json(orient="records"))
            output = open(data_filename)
            data_old: List = json.load(output)
            output.close()
            is_same = sorted(data_new, key=lambda x: x["ts_code"]) == sorted(
                data_old, key=lambda x: x["ts_code"]
            )

        if not is_same and not is_scf:
            data.to_json(data_filename, orient="records")

        return is_same


if __name__ == "__main__":
    from dotenv import load_dotenv

    load_dotenv()
    notify_tg(update())
