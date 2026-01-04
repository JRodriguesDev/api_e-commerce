import type {FastifyInstance} from 'fastify'
import cookie from '@fastify/cookie'

import {opt_create_plan, opt_list_plan, opt_delete_plan, opt_update_plan} from '#schemas/plan.js'
import {db_create_plan, db_delete_plan, db_update_plan} from '#prisma_routes/plan.js'
import {plan_cache, plan_cache_reset} from '#db_cache/plan.js'
import {Plan} from '#interfaces/plan.js'

export const plan = async (fastify: FastifyInstance) => {
    fastify.register(cookie, {secret: process.env.COOKIE_SECRET, hook: 'onRequest'})

    fastify.post('/', opt_create_plan, async (req, res) => {
        try {
            const {name, price} = req.body as Plan
            await db_create_plan(name, price)
            await plan_cache_reset()
            return res.status(201).send({status: 'sucess'})
        } catch (err) {
            return res.status(401).send({message: `Unauthorized ${err}`})
        }
    })
    fastify.patch('/:planId', opt_update_plan, async (req, res) => {
        try {
            const {planId} = req.params as {planId: string}
            const {...data} = req.body as Plan
            await db_update_plan(planId, data)
            await plan_cache_reset()
            return res.status(200).send({status: 'sucess'})
        } catch (err) {
            return res.status(401).send({message: 'Unauthorized'})
        }
    })
    fastify.delete('/:planId', opt_delete_plan, async (req, res) => {
        try {
            const {planId} = req.params as {planId: string}
            await db_delete_plan(planId)
            await plan_cache_reset()
            return res.status(200).send({status: 'sucess'})
        } catch (err) {
            return res.status(401).send({message: 'Unauthorized'})
        }
    })
    fastify.get('/', opt_list_plan, async (req, res) => {
        try {
            const plans = await plan_cache()
            return res.status(200).send({status: 'sucess', plans})
        } catch (err) {
            return res.status(401).send({message: 'Unauthorized'})
        }
    })
} 