import json
from http import HTTPStatus

from fastapi import Depends, Query, Request
from fastapi.templating import Jinja2Templates
from loguru import logger
from starlette.responses import HTMLResponse

from lnbits.core.models import User
from lnbits.decorators import check_user_exists

from . import customersupport_ext, customersupport_renderer

templates = Jinja2Templates(directory="templates")


@customersupport_ext.get("/", response_class=HTMLResponse)
async def index(request: Request, user: User = Depends(check_user_exists)):
    return customersupport_renderer().TemplateResponse(
        "customersupport/index.html",
        {"request": request, "user": user.dict()},
    )


@customersupport_ext.get("/market", response_class=HTMLResponse)
async def market(request: Request):
    return customersupport_renderer().TemplateResponse(
        "customersupport/market.html",
        {"request": request},
    )
