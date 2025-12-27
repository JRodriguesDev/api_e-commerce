import prisma from '../index.js'

export const order_update = async (id: string, session_id: string) => {
    await prisma.order.update({
        where: {id: id},
        data: {stripeSessionId: session_id}
    })
    prisma.$disconnect()
}

export const order_get = async (id: string) => {
    const orders = await prisma.user.findUnique({
        where: {id: id},
        include: {orders: true}
    })
    prisma.$disconnect()
    return orders
}