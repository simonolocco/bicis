import express, { Request, Response } from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Get all bikes
app.get('/api/bikes', async (req: Request, res: Response) => {
    try {
        const bikes = await prisma.bike.findMany();
        res.json(bikes);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching bikes' });
    }
});

// Start a rental
app.post('/api/rentals/start', async (req: Request, res: Response): Promise<any> => {
    const { bikeId } = req.body;
    try {
        const bike = await prisma.bike.findUnique({ where: { id: Number(bikeId) } });
        if (!bike) return res.status(404).json({ error: 'Bike not found' });
        if (bike.isRented) return res.status(400).json({ error: 'Bike is already rented' });

        const rental = await prisma.rental.create({
            data: {
                bikeId: Number(bikeId),
                startTime: new Date(),
            },
        });

        await prisma.bike.update({
            where: { id: Number(bikeId) },
            data: { isRented: true },
        });

        res.json(rental);
    } catch (error) {
        res.status(500).json({ error: 'Error starting rental' });
    }
});

// End a rental
app.post('/api/rentals/end', async (req: Request, res: Response): Promise<any> => {
    const { bikeId } = req.body;
    try {
        // Find the active rental for this bike
        const activeRental = await prisma.rental.findFirst({
            where: {
                bikeId: Number(bikeId),
                endTime: null,
            },
        });

        if (!activeRental) return res.status(404).json({ error: 'No active rental found for this bike' });

        const endTime = new Date();
        const durationHours = (endTime.getTime() - activeRental.startTime.getTime()) / (1000 * 60 * 60);

        const bike = await prisma.bike.findUnique({ where: { id: Number(bikeId) } });

        if (!bike) return res.status(404).json({ error: 'Bike not found' });

        const totalCost = durationHours * bike.pricePerHour;

        const updatedRental = await prisma.rental.update({
            where: { id: activeRental.id },
            data: {
                endTime,
                totalCost,
            },
        });

        await prisma.bike.update({
            where: { id: Number(bikeId) },
            data: { isRented: false },
        });

        res.json(updatedRental);
    } catch (error) {
        res.status(500).json({ error: 'Error ending rental' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
