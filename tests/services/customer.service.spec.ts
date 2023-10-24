import {CustomerService} from "../../src/services/customer.service";
import MockAdapter from "axios-mock-adapter";
import axios from "axios";
import {Customer} from "../../src/models/customer.model";
import { TransactionType} from "../../src/models/transactions.model";


describe('CustomerService', () => {
    let mock: MockAdapter;
    let customerService: CustomerService;

    beforeEach(() => {
        customerService = new CustomerService();
        mock = new MockAdapter(axios);
    })
    afterEach(() => {
        mock.restore();
    })
    describe('constructor', () => {
        it('should create a new instance of CustomerService', () => {
            expect(customerService).toBeInstanceOf(CustomerService);
            expect(customerService).toHaveProperty('baseUrl', 'http://localhost:3001');
        })
    })

    describe('createCustomer', () => {

        it('should create a customer', async () => {
            mock.onPost('http://localhost:3001/customers').reply(200, {
                id: '123',
                name: 'John Doe',
                balance: 1000
            } as Customer);
            const customer = await customerService.createCustomer('John Doe', 1000);
            expect(customer).toHaveProperty('id');
            expect(customer).toHaveProperty('name', 'John Doe');
            expect(customer).toHaveProperty('balance', 1000);
        })

        it('should throw an error if customer creation fails', async () => {
            mock.onPost('http://localhost:3001/customers').reply(500);
            try {
                const response = await customerService.createCustomer('John Doe', 1000);
                expect(response).toBeUndefined();
            } catch (err) {
                expect(err).toBeInstanceOf(Error);
                const {message} = err as Error;
                expect(message).toBe('Failed to create customer');
            }
        })
    })

    describe('getBalance', () => {
        it('should get the current balance of the customer', () => {
            mock.onGet('http://localhost:3001/customers/123').reply(200, {
                id: '123',
                name: 'John Doe',
                balance: 1000
            } as Customer);
            const balance = customerService.getBalance('123');
            expect(balance).resolves.toBe(1000);
        })
        it('should return null if customer is not found', () => {
            mock.onGet('http://localhost:3001/customers/123').reply(404);
            const balance = customerService.getBalance('123');
            expect(balance).resolves.toBe(null);
        })
        it('should throw an error if customer balance retrieval fails', () => {
            mock.onGet('http://localhost:3001/customers/123').reply(500);
            const balance = customerService.getBalance('123');
            expect(balance).rejects.toBeInstanceOf(Error);
        })
    })

    describe('deposit', () => {
        it('should deposit money to a customer account', () => {
            mock.onGet('http://localhost:3001/customers/123').reply(200, {
                id: '123',
                name: 'John Doe',
                balance: 1000
            } as Customer);
            mock.onPut('http://localhost:3001/customers/123').reply(200);
            const result = customerService.deposit('123', 1000);
            expect(result).resolves.toBe('Deposit successful');
        })
        it('should return null if customer is not found', () => {
            mock.onGet('http://localhost:3001/customers/123').reply(404);
            const result = customerService.deposit('123', 1000);
            expect(result).resolves.toBe(null);
        })
        it('should throw an error if customer deposit fails', () => {
            mock.onGet('http://localhost:3001/customers/123').reply(200, {
                id: '123',
                name: 'John Doe',
                balance: 1000
            } as Customer);
            mock.onPut('http://localhost:3001/customers/123').reply(500);
            const result = customerService.deposit('123', 1000);
            expect(result).rejects.toBeInstanceOf(Error);
        })
    })

    describe('withdraw', () => {
        it('should withdraw money from a customer account', () => {
            mock.onGet('http://localhost:3001/customers/123').reply(200, {
                id: '123',
                name: 'John Doe',
                balance: 1000
            } as Customer);
            mock.onPut('http://localhost:3001/customers/123').reply(200);
            const result = customerService.withdraw('123', 1000);
            expect(result).resolves.toBe('Withdraw successful');
        })
        it('should return insufficient funds if customer balance is less than amount to withdraw', () => {
            mock.onGet('http://localhost:3001/customers/123').reply(200, {
                id: '123',
                name: 'John Doe',
                balance: 500
            } as Customer);
            const result = customerService.withdraw('123', 1000);
            expect(result).resolves.toBe('Insufficient funds');
        })
        it('should return null if customer is not found', () => {
            mock.onGet('http://localhost:3001/customers/123').reply(404);
            const result = customerService.withdraw('123', 1000);
            expect(result).resolves.toBe(null);
        })
        it('should throw an error if customer withdraw fails', () => {
            mock.onGet('http://localhost:3001/customers/123').reply(200, {
                id: '123',
                name: 'John Doe',
                balance: 1000
            } as Customer);
            mock.onPut('http://localhost:3001/customers/123').reply(500);
            const result = customerService.withdraw('123', 1000);
            expect(result).rejects.toBeInstanceOf(Error);
        })
    })

    describe('transfer', () => {
        it('should transfer money from one customer account to another', () => {
            mock.onGet('http://localhost:3001/customers/123').reply(200, {
                id: '123',
                name: 'John Doe',
                balance: 1000
            } as Customer);
            mock.onGet('http://localhost:3001/customers/321').reply(200, {
                id: '321',
                name: 'Jane Doe',
                balance: 1000
            } as Customer);
            mock.onPut('http://localhost:3001/customers/123').reply(200);
            mock.onPut('http://localhost:3001/customers/321').reply(200);
            const result = customerService.transfer('123', '321', 1000);
            expect(result).resolves.toBe('Transfer successful');
        })
        it('should return insufficient funds if sender balance is less than amount to transfer', () => {
            mock.onGet('http://localhost:3001/customers/123').reply(200, {
                id: '123',
                name: 'Jane Doe',
                balance: 500
            } as Customer);
            mock.onGet('http://localhost:3001/customers/321').reply(200, {
                id: '321',
                name: 'John Doe',
                balance: 1000
            } as Customer);
            const result = customerService.transfer('123', '321', 1000);
            expect(result).resolves.toBe('Insufficient funds');
        })
        it('should return null if sender is not found', () => {
            mock.onGet('http://localhost:3001/customers/123').reply(404);
            const result = customerService.transfer('123', '321', 1000);
            expect(result).resolves.toBe(null);
        })
        it('should return null if receiver is not found', () => {
            mock.onGet('http://localhost:3001/customers/123').reply(200, {
                id: '123',
                name: 'John Doe',
                balance: 1000
            } as Customer);
            mock.onGet('http://localhost:3001/customers/321').reply(404);
            const result = customerService.transfer('123', '321', 1000);
            expect(result).resolves.toBe(null);
        })
        it('should throw an error if sender transfer fails', () => {
            mock.onGet('http://localhost:3001/customers/123').reply(200, {
                id: '123',
                name: 'John Doe',
                balance: 1000
            } as Customer);
            mock.onGet('http://localhost:3001/customers/321').reply(200, {
                id: '321',
                name: 'Jane Doe',
                balance: 1000
            } as Customer);
            mock.onPut('http://localhost:3001/customers/123').reply(500);
            const result = customerService.transfer('123', '321', 1000);
            expect(result).rejects.toBeInstanceOf(Error);
        });
    })

    describe('createTransaction', () => {
        it('should create a transaction', () => {
            const id:string = '123';
            const transaction = customerService.createTransaction( 1000, TransactionType.Deposit, id, id);
            expect(transaction).toHaveProperty('id');
            expect(transaction).toHaveProperty('senderId', id);
            expect(transaction).toHaveProperty('receiverId', id);
            expect(transaction).toHaveProperty('amount', 1000);
            expect(transaction).toHaveProperty('type', 'deposit');
            expect(transaction).toHaveProperty('timestamp');
        })
    })
})