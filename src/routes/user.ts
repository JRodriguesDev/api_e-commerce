import type {FastifyInstance} from 'fastify'
import {opt_user_create, opt_user_login} from '#schemas/user.js'
import bcryptjs from 'bcryptjs'
import {generate_token} from '#utils/jwt.js'
import cookie from '@fastify/cookie'
import {auth_guard} from '#middllewares/authGuard.js'
import {User} from '#interfaces'

export const user = async (fastify: FastifyInstance) => {
    fastify.register(cookie, {secret: process.env.COOKIE_SECRET, hook: 'onRequest'})
    fastify.post('/', opt_user_create, async (req, res) => {
        const {name, email, password} = req.body as {name: string, email: string, password: string}
        const user = await fastify.prisma.user.create({
            data: {
                name,
                email,
                password: await bcryptjs.hash(password, 10)
            },
            select: {id: true, name: true}
        })
        const token = await generate_token(user)
        return res
            .setCookie('token', token, {httpOnly: true, secure: true, sameSite: 'strict', path: '/user', signed: true})
            .code(201)
            .send({user})
    })
    fastify.post('/login', opt_user_login, async (req, res) => {
        const {email, password} = req.body as {email: string, password: string}
        const user = await fastify.prisma.user.findUnique({
            where: {email},
            omit: { email: true}
        })
        if (!(await bcryptjs.compare(password, user!.password))) return {verify: 'Password Incorrect'}
        const token = await generate_token({id: user!.id, name: user!.name})
        return res
            .setCookie('token', token, {httpOnly: true, secure: true, sameSite: 'strict', path: '/user', signed: true})
            .status(200)
            .send({user: {id: user!.id, name: user!.name}})
    })
    fastify.get('/', {preHandler: auth_guard}, async (req, res) => {
        const payload = req.body as {id: string} as User
        const user = await fastify.prisma.user.findUnique({
            where: {id: payload.id},
            omit: {password: true},
            include: {reviews: true}
        })
        return res.status(200).send({user})
    })
}