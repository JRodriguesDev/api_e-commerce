import prisma from '../index.js'

export const create_plan = async (name: string, discount: number, price: number) => {
    const plan = await prisma.plan.create({
        data: {
            name: name,
            discountPercent: discount,
            price: price
        },
        select: {
            name: true
        }
    })
    prisma.$disconnect()
    return plan
}

export const update_plan = async (id: string ,data: {}) => {
    const plan = await prisma.plan.update({
        where: {id: id},
        data: {...data},
        omit: {id: true}
    })
    return plan
}

export const delete_plan = async (id: string) => {
    const plan = await prisma.plan.delete({
        where: {id: id},
        select: {name: true}
    })
    return plan
}

export const list_plan = async () => {
    const plans = await prisma.plan.findMany()
    return plans
}