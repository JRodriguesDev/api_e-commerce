import type {FastifyInstance} from 'fastify'
import cookie from '@fastify/cookie'

import { db_set_role, db_remove_role, db_get_roles}  from '#prisma_routes/roles.js'
import {opt_get_roles, opt_set_role, opt_remove_role } from '#schemas/role.js'

export const role = async (fastify: FastifyInstance) => {
    fastify.register(cookie, {secret: process.env.COOKIE_SECRET, hook: 'onRequest'})

    fastify.get('/', opt_get_roles, async (req, res) => {
        try {
            const roles = await db_get_roles()
            return res.status(200).send({status: 'sucess', roles})
        } catch (err) {
            return res.status(401).send('Unauthorized')
        }
    })
    fastify.post('/set/:userId', opt_set_role, async (req, res) => {
        try {
            const {userId} = req.params as {userId: string}
            const {role} = req.body as {role: string}
            await db_set_role(userId, role)
            return res.status(200).send({status: 'sucess'})
        } catch (err) {
            return res.status(401).send('Unauthorized')
        }
    })
    fastify.patch('/:userId', opt_remove_role, async (req, res) => {
        try {
            const {userId} = req.params as {userId: string}
            const {role} = req.body as {role: string}
            await db_remove_role(userId, role)
            res.status(200).send({status: 'sucess'})
        } catch (err) {
            return res.status(401).send(`Unauthorized ${err}`)
        }
    })
}