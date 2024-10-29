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
        prices: KeyValueStore<ResourceAddress, Decimal>, // Stores the price of each resource.
    }

    impl SimpleOracle {
        /// Instantiates a new SimpleOracle component.
        ///
        /// # Arguments
        ///
        /// * `oracle_manager` - Access rule defining who can manage the oracle.
        /// * `metadata_init` - Metadata for initializing the oracle component.
        /// * `owner_role` - The owner role of the oracle.
        /// * `address_reservation` - Optional reservation for a global address for the oracle.
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

        /// Sets the price for a given resource address.
        ///
        /// # Arguments
        ///
        /// * `address` - The resource address for which the price is to be set.
        /// * `price` - The price of the resource.
        pub fn set_price(&mut self, address: ResourceAddress, price: Decimal) {
            self.prices.insert(address, price)
        }

        /// Gets the price for a given resource address.
        ///
        /// # Arguments
        ///
        /// * `address` - The resource address for which the price is to be retrieved.
        ///
        /// # Returns
        ///
        /// The price of the resource.
        pub fn get_price(&self, address: ResourceAddress) -> Decimal {
            let price = *self
                .prices
                .get(&address)
                .expect("Price not found for this resource");
            price
        }
    }
}
