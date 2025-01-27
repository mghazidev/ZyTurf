import { Document, Types } from "mongoose";

export namespace appModelTypes {
  /**
   * Abstract interface for CRUD Repository
   */
  export interface AbstractCrudRepository<
    M extends Document,
    Id extends Types.ObjectId
  > {
    bulkCreate(records: ReadonlyArray<M>): Promise<Array<M>>;
    save(values: M, options?: any): Promise<M>;
    findAll(filter?: any, options?: any): Promise<Array<M>>;
    findById(id: Id, options?: any): Promise<M | null>;
    findByOne(filter: any, options?: any): Promise<M | null>;
    updateByAny(filter: any, update: any, options?: any): Promise<M | null>;
    deleteByAny(filter: any, options?: any): Promise<void>;
    deleteById(id: Id, options?: any): Promise<void>;
    exist(filter: any, options?: any): Promise<boolean>;
  }

  /**
   * Interface for CRUD DAO
   */
  export interface ICrudDAO<M extends Document> {
    insertMany(records: ReadonlyArray<M>): Promise<M[]>;
    create(values: M): Promise<M>;
    findAll(filter?: any, options?: any): Promise<M[]>;
    findById(id: any, options?: any): Promise<M | null>;
    findByAny(filter: any, options?: any): Promise<M | null>;
    update(update: any, options: any): Promise<M | null>;
    updateByAny(filter: any, update: any, options?: any): Promise<M | null>;
    deleteByAny(filter: any, options?: any): Promise<void>;
    deleteById(id: any, options?: any): Promise<void>;
    exist(filter: any, options?: any): Promise<boolean>;
  }
}
