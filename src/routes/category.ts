import type {FastifyInstance} from 'fastify'
import cookie from '@fastify/cookie'

import {opt_category_create, opt_category_update, opt_category_delete} from '../validations/schemas/category.js'
import {create_category, update_category, delete_category, all_categories} from '#prisma_routes/category.js'
import {Category} from '#interfaces/category.js'

export const category = async (fastify: FastifyInstance) => {
    fastify.register(cookie, {secret: process.env.COOKIE_SECRET, hook: 'onRequest'})

    fastify.post('/category', opt_category_create, async (req, res) => {
        try {
            const {name} = req.body as Category
            await create_category(name)
            return res.status(201).send({message: 'sucess'})
        } catch (err) {
            return res.status(500).send({message: 'Internal Server Error'})
        }
    })
    fastify.patch('/category/:id', opt_category_update, async (req, res) => {
        try {
            const {name} = req.body as Category
            const {id} = req.params as {id: string}
            await update_category(id, name)
            return res.status(200).send({message: 'sucess'})
        } catch (err) {
            return res.status(500).send({message: 'Internal Server Error'})
        }
    })
    fastify.delete('/category/:id', opt_category_delete, async (req, res) => {
        try {
            const {id} = req.params as {id: string}
            await delete_category(id)
            return res.status(200).send({message: 'sucess'})
        } catch (err) {
            return res.status(500).send({message: 'Internal Server Error'})
        }
    })
    fastify.get('/', async (req, res) => {
        try {
            const categories = await all_categories()
            return res.status(200).send({category})
        } catch (err) {
            return res.status(500).send({message: 'Internal Server Error'})
        }
    })
}