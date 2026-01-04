import prisma from '../index.js'

export const db_create_plan = async (name: string, price: number) => {
    const plan = await prisma.plan.create({
        data: {
            name: name,
            price: price
        }
    })
    prisma.$disconnect()
}

export const db_update_plan = async (id: string ,data: {}) => {
    const plan = await prisma.plan.update({
        where: {id: id},
        data: {...data}
    })
}

export const db_delete_plan = async (id: string) => {
    const plan = await prisma.plan.delete({
        where: {id: id}
    })
}

export const db_list_plan = async () => {
    const plans = await prisma.plan.findMany()
    return plans
}