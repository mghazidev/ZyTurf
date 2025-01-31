import useAxiosAuth from "../hook/useAxiosAuth";
import { appModelTypes } from "../@types/app-form";

export const useGroundOwnerApi = () => {
  const axiosAuth = useAxiosAuth();

  const createGroundOwner = async (
    formData: FormData
  ): Promise<appModelTypes.ApiResponseSuccess<any>> => {
    const response = await axiosAuth.post<
      appModelTypes.ApiResponseSuccess<any>
    >("/ground-owner/register", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  };

  const updateGroundOwner = async (
    groundOwnerId: string,
    requestParameters: appModelTypes.GroundOwnerRequest
  ): Promise<appModelTypes.ApiResponseSuccess<any>> => {
    const response = await axiosAuth.put<appModelTypes.ApiResponseSuccess<any>>(
      `/ground-owner/${groundOwnerId}`,
      requestParameters
    );
    return response.data;
  };

  const getGroundOwnerById = async (
    groundOwnerId: string
  ): Promise<appModelTypes.ApiResponseSuccess<any>> => {
    const response = await axiosAuth.get<appModelTypes.ApiResponseSuccess<any>>(
      `/ground-owner/${groundOwnerId}`
    );
    return response.data;
  };

  const getAllGroundOwners = async (): Promise<
    appModelTypes.ApiResponseSuccess<any>
  > => {
    const response = await axiosAuth.get<appModelTypes.ApiResponseSuccess<any>>(
      "/get-owners"
    );
    return response.data;
  };

  const deleteGroundOwner = async (
    groundOwnerId: string
  ): Promise<appModelTypes.ApiResponseSuccess<any>> => {
    const response = await axiosAuth.delete<
      appModelTypes.ApiResponseSuccess<any>
    >(`/ground-owner/${groundOwnerId}`);
    return response.data;
  };

  return {
    createGroundOwner,
    updateGroundOwner,
    getGroundOwnerById,
    getAllGroundOwners,
    deleteGroundOwner,
  };
};
