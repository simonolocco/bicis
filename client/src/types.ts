export interface Bike {
    id: number;
    name: string;
    description: string;
    pricePerHour: number;
    image: string;
    isRented: boolean;
}

export interface Rental {
    id: number;
    bikeId: number;
    startTime: string;
    endTime?: string;
    totalCost?: number;
}
