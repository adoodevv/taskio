import mongoose from 'mongoose';

export interface IService extends mongoose.Document {
   taskioId: mongoose.Types.ObjectId;
   title: string;
   category: string;
   tags: string[];
   description: string;
   pricingModel: 'hourly' | 'fixed' | 'package';
   priceRange: {
      min: number;
      max: number;
      currency: string;
   };
   isNegotiable: boolean;
   availability: {
      days: string[];
      times: string[];
      urgency: 'low' | 'medium' | 'high';
   };
   location: {
      type: 'in-person' | 'remote' | 'both';
      serviceRadius?: number;
      serviceArea?: string;
   };
   experience: {
      skills: string[];
      certifications: string[];
      yearsOfExperience: number;
   };
   portfolio: {
      images: string[];
      links: string[];
   };
   booking: {
      type: 'instant' | 'approval' | 'consultation';
      requirements: string[];
      cancellationPolicy: string;
   };
   additionalInfo: {
      estimatedDuration: string;
      equipmentProvided: string[];
      serviceType: 'individual' | 'group' | 'both';
   };
   isActive: boolean;
   createdAt: Date;
   updatedAt: Date;
}

const serviceSchema = new mongoose.Schema<IService>(
   {
      taskioId: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'User',
         required: true,
      },
      title: {
         type: String,
         required: [true, 'Service title is required'],
         trim: true,
         maxlength: [100, 'Title cannot be more than 100 characters'],
      },
      category: {
         type: String,
         required: [true, 'Service category is required'],
         trim: true,
      },
      tags: [{
         type: String,
         trim: true,
      }],
      description: {
         type: String,
         required: [true, 'Service description is required'],
         trim: true,
         maxlength: [1000, 'Description cannot be more than 1000 characters'],
      },
      pricingModel: {
         type: String,
         enum: ['hourly', 'fixed', 'package'],
         required: [true, 'Pricing model is required'],
      },
      priceRange: {
         min: {
            type: Number,
            required: [true, 'Minimum price is required'],
            min: [0, 'Price cannot be negative'],
         },
         max: {
            type: Number,
            required: [true, 'Maximum price is required'],
            min: [0, 'Price cannot be negative'],
         },
         currency: {
            type: String,
            default: 'USD',
         },
      },
      isNegotiable: {
         type: Boolean,
         default: false,
      },
      availability: {
         days: [{
            type: String,
            enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
         }],
         times: [{
            type: String,
            enum: ['morning', 'afternoon', 'evening', 'night'],
         }],
         urgency: {
            type: String,
            enum: ['low', 'medium', 'high'],
            default: 'medium',
         },
      },
      location: {
         type: {
            type: String,
            enum: ['in-person', 'remote', 'both'],
            required: [true, 'Service location type is required'],
         },
         serviceRadius: {
            type: Number,
            min: [0, 'Service radius cannot be negative'],
         },
         serviceArea: {
            type: String,
            trim: true,
         },
      },
      experience: {
         skills: [{
            type: String,
            trim: true,
         }],
         certifications: [{
            type: String,
            trim: true,
         }],
         yearsOfExperience: {
            type: Number,
            min: [0, 'Years of experience cannot be negative'],
            default: 0,
         },
      },
      portfolio: {
         images: [{
            type: String,
            trim: true,
         }],
         links: [{
            type: String,
            trim: true,
         }],
      },
      booking: {
         type: {
            type: String,
            enum: ['instant', 'approval', 'consultation'],
            required: [true, 'Booking type is required'],
         },
         requirements: [{
            type: String,
            trim: true,
         }],
         cancellationPolicy: {
            type: String,
            required: [true, 'Cancellation policy is required'],
            trim: true,
         },
      },
      additionalInfo: {
         estimatedDuration: {
            type: String,
            required: [true, 'Estimated duration is required'],
            trim: true,
         },
         equipmentProvided: [{
            type: String,
            trim: true,
         }],
         serviceType: {
            type: String,
            enum: ['individual', 'group', 'both'],
            required: [true, 'Service type is required'],
         },
      },
      isActive: {
         type: Boolean,
         default: true,
      },
   },
   {
      timestamps: true,
   }
);

// Prevent mongoose from creating the model multiple times
export default mongoose.models.Service || mongoose.model<IService>('Service', serviceSchema); 