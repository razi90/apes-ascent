use scrypto::prelude::*;

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
        prices: KeyValueStore<ResourceAddress, Decimal>,
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

        pub fn set_price(&mut self, address: ResourceAddress, price: Decimal) {
            self.prices.insert(address, price)
        }

        pub fn get_price(&self, address: ResourceAddress) -> Decimal {
            let price = *self
                .prices
                .get(&address)
                .expect("Price not found for this resource");
            price
        }
    }
}
