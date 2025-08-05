import mongoose from 'mongoose';

export interface IBooking extends mongoose.Document {
   serviceId: mongoose.Types.ObjectId;
   taskioId: mongoose.Types.ObjectId;
   customerId: mongoose.Types.ObjectId;
   price: number;
   quantity: number;
   totalPrice: number;
   bookingDate: Date;
   bookingTime: string;
   address: string;
   city: string;
   state: string;
   zipCode: string;
   specialInstructions?: string;
   contactPhone: string;
   contactEmail: string;
   status: 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';
   createdAt: Date;
   updatedAt: Date;
}

const bookingSchema = new mongoose.Schema<IBooking>(
   {
      serviceId: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'Service',
         required: true,
      },
      taskioId: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'User',
         required: true,
      },
      customerId: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'User',
         required: true,
      },
      price: {
         type: Number,
         required: [true, 'Price is required'],
         min: [0, 'Price cannot be negative'],
      },
      quantity: {
         type: Number,
         required: [true, 'Quantity is required'],
         min: [1, 'Quantity must be at least 1'],
      },
      totalPrice: {
         type: Number,
         required: [true, 'Total price is required'],
         min: [0, 'Total price cannot be negative'],
      },
      bookingDate: {
         type: Date,
         required: [true, 'Booking date is required'],
      },
      bookingTime: {
         type: String,
         required: [true, 'Booking time is required'],
      },
      address: {
         type: String,
         required: [true, 'Address is required'],
         trim: true,
      },
      city: {
         type: String,
         required: [true, 'City is required'],
         trim: true,
      },
      state: {
         type: String,
         required: [true, 'State is required'],
         trim: true,
      },
      zipCode: {
         type: String,
         required: [true, 'ZIP code is required'],
         trim: true,
      },
      specialInstructions: {
         type: String,
         trim: true,
      },
      contactPhone: {
         type: String,
         required: [true, 'Contact phone is required'],
         trim: true,
      },
      contactEmail: {
         type: String,
         required: [true, 'Contact email is required'],
         trim: true,
      },
      status: {
         type: String,
         enum: ['pending', 'confirmed', 'in-progress', 'completed', 'cancelled'],
         default: 'pending',
      },
   },
   {
      timestamps: true,
   }
);

// Prevent mongoose from creating the model multiple times
export default mongoose.models.Booking || mongoose.model<IBooking>('Booking', bookingSchema); 