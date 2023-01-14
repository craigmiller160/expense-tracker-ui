# Expense Tracker UI

The UI for the Expense Tracker application.

## How to Run (Dev)

Simply run `yarn start`. The dev server runs on port 3002. 

## How to Update Types

This project uses automatic generation of types using the Swagger response from the backend. Simply run the `expense-tracker-api` locally and then use `yarn generate-types` to update the types file. Always remember to commit the updated file.

## Test Suites

This project was started using a combination of `jest`, `@testing-library/react`, and `miragejs` (as a mocked server). As it continued, `cypress` was adopted instead because it has proven to be a far superior testing solution for the goal of having proper UI integration tests. Gradually tests are being moved from the old suite to the new one, however both are still in play here for the time being.

## Terraform

For the Terraform script to run, the following environment variables must be present on the machine.

```
# The operator access token for communicating with 1Password
ONEPASSWORD_TOKEN=XXXXXXX
```