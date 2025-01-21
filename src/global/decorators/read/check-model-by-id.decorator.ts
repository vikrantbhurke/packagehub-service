import { Model } from "mongoose";

const checkModelById =
  (Model: Model<any>) =>
  (_target: any, _propertyKey: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;

    descriptor.value = async (...args: any[]) => {
      const id = args[0];
      const fieldDTO = args[1];
      const exists = await Model.exists({ _id: id, ...fieldDTO }).exec();
      args.push(!!exists);
      return originalMethod.apply(this, args);
    };

    return descriptor;
  };

export default checkModelById;
