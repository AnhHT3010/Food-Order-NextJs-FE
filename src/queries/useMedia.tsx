import { mediaApiRequest } from "@/apiRequests/media";
import { useMutation } from "@tanstack/react-query";
import React from "react";

const useUploadMediaMutation = () => {
  return useMutation({
    mutationFn: mediaApiRequest.upload,
  });
};

export default useUploadMediaMutation;
