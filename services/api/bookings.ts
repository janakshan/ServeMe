// services/api/bookings.ts
interface Booking {
  id: string;
  serviceId: string;
  serviceName: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  customerName: string;
  customerEmail: string;
  details: any;
}

const MOCK_BOOKINGS: Booking[] = [
  {
    id: '1',
    serviceId: '1',
    serviceName: 'Restaurant Booking',
    date: '2025-07-15',
    time: '19:00',
    status: 'confirmed',
    customerName: 'John Doe',
    customerEmail: 'john@example.com',
    details: {
      restaurantName: 'The Fine Dining',
      partySize: 4,
      specialRequests: 'Window seat preferred',
    },
  },
  {
    id: '2',
    serviceId: '1',
    serviceName: 'Hotel Booking',
    date: '2025-07-20',
    time: '15:00',
    status: 'pending',
    customerName: 'Jane Smith',
    customerEmail: 'jane@example.com',
    details: {
      hotelName: 'Grand Hotel',
      roomType: 'Deluxe Suite',
      nights: 3,
    },
  },
];

export const bookingsApi = {
  async getBookings(): Promise<Booking[]> {
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      return MOCK_BOOKINGS;
    } catch (error) {
      console.error('Error fetching bookings:', error);
      throw error;
    }
  },

  async createBooking(bookingData: Partial<Booking>): Promise<Booking> {
    try {
      const newBooking: Booking = {
        id: Date.now().toString(),
        serviceId: bookingData.serviceId || '',
        serviceName: bookingData.serviceName || '',
        date: bookingData.date || '',
        time: bookingData.time || '',
        status: 'pending',
        customerName: bookingData.customerName || '',
        customerEmail: bookingData.customerEmail || '',
        details: bookingData.details || {},
      };

      await new Promise(resolve => setTimeout(resolve, 1000));
      return newBooking;
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
  },

  async updateBookingStatus(bookingId: string, status: Booking['status']): Promise<void> {
    try {
      console.log(`Booking ${bookingId} status updated to: ${status}`);
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error('Error updating booking status:', error);
      throw error;
    }
  },
};
