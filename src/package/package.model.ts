import { getModelForClass, modelOptions, prop } from "@typegoose/typegoose";
import { Document } from "mongoose";
import { Platform } from "./platform.enum";

@modelOptions({ schemaOptions: { collection: "Packages", timestamps: true } })
export class Package extends Document {
  @prop({ type: String, required: true, unique: true })
  name: string;

  @prop({ type: String })
  description: string;

  @prop({ type: Number, required: true, default: 0 })
  rating: number;

  @prop({ type: Number, required: true, default: 0 })
  reviews: number;

  @prop({ type: String, required: true, default: "" })
  homepageUrl: string;

  @prop({ type: String, required: true, default: "" })
  packageUrl: string;

  @prop({ enum: Platform, required: true })
  platform: Platform;

  @prop({ type: Boolean, default: false })
  isDeleted: boolean;
}

export default getModelForClass(Package);
