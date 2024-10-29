use crate::oracle::simple_oracle::SimpleOracle;
use scrypto::prelude::*;

type LazySet<K> = KeyValueStore<K, ()>;

#[blueprint]
mod trade_simulator {

    // Enable method-based authorization for roles
    enable_method_auth! {
        roles {
            simulator_manager => updatable_by: [simulator_manager, OWNER];
        },
        methods {
            // Methods with public access
            trade => PUBLIC;

            // Methods with admin access
            add_new_resource => restrict_to: [simulator_manager, OWNER];
        }
    }

    // The TradeSimulator struct represents a component that allows trading between different resources.
    struct TradeSimulator {
        allowed_resources: LazySet<ResourceAddress>, // A set of resource addresses that are allowed for trading.
        oracle: Global<SimpleOracle>,                // Oracle component to fetch asset prices.
    }

    impl TradeSimulator {
        /// Instantiates a new TradeSimulator component.
        ///
        /// # Arguments
        ///
        /// * `simulator_manager` - Access rule defining who can manage the simulator.
        /// * `owner_role` - The owner role of the simulator.
        /// * `oracle_address` - The address of the oracle component used to get token prices.
        pub fn instantiate(
            simulator_manager: AccessRule,
            owner_role: OwnerRole,
            oracle_address: ComponentAddress,
        ) -> Global<TradeSimulator> {
            let oracle = oracle_address.into();

            Self {
                allowed_resources: KeyValueStore::new(),
                oracle,
            }
            .instantiate()
            .prepare_to_globalize(owner_role.clone())
            .roles(roles! {
                simulator_manager => simulator_manager;
            })
            .globalize()
        }

        /// Adds a new resource to the list of allowed resources for trading.
        ///
        /// # Arguments
        ///
        /// * `address` - The resource address of the new asset to be allowed for trading.
        pub fn add_new_resource(&mut self, address: ResourceAddress) {
            self.allowed_resources.insert(address, ());
        }

        /// Facilitates a trade by burning the input tokens and minting the equivalent amount of output tokens.
        ///
        /// # Arguments
        ///
        /// * `from_token` - A bucket of tokens to be traded.
        /// * `to_token_address` - The resource address of the token to be received.
        ///
        /// # Returns
        ///
        /// A bucket containing the newly minted tokens.
        pub fn trade(&mut self, from_token: Bucket, to_token_address: ResourceAddress) -> Bucket {
            // Assert that the asset to trade is whitelisted.
            assert!(
                self.allowed_resources
                    .get(&from_token.resource_address())
                    .is_some(),
                "The asset being traded is not allowed."
            );

            // Calculate the amount that needs to be minted.
            let to_token_amount_to_mint = self.calculate_amount_to_mint(
                &from_token.amount(),
                &from_token.resource_address(),
                &to_token_address,
            );

            // Burn the input tokens.
            from_token.burn();

            // Mint new tokens and send back.
            ResourceManager::from_address(to_token_address).mint(to_token_amount_to_mint)
        }

        /// Calculates the amount of tokens to mint based on the input token amount and token prices.
        ///
        /// # Arguments
        ///
        /// * `from_token_amount` - The amount of tokens being traded.
        /// * `from_token_address` - The resource address of the token being traded.
        /// * `to_token_address` - The resource address of the token to be received.
        ///
        /// # Returns
        ///
        /// The amount of tokens to be minted.
        fn calculate_amount_to_mint(
            &self,
            from_token_amount: &Decimal,
            from_token_address: &ResourceAddress,
            to_token_address: &ResourceAddress,
        ) -> Decimal {
            // Get the price of the token being traded.
            let from_token_price = self.oracle.get_price(*from_token_address);
            // Get the price of the token to be received.
            let to_token_price = self.oracle.get_price(*to_token_address);

            // Calculate the price ratio between the two tokens.
            let price_ratio = from_token_price
                .checked_div(to_token_price)
                .expect("Division by zero error");

            // Calculate the amount of tokens to mint.
            let to_token_amount = from_token_amount
                .checked_mul(price_ratio)
                .expect("Multiplication overflow")
                .checked_round(DIVISIBILITY_MAXIMUM, RoundingMode::ToZero)
                .expect("Rounding error");

            to_token_amount
        }
    }
}
