import mongoose, { Schema, Document } from 'mongoose';

export interface IStop extends Document {
  name: string;
  code?: string;
  location: {
    type: 'Point';
    coordinates: [number, number]; // [lng, lat]
  };
  createdAt: Date;
  updatedAt: Date;
}

const StopSchema = new Schema<IStop>(
  {
    name: { type: String, required: true, trim: true },
    code: { type: String, trim: true },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
        // no default here; enforce explicit coordinates
      },
    },
  },
  { timestamps: true }
);

// Ensure 2dsphere index on location
StopSchema.index({ location: '2dsphere' });

export const Stop = mongoose.model<IStop>('Stop', StopSchema);
