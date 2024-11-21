import { UserAssetVault } from "./UserAssetVault"

export interface Competition {
    start_date: string
    end_date: string
    user_vault: UserAssetVault[]
}