import prisma from '#prisma'
import type {Stripe} from 'stripe'
import {orderCache} from '#interfaces/order.js'

export const state_expire = async (data: orderCache) => {
    try {
        const order = await prisma.order.update({
            where: {id: data.order_id},
            data: {
                status: 'EXPIRE',
            }
        })
    } catch (err) {
        console.log(`Prisma ERR: ${err}`)
    }
}

export const state_failed = async (data: orderCache) => {
    try {
        const order = await prisma.order.update({
            where: {id: data.order_id},
            data: {
                status: 'FAILED',
                stripePaymentIntentId: data.payment_intent_id
            }
        })
    } catch (err) {
        console.log(`Prisma ERR: ${err}`)
    }
}

export const state_paid = async (data: orderCache) => {
    try {
        await prisma.$transaction(async (prisma) => {
            const order = await prisma.order.update({
                where: {id: data.order_id},
                data: {
                    status: 'PAID',
                    stripePaymentIntentId: data.payment_intent_id,
                },
                select: {userId: true}
            })
            const cart = await prisma.cart.findUnique({
                where: {userId: order.userId},
                include: {items: true}
            })
            await prisma.user.update({
                where: {id: order.userId},
                data: {
                    productsPurchased: {createMany: {
                        data: cart!.items.map(el => ({
                            productId: el.id,
                            name: el.title,
                            description: el.description,
                            quantity: el.quantity,
                            images: el.images
                        }))
                    }}
                },
                include: {productsPurchased: true}
            })
            const products = await prisma.product.findMany({
                where: {id: {in: cart?.items.map(el => el.productId)}},
                select: {id: true, stock: true}
            })
            const new_stock = cart?.items.map(el => {
                const product = products.find(p => p.id == el.productId)
                if (product) return {
                    id: product.id,
                    stock: product.stock - el.stock
                }
            })
            await Promise.all(new_stock!.map(el => prisma.product.update({
                where: {id: el?.id},
                data: {stock: el?.stock}
            })))
            await prisma.cartItem.deleteMany(/*{where: {id: {in: cart?.items.map(el => el.id)}}}*/)
        })
    } catch (err) {
        console.log(`Prisma ERR: ${err}`)
    }
}