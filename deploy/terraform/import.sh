#!/bin/sh

function import {
  terraform \
    import \
    -var="onepassword_token=$ONEPASSWORD_TOKEN"\
    "$1" "$2"
}

function plan {
  terraform plan \
    -var "onepassword_token=$ONEPASSWORD_TOKEN"
}

import "keycloak_openid_client.expense_tracker_ui_dev" "apps-dev/7ba71e16-28cf-4568-9ea1-819781bdf85e"
import "keycloak_openid_client.expense_tracker_ui_prod" "apps-prod/302c0308-9523-43cf-aa23-d5dbb055bd17"

plan
