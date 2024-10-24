use scrypto::prelude::*;

#[derive(Copy, Clone, Debug, PartialEq, Eq, PartialOrd, Ord, Hash, ScryptoSbor)]
pub struct Pair {
    pub base: ResourceAddress,
    pub quote: ResourceAddress,
}

#[derive(Copy, Clone, Debug, PartialEq, Eq, ScryptoSbor)]
pub struct PairPriceEntry {
    pub price: Decimal,
    pub observed_by_component_at: Instant,
}

#[blueprint]
mod simple_oracle {
    enable_method_auth! {
        roles {
            oracle_manager => updatable_by: [oracle_manager];
        },
        methods {
            set_price => restrict_to: [oracle_manager];
            get_price => PUBLIC;
        }
    }

    pub struct SimpleOracle {
        /// Maps the (base, quote) to the (price, updated_at).
        prices: KeyValueStore<Pair, PairPriceEntry>,
    }

    impl SimpleOracle {
        pub fn instantiate(
            oracle_manager: AccessRule,
            metadata_init: MetadataInit,
            owner_role: OwnerRole,
            address_reservation: Option<GlobalAddressReservation>,
        ) -> Global<SimpleOracle> {
            let address_reservation = address_reservation.unwrap_or_else(|| {
                Runtime::allocate_component_address(BlueprintId {
                    package_address: Runtime::package_address(),
                    blueprint_name: Runtime::blueprint_name(),
                })
                .0
            });

            Self {
                prices: KeyValueStore::new(),
            }
            .instantiate()
            .prepare_to_globalize(owner_role)
            .roles(roles! {
                oracle_manager => oracle_manager;
            })
            .metadata(ModuleConfig {
                init: metadata_init,
                roles: Default::default(),
            })
            .with_address(address_reservation)
            .globalize()
        }

        pub fn set_price(&mut self, base: ResourceAddress, quote: ResourceAddress, price: Decimal) {
            self.prices.insert(
                Pair { base, quote },
                PairPriceEntry {
                    price,
                    observed_by_component_at: Clock::current_time_rounded_to_minutes(),
                },
            )
        }

        pub fn get_price(
            &self,
            base: ResourceAddress,
            quote: ResourceAddress,
        ) -> (Decimal, Instant) {
            let PairPriceEntry {
                price,
                observed_by_component_at,
            } = *self
                .prices
                .get(&Pair { base, quote })
                .expect("Price not found for this resource");
            (price, observed_by_component_at)
        }
    }
}
