import {Request, Response} from "express-serve-static-core";
import {CustomerService} from "../services/customer.service";
import {Customer} from "../models/customer.model";
export class CustomerController {
    private customerService: CustomerService;

    constructor() {
        this.customerService = new CustomerService();
    }

     async createCustomer(req: Request, res: Response) {
        const {name, initialDeposit} = req.body as { name: string, initialDeposit: number };
        if (!name || !initialDeposit) {
            return res.status(400).json({message: "Bad Request"});
        }

        const customer: Customer = await this.customerService.createCustomer(name, initialDeposit);
        return res.status(201).json({data: customer})
    }

    async getBalance(req: Request, res: Response) {
        const {id} = req.params;

        try {
            const balance = await this.customerService.getBalance(id);
            if(!balance) {
                return res.status(404).json({message: 'Customer not found'});
            }
            return res.status(200).json({
                data: {
                    balance
                }
            });
        } catch (err) {
            const {message} = err as { message: string };
            return res.status(500).json({message});
        }
    }

    async deposit(req: Request, res: Response) {
        const {id} = req.params;
        const {amount} = req.body as { amount: number };
        try {
            const message = await this.customerService.deposit(id, amount);
            if(!message) {
                return res.status(404).json({message: 'Customer not found'});
            }
            return res.status(200).json({message});
        } catch (err) {
            const {message} = err as { message: string };
            return res.status(500).json({message});
        }
    }

    async withdraw(req: Request, res: Response) {
const {id} = req.params;
        const {amount} = req.body as { amount: number };
        try {
            const message = await this.customerService.withdraw(id, amount);
            if(!message) {
                return res.status(404).json({message: 'Customer not found'});
            } else if(message === 'Insufficient funds') {
                return res.status(400).json({message});
            }
            return res.status(200).json({message});
        } catch (err) {
            const {message} = err as { message: string };
            return res.status(500).json({message});
        }
    }

    async transfer(req: Request, res: Response) {
        const {senderId, receiverId} = req.params;
        const {amount} = req.body as { amount: number };

        try {
            const message = await this.customerService.transfer(senderId, receiverId, amount);
            if (!message) {
                return res.status(404).json({message: 'Transfer failed, please try again later.'});
            } else if(message === 'Insufficient funds') {
                return res.status(400).json({message});
            }

            return res.status(200).json({message: "Transfer successful"});
        } catch (err) {
            const {message} = err as { message: string };
            return res.status(500).json({message});
        }
    }
}