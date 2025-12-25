import type {FastifyInstance} from 'fastify'
import cookie from '@fastify/cookie'

import {create_roles, set_role, remove_role}  from '#prisma_routes/roles.js'
import {opt_role_default, role_edit} from '#schemas/role.js'

export const role = async (fastify: FastifyInstance) => {
    fastify.register(cookie, {secret: process.env.COOKIE_SECRET, hook: 'onRequest'})

    fastify.post('/default', opt_role_default, async (req, res) => {
        try {
            const roles = await create_roles()
            return res.status(201).send({roles})
        } catch (err) {
            return res.status(401).send('Unauthorized')
        }
    })
    fastify.post('/set/:id', role_edit, async (req, res) => {
        try {
            const {id} = req.params as {id: string}
            const {role} = req.body as {role: string}
            const user_role = await set_role(id, role)
            return res.status(200).send({user_role})
        } catch (err) {
            return res.status(401).send('Unauthorized')
        }
    })
    fastify.delete('/:id', role_edit, async (req, res) => {
        try {
            const {id} = req.params as {id: string}
            const {role} = req.body as {role: string}
            const role_remove = await remove_role(id, role)
            res.status(200).send({role_remove})
        } catch (err) {
            return res.status(401).send('Unauthorized')
        }
    })
}