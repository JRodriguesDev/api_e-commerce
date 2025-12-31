export interface orderCache {
    payment_intent_id?: string
    order_id?: string
    session_id?: string
    status?: 'PAID' | 'FAILED' | 'EXPIRE'
    mode?: 'payment' | 'subscription' | 'setup'
    totalAmount?: number
    planId?: string
    subscriptionId?: string
}