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

export const set_role = async (id: string, role: string) => {
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

export const remove_role = async (id: string, name: string) => {
    const role_delete = await prisma.$transaction(async (prisma) => {
        const role = await prisma.role.findUnique({
            where: {name: name},
            select: {id: true}
        })
        const user_role = await prisma.userRole.delete({
            where: {userId_roleId: {
                userId: id,
                roleId: role!.id
            }},
            select: {role: {select: {name: true}}}
        })
        return user_role
    })
    return role_delete
}