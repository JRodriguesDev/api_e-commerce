import prisma from '../index.js'

export const review_create = async (id: string, productId: string, rating: number, comment: string) => {
    const review = await prisma.reviews.create({
        data: {
            rating,
            comment,
            product: {connect: {id: productId}},
            author: {connect: {id: id}}
        },
        select: {
            comment: true,
            date: true,
            rating: true,
            id: true,
            author: {select: {name: true, id: true}}
        }
    })
    prisma.$disconnect()
    return review
}

export const review_update = async (id: string, author_id: string, body: {}) => {
    const review = await prisma.reviews.update({
        where: {id: id, authorId: author_id},
        data: {...body},
        select: {
            comment: true,
            date: true,
            rating: true,
            id: true,
            author: {select: {name: true, id: true}}
        }
    })
    prisma.$disconnect()
    return review
}

export const review_delete = async (id: string, author_id: string) => {
    const review = await prisma.reviews.delete({
        where: {id: id, authorId: author_id}
    })
    prisma.$disconnect()
}