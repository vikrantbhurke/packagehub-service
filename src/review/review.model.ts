import { getModelForClass, modelOptions, prop } from "@typegoose/typegoose";
import { Date, Document, Schema } from "mongoose";
import { Rating } from "./rating.enum";

@modelOptions({
  schemaOptions: {
    collection: "Reviews",
    timestamps: { createdAt: true, updatedAt: false },
  },
})
export class Review extends Document {
  @prop({ type: String, required: true, unique: false })
  title: string;

  @prop({ type: String, required: true })
  body: string;

  @prop({ type: Schema.Types.ObjectId, ref: "Package" })
  packageId: Schema.Types.ObjectId;

  @prop({ type: Schema.Types.ObjectId, ref: "User" })
  reviewerId: Schema.Types.ObjectId;

  @prop({ type: Number, default: 0 })
  votes: number;

  @prop({ type: Schema.Types.ObjectId, ref: "User", default: [] })
  upvoterIds: Schema.Types.ObjectId[];

  @prop({ type: Schema.Types.ObjectId, ref: "User", default: [] })
  downvoterIds: Schema.Types.ObjectId[];

  @prop({ enum: Rating, required: true })
  rating: Rating;

  @prop({ type: Boolean, default: false })
  isDeleted: boolean;

  @prop({ type: Date, default: Date.now })
  updatedAt: Date;
}

export default getModelForClass(Review);
