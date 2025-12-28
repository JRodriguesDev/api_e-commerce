import stripe from '../index.js'

export const list_payments = async (id: string) => {
    const payment_list = await stripe.customers.listPaymentMethods(id)
    return {
        cards: payment_list.data.map(el => ({
            id: el.id,
            last4: el.card?.last4,
            exp_month: el.card?.exp_month,
            exp_year: el.card?.exp_year,
            funding: el.card?.funding,
            brand: el.card?.brand,
        }))
    }
}

export const remove_payment = async (id: string) => {
    const payment = await stripe.paymentMethods.detach(id)
    return {
        brand: payment.card?.brand,
        last4: payment.card?.last4
    }
}