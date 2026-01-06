import prisma from '../index.js'
import bcrypt  from 'bcryptjs'

import {create_customer} from '#stripe_core/customer.js'

// criando as roles e usuario padrao

export const default_roles = async () => {
    await prisma.role.createMany({
        data: [
            {name: 'CUSTOMER'},
            {name: 'SELLER'},
            {name: 'MODERATOR'},
            {name: 'ADMIN'}
        ]
    })
    prisma.$disconnect()
}

export const default_user = async () => {
        const customer = await create_customer({name: 'root', email: 'root@gmail.com'})
        const user = await prisma.user.create({
            data: {
                name: 'root',
                email: 'root@gmail.com',
                password: await bcrypt.hash('admin123', 10),
            },
            select: {id: true}
        })
        await prisma.stripeProfile.create({
            data: {
                id: customer.id,
                user: {connect: {id: user.id}}
            }
        })
        const new_cart = await prisma.cart.create({
            data: {
                user: {connect: {id: user.id}}
            },
            include: {items: true}
        })
        const roles = await prisma.role.findMany({select: {name: true}})
        for (const el of roles) {
            await prisma.user.update({
                where: {id: user.id},
                data: {
                    role: {create: {role: {connect: {name: el.name}}}}
                }
            })
        }
    prisma.$disconnect()
}