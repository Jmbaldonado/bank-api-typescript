import {BankManagerService} from "../services/bank-manager.service";
import {Request, Response} from "express-serve-static-core";


export class BankManagerController {
    private bankManagerService: BankManagerService;

    constructor() {
        this.bankManagerService = new BankManagerService();
    }


    async getTotalBalance(_req: Request, res: Response) {
        const totalBalance = await this.bankManagerService.getTotalBalance();
        return res.status(200).json({data: {totalBalance}});
    }

     async getCustomers(req: Request<{}>, res: Response) {
        const customers = await this.bankManagerService.getCustomers();
        return res.status(200).json({data: customers});
    }
    async getCustomerById(req: Request, res: Response) {
        const {id} = req.params;
        try {
            const customer = await this.bankManagerService.getCustomerById(id);
            if(!customer) {
                return res.status(404).json({message: 'Customer not found'});
            }

            return res.status(200).json({data: customer});
        } catch(err) {
            const {message} = err as {message: string};
            return res.status(500).json({message});
        }
    }

}