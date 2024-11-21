import { Asset } from "./Asset";

export interface UserAssetVault {
    userId: string
    assets: Map<string, number>
}