import prisma from '../index.js'

export const subscription_list = async (id: string) => {
    const subscriptions = await prisma.user.findUnique({
        where: {id: id},
        include: {subscriptions: true}
    })
    return subscriptions
}

export const subscription_delete = async (id: string) => {
    const subscription = await prisma.subscription.delete({
        where: {id: id}
    })
}