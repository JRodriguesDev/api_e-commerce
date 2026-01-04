import prisma from '../index.js'


export const db_review_create = async (id: string, productId: string, comment: string) => {
    await prisma.reviews.create({
        data: {
            comment,
            product: {connect: {id: productId}},
            author: {connect: {id: id}}
        }
    })
    prisma.$disconnect()
}

export const db_review_update = async (id: string, author_id: string, body: {}) => {
    const review = await prisma.reviews.update({
        where: {id: id, authorId: author_id},
        data: {...body},
        select: {productId: true}
    })
    prisma.$disconnect()
    return review
}

export const db_review_delete = async (id: string, author_id: string) => {
    const review = await prisma.reviews.delete({
        where: {id: id, authorId: author_id},
        select: {productId: true}
    })
    prisma.$disconnect()
    return review
}