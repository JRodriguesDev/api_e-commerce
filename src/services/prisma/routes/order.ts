import prisma from '../index.js'

export const db_order_update = async (id: string, session_id: string) => {
    await prisma.order.update({
        where: {id: id},
        data: {sessionId: session_id}
    })
    prisma.$disconnect()
}

export const db_order_get = async (id: string) => {
    const orders = await prisma.user.findUnique({
        where: {id: id},
        include: {orders: true}
    })
    prisma.$disconnect()
    return orders
}