import {Transaction} from "./transactions.model";

export interface Customer {
    id: string;
    name: string;
    balance: number;
    transactions: Transaction[];
}
