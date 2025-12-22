import prisma from '../index.js'

export const order_create = async (id: string, session_id: string) => {
    await prisma.order.update({
        where: {id: id},
        data: {stripeSessionId: session_id}
    })
    prisma.$disconnect()
}