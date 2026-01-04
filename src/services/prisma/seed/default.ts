import prisma from '../index.js'
import bcrypt  from 'bcryptjs'

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
        const user = await prisma.user.create({
            data: {
                name: 'root',
                email: 'root@gmail.com',
                password: await bcrypt.hash('admin123', 10),
                stripeProfile: {create: {id: 'dasa'}}
            },
            select: {id: true}
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