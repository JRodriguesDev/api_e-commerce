import prisma from '#prisma'
import type {Stripe} from 'stripe'
import {orderCache} from '#interfaces/order.js'

export const session_state_expire = async (data: orderCache) => {
    try {
        await prisma.order.update({
            where: {id: data.orderId},
            data: {
                status: 'EXPIRE',
                mode: data.mode,
                paymentType: data.paymentType
            }
        })
    } catch (err) {
        console.log(`Prisma ERR: ${err}`)
    }
}

export const payment_state_failed = async (data: orderCache) => {
    try {
        await prisma.order.update({
            where: {id: data.orderId},
            data: {
                status: 'FAILED',
                paymentType: data.paymentType,
                paymentError: data.paymentError,
                mode: data.mode,
                totalAmount: data.totalAmount,
                paymentIntentId: data.paymentIntentId
            }
        })
    } catch (err) {
        console.log(`Prisma ERR: ${err}`)
    }
}


export const payment_state_paid = async (data: orderCache) => {
    try {
        await prisma.$transaction(async (prisma) => {
            const order = await prisma.order.update({
                where: {id: data.orderId},
                data: {
                    status: 'PAID',
                    mode: data.mode,
                    paymentType: data.paymentType,
                    paymentIntentId: data.paymentIntentId,
                    totalAmount: Number(data.totalAmount)
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
                    stock: product.stock - el.quantity
                }
            })
            await Promise.all(new_stock!.map(el => prisma.product.update({
                where: {id: el?.id},
                data: {stock: el?.stock}
            })))
            await prisma.cartItem.deleteMany()
        })
    } catch (err) {
        console.log(`Prisma ERR: ${err}`)
    }
}

export const invoice_state_paid = async (data: orderCache) => {
    await prisma.$transaction(async (prisma) => {
        const invoice = await prisma.invoice.create({
            data: {
                id: data.invoiceId as string,
                totalAmount: data.totalAmount as number,
                status: 'paid',
                subscriptionId: data.subscriptionId as string,
                planId: data.planId as string,
                userId: data.userId as string
            },
            select: {userId: true}
        })
        await prisma.subscription.upsert({
            where: {
                id: data.subscriptionId as string,
            },
            create: {
                id: data.subscriptionId as string,
                plan: data.planId as string,
                status: 'active',
                userId: invoice.userId,
                description: data.description as string
            },
            update: {
                status: 'active',
                plan: data.planId as string
            }
        })
    })
}

export const subscription_state_update = async (data: orderCache) => {
    await prisma.subscription.update({
        where: {id: data.subscriptionId},
        data: {status: data.status}
    })
}