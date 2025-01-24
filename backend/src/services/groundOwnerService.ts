import GroundOwner, { IGroundOwner } from "../models/groundOwnerModel";

export const createGroundOwner: any = async (data: IGroundOwner) => {
  try {
    const newGroundOwner = new GroundOwner(data);
    await newGroundOwner.save();
    return newGroundOwner;
  } catch (error) {
    throw new Error("Failed to register ground owner");
  }
};

export const getGroundOwners: any = async () => {
  try {
    const groundOwners = await GroundOwner.find();
    return groundOwners;
  } catch (error) {
    throw new Error("Failed to fetch ground owners");
  }
};
