import type {FastifyInstance} from 'fastify'
import cookie from '@fastify/cookie'
import bcrypt from 'bcryptjs'

import {create_customer, update_customer, delete_customer} from '#stripe_core/customer.js'
import {user_create, user_update, user_password, user_delete, user_login, user_get,user_search , user_find, refresh_cart} from '#prisma_routes/user.js'
import {opt_user_create, opt_user_login, opt_user_password, opt_user_search, opt_user_find, opt_user_update, opt_user_delete, opt_user_get} from '../validations/schemas/user.js'
import {generate_token} from '../services/jwt/index.js'
import {User} from '#interfaces/user.js'

export const user = async (fastify: FastifyInstance) => {
    fastify.register(cookie, {secret: process.env.COOKIE_SECRET, hook: 'onRequest'})

    fastify.post('/login', opt_user_login, async (req, res) => {
        try {
            const {email, password} = req.body as User
            const user = await user_login(email)
            if (!(await bcrypt.compare(password, user!.password))) return {verify: 'Password Incorrect'}
            const roles = user?.role.map(el => el.role.name)
            const token = await generate_token({id: user!.id, customerId: user?.stripeProfile?.id, roles: roles})
            return res
                .setCookie('token', token, {httpOnly: true, secure: true, sameSite: 'strict', path: '/', signed: true})
                .status(200)
                .send({state:'sucess'})
        } catch (err) {
            return res.status(400).send({message: 'Email not Found'})
        }
    })
    fastify.post('/', opt_user_create, async (req, res) => {
        try {
            const {name, email, password} = req.body as User
            const hash_password = await bcrypt.hash(password, 10)
            const stripe_customer = await create_customer({name: name, email: email})
            const {user, cart} = await user_create(name, email, hash_password, stripe_customer.id)
            const roles = user.role.map(el => el.role.name)
            const token = await generate_token({id: user.id, customerId: stripe_customer.id, roles: roles})
            return res
                .setCookie('token', token, {httpOnly: true, secure: true, sameSite: 'strict', path: '/', signed: true})
                .code(201)
                .send({state:'sucess'})
        } catch (err) {
            return res.status(500).send({message: `Internal Server Error ${err}`})
        }
    })
    fastify.get('/', opt_user_get, async (req, res) => {
        try {
            const user = await user_get(req.user!.id)
            const roles = user!.role.map(el => el.role.name)
            const token = await generate_token({id: user!.id, customer_id: user?.stripeProfile!.id, roles: roles})
            return res
                .setCookie('token', token, {httpOnly: true, secure: true, sameSite: 'strict', path: '/', signed: true})
                .status(200)
                .send({user: {name: user!.name, email: user!.email}, cart: user!.cart, role: user!.role})
        } catch (err) {
            return res.status(401).send({message: 'User Not Found or Unauthorized'})
        }
    })
    fastify.patch('/', opt_user_update, async (req, res) => {
        try {
            const {name, email} = req.body as User
            const user = await user_update(req.user!.id, name, email)
            await update_customer(user.stripeProfile!.id, {name, email})
            return res
                .status(200)
                .send({user: {name: user!.name, email: user!.email}})
        } catch (err) {
            return res.status(401).send({message: 'User Not Found or Unauthorized'})
        }
    }) 
    fastify.patch('/password', opt_user_password, async (req, res) => {
        const {password} = req.body as User
        try {
            const hash_password = await bcrypt.hash(password, 10)
            await user_password(req.user!.id, hash_password)
            return res
                .status(200)
                .send({message: 'sucess'})
        } catch (err) {
            return res.status(401).send({message: 'User Not Found or Unauthorized'})
        }
    })
    fastify.delete('/', opt_user_delete, async (req, res) => {
        try {
            const user_data = await user_delete(req.user!.id)
            await delete_customer(user_data.customer_id)
            return res.status(200).send({message: 'sucess'})
        } catch (err) {
            return res.status(401).send({message: 'User Not Found or Unauthorized'})
        }
    })
    fastify.get('/users', opt_user_search, async (req, res) => {
        try {
            const {name} = req.query as {name: string}
            const user = await user_search(name)
            return res.status(200).send({user})
        } catch (err) {
            return res.status(500).send({message: 'Internal Server Error'})
        }
    })
    fastify.get('/user/:id', opt_user_find, async (req, res) => {
        try {
            const {id} = req.params as {id: string}
            const user = await user_find(id)
            return res.status(200).send({user})
        } catch (err) {
            return res.status(500).send({message: 'Internal Server Error'})
        }
    })
}