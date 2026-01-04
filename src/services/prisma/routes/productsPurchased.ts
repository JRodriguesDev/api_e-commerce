import prisma from '../index.js'

export const db_get_products = async (id: string) => {
    const products = await prisma.user.findUnique({
        where: {id: id},
        include: {productsPurchased: {omit: {userId: true, productId: true}}}
    })
    prisma.$disconnect()
    return products
}