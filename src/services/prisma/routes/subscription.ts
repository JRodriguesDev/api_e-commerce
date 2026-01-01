import prisma from '../index.js'

export const subscription_list = async (id: string) => {
    const subscriptions = await prisma.user.findUnique({
        where: {id: id},
        include: {subscriptions: true}
    })
    return subscriptions
}