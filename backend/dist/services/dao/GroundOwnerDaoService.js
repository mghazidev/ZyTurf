"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class GroundOwnerDAOService {
    constructor(groundOwnerRepository) {
        this.groundOwnerRepository = groundOwnerRepository;
    }
    insertMany(records) {
        return this.groundOwnerRepository.bulkCreate(records);
    }
    create(values) {
        return this.groundOwnerRepository.save(values);
    }
    findAll(filter, options) {
        return this.groundOwnerRepository.findAll(filter, options);
    }
    findById(id, options) {
        return this.groundOwnerRepository.findById(id, options);
    }
    findByAny(filter, options) {
        return this.groundOwnerRepository.findByOne(filter, options);
    }
    update(update, options) {
        return this.groundOwnerRepository.update(update, Object.assign({ new: true }, options));
    }
    updateByAny(filter, update, options) {
        return this.groundOwnerRepository.updateByAny(filter, update, options);
    }
    deleteByAny(filter, options) {
        return this.groundOwnerRepository.deleteByAny(filter, options);
    }
    deleteAll(options) {
        return this.groundOwnerRepository.deleteAll(options);
    }
    deleteById(id, options) {
        return this.groundOwnerRepository.deleteById(id, options);
    }
    exist(filter, options) {
        return this.groundOwnerRepository.exist(filter, options);
    }
}
exports.default = GroundOwnerDAOService;
