import { model, Schema } from 'mongoose';
import { IText } from '../interfaces/text.interface';

const textSchema = new Schema({
    content: { type: String, required: true },
    userId: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

// create the model
export const textModel = model<IText>('userText', textSchema);