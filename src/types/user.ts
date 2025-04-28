import { Document } from 'mongoose';
import { Timestamp } from 'rxjs';

export interface User extends Document {

   email: string;
   name: string;
   password: string;
   attempt: number;
   isDeleted: Boolean; 
   updatedAt: number;
   createdAt: number;

}