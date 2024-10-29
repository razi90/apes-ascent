use scrypto::prelude::*;

#[blueprint]
mod trade_vault {
    struct TradeVault {
        assets: KeyValueStore<ResourceAddress, Vault>,
    }

    impl TradeVault {
        pub fn instantiate(fusd: Bucket) -> Owned<TradeVault> {
            // Add FUSD to the assets
            let assets = KeyValueStore::new();
            assets.insert(fusd.resource_address(), Vault::with_bucket(fusd));

            Self { assets }.instantiate()
        }

        pub fn withdraw_asset(
            &mut self,
            resource_address: ResourceAddress,
            amount: Decimal,
        ) -> Bucket {
            let mut vault = self.assets.get_mut(&resource_address).unwrap();
            vault.take(amount)
        }

        pub fn deposit_asset(&mut self, asset: Bucket) {
            let entry = self.assets.get_mut(&asset.resource_address());
            if let Some(mut vault) = entry {
                info!(
                    "Add asset to existing vault for {:?}",
                    asset.resource_address()
                );
                vault.put(asset)
            } else {
                info!("Create new asset vault for {:?}", asset.resource_address());
                drop(entry);
                self.assets
                    .insert(asset.resource_address(), Vault::with_bucket(asset));
            }
        }
    }
}
