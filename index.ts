import express from 'express'
import { PrismaClient } from '@prisma/client'
import cors from 'cors'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const app = express()
app.use(cors())
app.use(express.json())

const PORT = process.env.PORT || 4001

const prisma = new PrismaClient({ log: ['query', 'error', 'warn', 'info'] })


function createToken(id: number) {
    return jwt.sign({ id: id }, process.env.MY_SECRET, { expiresIn: '3days' })
}

async function getUserFromToken(token: string) {
    const decodedToken = jwt.verify(token, process.env.MY_SECRET)
    const user = await prisma.user.findUnique({
        // @ts-ignore
        where: { id: decodedToken.id },
        select: {
            id: true, name: true, email: true, orders: { include: { orderItems: { include: { item: true } } } }, basketItems: { include: { item: true } }
        }
    })
    return user
}

app.post('/sign-in', async (req, res) => {
    const { email, password } = req.body
    try {
        const user = await prisma.user.findUnique({
            where: { email: email },
            include: { orders: { include: { orderItems: { include: { item: true } } } } } 
        })
        const passwordMatches = bcrypt.compareSync(password, user.password)
        if (user && passwordMatches) {
            const { id, name, email, orders } = user
            res.send({ user: { id, name, email, orders }, token: createToken(user.id) })
        } else {
            throw Error()
        }
    } catch (err) {
        res.status(400).send({ error: 'User/password invalid.' })
    }
})

app.post('/sign-up', async (req, res) => {
    const {email, password, name} = req.body

    try {
        const hash = bcrypt.hashSync(password, 8)
        const user = await prisma.user.create({
            data: {
                email: email,
                password: hash,
                name: name
            },
            select: {id: true, name: true, email: true, orders: true}
        })
        res.send({ user, token: createToken(user.id) })
    } catch (err) {
        res.status(400).send(err.message)
    }
})

// app.patch('/changePassword', async (req, res) => {
//     const { email, password } = req.body
//     const user = await prisma.user.findUnique({ where: { email: email } })

//     if (user) {
//         try {
//             const hash = bcrypt.hashSync(password, 8)
//             const updateUser = await prisma.user.update({ where: { email }, data: { password: hash } })
//             res.send({ updateUser, token: createToken(updateUser.id) })
//         } catch (err) {
//             // @ts-ignore
//             res.status(400).send(`<pre> ${err.message} </pre>`)
//         }
//     } else res.status(404).send({ error: "User not found" })

// })

app.get('/items', async (req, res) => {
    const items = await prisma.item.findMany()
    res.send(items)
})

app.get('/items/:id', async (req, res) => {
    const id = Number(req.params.id)
    try {
        const item = await prisma.item.findFirst({ where: { id: id } })
        if (item) {
            res.send(item)
        } else res.status(404).send({ error: 'Item not found.' })
    } catch (err) {
        // @ts-ignore
        res.status(400).send(`<pre>${err.message}</pre>`)
    }
})

app.get('/validate', async (req, res) => {
    const token = req.headers.authorization

    try {
        // @ts-ignore
        const user = await getUserFromToken(token)
        res.send(user)
    } catch (err) {
        res.status(400).send(err.message)
    }
})

app.get('/orders', async (req, res) => {
    const orders = await prisma.order.findMany({ include: { orderItems: { include: { item: true } } } })
    res.send(orders)
})

app.post('/orderItems', async (req, res) => {
    const { orderId, itemId, quantity } = req.body
    try {
        const doExists = await prisma.orderItem.findFirst({ where: {orderId: orderId, itemId: itemId} })
        if (doExists) throw new Error
        else {
            const newOrder = await prisma.orderItem.create({ data: { orderId: orderId, itemId: itemId, quantity: quantity } })
            res.send(newOrder)
        }

    } catch (err) {
        // @ts-ignore
        res.status(400).send(err.message)
    }
})

app.get('/basketItems', async (req, res) => {
    const basketItems = await prisma.basketItem.findMany( { include: { item: true } } )
    res.send(basketItems)
})

app.post('/basketItems', async (req, res) => {
    const { userId, itemId, quantity } = req.body
    try {
        const doExists = await prisma.basketItem.findFirst({ where: {userId: userId, itemId: itemId} })
        if (doExists) throw new Error
        else {
            const newOrder = await prisma.basketItem.create({ data: { userId: userId, itemId: itemId, quantity: quantity } })
            res.send(newOrder)
        }

    } catch (err) {
        // @ts-ignore
        res.status(400).send(err.message)
    }
})

app.listen(PORT, () => {
    console.log(`Server runing on: http://localhost:${PORT}/`)
})