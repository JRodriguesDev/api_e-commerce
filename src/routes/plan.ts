import type {FastifyInstance} from 'fastify'
import cookie from '@fastify/cookie'

import {opt_create_plan, opt_list_plan, opt_delete_plan, opt_update_plan} from '#schemas/plan.js'
import {create_plan, list_plan, delete_plan, update_plan} from '#prisma_routes/plan.js'

export const plan = async (fastify: FastifyInstance) => {
    fastify.register(cookie, {secret: process.env.COOKIE_SECRET, hook: 'onRequest'})

    fastify.post('/', opt_create_plan, async (req, res) => {
        try {
            const {name, discountPercent, price} = req.body as {name: string, discountPercent: number, price: number}
            const plan = await create_plan(name, discountPercent, price)
            return res.status(201).send({plan})
        } catch (err) {
            return res.status(401).send({message: `Unauthorized ${err}`})
        }
    })
    fastify.patch('/:id', opt_update_plan, async (req, res) => {
        try {
            const {id} = req.params as {id: string}
            const {...data} = req.body as {}
            const plan = await update_plan(id, data)
            return res.status(200).send({plan})
        } catch (err) {
            return res.status(401).send({message: 'Unauthorized'})
        }
    })
    fastify.delete('/:id', opt_delete_plan, async (req, res) => {
        try {
            const {id} = req.params as {id: string}
            const plan = await delete_plan(id)
            return res.status(200).send({plan})
        } catch (err) {
            return res.status(401).send({message: 'Unauthorized'})
        }
    })
    fastify.get('/', opt_list_plan, async (req, res) => {
        try {
            const plans = await list_plan()
            return res.status(200).send({plans})
        } catch (err) {
            return res.status(401).send({message: 'Unauthorized'})
        }
    })
} 