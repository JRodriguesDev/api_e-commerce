import prisma from '../index.js'

export const create_cart = async (id: string, product_id: string, quantity: number) => {
    const cart_item = await prisma.$transaction(async (prisma) => {
        const product = await prisma.product.findUnique({
            where: {id: product_id},
            select: {
                images: true,
                title: true,
                description: true,
                price: true,
            }
        })
        const cart_id = await prisma.cart.findUnique({
            where: {userId: id},
                select: {id: true}
        })
        const new_cart_item = await prisma.cartItem.create({
            data: {
                cart: {connect: {id: cart_id!.id}},
                productId: product_id,
                quantity: quantity,
                ...product!
            },
            select: { quantity: true, productId: true}
        })
        return new_cart_item
    })
    prisma.$disconnect()
    return cart_item
}

export const update_cart = async (cart_id: string, quantity: number)  => {
    const cart_item = await prisma.cartItem.update({
        where: {id: cart_id},
        data: {
            quantity
        },
        select: {quantity: true, productId: true}
    })
    prisma.$disconnect()
    return cart_item
}

export const delete_cart_item = async (cart_id: string) => {
    const cart_item = await prisma.cartItem.delete({
        where: {id: cart_id},
        select: {productId: true}
    })
    prisma.$disconnect()
}

export const get_cart = async (id: string) => {
    const {products, cart} = await prisma.$transaction(async (prisma) => {
        const cart = await prisma.cart.findUnique({
            where: {userId: id},
            include: {
                items: {select: {cartId: true, productId: true, quantity: true}}
            }
        })
        const products = await prisma.product.findMany({
            where: {id: {
                in: cart?.items.map(el => el.productId)
            }},
            select: {
                id: true,
                thumbnail: true,
                title: true,
                price: true,
            }
        })
        return {products, cart}
    })
    prisma.$disconnect()
    return {products, cart}
}