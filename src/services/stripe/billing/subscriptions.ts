import stripe from '../index.js'

export const update_subscription = async (id: string, method: string) => {
    const subscription = await stripe.subscriptions.update(
        id,
        {
            collection_method: method as any,
            days_until_due: 7
        }
    )
}

export const invoice_subscription = async (id: string) => {
    const subscription = await stripe.subscriptions.retrieve(id)
    return {invoice: subscription.latest_invoice}
}

export const delete_subscription = async (id: string) => {
    const subscription = await stripe.subscriptions.cancel(id)
    return subscription
}