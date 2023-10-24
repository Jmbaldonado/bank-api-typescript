import MockAdapter from "axios-mock-adapter";
import axios from "axios";
import {BankManagerService} from "../../src/services/bank-manager.service";

describe('BankManagerService', () => {
    let mock: MockAdapter;
    let bankManagerService: BankManagerService;

    beforeEach(() => {
        bankManagerService = new BankManagerService();
        mock = new MockAdapter(axios);
    })
    afterEach(() => {
        mock.restore();
    })
    describe('constructor', () => {
        it('should create a new instance of BankManagerService', () => {
            expect(bankManagerService).toBeInstanceOf(BankManagerService);
            expect(bankManagerService).toHaveProperty('baseUrl', 'http://localhost:3001');
        })
    })

    describe('getCustomers', () => {
        it('should get all customers', async () => {
            mock.onGet('http://localhost:3001/customers').reply(200, [
                {
                    id: '123',
                    name: 'John Doe',
                    balance: 1000
                }
            ]);
            const customers = await bankManagerService.getCustomers();
            expect(customers).toHaveLength(1);
            expect(customers[0]).toHaveProperty('id', '123');
            expect(customers[0]).toHaveProperty('name', 'John Doe');
            expect(customers[0]).toHaveProperty('balance', 1000);
        })

        it('should throw an error if customer retrieval fails', async () => {
            mock.onGet('http://localhost:3001/customers').reply(500);
            try {
                const response = await bankManagerService.getCustomers();
                expect(response).toBeUndefined();
            } catch (err) {
                expect(err).toBeInstanceOf(Error);
                const {message} = err as Error;
                expect(message).toBe('Failed to get customers');
            }
        })
    })

    describe('getCustomerById', () => {
        it('should get a customer by id', async () => {
            mock.onGet('http://localhost:3001/customers/123').reply(200, {
                id: '123',
                name: 'John Doe',
                balance: 1000
            });
            const customer = await bankManagerService.getCustomerById('123');
            expect(customer).toHaveProperty('id', '123');
            expect(customer).toHaveProperty('name', 'John Doe');
            expect(customer).toHaveProperty('balance', 1000);
        })

        it('should return null if customer does not exist', async () => {
            mock.onGet('http://localhost:3001/customers/123').reply(404);
            const customer = await bankManagerService.getCustomerById('123');
            expect(customer).toBeNull();
        })

        it('should throw an error if customer retrieval fails', async () => {
            mock.onGet('http://localhost:3001/customers/123').reply(500);
            try {
                const response = await bankManagerService.getCustomerById('123');
                expect(response).toBeUndefined();
            } catch (err) {
                expect(err).toBeInstanceOf(Error);
                const {message} = err as Error;
                expect(message).toBe('Request failed with status code 500');
            }
        })
    })

    describe('getTotalBalance', () => {
        it('should get the total balance of all customers', async () => {
            mock.onGet('http://localhost:3001/customers').reply(200, [
                {
                    id: '123',
                    name: 'John Doe',
                    balance: 1000
                },
                {
                    id: '456',
                    name: 'Jane Doe',
                    balance: 2000
                }
            ]);
            const totalBalance = await bankManagerService.getTotalBalance();
            expect(totalBalance).toBe(3000);
        })
    })
})