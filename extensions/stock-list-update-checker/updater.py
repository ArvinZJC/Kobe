"""
'''
Description: a stock list data updater
Version: 1.2.2.20220721
Author: Arvin Zhao
Date: 2021-12-16 20:36:26
Last Editors: Arvin Zhao
LastEditTime: 2022-07-21 22:29:39
'''
"""

import json
import os

from onepush import notify
from retriever import retrieve


def notify_tg(is_same: bool) -> None:
    """Notify the stock list data updater's response to a specific Telegram bot.

    Parameters
    ----------
    is_same : bool
        A flag indicating if the data file pending comparison contains the latest data.
    """
    tg_bot_token = os.getenv("TG_BOT_TOKEN")
    tg_user_id = os.getenv("TG_USER_ID")

    if tg_bot_token is None or tg_user_id is None:
        print("No Telegram bot token or user ID found.")
        return

    notify(
        "telegram",
        content="Same data? {}.".format(is_same),
        title="Stock List Update Checker",
        token=tg_bot_token,
        userid=tg_user_id,
    )


def update(is_fc: bool = False) -> bool:
    """Update the stock list data if necessary.

    Parameters
    ----------
    is_fc : bool, optional
        A flag indicating if Aliyun FC is used. Default: `False`.

    Returns
    -------
    bool
        A flag indicating if the data file pending comparison contains the latest data.
    """
    data = retrieve()

    if data is not None:
        data_filename = "stock-list.json"
        is_same = False

        if os.path.exists(data_filename):
            data_new: list = json.loads(data.to_json(orient="records"))
            output = open(data_filename)
            data_old: list = json.load(output)
            output.close()
            is_same = sorted(data_new, key=lambda x: x["ts_code"]) == sorted(
                data_old, key=lambda x: x["ts_code"]
            )

        if not is_same and not is_fc:
            data.to_json(data_filename, orient="records")

        return is_same


if __name__ == "__main__":
    from dotenv import load_dotenv

    load_dotenv()
    notify_tg(update())
