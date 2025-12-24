import {Prisma} from '../index.js'
import prisma from '../index.js'

export const create_roles = async () => {
    const new_roles = await prisma.role.createManyAndReturn({
        data: [
            {name: 'ADMIN'},
            {name: 'CUSTOMER'},
            {name: 'MODERATOR'},
            {name: 'SELLER'},
        ],
    select: {name: true}
    })
    prisma.$disconnect()
    return new_roles
}

export const set_role = async (id: string, role: any) => {
    const user_role = await prisma.user.update({
        where: {id: id},
        data: {
            role: {
                create: {
                    role: {connect: {name: role}}
                }
            }
        },
        include: {role: true}
    })
    prisma.$disconnect()
    return user_role
}