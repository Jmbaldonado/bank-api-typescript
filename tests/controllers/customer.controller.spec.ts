import {CustomerController} from "../../src/controllers/customer.controller";
import {CustomerService} from "../../src/services/customer.service";
import {Request, Response} from "express-serve-static-core";

describe('CustomerController', () => {
    let customerController: CustomerController;
    let mockResponse: Response;

    beforeEach(() => {
        customerController = new CustomerController();
        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        } as unknown as Response;
    })

    describe('constructor', () => {
        it('should create a new instance of BankManagerService', () => {
            expect(customerController).toBeInstanceOf(CustomerController);
            expect(customerController).toHaveProperty('customerService');
        })
    })

    describe('createCustomer', () => {
        let mockCreateCustomer: jest.Mock;
        beforeEach(() => {
            mockCreateCustomer = jest.fn();
            jest.spyOn(CustomerService.prototype, "createCustomer").mockImplementation(() => mockCreateCustomer());
        })
        afterEach(() => {
            jest.clearAllMocks();
        })
        it('should return 201 ok response if customer is created successfully', async () => {

            const expectedCustomer = {id: "123", name: "Alice", balance: 100};
            mockCreateCustomer.mockReturnValue(expectedCustomer);
            //
            const req = {body: {name: "Alice", initialDeposit: 1000}} as unknown as Request;
            const res = mockResponse
            await customerController.createCustomer(req, res);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({data: expectedCustomer});
        })
        it('should return 400 bad request if name or initialDeposit is not provided', async () => {
            const req = {body: {name: "Alice"}} as unknown as Request;
            const res = mockResponse

            await customerController.createCustomer(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({message: "Bad Request"});
        })
    })

    describe('getBalance', () => {
        let mockGetBalance: jest.Mock;
        beforeEach(() => {
            mockGetBalance = jest.fn();
            jest.spyOn(CustomerService.prototype, "getBalance").mockImplementation(() => mockGetBalance());
        })
        afterEach(() => {
            jest.clearAllMocks();
        })

        it('should return 200 ok response if balance is retrieved successfully', async () => {
            const req = {params: {id: '123'}} as unknown as Request;
            const res = mockResponse

            mockGetBalance.mockReturnValue(100);

            await customerController.getBalance(req, res);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({data: {balance: 100}});
        })

        it('should return 404 not found response if customer is not found', async () => {
            const req = {params: {id: '123'}} as unknown as Request;
            const res = mockResponse

            mockGetBalance.mockReturnValue(null);

            await customerController.getBalance(req, res);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({message: 'Customer not found'});
        })

        it('should return 500 internal server error if an error occurs', async () => {
            const req = {params: {id: '123'}} as unknown as Request;
            const res = mockResponse

            mockGetBalance.mockRejectedValue(new Error('Failed to get balance'));

            await customerController.getBalance(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({message: 'Failed to get balance'});
        })
    })

    describe('deposit', () => {
        let mockDeposit: jest.Mock;
        beforeEach(() => {
            mockDeposit = jest.fn();
            jest.spyOn(CustomerService.prototype, "deposit").mockImplementation(() => mockDeposit());
        })
        afterEach(() => {
            jest.clearAllMocks();
        })

        it('should return 200 ok response if successful deposit', async () => {
            const req = {params: {id: '123'}, body: {amount: 100}} as unknown as Request;
            const res = mockResponse

            mockDeposit.mockResolvedValue('Deposit successful');

            await customerController.deposit(req, res);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({message: 'Deposit successful'});
        })

        it('should return 404 not found response if customer is not found', async () => {
            const req = {params: {id: '123'}, body: {amount: 100}} as unknown as Request;
            const res = mockResponse

            mockDeposit.mockResolvedValue(null);

            await customerController.deposit(req, res);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({message: 'Customer not found'});
        })

        it('should return 500 internal server error if an error occurs', async () => {
            const req = {params: {id: '123'}, body: {amount: 100}} as unknown as Request;
            const res = mockResponse

            mockDeposit.mockRejectedValue(new Error('Failed to deposit'));

            await customerController.deposit(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({message: 'Failed to deposit'});
        })
    })

    describe('withdraw', () => {
        let mockWithdraw: jest.Mock;
        beforeEach(() => {
            mockWithdraw = jest.fn();
            jest.spyOn(CustomerService.prototype, "withdraw").mockImplementation(() => mockWithdraw());
        })
        afterEach(() => {
            jest.clearAllMocks();
        })

        it('should return 200 ok response if successful withdraw', async () => {
            const req = {params: {id: '123'}, body: {amount: 100}} as unknown as Request;
            const res = mockResponse

            mockWithdraw.mockResolvedValue('Withdraw successful');

            await customerController.withdraw(req, res);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({message: 'Withdraw successful'});
        })

        it('should return 404 not found response if customer is not found', async () => {
            const req = {params: {id: '123'}, body: {amount: 100}} as unknown as Request;
            const res = mockResponse

            mockWithdraw.mockResolvedValue(null);

            await customerController.withdraw(req, res);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({message: 'Customer not found'});
        })

        it('should return 400 bad request response if customer has insufficient funds', async () => {
            const req = {params: {id: '123'}, body: {amount: 100}} as unknown as Request;
            const res = mockResponse

            mockWithdraw.mockResolvedValue('Insufficient funds');

            await customerController.withdraw(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({message: 'Insufficient funds'});
        })

        it('should return 500 internal server error if an error occurs', async () => {
            const req = {params: {id: '123'}, body: {amount: 100}} as unknown as Request;
            const res = mockResponse

            mockWithdraw.mockRejectedValue(new Error('Failed to withdraw'));

            await customerController.withdraw(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({message: 'Failed to withdraw'});
        })
    })

    describe('transfer', () => {
        let mockTransfer: jest.Mock;
        beforeEach(() => {
            mockTransfer = jest.fn();
            jest.spyOn(CustomerService.prototype, "transfer").mockImplementation(() => mockTransfer());
        })
        afterEach(() => {
            jest.clearAllMocks();
        })

        it('should return 200 ok response if successful transfer', async () => {
            const req = {params: {senderId: '123', receiverId: "456"}, body: {amount: 100}} as unknown as Request;
            const res = mockResponse

            mockTransfer.mockResolvedValue('Transfer successful');

            await customerController.transfer(req, res);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({message: 'Transfer successful'});
        })

        it('should return 404 not found response if customer is not found', async () => {
            const req = {params: {senderId: '123', receiverId: "456"}, body: {amount: 100}} as unknown as Request;
            const res = mockResponse

            mockTransfer.mockResolvedValue(null);

            await customerController.transfer(req, res);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({message: 'Transfer failed, please try again later.'});
        })

        it('should return 400 bad request response if customer has insufficient funds', async () => {
            const req = {params: {senderId: '123', receiverId: "456"}, body: {amount: 100}} as unknown as Request;
            const res = mockResponse

            mockTransfer.mockResolvedValue('Insufficient funds');

            await customerController.transfer(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({message: 'Insufficient funds'});
        })

        it('should return 500 internal server error if an error occurs', async () => {
            const req = {params: {senderId: '123', receiverId: "456"}, body: {amount: 100}} as unknown as Request;
            const res = mockResponse

            mockTransfer.mockRejectedValue(new Error('Failed to transfer'));

            await customerController.transfer(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({message: 'Failed to transfer'});
        })
    })

})