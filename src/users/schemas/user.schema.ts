import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @ApiProperty({ description: 'The name of the user', example: 'John Doe' })
  @Prop()
  name: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
