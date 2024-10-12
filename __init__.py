import asyncio

from fastapi import APIRouter
from lnbits.db import Database
from lnbits.tasks import create_permanent_unique_task
from loguru import logger

from .tasks import wait_for_paid_invoices
from .views import customersupport_ext_generic
from .views_api import customersupport_ext_api

db = Database("ext_customersupport")

scheduled_tasks: list[asyncio.Task] = []

customersupport_ext: APIRouter = APIRouter(prefix="/customersupport", tags=["customersupport"])
customersupport_ext.include_router(customersupport_ext_generic)
customersupport_ext.include_router(customersupport_ext_api)

customersupport_static_files = [
    {
        "path": "/customersupport/static",
        "name": "customersupport_static",
    }
]


def customersupport_stop():
    for task in scheduled_tasks:
        try:
            task.cancel()
        except Exception as ex:
            logger.warning(ex)


def customersupport_start():
    # ignore will be removed in lnbits `0.12.6`
    # https://github.com/lnbits/lnbits/pull/2417
    task = create_permanent_unique_task("ext_testing", wait_for_paid_invoices)  # type: ignore
    scheduled_tasks.append(task)
