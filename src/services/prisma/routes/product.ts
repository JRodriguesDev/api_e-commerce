import prisma from '../index.js'

export const create_product = async (id: string, data: any) => {
    const product = await prisma.product.create({
        data: {
            ...data,
            owner: {connect: {id: id}},
        },
        select: {title: true}
    })
    prisma.$disconnect()
    return product
}

export const update_product = async (id: string, owner_id: string, data: any) => {
    const product = await prisma.product.update({
        where: {id: id, ownerId: owner_id},
        data: {...data},
        select: {title: true}
    })
    prisma.$disconnect()
    return product
}

export const delete_product = async (id: string, owner_id: string) => {
    const product = await prisma.product.delete({
        where: {id: id, ownerId: owner_id},
        select: {title: true}
    })
    prisma.$disconnect()
}

export const pages_product = async (limit: number, skip: number) => {
    const products = await prisma.product.findMany({
        take: limit,
        skip: skip,
        select: {
            id: true,
            title: true,
            description: true,
            price: true,
            rating: true,
            category: true,
            thumbnail: true,
            stock: true,
            owner: {select: {name: true}}
        }
    })
    prisma.$disconnect()
    return products
}

export const category_products = async (category: string, limit: number, skip: number) => {
    const products = await prisma.product.findMany({
        where: {category: category},
        take: limit,
        skip: skip,
        select: {
            id: true,
            title: true,
            description: true,
            price: true,
            rating: true,
            category: true,
            thumbnail: true,
            stock: true,
            owner: {select: {name: true}}
        },
    })
    prisma.$disconnect()
    return products
}

export const find_product = async (id: string) => {
    const product = await prisma.product.findUnique({
        where: {id: id},
        omit: {thumbnail: true},
        include: {
            reviews: {
                select: {
                    comment: true, 
                    date: true, 
                    rating: true, 
                    id: true, 
                    author: {select: {name: true, id: true}}
                }},
                owner: {select: {name: true, id: true}
            }
        }
    })
    prisma.$disconnect()
    return product
}