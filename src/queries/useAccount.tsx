import accountApiRequest from "@/apiRequests/account";
import { AccountResType } from "@/schemaValidations/account.schema";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useAccountMe = (
  uniqueKey: string,
  onSuccess?: (data: AccountResType) => void
) => {
  return useQuery({
    queryKey: [uniqueKey],
    queryFn: () =>
      accountApiRequest.me().then((res) => {
        if (onSuccess) onSuccess(res.payload);
        return res;
      }),
  });
};

export const useUpdateMeMutation = () => {
  return useMutation({
    mutationFn: accountApiRequest.updateMe,
  });
};

export const useChangePasswordMutation = () => {
  return useMutation({
    mutationFn: accountApiRequest.changePasswordV2,
  });
};
