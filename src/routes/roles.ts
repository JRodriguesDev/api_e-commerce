import type {FastifyInstance} from 'fastify'
import cookie from '@fastify/cookie'

import {db_create_role, db_set_role, db_remove_role, db_delete_role, db_get_roles}  from '#prisma_routes/roles.js'
import {opt_get_roles, opt_create_role, opt_set_role, opt_remove_role, opt_delete_role, } from '#schemas/role.js'

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
    fastify.post('/', opt_create_role, async (req, res) => {
        try {
            const {name} = req.body as {name: string}
            await db_create_role(name)
            return res.status(201).send({status: 'sucess'})
        } catch (err) {
            return res.status(401).send('Unauthorized')
        }
    })
    fastify.patch('/set/:roleId', opt_set_role, async (req, res) => {
        try {
            const {roleId} = req.params as {roleId: string}
            const {role} = req.body as {role: string}
            await db_set_role(roleId, role)
            return res.status(200).send({status: 'sucess'})
        } catch (err) {
            return res.status(401).send('Unauthorized')
        }
    })
    fastify.patch('/:roleId', opt_remove_role, async (req, res) => {
        try {
            const {roleId} = req.params as {roleId: string}
            const {role} = req.body as {role: string}
            await db_remove_role(roleId, role)
            res.status(200).send({status: 'sucess'})
        } catch (err) {
            return res.status(401).send('Unauthorized')
        }
    })
    fastify.delete('/:roleId', opt_delete_role, async (req, res) => {
        try {
            const {roleId} = req.params as {roleId: string}
            await db_delete_role(roleId)
            return res.status(200).send({status: 'sucess'})
        } catch (err) {
            return res.status(401).send('Unauthorized')
        }
    })
}