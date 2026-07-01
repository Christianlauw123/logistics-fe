import type { TransactionDetailStatus, TransactionStatus } from "@/types";

const transactionStatusBadge: Record<string, string> = {
    'SUBMITTED': 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
    'APPROVED':  'bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300',
    'DONE_AND_WAITING_DOCUMENT': 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
    'DONE': 'bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300',
    'REJECTED': 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300',
    'CANCELLED': 'bg-gray-50 text-gray-700 dark:bg-gray-950 dark:text-gray-300',
    'CANCELLED_NO_REFUND': 'bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300',
    'CANCELLED_AND_REFUND': 'bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300',
    'CANCELLED_FOR_REVISION': 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
};

const transactionStatusStage: Record<string, Record<TransactionStatus, [TransactionStatus, string][]>> = {
    'Super Admin': {
        // 'SUBMITTED': [['APPROVED', 'Approve'], ['DONE', 'Done'], ['CANCELLED', 'Cancel'], ['REJECTED', 'Reject'], ['DONE_AND_WAITING_DOCUMENT', 'Done - Menunggu Dokumen'], ['CANCELLED_NO_REFUND', 'Cancel - No Refund'], ['CANCELLED_AND_REFUND', 'Cancel - Refund Selesai']],
        // 'APPROVED': [['DONE', 'Done'], ['CANCELLED', 'Cancel'], ['REJECTED', 'Reject'], ['DONE_AND_WAITING_DOCUMENT', 'Done - Menunggu Dokumen'], ['CANCELLED_NO_REFUND', 'Cancel - No Refund'], ['CANCELLED_AND_REFUND', 'Cancel - Refund Selesai']],
        // 'DONE': [],
        // 'CANCELLED': [['CANCELLED_NO_REFUND', 'Cancel - No Refund'], ['CANCELLED_AND_REFUND', 'Cancel - Refund Selesai']],
        // 'REJECTED': [],
        // 'DONE_AND_WAITING_DOCUMENT': [['DONE', 'Done']],
        // 'CANCELLED_NO_REFUND': [],
        // 'CANCELLED_AND_REFUND': []
        'SUBMITTED': [
            ['APPROVED', 'Approve'],
            ['REJECTED', 'Reject'],
            ['CANCELLED', 'Cancel'],
            ['CANCELLED_NO_REFUND', 'Cancel - No Refund'],
            ['CANCELLED_AND_REFUND', 'Cancel - Refund Selesai'],
            ['DONE_AND_WAITING_DOCUMENT', 'Done - Menunggu Dokumen'],
            ['DONE', 'Done'],
        ],
        'APPROVED': [
            ['SUBMITTED', 'Submitted'],
            ['REJECTED', 'Reject'],
            ['CANCELLED', 'Cancel'],
            ['CANCELLED_NO_REFUND', 'Cancel - No Refund'],
            ['CANCELLED_AND_REFUND', 'Cancel - Refund Selesai'],
            ['DONE_AND_WAITING_DOCUMENT', 'Done - Menunggu Dokumen'],
            ['DONE', 'Done'],
        ],
        'DONE': [
            ['SUBMITTED', 'Submitted'],
            ['APPROVED', 'Approve'],
            ['REJECTED', 'Reject'],
            ['CANCELLED', 'Cancel'],
            ['CANCELLED_NO_REFUND', 'Cancel - No Refund'],
            ['CANCELLED_AND_REFUND', 'Cancel - Refund Selesai'],
            ['DONE_AND_WAITING_DOCUMENT', 'Done - Menunggu Dokumen'],
        ],
        'CANCELLED': [
            ['SUBMITTED', 'Submitted'],
            ['APPROVED', 'Approve'],
            ['REJECTED', 'Reject'],
            ['CANCELLED_NO_REFUND', 'Cancel - No Refund'],
            ['CANCELLED_AND_REFUND', 'Cancel - Refund Selesai'],
            ['DONE_AND_WAITING_DOCUMENT', 'Done - Menunggu Dokumen'],
            ['DONE', 'Done'],
        ],
        'REJECTED': [
            ['SUBMITTED', 'Submitted'],
            ['APPROVED', 'Approve'],            
            ['CANCELLED', 'Cancel'],
            ['CANCELLED_NO_REFUND', 'Cancel - No Refund'],
            ['CANCELLED_AND_REFUND', 'Cancel - Refund Selesai'],
            ['DONE_AND_WAITING_DOCUMENT', 'Done - Menunggu Dokumen'],
            ['DONE', 'Done'],
        ],
        'DONE_AND_WAITING_DOCUMENT': [
            ['SUBMITTED', 'Submitted'],
            ['APPROVED', 'Approve'],
            ['REJECTED', 'Reject'],
            ['CANCELLED', 'Cancel'],
            ['CANCELLED_NO_REFUND', 'Cancel - No Refund'],
            ['CANCELLED_AND_REFUND', 'Cancel - Refund Selesai'],
            ['DONE', 'Done'],
        ],
        'CANCELLED_NO_REFUND': [
            ['SUBMITTED', 'Submitted'],
            ['APPROVED', 'Approve'],
            ['REJECTED', 'Reject'],
            ['CANCELLED', 'Cancel'],
            ['CANCELLED_AND_REFUND', 'Cancel - Refund Selesai'],
            ['DONE_AND_WAITING_DOCUMENT', 'Done - Menunggu Dokumen'],
            ['DONE', 'Done'],
        ],
        'CANCELLED_AND_REFUND': [
            ['SUBMITTED', 'Submitted'],
            ['APPROVED', 'Approve'],
            ['REJECTED', 'Reject'],
            ['CANCELLED', 'Cancel'],
            ['CANCELLED_NO_REFUND', 'Cancel - No Refund'],
            ['DONE_AND_WAITING_DOCUMENT', 'Done - Menunggu Dokumen'],
            ['DONE', 'Done'],

        ],
    },

    'Staff': {
        'SUBMITTED': [['CANCELLED', 'Cancel']],
        'APPROVED': [['DONE', 'Done'], ['CANCELLED', 'Cancel'], ['DONE_AND_WAITING_DOCUMENT', 'Done - Menunggu Dokumen'], ['CANCELLED_NO_REFUND', 'Cancel - No Refund'], ['CANCELLED_AND_REFUND', 'Cancel - Refund Selesai']],
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

const transactionDetailStatusStage: Record<string, Record<TransactionDetailStatus, [TransactionDetailStatus, string][]>> = {
    'Super Admin': {
        'SUBMITTED': [
            ['APPROVED', 'Approve'],
            ['REJECTED', 'Reject'],
            ['CANCELLED', 'Cancel'],
            ['CANCELLED_FOR_REVISION', 'Cancel - Revisi'],
            ['DONE', 'Done']
        ],
        'APPROVED': [
            ['REJECTED', 'Reject'],
            ['CANCELLED', 'Cancel'],
            ['CANCELLED_FOR_REVISION', 'Cancel - Revisi'],
            ['DONE', 'Done']
        ],
        'REJECTED': [
            ['APPROVED', 'Approved'],
            ['CANCELLED', 'Cancel'],
            ['CANCELLED_FOR_REVISION', 'Cancel - Revisi'],
            ['DONE', 'Done']
        ],
        'CANCELLED': [
            ['APPROVED', 'Approved'],
            ['REJECTED', 'Reject'],
            ['CANCELLED_FOR_REVISION', 'Cancel - Revisi'],
            ['DONE', 'Done']
        ],
        'CANCELLED_FOR_REVISION': [
            ['APPROVED', 'Approved'],
            ['REJECTED', 'Reject'],
            ['CANCELLED', 'Cancel'],
            ['DONE', 'Done']
        ],
        'DONE': [
            ['APPROVED', 'Approved'],
            ['REJECTED', 'Reject'],
            ['CANCELLED', 'Cancel'],
            ['CANCELLED_FOR_REVISION', 'Cancel - Revisi'],
        ],
    },

    'Staff': {
        'SUBMITTED': [['CANCELLED', 'Cancel']],
        'APPROVED': [['CANCELLED', 'Cancel'],['DONE', 'Done']],
        'REJECTED': [],
        'CANCELLED': [],
        'CANCELLED_FOR_REVISION': [],
        'DONE': [],
    },
    'Operational': {
        'SUBMITTED': [],
        'APPROVED': [],
        'REJECTED': [],
        'CANCELLED': [],
        'CANCELLED_FOR_REVISION': [],
        'DONE': [],
    }
};


const allowedMainTransactionEdit = ['SUBMITTED']
const allowedMainTransactionEditDetailStatus = ['SUBMITTED', 'APPROVED']

const allowedAttachmentModification  = ['SUBMITTED', 'APPROVED', 'DONE_AND_WAITING_DOCUMENT']
const detailNotAllowedModify = ['TABUNGAN', 'CLAIM']
const detailTabunganClaimStatus = ['APPROVED', 'DONE']

export {
    transactionStatusBadge,
    transactionStatusStage,
    transactionDetailStatusStage,
    allowedMainTransactionEditDetailStatus,
    allowedAttachmentModification,
    allowedMainTransactionEdit,
    detailNotAllowedModify,
    detailTabunganClaimStatus
}