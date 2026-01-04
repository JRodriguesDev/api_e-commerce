import prisma from '../index.js'

export const db_stripe_profile = async (id: string) => {
    const user = await prisma.user.findUnique({
        where: {id: id},
        select: {stripeProfile: {select: {id: true}}}
    })
    return user!
}