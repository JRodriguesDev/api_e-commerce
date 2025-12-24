import prisma from '../index.js'

export const order_update = async (id: string, session_id: string) => {
    await prisma.order.update({
        where: {id: id},
        data: {stripeSessionId: session_id}
    })
    prisma.$disconnect()
}