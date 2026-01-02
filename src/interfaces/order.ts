export interface orderCache {
    orderId?: string
    paymentIntentId?: string
    invoiceId?: string
    paymentType?: string[]
    paymentError?: string
    status?: string
    mode?: 'payment' | 'subscription' | 'setup'
    totalAmount?: number
    planId?: string
    subscriptionId?: string
    userId?: string
    description?: string
}