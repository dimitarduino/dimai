import type { Dispatch, SetStateAction } from "react"
import { createContext } from "react"

export type MobileNavContextValue = {
  showBottomNav: boolean
  setShowBottomNav: Dispatch<SetStateAction<boolean>>
}

export const MobileNavContext = createContext<MobileNavContextValue>({
  showBottomNav: true,
  setShowBottomNav: () => {},
})
