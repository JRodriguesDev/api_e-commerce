import type {FastifyInstance} from 'fastify'
import cookie from '@fastify/cookie'
import bcrypt from 'bcryptjs'

import {create_customer, update_customer, delete_customer} from '#stripe_core/customer.js'
import {db_create_user, db_update_user, db_user_password, db_delete_user, db_login_user, db_get_user, db_search_user, db_find_user} from '#prisma_routes/user.js'
import {opt_create_user, opt_login_user, opt_user_password, opt_search_user, opt_find_user, opt_update_user, opt_delete_user, opt_get_user} from '../validations/schemas/user.js'
import {generate_token} from '../services/jwt/index.js'
import {User} from '#interfaces/user.js'

export const user = async (fastify: FastifyInstance) => {
    fastify.register(cookie, {secret: process.env.COOKIE_SECRET, hook: 'onRequest'})

    fastify.post('/login', opt_login_user, async (req, res) => {
        try {
            const {email, password} = req.body as User
            const user = await db_login_user(email)
            if (!(await bcrypt.compare(password, user!.password))) return {verify: 'Password Incorrect'}
            const roles = user?.role.map(el => el.role.name)
            const token = await generate_token({id: user!.id, customerId: user?.stripeProfile?.id, roles: roles})
            return res
                .setCookie('token', token, {httpOnly: true, secure: true, sameSite: 'strict', path: '/', signed: true})
                .status(200)
                .send({status:'sucess'})
        } catch (err) {
            return res.status(400).send({message: 'Email not Found'})
        }
    })
    fastify.post('/', opt_create_user, async (req, res) => {
        try {
            const {name, email, password} = req.body as User
            const hash_password = await bcrypt.hash(password, 10)
            const stripe_customer = await create_customer({name: name, email: email})
            const {user, cart} = await db_create_user(name, email, hash_password, stripe_customer.id)
            const roles = user.role.map(el => el.role.name)
            const token = await generate_token({id: user.id, customerId: stripe_customer.id, roles: roles})
            return res
                .setCookie('token', token, {httpOnly: true, secure: true, sameSite: 'strict', path: '/', signed: true})
                .code(201)
                .send({status:'sucess'})
        } catch (err) {
            return res.status(500).send({message: `Internal Server Error ${err}`})
        }
    })
    fastify.patch('/', opt_update_user, async (req, res) => {
        try {
            const {name, email} = req.body as User
            const user = await db_update_user(req.user!.id, name, email)
            await update_customer(user.stripeProfile!.id, {name, email})
            return res
                .status(200)
                .send({status: 'sucess', user: {name: user!.name, email: user!.email}})
        } catch (err) {
            return res.status(401).send({message: 'User Not Found or Unauthorized'})
        }
    })
    fastify.delete('/', opt_delete_user, async (req, res) => {
        try {
            const user_data = await db_delete_user(req.user!.id)
            await delete_customer(user_data.stripeProfile!.id)
            return res.status(200).send({status: 'sucess'})
        } catch (err) {
            return res.status(401).send({message: `User Not Found or Unauthorized ${err}`})
        }
    })
    fastify.patch('/password', opt_user_password, async (req, res) => {
        const {password} = req.body as User
        try {
            const hash_password = await bcrypt.hash(password, 10)
            await db_user_password(req.user!.id, hash_password)
            return res
                .status(200)
                .send({status: 'sucess'})
        } catch (err) {
            return res.status(401).send({message: 'User Not Found or Unauthorized'})
        }
    })
    fastify.get('/', opt_get_user, async (req, res) => {
        try {
            const user = await db_get_user(req.user!.id)
            const roles = user!.role.map(el => el.role.name)
            const token = await generate_token({id: user!.id, customer_id: user?.stripeProfile!.id, roles: roles})
            return res
                .setCookie('token', token, {httpOnly: true, secure: true, sameSite: 'strict', path: '/', signed: true})
                .status(200)
                .send({user: {id: user!.id, name: user!.name, email: user!.email}, roles: user!.role.map(r => r.role.name)})
        } catch (err) {
            return res.status(401).send({message: `User Not Found or Unauthorized ${err}`})
        }
    })
    fastify.get('/user/:userId', opt_find_user, async (req, res) => {
        try {
            const {userId} = req.params as {userId: string}
            const user = await db_find_user(userId)
            return res.status(200).send({status: 'sucess', user})
        } catch (err) {
            return res.status(500).send({message: 'Internal Server Error'})
        }
    })
    fastify.get('/users', opt_search_user, async (req, res) => {
        try {
            const {name} = req.query as {name: string}
            const user = await db_search_user(name)
            return res.status(200).send({status: 'sucess', user})
        } catch (err) {
            return res.status(500).send({message: 'Internal Server Error'})
        }
    })
    
}