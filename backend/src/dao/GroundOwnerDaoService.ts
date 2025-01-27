import { FilterQuery, UpdateQuery, QueryOptions } from "mongoose";
import { IGroundOwner } from "../models/groundOwnerModel";
import GroundOwnerRepository from "../repositories/GroundOwnerRepository";

import { appModelTypes } from "../@types/app-model";
import ICrudDAO = appModelTypes.ICrudDAO;

export default class GroundOwnerDAOService implements ICrudDAO<IGroundOwner> {
  private groundOwnerRepository: GroundOwnerRepository;

  constructor(groundOwnerRepository: GroundOwnerRepository) {
    this.groundOwnerRepository = groundOwnerRepository;
  }

  insertMany(records: ReadonlyArray<IGroundOwner>): Promise<IGroundOwner[]> {
    return this.groundOwnerRepository.bulkCreate(records);
  }

  create(values: IGroundOwner): Promise<IGroundOwner> {
    return this.groundOwnerRepository.save(values);
  }

  findAll(
    filter?: FilterQuery<IGroundOwner>,
    options?: QueryOptions
  ): Promise<IGroundOwner[]> {
    return this.groundOwnerRepository.findAll(filter, options);
  }

  findById(id: any, options?: QueryOptions): Promise<IGroundOwner | null> {
    return this.groundOwnerRepository.findById(id, options);
  }

  findByAny(
    filter: FilterQuery<IGroundOwner>,
    options?: QueryOptions
  ): Promise<IGroundOwner | null> {
    return this.groundOwnerRepository.findByOne(filter, options);
  }

  update(
    update: UpdateQuery<IGroundOwner>,
    options: QueryOptions
  ): Promise<IGroundOwner | null> {
    return this.groundOwnerRepository.update(update, { new: true, ...options });
  }

  updateByAny(
    filter: FilterQuery<IGroundOwner>,
    update: UpdateQuery<IGroundOwner>,
    options?: QueryOptions
  ): Promise<IGroundOwner | null> {
    return this.groundOwnerRepository.updateByAny(filter, update, options);
  }

  deleteByAny(
    filter: FilterQuery<IGroundOwner>,
    options?: QueryOptions
  ): Promise<void> {
    return this.groundOwnerRepository.deleteByAny(filter, options);
  }

  deleteAll(options?: QueryOptions): Promise<void> {
    return this.groundOwnerRepository.deleteAll(options);
  }

  deleteById(id: any, options?: QueryOptions): Promise<void> {
    return this.groundOwnerRepository.deleteById(id, options);
  }

  exist(
    filter: FilterQuery<IGroundOwner>,
    options?: QueryOptions
  ): Promise<boolean> {
    return this.groundOwnerRepository.exist(filter, options);
  }
}
