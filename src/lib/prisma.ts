
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export default prisma;

export { userCrud } from './crud/user'
export { productCrud } from './crud/product'
export { categoryCrud } from './crud/category'
export { orderCrud } from './crud/order'
export { quoteCrud } from './crud/quote'
export { appointmentCrud } from './crud/appointment'
export { cartCrud } from './crud/cart'
export { invoiceCrud } from './crud/invoice'
export { expenseCrud } from './crud/expense'