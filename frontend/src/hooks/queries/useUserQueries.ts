import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getMe, updateMe } from "@/services/user-service";
import { useUser } from "@/context/UserContext";

export const useGetMe = () => {
  return useQuery({
    queryKey: ["users", "me"],
    queryFn: getMe,
  });
};

export const useUpdateMe = () => {
  const queryClient = useQueryClient();
  const { setUser } = useUser();

  return useMutation({
    mutationFn: updateMe,
    onSuccess: async (data) => {
      queryClient.setQueryData(["users", "me"], data);
      setUser(data);
      await queryClient.invalidateQueries({ queryKey: ["users", "me"] });
    },
  });
};
