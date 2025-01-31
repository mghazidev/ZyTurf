import { useMutation, useQuery, useQueryClient } from "react-query";
import { useGroundOwnerApi } from "./groundOwnerApi";
import { appModelTypes } from "../@types/app-form";

export const useCreateGroundOwner = () => {
  const api = useGroundOwnerApi();
  const queryClient = useQueryClient();

  return useMutation<appModelTypes.ApiResponseSuccess<any>, Error, FormData>({
    mutationFn: (formData: FormData) => api.createGroundOwner(formData), // ensure mutationFn is used correctly
    onSuccess: async () => {
      await queryClient.invalidateQueries(["groundOwners"]);
    },
    onError: (error: Error) => {
      console.error("Error creating ground owner:", error);
    },
  });
};

export const useUpdateGroundOwner = (groundOwnerId: string) => {
  const api = useGroundOwnerApi();
  const queryClient = useQueryClient();

  return useMutation<
    appModelTypes.ApiResponseSuccess<any>,
    Error,
    appModelTypes.GroundOwnerRequest
  >({
    mutationFn: (requestParameters: appModelTypes.GroundOwnerRequest) => {
      return api.updateGroundOwner(groundOwnerId, requestParameters);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries(["groundOwners"]);
    },
    onError: (error: Error) => {
      console.error("Error updating ground owner:", error);
    },
  });
};

export const useGetGroundOwnerById = (groundOwnerId: string) => {
  const api = useGroundOwnerApi();

  return useQuery<appModelTypes.ApiResponseSuccess<any>, Error>(
    ["groundOwner", groundOwnerId],
    () => api.getGroundOwnerById(groundOwnerId),
    {
      onError: (error: Error) => {
        console.error("Error fetching ground owner by ID:", error);
      },
    }
  );
};

export const useGetAllGroundOwners = () => {
  const api = useGroundOwnerApi();

  return useQuery<appModelTypes.ApiResponseSuccess<any>, Error>(
    ["groundOwners"],
    api.getAllGroundOwners,
    {
      onError: (error: Error) => {
        console.error("Error fetching all ground owners:", error);
      },
    }
  );
};

export const useDeleteGroundOwner = (groundOwnerId: string) => {
  const api = useGroundOwnerApi();
  const queryClient = useQueryClient();

  return useMutation<appModelTypes.ApiResponseSuccess<any>, Error>({
    mutationFn: () => {
      return api.deleteGroundOwner(groundOwnerId);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries(["groundOwners"]);
    },
    onError: (error: Error) => {
      console.error("Error deleting ground owner:", error);
    },
  });
};
