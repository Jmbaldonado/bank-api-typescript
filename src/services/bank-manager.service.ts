import {Customer} from "../models/customer.model";
import axios from "axios";

export class BankManagerService {

    private readonly baseUrl: string;
    constructor() {
        this.baseUrl = "http://localhost:3001"
    }

    async getCustomers(): Promise<Customer[]> {
        try {
            const customers = await axios.get(`${this.baseUrl}/customers`);
            return customers.data;
        } catch(err){
            throw new Error('Failed to get customers');
        }
    }

    async getCustomerById(id: string): Promise<Customer | null> {
        try {
            const customer = await axios.get(`${this.baseUrl}/customers/${id}`);
            return customer.data;
        }catch(err) {
            if(axios.isAxiosError(err)){
                const {response} = err as {response: {status: number}};
                if(response.status === 404) {
                    return null;
                }
            }

            throw err;
        }

    }

      async getTotalBalance(): Promise<number>{
        const customers = await this.getCustomers();
        return customers.reduce((totalBalance, customer) => {
            return totalBalance + customer.balance;
        }, 0);
    }
}