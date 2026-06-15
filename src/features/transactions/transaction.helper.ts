import type { TransactionStatus } from "@/types";

const transactionStatusBadge: Record<string, string> = {
    'SUBMITTED': 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
    'APPROVED':  'bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300',
    'DONE': 'bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300',
    'CANCELLED': 'bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300',
    'REJECTED': 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300',
    'DONE_AND_WAITING_DOCUMENT': 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300',
    'CANCELLED_NO_REFUND': 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300',
    'CANCELLED_AND_REFUND': 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300',
};

const transactionStatusStage: Record<string, Record<TransactionStatus, [TransactionStatus, string][]>> = {
    'Super Admin': {
        'SUBMITTED': [['APPROVED', 'Approve'], ['DONE', 'Done'], ['CANCELLED', 'Cancel'], ['REJECTED', 'Reject'], ['DONE_AND_WAITING_DOCUMENT', 'Done - Menunggu Dokument'], ['CANCELLED_NO_REFUND', 'Cancel - No Refund'], ['CANCELLED_AND_REFUND', 'Cancel - Refund Selesai']],
        'APPROVED': [['DONE', 'Done'], ['CANCELLED', 'Cancel'], ['REJECTED', 'Reject'], ['DONE_AND_WAITING_DOCUMENT', 'Done - Menunggu Dokument'], ['CANCELLED_NO_REFUND', 'Cancel - No Refund'], ['CANCELLED_AND_REFUND', 'Cancel - Refund Selesai']],
        'DONE': [],
        'CANCELLED': [['CANCELLED_NO_REFUND', 'Cancel - No Refund'], ['CANCELLED_AND_REFUND', 'Cancel - Refund Selesai']],
        'REJECTED': [],
        'DONE_AND_WAITING_DOCUMENT': [['DONE', 'Done']],
        'CANCELLED_NO_REFUND': [],
        'CANCELLED_AND_REFUND': []
    },

    'Staff': {
        'SUBMITTED': [['CANCELLED', 'Cancel']],
        'APPROVED': [['DONE', 'Done'], ['CANCELLED', 'Cancel'], ['DONE_AND_WAITING_DOCUMENT', 'Done - Menunggu Dokument'], ['CANCELLED_NO_REFUND', 'Cancel - No Refund'], ['CANCELLED_AND_REFUND', 'Cancel - Refund Selesai']],
        'DONE': [],
        'CANCELLED': [['CANCELLED_NO_REFUND', 'Cancel - No Refund'], ['CANCELLED_AND_REFUND', 'Cancel - Refund Selesai']],
        'REJECTED': [],
        'DONE_AND_WAITING_DOCUMENT': [['DONE', 'Done']],
        'CANCELLED_NO_REFUND': [],
        'CANCELLED_AND_REFUND': []
    },
    'Operational': {
        'SUBMITTED': [],
        'APPROVED': [],
        'DONE': [],
        'CANCELLED': [],
        'REJECTED': [],
        'DONE_AND_WAITING_DOCUMENT': [],
        'CANCELLED_NO_REFUND': [],
        'CANCELLED_AND_REFUND': []
    }
};

//  | "DONE_AND_WAITING_DOCUMENT" | "CANCELLED_NO_REFUND" | "CANCELLED_AND_REFUND"
const allowedMainTransactionEditDetailStatus = ['SUBMITTED', 'APPROVED']
const detailNotAllowedModify = ['TABUNGAN', 'CLAIM']
const detailTabunganClaimStatus = ['APPROVED', 'DONE']

export {
    transactionStatusBadge,
    transactionStatusStage,
    allowedMainTransactionEditDetailStatus,
    detailNotAllowedModify,
    detailTabunganClaimStatus
}