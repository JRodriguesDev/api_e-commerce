import type {FastifyInstance} from 'fastify'
import {opt_user_create, opt_user_login, opt_user_password, opt_user_update} from '#schemas/user.js'
import bcryptjs from 'bcryptjs'
import {generate_token} from '#utils/jwt.js'
import cookie from '@fastify/cookie'
import {auth_guard} from '#middllewares/authGuard.js'
import {User} from '#interfaces'
import bcrypt from 'bcryptjs'

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
            omit: {password: true}
        })
        const token = await generate_token({id: user.id})
        return res
            .setCookie('token', token, {httpOnly: true, secure: true, sameSite: 'strict', path: '/user', signed: true})
            .code(201)
            .send({user: {name: user.name, email: user.email}})
    })
    fastify.post('/login', opt_user_login, async (req, res) => {
        const {email, password} = req.body as {email: string, password: string}
        const user = await fastify.prisma.user.findUnique({
            where: {email}
        })
        if (!(await bcryptjs.compare(password, user!.password))) return {verify: 'Password Incorrect'}
        const token = await generate_token({id: user!.id})
        return res
            .setCookie('token', token, {httpOnly: true, secure: true, sameSite: 'strict', path: '/user', signed: true})
            .status(200)
            .send({user: {name: user!.name, email: user!.email}})
    })
    fastify.get('/', {preHandler: auth_guard}, async (req, res) => {
        const payload = req.body as {id: string} as User
        const user = await fastify.prisma.user.findUnique({
            where: {id: payload.id},
            omit: {password: true},
            include: {reviews: true}
        })
        return res.status(200).send({user: {name: user!.name, email: user!.email}})
    })
    fastify.patch('/', opt_user_update, async (req, res) => {
        const body = req.body
        const user = await fastify.prisma.user.update({
            where: {id: req.user!.id},
            data: {
                ...body!
            },
            omit: {password: true}
        })
        return res
            .status(200)
            .send({user: {name: user!.name, email: user!.email}})
    }) 
    fastify.patch('/password', opt_user_password, async (req, res) => {
        const {password} = req.body as {password: string}
        const user = await fastify.prisma.user.update({
            where: {id: req.user!.id},
            data: {password: await bcrypt.hash(password, 10)},
            omit: {password: true}
        })
        return res
            .status(200)
            .send({user: {name: user!.name, email: user!.email}})
    })
}