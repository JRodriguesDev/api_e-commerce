import type {FastifyInstance} from 'fastify'
import cookie from '@fastify/cookie'

import {opt_category_create, opt_category_update, opt_category_delete} from '../validations/schemas/category.js'
import {db_create_category, db_update_category, db_delete_category} from '#prisma_routes/category.js'
import {category_cache_reset, categoy_cache} from '#db_cache/category.js'
import {Category} from '#interfaces/category.js'

export const category = async (fastify: FastifyInstance) => {
    fastify.register(cookie, {secret: process.env.COOKIE_SECRET, hook: 'onRequest'})

    fastify.post('/', opt_category_create, async (req, res) => {
        try {
            const {name} = req.body as Category
            await db_create_category(name)
            await category_cache_reset()
            return res.status(201).send({status: 'sucess'})
        } catch (err) {
            return res.status(500).send({status: 'Internal Server Error'})
        }
    })
    fastify.patch('/:id', opt_category_update, async (req, res) => {
        try {
            const {name} = req.body as Category
            const {id} = req.params as {id: string}
            await db_update_category(id, name)
            await category_cache_reset()
            return res.status(200).send({status: 'sucess'})
        } catch (err) {
            return res.status(500).send({status: 'Internal Server Error'})
        }
    })
    fastify.delete('/:id', opt_category_delete, async (req, res) => {
        try {
            const {id} = req.params as {id: string}
            await db_delete_category(id)
            await category_cache_reset()
            return res.status(200).send({status: 'sucess'})
        } catch (err) {
            return res.status(500).send({status: `Internal Server Error ${err}`})
        }
    })
    fastify.get('/', async (req, res) => {
        try {
            const categories = await categoy_cache()
            return res.status(200).send({categories})
        } catch (err) {
            return res.status(500).send({status: 'Internal Server Error'})
        }
    })
}