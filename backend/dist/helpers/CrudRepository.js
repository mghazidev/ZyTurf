"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
class CrudRepository {
    constructor(model) {
        this.model = model;
    }
    bulkCreate(records) {
        return __awaiter(this, void 0, void 0, function* () {
            //@ts-ignore
            return this.model.insertMany(records);
        });
    }
    save(values, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.model.create([values], options);
            return result[0];
        });
    }
    findAll(filter, options) {
        return __awaiter(this, void 0, void 0, function* () {
            let query = filter ? this.model.find(filter) : this.model.find({}, options);
            if ((options === null || options === void 0 ? void 0 : options.search) && (options === null || options === void 0 ? void 0 : options.searchFields)) {
                const searchRegex = new RegExp(options === null || options === void 0 ? void 0 : options.search, "i");
                const searchConditions = options.searchFields.map((field) => ({
                    [field]: searchRegex,
                }));
                query = query.find({ $or: searchConditions });
            }
            // Sorting
            if (options === null || options === void 0 ? void 0 : options.sort) {
                query.sort(options.sort);
            }
            else {
                query.sort({ createdAt: -1 });
            }
            // Limiting
            if (options === null || options === void 0 ? void 0 : options.limit) {
                query.limit(options.limit);
            }
            // Skipping for pagination
            if (options === null || options === void 0 ? void 0 : options.skip) {
                query.skip(options.skip);
            }
            const today = new Date();
            const isNotToday = (date) => {
                const d = new Date(date);
                return (d.getDate() !== today.getDate() ||
                    d.getMonth() !== today.getMonth() ||
                    d.getFullYear() !== today.getFullYear());
            };
            if ((options === null || options === void 0 ? void 0 : options.from) &&
                (options === null || options === void 0 ? void 0 : options.to) &&
                (isNotToday(options.from) || isNotToday(options.to))) {
                query = query.find({
                    createdAt: {
                        $gte: new Date(options.from),
                        $lte: new Date(options.to),
                    },
                });
            }
            return query.exec();
        });
    }
    findById(id, options) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.model.findById(id, null, options).exec();
        });
    }
    findByIdPopulatePermissions(id, options) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.model
                .findById(id, null, options)
                .populate({ path: "permissions", options: { strictPopulate: false } })
                .exec();
        });
    }
    findByAnyPopulatePermissions(filter, options) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.model
                .findOne(filter, null, options)
                .populate({ path: "permissions", options: { strictPopulate: false } })
                .exec();
        });
    }
    findByOne(filter, options) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.model.findOne(filter, null, options).exec();
        });
    }
    update(update, options) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.model
                .updateOne(update, Object.assign({ new: true }, options))
                .exec();
        });
    }
    updateByAny(filter, update, options) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.model
                .findOneAndUpdate(filter, update, Object.assign({ new: true }, options))
                .exec();
        });
    }
    deleteByAny(filter, options) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.model.deleteOne(filter, options);
        });
    }
    deleteAll(options) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.model.deleteMany({}, options);
        });
    }
    deleteById(id, options) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.model.findByIdAndDelete(id, options);
        });
    }
    exist(filter, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const count = yield this.model
                .countDocuments(filter, options)
                .exec();
            return count > 0;
        });
    }
}
exports.default = CrudRepository;
