import type {FastifyInstance} from 'fastify'
import cookie from '@fastify/cookie'
import {opt_category_create, opt_category_update, opt_category_delete} from '../validations/schemas/category.js'
import {Category} from '#interfaces'

export const category = async (fastify: FastifyInstance) => {
    fastify.register(cookie, {secret: process.env.COOKIE_SECRET, hook: 'onRequest'})
    fastify.post('/category', opt_category_create, async (req, res) => {
        const {name} = req.body as Category
        try {
            const category = await fastify.prisma.category.create({
                data: {name},
                select: {name: true}
            })
            return res.status(201).send({message: 'sucess'})
        } catch (err) {
            return res.status(500).send({message: 'Internal Server Error'})
        }
    })
    fastify.patch('/category/:id', opt_category_update, async (req, res) => {
        const {name} = req.body as Category
        const {id} = req.params as {id: string}
        try {
            const category = await fastify.prisma.category.update({
                where: {id},
                data: {name},
                select: {name: true}
            })
            return res.status(200).send({message: 'sucess'})
        } catch (err) {
            return res.status(500).send({message: 'Internal Server Error'})
        }
    })
    fastify.delete('/category/:id', opt_category_delete, async (req, res) => {
        const {id} = req.params as {id: string}
        try {
            const category = await fastify.prisma.category.delete({
                where: {id},
                select: {name: true}
            })
            return res.status(200).send({message: 'sucess'})
        } catch (err) {
            return res.status(500).send({message: 'Internal Server Error'})
        }
    })
    fastify.get('/', async (req, res) => {
        try {
            const category = await fastify.prisma.category.findMany({
                select: {id: true, name: true}
            })
            return res.status(200).send({category})
        } catch (err) {
            return res.status(500).send({message: 'Internal Server Error'})
        }
    })
}