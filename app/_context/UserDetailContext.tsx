import type { InferSelectModel } from "drizzle-orm"
import type { Dispatch, SetStateAction } from "react"
import { createContext, useContext } from "react"

import type { Users } from "@/configs/schema"

export type UserDetails = InferSelectModel<typeof Users> & {
  momentalnoKrediti?: number | null
}

export type UserDetailContextType = {
  userDetail: UserDetails | null
  setUserDetail: Dispatch<SetStateAction<UserDetails | null>>
}

export const UserDetailContext = createContext<UserDetailContextType | null>(null)

export function useUserDetail(): UserDetailContextType {
  const ctx = useContext(UserDetailContext)
  if (!ctx) {
    throw new Error("useUserDetail must be used inside UserDetailContext.Provider")
  }
  return ctx
}
