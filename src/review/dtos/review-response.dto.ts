import { Date, Schema } from "mongoose";

export default class ReviewResponseDTO {
  id: Schema.Types.ObjectId;
  title: string;
  body: string;
  packageId: Schema.Types.ObjectId;
  reviewerId: Schema.Types.ObjectId;
  votes: number;
  upvoterIds: Schema.Types.ObjectId[];
  downvoterIds: Schema.Types.ObjectId[];
  rating: number;
  updatedAt: Date;
}
