import mongoose, { Schema } from 'mongoose';
import IUserModel from '../model/IUserModel';

const schemaName = 'user';

const UserSchema: Schema = new Schema(
  {
    email: {
      type: mongoose.SchemaTypes.String,
      unique: true,
      index: true,
      required: true,
    },

    password: {
      type: mongoose.SchemaTypes.String,
      required: true,
    },

    firstName: {
      type: mongoose.SchemaTypes.String,
      required: true,
    },

    lastName: {
      type: mongoose.SchemaTypes.String,
      required: true,
    },

    phone: {
      type: mongoose.SchemaTypes.String,
      required: true,
    },

  },
  {
    timestamps: true
  }
);

UserSchema.plugin(require('mongoose-autopopulate'));

export default mongoose.model<IUserModel>(schemaName, UserSchema);