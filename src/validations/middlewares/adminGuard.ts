import type { FastifyRequest, FastifyReply } from 'fastify'

export const admin_guard = async (req: FastifyRequest, res: FastifyReply) => {
    if (!(req.user!.roles?.includes('ADMIN'))) return res.status(401).send({message: "Unauthorized"})
}

export const moderator_guard = async (req: FastifyRequest, res: FastifyReply) => {
    if (!(req.user!.roles?.includes('ADMIN')) || !(req.user!.roles.includes('MODERATOR'))) return res.status(401).send({message: "Unauthorized"})
}