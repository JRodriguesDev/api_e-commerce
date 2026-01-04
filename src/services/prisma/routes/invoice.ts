import prisma from '../index.js'

export const db_list_invoice = async (id: string) => {
    const invoices = await prisma.user.findUnique({
        where: {id: id},
        include: {invoices: true}
    })
    return invoices
}