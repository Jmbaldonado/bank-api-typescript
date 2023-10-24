import request from 'supertest'
import {app} from "../../src/app";
import {CustomerService} from "../../src/services/customer.service";
import {Customer} from "../../src/models/customer.model";

describe('CustomerRoutes', () => {

    describe('POST /customer', () => {
        it('should send the request and process it', async () => {
            const mockCreateCustomer = jest.fn(() => (Promise.resolve({
                id: '123',
                name: 'Alice',
                balance: 100
            } as Customer)));
            jest.spyOn(CustomerService.prototype, "createCustomer").mockImplementation(() => mockCreateCustomer());

            const response = await request(app).post('/api/customer').send({name: "Alice", initialDeposit: 1000});
            expect(mockCreateCustomer).toHaveBeenCalledTimes(1)
            expect(response).toBeDefined();
        })
    })

    describe('GET /customer/:id/balance', () => {
        it('should send the request and process it', async () => {
            const mockGetBalance = jest.fn(() => (Promise.resolve(100)));
            jest.spyOn(CustomerService.prototype, "getBalance").mockImplementation(() => mockGetBalance());

            const response = await request(app).get('/api/customer/123/balance');
            expect(mockGetBalance).toHaveBeenCalledTimes(1)
            expect(response).toBeDefined();
        })
    })

    describe('PATCH /customer/:id/deposit',  () => {
        it('should send the request and process it', async () => {
            const mockDeposit = jest.fn(() => (Promise.resolve('Deposit successful')));
            jest.spyOn(CustomerService.prototype, "deposit").mockImplementation(() => mockDeposit());

            const response = await request(app).patch('/api/customer/123/deposit').send({amount: 100});
            expect(mockDeposit).toHaveBeenCalledTimes(1)
            expect(response).toBeDefined();
        })
    })

    describe('PATCH /customer/:id/withdraw',  () => {
        it('should send the request and process it', async () => {
            const mockWithdraw = jest.fn(() => (Promise.resolve('Withdraw successful')));
            jest.spyOn(CustomerService.prototype, "withdraw").mockImplementation(() => mockWithdraw());

            const response = await request(app).patch('/api/customer/123/withdraw').send({amount: 100});
            expect(mockWithdraw).toHaveBeenCalledTimes(1)
            expect(response).toBeDefined();
        })
    })

    describe('POST /customer/:senderId/transfer/:receiverId',  () => {
        it('should send the request and process it', async () => {
            const mockTransfer = jest.fn(() => (Promise.resolve('Transfer successful')));
            jest.spyOn(CustomerService.prototype, "transfer").mockImplementation(() => mockTransfer());

            const response = await request(app).post('/api/customer/123/transfer/456').send({amount: 100});
            expect(mockTransfer).toHaveBeenCalledTimes(1)
            expect(response).toBeDefined();
        })
    })
})