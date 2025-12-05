import type { FastifyRequest, FastifyReply } from 'fastify'

export const admin_guard = async (req: FastifyRequest, res: FastifyReply) => {
    if (req.user!.role !== 'ADMIN') return res.status(401).send({message: "Unauthorized"})
}