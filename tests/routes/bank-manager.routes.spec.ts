import request from "supertest";
import {app} from "../../src/app";
import {BankManagerService} from "../../src/services/bank-manager.service";
import {Customer} from "../../src/models/customer.model";

describe('BankManagerRoutes', () => {
    describe('GET /customers', () => {
        it('should send the request and process it', async () => {
            const mockGetCustomers = jest.fn(() => (Promise.resolve([])));
            jest.spyOn(BankManagerService.prototype, "getCustomers").mockImplementation(() => mockGetCustomers());

            const response = await request(app).get('/api/admin/customers');
            expect(mockGetCustomers).toHaveBeenCalledTimes(1)
            expect(response).toBeDefined();
        })
    })

    describe('GET /total-balance', () => {
        it('should send the request and process it', async () => {
            const mockGetTotalBalance = jest.fn(() => (Promise.resolve(5000)));
            jest.spyOn(BankManagerService.prototype, "getTotalBalance").mockImplementation(() => mockGetTotalBalance());

            const response = await request(app).get('/api/admin/total-balance');
            expect(mockGetTotalBalance).toHaveBeenCalledTimes(1)
            expect(response).toBeDefined();
        })
    })

    describe('GET /customer/:id', () => {
        it('should send the request and process it', async () => {
            const mockGetCustomerById = jest.fn(() => (Promise.resolve({} as Customer)));
            jest.spyOn(BankManagerService.prototype, "getCustomerById").mockImplementation(() => mockGetCustomerById());

            const response = await request(app).get('/api/admin/customer/123');
            expect(mockGetCustomerById).toHaveBeenCalledTimes(1)
            expect(response).toBeDefined();
        })
    })
})