import {CustomerController} from "../../src/controllers/customer.controller";
import {Request, Response} from "express-serve-static-core";
import {BankManagerController} from "../../src/controllers/bank-manager.controller";
import {CustomerService} from "../../src/services/customer.service";
import {BankManagerService} from "../../src/services/bank-manager.service";
import {Customer} from "../../src/models/customer.model";

describe('BankManagerController', () => {
    let bankManagerController: BankManagerController;
    let mockResponse: Response;

    beforeEach(() => {
        bankManagerController = new BankManagerController();
        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        } as unknown as Response;
    })

    describe('constructor', () => {
        it('should create a new instance of BankManagerController', () => {
            expect(bankManagerController).toBeInstanceOf(BankManagerController);
            expect(bankManagerController).toHaveProperty('bankManagerService');
        })
    })

    describe('getCustomerById', () => {
        let mockGetCustomerById: jest.Mock;
        beforeEach(() => {
            mockGetCustomerById = jest.fn();
            jest.spyOn(BankManagerService.prototype, "getCustomerById").mockImplementation(() => mockGetCustomerById());
        })
        afterEach(() => {
            jest.clearAllMocks();
        })

        it('should return 200 ok response if customer is retrieved successfully', async () => {
            const req = {params: {id: '123'}} as unknown as Request;
            const res = mockResponse

            mockGetCustomerById.mockReturnValue({id: '123', name: 'John Doe'} as Customer);

            await bankManagerController.getCustomerById(req, res);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({data: {id: '123', name: 'John Doe'}});
        })

        it('should return 404 not found response if customer is not found', async () => {
            const req = {params: {id: '123'}} as unknown as Request;
            const res = mockResponse

            mockGetCustomerById.mockReturnValue(null);

            await bankManagerController.getCustomerById(req, res);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({message: 'Customer not found'});
        })

        it('should return 500 internal server error if an error occurs', async () => {
            const req = {params: {id: '123'}} as unknown as Request;
            const res = mockResponse

            mockGetCustomerById.mockRejectedValue(new Error('Failed to get customer'));

            await bankManagerController.getCustomerById(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({message: 'Failed to get customer'});
        })
    })
})