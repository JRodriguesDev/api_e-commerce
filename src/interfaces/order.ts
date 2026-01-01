export interface orderCache {
    orderId?: string
    paymentIntentId?: string
    invoiceId?: string
    paymentType?: string[]
    paymentError?: string
    status?: 'PAID' | 'FAILED' | 'EXPIRE'
    mode?: 'payment' | 'subscription' | 'setup'
    totalAmount?: number
    planId?: string
    subscriptionId?: string
}