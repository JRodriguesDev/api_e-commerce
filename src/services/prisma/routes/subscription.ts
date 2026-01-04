import prisma from '../index.js'

export const db_subscription_list = async (id: string) => {
    const subscriptions = await prisma.user.findUnique({
        where: {id: id},
        include: {subscriptions: true}
    })
    return subscriptions
}

export const db_subscription_delete = async (id: string) => {
    const subscription = await prisma.subscription.delete({
        where: {id: id}
    })
}