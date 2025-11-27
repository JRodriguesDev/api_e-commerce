import type {FastifyInstance} from 'fastify'
import {opt_user_create, opt_user_login} from '#schemas'
import bcryptjs from 'bcryptjs'

export const user = async (fastify: FastifyInstance) => {
    fastify.post('/', opt_user_create, async (req, res) => {
        const {name, email, password} = req.body as {name: string, email: string, password: string}
        const user = await fastify.prisma.user.create({
            data: {
                name,
                email,
                password: await bcryptjs.hash(password, 10)
            },
            select: {name: true}
        })
        return {user}
    })
    fastify.post('/login', opt_user_login, async (req, res) => {
        const {email, password} = req.body as {email: string, password: string}
        const user = await fastify.prisma.user.findUnique({
            where: {email},
            select: {password: true}
        })

        if (!(await bcryptjs.compare(password, user!.password))) return {verify: 'false'}
        return {verify: 'true'}
    })
}