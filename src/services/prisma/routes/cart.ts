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
                stock: true,
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
    const cart = await prisma.$transaction(async (prisma) => {
        const cart = await prisma.cart.findUnique({
            where: {userId: id},
            select: {
                items: {include: {cart: true}}
            }
        })
        const products = await prisma.product.findMany({
            where: {id: {
                in: cart!.items.map(el => el.productId)
            }},
            select: {
                id: true,
                title: true,
                description: true,
                price: true,
                images: true,
                stock: true
            }
        })
        const update_data = cart!.items.map(el => {
            const product = products.find(p => p.id == el.productId)
            return {
                id: el.id,
                title: product!.title,
                description: product!.description,
                price: product?.price,
                images: product?.images,
                stock: product?.stock
            }
        })
        await Promise.all(update_data!.map(el => 
            prisma.cartItem.update({
                where: {id: el!.id},
                data: {
                    title: el?.title,
                    description: el?.description,
                    price: el?.price,
                    images: el?.images,
                    stock: el?.stock
                }
            })
        ))
        const new_cart = await prisma.cart.findUnique({
            where: {userId: id},
            include: {items: true}
        })
        return new_cart
    })
    prisma.$disconnect()
    return cart
}