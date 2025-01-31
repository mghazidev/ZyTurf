export namespace appModelTypes {
  export interface ApiResponseSuccess<T> {
    success: boolean;
    data: T;
  }

  // GroundOwner request structure
  export interface GroundOwnerRequest {
    fullname: string;
    contactNo: string;
    cnicFrontUrl: any | File;
    cnicBackUrl: any | File;
    groundLocation: string;
    paymentMethod: string;
  }

  // GroundOwner response structure
  export interface GroundOwner {
    _id: string;
    fullname: string;
    contactNo: string;
    cnicFrontUrl: string;
    cnicBackUrl: string;
    groundLocation: string;
    paymentMethod: string;
    createdAt: string;
    updatedAt: string;
  }
}
