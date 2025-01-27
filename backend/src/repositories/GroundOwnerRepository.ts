import CrudRepository from "../helpers/CrudRepository";
import { Model, Types } from "mongoose";
import GroundOwner, { IGroundOwner } from "../models/groundOwnerModel";

export default class GroundOwnerRepository extends CrudRepository<
  IGroundOwner,
  Types.ObjectId
> {
  constructor() {
    super(GroundOwner as Model<IGroundOwner>);
  }
}
