import prisma from '../index.js'

export const create_category = async (name: string) => {
    const category = await prisma.category.create({
        data: {name},
        select: {name: true}
    })
    prisma.$disconnect()
}

export const update_category = async (id: string, name: string) => {
    const category = await prisma.category.update({
        where: {id},
        data: {name},
        select: {name: true}
    })
    prisma.$disconnect()
}

export const delete_category = async (id: string) => {
    const category = await prisma.category.delete({
        where: {id},
        select: {name: true}
    })
    prisma.$disconnect()
}

export const all_categories = async () => {
    const category = await prisma.category.findMany({
        select: {id: true, name: true}
    })
    prisma.$disconnect()
    return category
}