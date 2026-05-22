import type { TransactionStatus } from "../../types";

const transactionStatusBadge: Record<string, string> = {
    'SUBMITTED': 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
    'APPROVED':  'bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300',
    'DONE': 'bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300',
    'CANCELLED': 'bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300',
    'REJECTED': 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300'
};

const transactionStatusStage: Record<TransactionStatus, [TransactionStatus, string][]> = {
    'SUBMITTED': [['APPROVED', 'Approve'], ['DONE', 'Done'], ['CANCELLED', 'Cancel'], ['REJECTED', 'Reject']],
    'APPROVED':  [['DONE', 'Done'], ['CANCELLED', 'Cancel'], ['REJECTED', 'Reject']],
    'DONE': [],
    'CANCELLED': [],
    'REJECTED': [],
};

export {
    transactionStatusBadge,
    transactionStatusStage
}