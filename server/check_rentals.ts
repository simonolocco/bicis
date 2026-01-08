
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const count = await prisma.rental.count();
    console.log(`Rental count: ${count}`);
}

main();
