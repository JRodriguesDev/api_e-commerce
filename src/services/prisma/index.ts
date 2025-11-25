import { PrismaClient } from '../../prisma/client/client.js';
import type {Prisma} from '../../prisma/client/client.js';


//@ts-ignore
const prisma = new PrismaClient()
export default prisma
export type {Prisma}
