import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const bikes = [
    {
        name: 'Specialized S-Works Tarmac',
        description: 'The ultimate road racing machine. Aerodynamic, lightweight, and incredibly fast.',
        pricePerHour: 45.0,
        category: 'Road',
        image: '/images/road.png',
    },
    {
        name: 'Trek Fuel EXe',
        description: 'A quiet, powerful e-MTB that blends in with nature. Perfect for technical trails.',
        pricePerHour: 55.0,
        category: 'Electric',
        image: '/images/mountain.png',
    },
    {
        name: 'Cannondale Bad Boy',
        description: 'The ultimate urban commuter. Lefty fork, integrated lights, and aggressive style.',
        pricePerHour: 20.0,
        category: 'Urban',
        image: '/images/urban.png',
    },
    {
        name: 'Santa Cruz Megatower',
        description: 'A long-travel 29er built for the hardest enduro tracks in the world.',
        pricePerHour: 40.0,
        category: 'Mountain',
        image: '/images/mountain.png',
    },
    {
        name: 'VanMoof S5',
        description: 'Next-gen e-bike with anti-theft tech, turbo boost, and automatic shifting.',
        pricePerHour: 35.0,
        category: 'Electric',
        image: '/images/urban.png',
    },
    {
        name: 'Canyon Grizl',
        description: 'Rough gravel, bikepacking, and daily riding. This bike does it all.',
        pricePerHour: 25.0,
        category: 'Gravel',
        image: '/images/road.png',
    },
    {
        name: 'Brompton C Line',
        description: 'The classic folding bike. Ride it, fold it, take it anywhere.',
        pricePerHour: 15.0,
        category: 'Foldable',
        image: '/images/urban.png',
    },
    {
        name: 'Pinarello Dogma F',
        description: 'Seven of the last 11 Tours de France have been won on a Dogma.',
        pricePerHour: 60.0,
        category: 'Road',
        image: '/images/road.png',
    }
];

async function main() {
    console.log('Seeding database...');

    await prisma.rental.deleteMany();
    await prisma.bike.deleteMany();

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
