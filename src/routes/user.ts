import type {FastifyInstance} from 'fastify'
import {opt_user_create, opt_user_login, opt_user_password, opt_user_search, opt_user_find, opt_user_update, opt_user_delete, opt_user_get} from '../validations/schemas/user.js'
import bcryptjs from 'bcryptjs'
import {generate_token} from '#utils/jwt.js'
import cookie from '@fastify/cookie'
import bcrypt from 'bcryptjs'
import {User} from '#interfaces'
import {create_customer, update_user} from '#stripe_core/customer.js'

export const user = async (fastify: FastifyInstance) => {
    fastify.register(cookie, {secret: process.env.COOKIE_SECRET, hook: 'onRequest'})

    fastify.post('/', opt_user_create, async (req, res) => {
        const {name, email, password} = req.body as User
        try {
            const stripe_customer = await create_customer({name: name, email: email})

            const [user, cart] = await fastify.prisma.$transaction(async (prisma) => {
                const new_user = await fastify.prisma.user.create({
                data: {
                    name,
                    email,
                    password: await bcryptjs.hash(password, 10)
                },
                omit: {password: true}
                })
                await fastify.prisma.stripeProfile.create({
                data: {
                    id: stripe_customer.id,
                    user: {connect: {id: new_user.id}}
                    }
                })
                const new_cart = await fastify.prisma.cart.create({
                data: {
                    user: {connect: {id: new_user.id}}
                },
                include: {items: true}
                })
                return [new_user, new_cart]
            })

            const token = await generate_token({id: user.id, customerId: stripe_customer.id, role: user.role})
            return res
                .setCookie('token', token, {httpOnly: true, secure: true, sameSite: 'strict', path: '/', signed: true})
                .code(201)
                .send({user: {name: user.name, email: user.email}, cart})
        } catch (err) {
            return res.status(500).send({message: `Internal Server Error ${err}`})
        }
    })

        fastify.patch('/', opt_user_update, async (req, res) => {
        const {name, email} = req.body as User
        try {
            const user = await fastify.prisma.user.update({
                where: {id: req.user!.id},
                data: {
                    name: name,
                    email: email
                },
                omit: {password: true},
                include: {
                    stripeProfile: {select: {id: true}}
                }
            })
            await update_user(user.stripeProfile!.id, {name, email})
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
            await fastify.prisma.user.update({
                where: {id: req.user!.id},
                data: {password: await bcrypt.hash(password, 10)},
                omit: {password: true}
            })
            return res
                .status(200)
                .send({message: 'sucess'})
        } catch (err) {
            return res.status(401).send({message: 'User Not Found or Unauthorized'})
        }
    })

    fastify.delete('/', opt_user_delete, async (req, res) => {
        try {
            await fastify.prisma.reviews.deleteMany({
                where: {authorId: req.user!.id}
            })
            await fastify.prisma.user.delete({
                where: {id: req.user!.id},
                select: {name: true}
            })
            return res.status(200).send({message: 'sucess'})
        } catch (err) {
            return res.status(401).send({message: 'User Not Found or Unauthorized'})
        }
    })

    fastify.post('/login', opt_user_login, async (req, res) => {
        const {email, password} = req.body as User
        try {
            const user = await fastify.prisma.user.findUnique({
                where: {email},
                include: {stripeProfile: {select: {id: true}}, cart: true}
            })
            if (!(await bcryptjs.compare(password, user!.password))) return {verify: 'Password Incorrect'}
            const token = await generate_token({id: user!.id, customerId: user?.stripeProfile?.id, role: user!.role})
            return res
                .setCookie('token', token, {httpOnly: true, secure: true, sameSite: 'strict', path: '/', signed: true})
                .status(200)
                .send({user: {name: user!.name, email: user!.email}, cart: user!.cart})
        } catch (err) {
            return res.status(400).send({message: 'Email not Found'})
        }
    })

    fastify.get('/', opt_user_get, async (req, res) => {
        try {
            const user = await fastify.prisma.user.findUnique({
                where: {id: req.user!.id},
                omit: {password: true},
                include: {reviews: true, products: true, cart: {select: {items: true}}}
            })
            return res.status(200).send({user: {name: user!.name, email: user!.email}, cart: user!.cart})
        } catch (err) {
            return res.status(401).send({message: 'User Not Found or Unauthorized'})
        }
    })

    fastify.get('/users', opt_user_search, async (req, res) => {
        const {name} = req.query as {name: string}
        try {
            const user = await fastify.prisma.user.findMany({
                where: {
                    name: {
                        startsWith: name,
                        mode: 'insensitive'
                    }
                },
                select: {
                    id: true,
                    name: true
                }
            })
            return res.status(200).send({user})
        } catch (err) {
            return res.status(500).send({message: 'Internal Server Error'})
        }
    })

    fastify.get('/user/:id', opt_user_find, async (req, res) => {
        const {id} = req.params as {id?: string}
        try {
            const user = await fastify.prisma.user.findUnique({
                where: {id},
                omit: {password: true, role: true, email: true},
                include: {
                    products: {omit: {images: true}}
                }
            })
            return res.status(200).send({user})
        } catch (err) {
            return res.status(500).send({message: 'Internal Server Error'})
        }
    })
}