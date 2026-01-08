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

// Start a rental with date range
app.post('/api/rentals/start', async (req: Request, res: Response): Promise<any> => {
    const { bikeId, userId, customerName, startTime, endTime } = req.body;
    try {
        const start = new Date(startTime);
        const end = new Date(endTime);

        const bike = await prisma.bike.findUnique({ where: { id: Number(bikeId) } });
        if (!bike) return res.status(404).json({ error: 'Bike not found' });

        // Check for overlaps
        const overlaps = await prisma.rental.findMany({
            where: {
                bikeId: Number(bikeId),
                OR: [
                    {
                        startTime: { lte: end },
                        expectedEndTime: { gte: start },
                        endTime: null
                    }
                ]
            }
        });

        if (overlaps.length > 0) {
            return res.status(400).json({ error: 'Bike is not available for the selected time range' });
        }

        const rental = await prisma.rental.create({
            data: {
                bikeId: Number(bikeId),
                userId: String(userId),
                customerName: customerName || "Guest User",
                startTime: start,
                expectedEndTime: end,
            },
        });

        // We no longer set bike.isRented globally true, because it depends on the time.
        // But for backward compatibility or current status, we might leave it.
        // However, the prompt asked for "days valid", so the main logic is the overlap check above.

        res.json(rental);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error starting rental' });
    }
});

// Get user rentals
app.get('/api/rentals/user/:userId', async (req: Request, res: Response): Promise<any> => {
    const { userId } = req.params;
    try {
        const rentals = await prisma.rental.findMany({
            where: { userId },
            include: { bike: true },
            orderBy: { startTime: 'desc' }
        });
        res.json(rentals);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching rentals' });
    }
});

// Get rentals for a specific bike (for availability)
app.get('/api/rentals/bike/:bikeId', async (req: Request, res: Response): Promise<any> => {
    const { bikeId } = req.params;
    try {
        const rentals = await prisma.rental.findMany({
            where: {
                bikeId: Number(bikeId),
                endTime: null, // Only active/future rentals
                expectedEndTime: { gte: new Date() } // Future only
            }
        });
        res.json(rentals);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching bike rentals' });
    }
});

// Get ALL rentals (Admin)
app.get('/api/rentals/all', async (req: Request, res: Response): Promise<any> => {
    try {
        const rentals = await prisma.rental.findMany({
            include: { bike: true },
            orderBy: { startTime: 'desc' }
        });
        res.json(rentals);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching all rentals' });
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
            orderBy: { startTime: 'asc' } // Get the earliest active one? Or just the one that started? 
            // Simplified: Just find one that hasn't ended.
        });

        if (!activeRental) return res.status(404).json({ error: 'No active rental found for this bike' });

        const endTime = new Date();
        const durationHours = (endTime.getTime() - activeRental.startTime.getTime()) / (1000 * 60 * 60);

        const bike = await prisma.bike.findUnique({ where: { id: Number(bikeId) } });

        if (!bike) return res.status(404).json({ error: 'Bike not found' });

        const totalCost = Math.max(0, durationHours * bike.pricePerHour);

        const updatedRental = await prisma.rental.update({
            where: { id: activeRental.id },
            data: {
                endTime,
                totalCost,
            },
        });

        res.json(updatedRental);
    } catch (error) {
        res.status(500).json({ error: 'Error ending rental' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
