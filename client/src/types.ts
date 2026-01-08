export interface Bike {
    id: number;
    name: string;
    description: string;
    pricePerHour: number;
    category: string;
    image: string;
    isRented: boolean;
}

export interface Rental {
    id: number;
    bikeId: number;
    userId: string;
    customerName?: string;
    startTime: string;
    expectedEndTime?: string;
    endTime?: string;
    totalCost?: number;
}

export const _types = true;
