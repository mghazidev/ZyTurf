import GroundOwnerRepository from "../repositories/GroundOwnerRepository";

import GroundOwnerDAOService from "./GroundOwnerDaoService";

const groundOwnerRepository = new GroundOwnerRepository();

const groundOwnerDAOService = new GroundOwnerDAOService(groundOwnerRepository);

export default groundOwnerDAOService;
