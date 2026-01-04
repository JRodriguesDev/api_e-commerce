import prisma from '../index.js'

export const db_get_roles = async () => {
    const roles = await prisma.role.findMany({
        select: {name: true}
    })
    return roles
}

export const db_create_role = async (name: string) => {
    const new_roles = await prisma.role.create({
        data: {name: name},
        select: {name: true}
    })
    prisma.$disconnect()
    return new_roles
}

export const db_set_role = async (id: string, role: string) => {
    await prisma.user.update({
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
}

export const db_remove_role = async (id: string, name: string) => {
    await prisma.$transaction(async (prisma) => {
        const role = await prisma.role.findUnique({
            where: {name: name},
            select: {id: true}
        })
        await prisma.userRole.delete({
            where: {userId_roleId: {
                userId: id,
                roleId: role!.id
            }},
            select: {role: {select: {name: true}}}
        })
    })
    prisma.$disconnect()
}

export const db_delete_role = async (id: string) => {
    await prisma.role.delete({
        where: {id: id}
    })
}