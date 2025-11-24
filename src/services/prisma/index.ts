import { PrismaClient } from './prisma/client.js';
import type {Prisma} from './prisma/client.js';


//@ts-ignore
const prisma = new PrismaClient()
export default prisma
export type {Prisma}
