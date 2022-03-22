import { Prisma, PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({ log: ['query', 'error', 'warn', 'info'] })

const users: Prisma.UserCreateInput[] = [
    {
        name: 'Ilir',
        email: 'ilir@email.com',
        password: 'ilir1234',
    },
    {
        name: 'Denis',
        email: 'denis@email.com',
        password: 'denis1234',

    },
    {
        name: 'Ed',
        email: 'ed@email.com',
        password: 'ed1234'
    }
]

const items: Prisma.ItemCreateInput[] = [
    {
        title: 'iPhone 12 pro max',
        image: 'https://www.apple.com/newsroom/images/product/iphone/standard/Apple_announce-iphone12pro_10132020_big.jpg.large.jpg',
        price: 979
    },
    {
        title: "Gildan Men's Fleece Crewneck Sweatshirt, Style G18000",
        image: 'https://m.media-amazon.com/images/I/61iDKNQdzOL._AC_UL480_FMwebp_QL65_.jpg',
        price: 9
    },
    {
        title: 'Beckham Hotel Collection Bed Pillows for Sleeping',
        image: 'https://m.media-amazon.com/images/I/31T51VsUJdS._AC_UL480_QL65_.jpg',
        price: 6.76
    },
    {
        title: 'Pokémon Assorted Cards, 50 Pieces',
        image: 'https://m.media-amazon.com/images/I/61VJWSztDcL._AC_UL480_QL65_.jpg',
        price: 289.99
    }
]

const orders = [
    {
        userId: 1,
        total: 0,
    },
    {
        userId: 2,
        total: 0,
    },
    {
        userId: 3,
        total: 0
    }
]

const orderItems = [
    {
        orderId: 1,
        itemId: 1,
        quantity: 1,
    },
    {
        orderId: 1,
        itemId: 1,
        quantity: 1,
    },
    {
        orderId: 3,
        itemId: 1,
        quantity: 1
    }

]

const basketItems = [
    {
        userId: 1,
        itemId: 4,
        quantity: 1
    }
]

async function createStuf() {
    for (const user of users) {
        await prisma.user.create({data: user})
    }
    for (const item of items) {
        await prisma.item.create({data: item})
    }
    for (const order of orders) {
        await prisma.order.create({ data: order })
    }
    for (const orderItem of orderItems) {
        // @ts-ignore
        await prisma.orderItem.create({ data: orderItem })
    }
    for (const basketItem of basketItems) {
        // @ts-ignore
        await prisma.basketItem.create({ data: basketItem })
    }
}

createStuf()