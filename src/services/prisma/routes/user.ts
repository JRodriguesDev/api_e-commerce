import prisma  from '../index.js'

export const db_create_user = async (name: string, email: string, password: string, customer_id: string) => {
    const [user, cart] = await prisma.$transaction(async (prisma) => {
        const new_user = await prisma.user.create({
            data: {
                name,
                email,
                password: password,
                role: {create: {role: {connect: {name: 'CUSTOMER'}}}}
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

export const db_update_user = async (id: string, name: string, email: string) => {
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

export const db_user_password = async (id: string, password: string) => {
    const user = await prisma.user.update({
        where: {id: id},
        data: {password: password},
        omit: {password: true}
    })
    prisma.$disconnect()
    return user
}

export const db_delete_user = async (id: string) => {
    const data = await prisma.$transaction(async (prisma) => {
        const user = await prisma.user.delete({
        where: {id: id},
            select: {stripeProfile: {select: {id: true}}},
        })
        return user
    })
    prisma.$disconnect()
    return data
}

export const db_login_user = async (email: string) => {
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

export const db_get_user = async (id: string) => {
    const user = await prisma.user.findUnique({
        where: {id: id},
            omit: {password: true},
            include: {
                stripeProfile: true,
                role: {select: {role: {select: {name: true}}}}
            }
    })
    prisma.$disconnect()
    return user
}

export const db_search_user = async (name: string) => {
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

export const db_find_user = async (id: string) => {
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