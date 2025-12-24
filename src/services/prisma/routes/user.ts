import prisma  from '../index.js'

export const user_create = async (name: string, email: string, password: string, customer_id: string) => {
    const [user, cart] = await prisma.$transaction(async (prisma) => {
        const new_user = await prisma.user.create({
            data: {
                name,
                email,
                password: password,
                role: {create: {role: {connect: {name: 'ADMIN'}}}}
            },
            omit: {password: true},
            include: {role: {select: {role: {select: {name: true}}}}}
        })
        await prisma.stripeProfile.create({
            data: {
                id: customer_id,
                user: {connect: {id: new_user.id}}
            }
        })
        const new_cart = await prisma.cart.create({
            data: {
                user: {connect: {id: new_user.id}}
            },
            include: {items: true}
        })
        return [new_user, new_cart]
    })
    prisma.$disconnect()
    return {user, cart}
}

export const user_update = async (id: string, name: string, email: string) => {
    const user = await prisma.user.update({
        where: {id: id},
        data: {
            name: name,
            email: email
        },
        omit: {password: true},
        include: {
            stripeProfile: {select: {id: true}}
        }
    })
    prisma.$disconnect()
    return user
}

export const user_password = async (id: string, password: string) => {
    const user = await prisma.user.update({
        where: {id: id},
        data: {password: password},
        omit: {password: true}
    })
    prisma.$disconnect()
    return user
}

export const user_delete = async (id: string) => {
    const data = await prisma.$transaction(async (prisma) => {
        await prisma.reviews.deleteMany({
            where: {authorId: id}
        })
        const user = await prisma.user.delete({
            where: {id: id},
            select: {name: true, stripeProfile: {select: {id: true}}}
        })
        return user
    })
    prisma.$disconnect()
    return {name: data.name, customer_id: data.stripeProfile!.id}
}

export const user_login = async (email: string) => {
    const user = await prisma.user.findUnique({
        where: {email},
        include: {
            stripeProfile: {select: {id: true}}, cart: true,
            role: {select: {role: {select: {name: true}}}}
        }
    })
    prisma.$disconnect()
    return user
}

export const user_get = async (id: string) => {
    const user = await prisma.user.findUnique({
        where: {id: id},
            omit: {password: true},
            include: {
                stripeProfile: true,
                cart: {include: {items: true}},
                role: {select: {role: {select: {name: true}}}}
            }
    })
    prisma.$disconnect()
    return user
}

export const user_search = async (name: string) => {
    const user = await prisma.user.findMany({
        where: {
            name: {
                startsWith: name,
                mode: 'insensitive'
            }
        },
        select: {
            id: true,
            name: true
        }
    })
    prisma.$disconnect()
    return user
}

export const user_find = async (id: string) => {
    const user = await prisma.user.findUnique({
        where: {id: id},
        omit: {password: true, /*role: true*/ email: true},
        include: {
            products: {omit: {images: true}}
        }
    })
    prisma.$disconnect()
    return user
}