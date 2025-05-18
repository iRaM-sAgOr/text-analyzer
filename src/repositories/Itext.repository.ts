import { IText } from "../interfaces/text.interface";

// Dependency Inversion
export interface ITextRepository {
    createText(text: IText): Promise<IText>;
    getTextById(id: string): Promise<IText | null>;
    updateText(id: string, text: Partial<IText>): Promise<IText | null>;
    deleteText(id: string): Promise<boolean>;
    getTextByUserId(userId: string): Promise<IText[]>;
}