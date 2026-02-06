import { TripInfo } from "@/app/create-new-trip/_components/ChatBox";
import { createContext, Dispatch, SetStateAction} from "react";

export type TripContextType = {
    tripDetailInfo: TripInfo | null,
    setTripDetailInfo: Dispatch<SetStateAction<TripInfo | null >>;
}
export const TripDetailContext = createContext<TripContextType | undefined>(undefined);