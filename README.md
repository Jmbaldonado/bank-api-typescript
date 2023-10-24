# Bank Management System
This Bank Management System is a simple program that allows customers to manage their accounts by depositing, withdrawing, and checking their account balances. It also provides a total balance view for bank managers. Additionally, it allows customers to transfer money to other customers.

## Features
- Create a customer account with an initial deposit.
- Deposit money into the account.
- Withdraw money from the account.
- Check the account balance.
- Bank managers can view the total balance of the bank.
- Customers can transfer money to other customers.

## Getting Started

To run the Bank Management System, you'll need to have [Node.js](https://nodejs.org/) installed.

1. Clone this repository to your local machine.
   ```bash
   git clone https://github.com/Jmbaldonado/bank-api-typescript.git .
   ```
2. Install the dependencies.
   ```bash
   npm install
   ```
3. Run the program.
   ```bash
    npm start && npm start:backend
    ```
   
4. in the **docs folder** you can find the attached json file for the postman collection.

## Usage

Here's how you can use the Bank Management System:

- Create a customer account: Provide a customer's name and initial deposit.
- Deposit: Add money to the customer's account.
- Withdraw: Take money from the customer's account (within withdrawal limits).
- Check Balance: View the customer's account balance.
- Bank Manager: Access the bank manager interface to see the total balance.
- Transfer Money: Customers can transfer money to other customers.

## Technology Stack

- Node.js
- Express (for the RESTful API)
- TypeScript
- Jest (for testing)

## Testing
1. to run the test cases
   ```bash
    npm test
    ```
2. you could also  run the test cases with coverage
   ```bash
    npm run test:coverage
    ```
