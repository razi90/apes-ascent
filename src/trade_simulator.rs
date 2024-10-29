use crate::oracle::simple_oracle::SimpleOracle;
use scrypto::prelude::*;

type LazySet<K> = KeyValueStore<K, ()>;

#[blueprint]
mod trade_simulator {
    struct TradeSimulator {
        allowed_resources: LazySet<ResourceAddress>,
        oracle: Global<SimpleOracle>,
    }

    impl TradeSimulator {
        pub fn instantiate(oracle_address: ComponentAddress) -> Global<TradeSimulator> {
            let oracle = oracle_address.into();

            Self {
                allowed_resources: KeyValueStore::new(),
                oracle,
            }
            .instantiate()
            .prepare_to_globalize(OwnerRole::None)
            .globalize()
        }

        pub fn add_new_resource(&mut self, address: ResourceAddress) {
            self.allowed_resources.insert(address, ());
        }

        pub fn trade(&mut self, from_token: Bucket, to_token_address: ResourceAddress) -> Bucket {
            // Assert that the asset to trade is whitelisted

            // calculate the amount that needs to be minted
            let to_token_amount_to_mint = self.calculate_amount_to_mint(
                &from_token.amount(),
                &from_token.resource_address(),
                &to_token_address,
            );

            // burn input tokens
            from_token.burn();

            // mint new tokens and send back
            ResourceManager::from_address(to_token_address).mint(to_token_amount_to_mint)
        }

        fn calculate_amount_to_mint(
            &self,
            from_token_amount: &Decimal,
            from_token_address: &ResourceAddress,
            to_token_address: &ResourceAddress,
        ) -> Decimal {
            // get from token price
            let from_token_price = self.oracle.get_price(*from_token_address);
            // get to token price
            let to_token_price = self.oracle.get_price(*to_token_address);

            // calculate price ratio
            let price_ratio = from_token_price.checked_div(to_token_price).unwrap();

            // calculate the amount of tokens to mint
            let to_token_amount = from_token_amount
                .checked_mul(price_ratio)
                .unwrap()
                .checked_round(DIVISIBILITY_MAXIMUM, RoundingMode::ToZero)
                .unwrap();

            to_token_amount
        }
    }
}
