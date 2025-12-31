export interface stripeProfile {
    id: string
}

export interface StripeLineItem {
    quantity: number
    price_data: {
        currency: string,
        unit_amount: number,
        product_data: {
            name: string,
            description: string,
            images?: string[]
        },
        recurring?: {interval: 'day' | 'week' | 'month' | 'year'}
    }
}