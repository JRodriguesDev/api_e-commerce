import type { FastifyRequest, FastifyReply } from 'fastify'
import {verify_token} from '#utils/jwt.js'

export const auth_guard = async (req: FastifyRequest, res: FastifyReply) => {
    if (!req.cookies.token) return res.status(428).send("Cookie Necessary")
    const cookie = req.unsignCookie(req.cookies.token!)
    if (!cookie.valid) return res.status(401).send("Unauthorized")
    const token = await verify_token(cookie.value!)
    req.user = {id: token.payload.id as string}
}