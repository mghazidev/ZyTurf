export const sendResponse = (
  res: any,
  statusCode: number,
  message: string,
  data: any = null
) => {
  return res.status(statusCode).json({
    success: statusCode >= 200 && statusCode < 300,
    message,
    data,
  });
};

export const sendError = (
  res: any,
  statusCode: number,
  message: string,
  errorDetails: any = null
) => {
  return res.status(statusCode).json({
    success: false,
    message,
    error: errorDetails,
  });
};
