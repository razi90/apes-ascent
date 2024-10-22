use scrypto::prelude::*;

#[blueprint]
mod trade_vault {
    struct TradeVault {
        fake_usd_vault: Vault,
    }

    impl TradeVault {
        pub fn instantiate() -> Global<TradeVault> {
            let my_bucket: Bucket = ResourceBuilder::new_fungible(OwnerRole::None)
                .divisibility(DIVISIBILITY_MAXIMUM)
                .metadata(metadata! {
                    init {
                        "name" => "Fake USD", locked;
                        "symbol" => "FUSD", locked;
                    }
                })
                .mint_initial_supply(10000)
                .into();

            Self {
                fake_usd_vault: Vault::with_bucket(my_bucket),
            }
            .instantiate()
            .prepare_to_globalize(OwnerRole::None)
            .globalize()
        }

        pub fn trade(&mut self) {
            info!("My balance is: {} Fake USD!", self.fake_usd_vault.amount());
        }
    }
}
