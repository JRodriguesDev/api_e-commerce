import prisma from '../index.js'

export const db_create_category = async (name: string) => {
    await prisma.category.create({
        data: {name},
    })
    prisma.$disconnect()
}

export const db_update_category = async (id: string, name: string) => {
    await prisma.category.update({
        where: {id},
        data: {name},
    })
    prisma.$disconnect()
}

export const db_delete_category = async (id: string) => {
    await prisma.category.delete({
        where: {id},
    })
    prisma.$disconnect()
}

export const db_all_categories = async () => {
    const category = await prisma.category.findMany({
        select: {id: true, name: true}
    })
    prisma.$disconnect()
    return category
}