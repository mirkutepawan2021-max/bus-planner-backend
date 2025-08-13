import mongoose, { Schema, Document } from 'mongoose';

export interface IRoute extends Document {
  routeName: string;
  routeNumber: string;
  from: string;
  to: string;
  turnoutFromDepot: boolean;
  firstStop: String;
  upturnoutKm: number;
  downturnoutKm: number;
  upregularKm: number;
  downregularKm: number;
  timePerKm: number;
  schedule: string[]; // <-- ADDED
}

const RouteSchema = new Schema<IRoute>(
  {
    routeName: { type: String, required: true, trim: true, unique: true },
    routeNumber: { type: String, required: true, trim: true, unique: true },
    from: { type: String, required: true, trim: true },
    to: { type: String, required: true, trim: true },
    turnoutFromDepot: { type: Boolean, required: true, default: false },
    firstStop: { type: String, ref: 'Stop', required: false },
    upturnoutKm: { type: Number, required: true },
    downturnoutKm: { type: Number, required: true },
    upregularKm: { type: Number, required: true },
    downregularKm: { type: Number, required: true },
    timePerKm: { type: Number, required: true },
    schedule: { type: [String], required: false, default: [] }, // <-- ADDED
  },
  { timestamps: true }
);

RouteSchema.index({ routeName: 'text', from: 'text', to: 'text' });

export const Route = mongoose.model<IRoute>('Route', RouteSchema);
