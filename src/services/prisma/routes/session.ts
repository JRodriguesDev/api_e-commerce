import prisma  from '../index.js'
import {StripeLineItem} from '#interfaces/stripe.js'

export const session_create = async (id: string) => {
    const user = await prisma.user.findUnique({
        where: {id: id},
        omit: {password: true},
        include: {
            stripeProfile: {select: {id: true}},
            cart: {include: {items: true}}
        }
    })
    const items = user!.cart!.items
    const line_items = items.map(item => {
    const unitAmountCents = Math.round(item.price * 100);
        return {
            quantity: item.quantity,
            price_data: {
                currency: 'brl',
                unit_amount: unitAmountCents,
                product_data: {
                    name: item.title,
                    description: item.description,
                    images: item.images
                }
            }
        } satisfies StripeLineItem
    })
    const order_data = await prisma.$transaction(async (prisma) => {
        const new_order = await prisma.order.create({
            data: {
                userId: user!.id,
            },
            select: {id: true}
        })
        await prisma.orderItem.createMany({
            data: items.map(item => ({
                orderId: new_order.id,
                productId: item.productId,
                productName: item.title,
                quantity: item.quantity,                        
                unitPriceAtPurchase: item.price,
                description: item.description,
            }))
        })
        return new_order
    })
    prisma.$disconnect()
    return {user, order_data, line_items}
}