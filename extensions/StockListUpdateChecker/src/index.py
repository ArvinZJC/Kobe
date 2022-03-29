"""
'''
Description: the Tencent SCF entry 
Version: 1.0.0.20220329
Author: Arvin Zhao
Date: 2022-03-29 19:18:24
Last Editors: Arvin Zhao
LastEditTime: 2022-03-29 19:25:24
'''
"""

from typing import Dict

from updater import notify_tg, update


def main_handler(event: Dict, context: Dict) -> None:
    """The Tecent SCF's main handler.

    Parameters
    ----------
    event : Dict
        The triggered function's basic info.
    context : Dict
        The context info.
    """
    notify_tg(update(is_scf=True))
