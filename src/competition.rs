use crate::trade_simulator::trade_simulator::TradeSimulator;
use crate::user_asset_vault::user_asset_vault::UserAssetVault;

use scrypto::prelude::*;

#[derive(ScryptoSbor, ManifestSbor)]
struct CompetitionData {
    competition_start: Instant,
    competition_end: Instant,
}

#[blueprint]
mod competition {

    enable_method_auth! {
        roles {
            admin => updatable_by: [admin, OWNER];
        },
        methods {
            // Methods with public access
            register => PUBLIC;
            trade => PUBLIC;
            get_competition_start_time => PUBLIC;
            get_competition_end_time => PUBLIC;

            // Methods with admin access
            set_competition_start_time => restrict_to: [admin, OWNER];
            set_competition_end_time => restrict_to: [admin, OWNER];
        }
    }

    struct Competition {
        competition_data: CompetitionData,
        trade_simulator: Global<TradeSimulator>,
        user_asset_vaults: KeyValueStore<String, Owned<UserAssetVault>>,
        fusd_resource_address: ResourceAddress,
        user_token_resource_address: ResourceAddress,
    }

    impl Competition {
        /// Instantiates a new Competition component.
        ///
        /// # Arguments
        ///
        /// * `owner_role` - The owner of the competition.
        /// * `competition_start` - The start time of the competition.
        /// * `competition_end` - The end time of the competition.
        /// * `trade_simulator_address` - The address of the TradeSimulator component.
        /// * `fusd_resource_address` - The resource address of FUSD tokens.
        /// * `user_token_resource_address` - The resource address of user tokens.
        pub fn instantiate(
            owner_role: OwnerRole,
            competition_start: Instant,
            competition_end: Instant,
            trade_simulator_address: ComponentAddress,
            fusd_resource_address: ResourceAddress,
            user_token_resource_address: ResourceAddress,
        ) -> (Global<Competition>, Bucket) {
            let competition_data = CompetitionData {
                competition_start,
                competition_end,
            };

            let admin_badge: Bucket = ResourceBuilder::new_fungible(owner_role.clone())
                .divisibility(DIVISIBILITY_NONE)
                .metadata(metadata! {
                    init {
                        "name" => "Competition Manager", updatable;
                        "symbol" => "CM", updatable;
                        "description" => "A badge with the authority to manage the competition.", updatable;
                        "tags" => ["badge"], updatable;
                        "info_url" => Url::of("https://colosseum.com"), updatable;
                        "icon_url" => Url::of("https://colosseum.com/images/LogoColosseum.png"), updatable;
                    }
                })
                .mint_initial_supply(1)
                .into();

            let trade_simulator: Global<TradeSimulator> = trade_simulator_address.into();

            let competition = Self {
                competition_data,
                trade_simulator,
                user_asset_vaults: KeyValueStore::new(),
                fusd_resource_address,
                user_token_resource_address,
            }
            .instantiate()
            .prepare_to_globalize(owner_role.clone())
            .roles(roles!(
                admin => rule!(
                    require(
                        admin_badge.resource_address()
                    )
                );
            ))
            .globalize();

            (competition, admin_badge)
        }

        /// Registers a user for the competition by minting initial FUSD and creating a user asset vault.
        ///
        /// # Arguments
        ///
        /// * `user_token_proof` - A proof of the user's token to verify identity.
        pub fn register(&mut self, user_token_proof: Proof) {
            self.assert_competition_not_started();
            let user_id = self.extract_user_id(user_token_proof);

            // Mint FUSD
            let fusd_bucket = ResourceManager::from_address(self.fusd_resource_address)
                .mint(Decimal::from(10000));

            let user_asset_vault = UserAssetVault::instantiate(fusd_bucket);

            self.user_asset_vaults.insert(user_id, user_asset_vault);
        }

        /// Allows a user to trade assets during the competition.
        ///
        /// # Arguments
        ///
        /// * `user_token_proof` - A proof of the user's token to verify identity.
        /// * `from_address` - The resource address of the asset to be traded from.
        /// * `to_address` - The resource address of the asset to be traded to.
        /// * `amount` - The amount of the asset to be traded.
        pub fn trade(
            &mut self,
            user_token_proof: Proof,
            from_address: ResourceAddress,
            to_address: ResourceAddress,
            amount: Decimal,
        ) {
            self.assert_competition_running();
            info!(
                "I want to trade {:?} of {:?} into {:?}",
                amount, from_address, to_address
            );

            let user_id = self.extract_user_id(user_token_proof);

            // Withdraw asset from the user vault
            let user_asset_vault = self
                .user_asset_vaults
                .get(&user_id)
                .expect("User vault not found");
            let from_token_bucket = user_asset_vault.withdraw_asset(from_address, amount);

            // Swap asset
            let to_token_bucket = self.trade_simulator.trade(from_token_bucket, to_address);

            // Deposit new assets back to the user vault
            user_asset_vault.deposit_asset(to_token_bucket);
        }

        /// Asserts that the competition has not started yet.
        fn assert_competition_not_started(&self) {
            info!(
                "Current time: {:?}",
                Clock::current_time(TimePrecisionV2::Second)
            );
            info!(
                "Current competition start: {:?}",
                self.competition_data.competition_start
            );
            assert!(
                Clock::current_time_is_strictly_before(
                    self.competition_data.competition_start,
                    TimePrecisionV2::Second,
                ),
                "Competition has already started. Registration is not possible anymore!"
            );
        }

        /// Asserts that the competition is currently running.
        fn assert_competition_running(&self) {
            assert!(
                Clock::current_time_is_at_or_after(
                    self.get_competition_start_time(),
                    TimePrecisionV2::Second
                ),
                "Competition has not started yet!"
            );
            assert!(
                Clock::current_time_is_strictly_before(
                    self.get_competition_end_time(),
                    TimePrecisionV2::Second
                ),
                "Competition has already finished."
            );
        }

        /// Extracts the user ID from the provided proof.
        ///
        /// # Arguments
        ///
        /// * `user_token_proof` - A proof of the user's token to verify identity.
        ///
        /// # Returns
        ///
        /// A string representing the user ID.
        fn extract_user_id(&self, user_token_proof: Proof) -> String {
            let checked_proof = user_token_proof.check(self.user_token_resource_address);
            checked_proof
                .as_non_fungible()
                .non_fungible_local_id()
                .to_string()
        }

        /// Sets the competition start time.
        ///
        /// # Arguments
        ///
        /// * `time` - The new start time of the competition.
        pub fn set_competition_start_time(&mut self, time: Instant) {
            self.competition_data.competition_start = time;
        }

        /// Sets the competition end time.
        ///
        /// # Arguments
        ///
        /// * `time` - The new end time of the competition.
        pub fn set_competition_end_time(&mut self, time: Instant) {
            self.competition_data.competition_end = time;
        }

        /// Gets the competition start time.
        ///
        /// # Returns
        ///
        /// The start time of the competition.
        pub fn get_competition_start_time(&self) -> Instant {
            self.competition_data.competition_start
        }

        /// Gets the competition end time.
        ///
        /// # Returns
        ///
        /// The end time of the competition.
        pub fn get_competition_end_time(&self) -> Instant {
            self.competition_data.competition_end
        }
    }
}
