import { useQuery } from "@tanstack/react-query";
import newRequest from "../utils/newRequest";
import { ContactType } from "../types";
import { getUser } from "../utils/localStorage";

const useAppData = () => {
  const currentUser = getUser();
  const contacts = useQuery<ContactType[]>({
    queryKey: ["contacts"],
    queryFn: async () => {
      const res = (await newRequest(`${currentUser.id}/contacts`)).data;
      console.log("contacts", res);
      return res.contacts;
    },
  });

  return { contacts };
};

export default useAppData;
