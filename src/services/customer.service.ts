import {Customer} from "../models/customer.model";
import {v4 as uuidv4} from 'uuid';
import {Transaction, TransactionType} from "../models/transactions.model";
import axios from "axios";

export class CustomerService {
    private readonly baseUrl: string;

    constructor() {
        this.baseUrl = "http://localhost:3001"
    }

    async createCustomer(name: string, initialDeposit: number): Promise<Customer> {
        try {
            const id = uuidv4();
            const customer: Customer = {id, name, balance: initialDeposit, transactions: []};
            const response = await axios.post(`${this.baseUrl}/customers`, customer);
            return response.data;
        } catch (err) {
            throw new Error('Failed to create customer');
        }
    }

    async getBalance(id: string): Promise<number | null> {
        try {
            const response = await axios.get(`${this.baseUrl}/customers/${id}`);
            return response.data.balance;
        } catch (err) {
            if (axios.isAxiosError(err)) {
                const {response} = err as { response: { status: number } };
                if (response.status === 404) {
                    return null;
                }
            }
            throw err;
        }
    }

    async deposit(id: string, amount: number): Promise<string | null> {
        try {
            const response = await axios.get(`${this.baseUrl}/customers/${id}`);
            const customer = response.data;

            customer.balance += amount;
            const transaction = this.createTransaction(amount, TransactionType.Deposit, id, id);
            customer.transactions?.push(transaction);

            await axios.put(`${this.baseUrl}/customers/${id}`, customer);
            return 'Deposit successful';
        } catch (err) {
            if (axios.isAxiosError(err)) {
                const {response} = err as { response: { status: number } };
                if (response.status === 404) {
                    return null;
                }
            }
            throw err;
        }
    }

    async withdraw(id: string, amount: number): Promise<string | null> {
        try {
            const response = await axios.get(`${this.baseUrl}/customers/${id}`);
            const customer = response.data;

            if (customer.balance < amount) {
                return 'Insufficient funds';
            }

            customer.balance -= amount;
            const transaction = this.createTransaction(amount, TransactionType.Withdraw, id, id);
            customer.transactions?.push(transaction);

            await axios.put(`${this.baseUrl}/customers/${id}`, customer);
            return 'Withdraw successful';
        } catch (err) {
            if (axios.isAxiosError(err)) {
                const {response} = err as { response: { status: number } };
                if (response.status === 404) {
                    return null;
                }
            }
            throw err;
        }
    }

    async transfer(senderId: string, receiverId: string, amount: number): Promise<string | null> {
        try {

            const [senderResponse, receiverResponse] = await Promise.all([
                 axios.get(`${this.baseUrl}/customers/${senderId}`),
                 axios.get(`${this.baseUrl}/customers/${receiverId}`)
            ]);
            const sender = senderResponse.data;
            const receiver = receiverResponse.data;

            if (sender.balance < amount) {
                return 'Insufficient funds';
            }

            sender.balance -= amount;
            receiver.balance += amount;

            const senderTransaction = this.createTransaction(amount, TransactionType.Transfer, senderId, receiverId);
            sender.transactions?.push(senderTransaction);

            const receiverTransaction = this.createTransaction(amount, TransactionType.Receive, senderId, receiverId);
            receiver.transactions?.push(receiverTransaction);


            await Promise.all([
                await axios.put(`${this.baseUrl}/customers/${senderId}`, sender),
                await axios.put(`${this.baseUrl}/customers/${receiverId}`, receiver)
            ])

            return 'Transfer successful';

        } catch (err) {
            if (axios.isAxiosError(err)) {
                const {response} = err as { response: { status: number } };
                if (response.status === 404) {
                    return null;
                }
            }
            throw err;
        }
    }

     createTransaction(amount: number, type: TransactionType, senderId = '', receiverId = '',): Transaction {
        return {
            id: uuidv4(),
            senderId,
            receiverId,
            amount,
            type,
            timestamp: new Date()
        }
    }
}

