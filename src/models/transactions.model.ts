export interface Transaction {
    id: string;
    senderId: string;
    receiverId: string;
    amount: number;
    type: TransactionType;
    timestamp: Date;
}

export enum TransactionType {
    Deposit = 'deposit',
    Withdraw = 'withdraw',
    Transfer = 'transfer',
    Receive = 'receive'
}