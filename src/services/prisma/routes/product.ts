import prisma from '../index.js'

export const db_create_product = async (id: string, data: any) => {
    const product = await prisma.product.create({
        data: {
            ...data,
            owner: {connect: {id: id}},
        }
    })
    prisma.$disconnect()
}

export const db_update_product = async (id: string, owner_id: string, data: any) => {
    const product = await prisma.product.update({
        where: {id: id, ownerId: owner_id},
        data: {...data},
    })
    prisma.$disconnect()
}

export const db_delete_product = async (id: string, owner_id: string) => {
    const product = await prisma.product.delete({
        where: {id: id, ownerId: owner_id}
    })
    prisma.$disconnect()
}

export const db_pages_product = async (limit: number, skip: number) => {
    const products = await prisma.product.findMany({
        take: limit,
        skip: skip,
        select: {
            id: true,
            title: true,
            description: true,
            price: true,
            category: true,
            thumbnail: true,
            stock: true,
            owner: {select: {name: true}},
        }
    })
    prisma.$disconnect()
    return products
}

export const db_category_products = async (category: string, limit: number, skip: number) => {
    const products = await prisma.product.findMany({
        where: {category: category},
        take: limit,
        skip: skip,
        select: {
            id: true,
            title: true,
            description: true,
            price: true,
            category: true,
            thumbnail: true,
            stock: true,
            owner: {select: {name: true}}
        },
    })
    prisma.$disconnect()
    return products
}

export const db_find_product = async (id: string) => {
    const product = await prisma.product.findUnique({
        where: {id: id},
        omit: {thumbnail: true},
        include: {
            reviews: {
                select: {
                    comment: true, 
                    date: true, 
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