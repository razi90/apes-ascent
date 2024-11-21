import { UserAssetVault } from "./UserAssetVault"

export interface Competition {
    start_date: Date
    end_date: Date
    user_vault: UserAssetVault[]
}