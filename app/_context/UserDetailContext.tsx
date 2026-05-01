import type { InferSelectModel } from "drizzle-orm"
import type { Dispatch, SetStateAction } from "react"
import { createContext } from "react"

import type { Users } from "@/configs/schema"

export type UserDetails = InferSelectModel<typeof Users> & {
  momentalnoKrediti?: number | null
}

type UserDetailContextType = {
  userDetail: UserDetails | null
  setUserDetail: Dispatch<SetStateAction<UserDetails | null>>
}

export const UserDetailContext = createContext<UserDetailContextType | null>(null)
