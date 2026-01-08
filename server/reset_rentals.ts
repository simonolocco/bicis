
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    try {
        console.log('Deleting all rentals...');
        await prisma.rental.deleteMany({});
        console.log('All rentals deleted.');

        // Optional: Reset any legacy flags if they exist, though not used by logic
        // await prisma.bike.updateMany({ data: { isRented: false } });
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
