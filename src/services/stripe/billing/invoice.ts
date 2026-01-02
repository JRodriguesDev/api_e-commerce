import stripe from '../index.js'

export const retrieve_invoice = async (id: string) => {
    const invoice = await stripe.invoices.retrieve(id)
    return invoice
}

export const pay_invoice = async (id: string) => {
    const invoice = await stripe.invoices.sendInvoice(id)
    return invoice
}