
//  Database schema for text
export interface IText {
    _id?: string;
    content: string;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
}