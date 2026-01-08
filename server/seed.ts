import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const bikes = [
    {
        name: 'Mountain Explorer',
        description: 'Rugged mountain bike perfect for off-road trails.',
        pricePerHour: 15.0,
        image: 'https://images.unsplash.com/photo-1576435728678-be95e39e565d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    },
    {
        name: 'City Cruiser',
        description: 'Comfortable bike for navigating city streets.',
        pricePerHour: 10.0,
        image: 'https://images.unsplash.com/photo-1485965120184-e224f7a1d7f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    },
    {
        name: 'Speed Racer',
        description: 'Lightweight road bike for speed enthusiasts.',
        pricePerHour: 20.0,
        image: 'https://images.unsplash.com/photo-1532298229144-0ec0c57e3081?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    },
    {
        name: 'Electric Glide',
        description: 'E-bike with pedal assist for easy riding.',
        pricePerHour: 25.0,
        image: 'https://images.unsplash.com/photo-1571068316344-75bc76f778f7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    },
];

async function main() {
    console.log('Seeding database...');
    for (const bike of bikes) {
        const createdBike = await prisma.bike.create({
            data: bike,
        });
        console.log(`Created bike: ${createdBike.name}`);
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
