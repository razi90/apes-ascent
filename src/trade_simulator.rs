use crate::oracle::simple_oracle::SimpleOracle;
use scrypto::prelude::*;

#[blueprint]
mod trade_simulator {

    struct TradeSimulator {
        resource_managers: KeyValueStore<String, ResourceManager>,
        fusd_resource_manager: ResourceManager,
        oracle: Global<SimpleOracle>,
    }

    impl TradeSimulator {
        pub fn instantiate(oracle_address: ComponentAddress) -> Global<TradeSimulator> {
            let fusd_resource_manager = ResourceBuilder::new_fungible(OwnerRole::None)
                .divisibility(DIVISIBILITY_MAXIMUM)
                .metadata(metadata! {
                    init {
                        "name" => "Fake USD", locked;
                        "symbol" => "FUSD", locked;
                    }
                })
                .create_with_no_initial_supply();

            let oracle = oracle_address.into();

            Self {
                resource_managers: KeyValueStore::new(),
                fusd_resource_manager,
                oracle,
            }
            .instantiate()
            .prepare_to_globalize(OwnerRole::None)
            .globalize()
        }

        pub fn mint_fusd(&mut self, amount: Decimal) -> Bucket {
            self.fusd_resource_manager.mint(amount)
        }

        pub fn add_new_resource_manager(&mut self, name: String, symbol: String) {
            let resource_manager = ResourceBuilder::new_fungible(OwnerRole::None)
                .divisibility(DIVISIBILITY_MAXIMUM)
                .metadata(metadata! {
                    init {
                        "name" => name, locked;
                        "symbol" => symbol.clone(), locked;
                    }
                })
                .create_with_no_initial_supply();
            self.resource_managers.insert(symbol, resource_manager);
        }

        pub fn swap(&mut self, from_token: Bucket, to_token_symbol: String) -> Bucket {
            from_token.burn();
            self.resource_managers
                .get(&to_token_symbol)
                .unwrap()
                .mint(1)
        }
    }
}
