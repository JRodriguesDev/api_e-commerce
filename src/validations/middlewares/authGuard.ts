import type { FastifyRequest, FastifyReply } from 'fastify'
import {verify_token} from '#utils/jwt.js'

export const auth_guard = async (req: FastifyRequest, res: FastifyReply) => {
    const cookie = req.unsignCookie(req.cookies.token!)
    if (!cookie.valid) return res.status(401).send("Unauthorized")
    const token = await verify_token(cookie.value!)
    req.body = token.payload
}