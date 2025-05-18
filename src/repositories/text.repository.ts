import { ITextRepository } from "./Itext.repository";
import { IText } from "../interfaces/text.interface";
import { Model } from "mongoose";

export class TextRepository implements ITextRepository {
    private textModel: Model<IText>;
    
    constructor(textModel: Model<IText>) {
        this.textModel = textModel;
    }

    async createText(text: IText): Promise<IText> {
        return this.textModel.create(text);
    }

    async getTextById(id: string): Promise<IText | null> {
        return this.textModel.findById(id).exec();
    }

    async updateText(id: string, text: Partial<IText>): Promise<IText | null> {
        return this.textModel.findByIdAndUpdate(id, text, { new: true });
    }

    async deleteText(id: string): Promise<boolean> {
        const result = await this.textModel.findByIdAndDelete(id);
        return !!result;
    }

    async getTextByUserId(userId: string): Promise<IText[]> {
        return this.textModel.find({ userId })
    }
}