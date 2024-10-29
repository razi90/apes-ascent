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

    struct Competition {
        competition_data: CompetitionData,
        trade_simulator: Global<TradeSimulator>,
        trading_vaults: KeyValueStore<String, Owned<UserAssetVault>>,
        fusd_resource_address: ResourceAddress,
        user_token_resource_address: ResourceAddress,
    }

    impl Competition {
        pub fn instantiate(
            competition_start: Instant,
            competition_end: Instant,
            trade_simulator_address: ComponentAddress,
            fusd_resource_address: ResourceAddress,
            user_token_resource_address: ResourceAddress,
        ) -> Global<Competition> {
            let competition_data = CompetitionData {
                competition_start,
                competition_end,
            };

            let trade_simulator: Global<TradeSimulator> = trade_simulator_address.into();

            Self {
                competition_data,
                trade_simulator,
                trading_vaults: KeyValueStore::new(),
                fusd_resource_address,
                user_token_resource_address,
            }
            .instantiate()
            .prepare_to_globalize(OwnerRole::None)
            .globalize()
        }

        pub fn register(&mut self, user_token_proof: Proof) {
            self.assert_competition_not_started();
            let user_id = self.extract_user_id(user_token_proof);

            // Mint FUSD
            let fusd_bucket = ResourceManager::from_address(self.fusd_resource_address)
                .mint(Decimal::from(10000));

            let trade_vault = UserAssetVault::instantiate(fusd_bucket);

            self.trading_vaults.insert(user_id, trade_vault);
        }

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
            let trading_vault = self
                .trading_vaults
                .get(&user_id)
                .expect("User vault not found");
            let from_token_bucket = trading_vault.withdraw_asset(from_address, amount);

            // Swap asset
            let to_token_bucket = self.trade_simulator.trade(from_token_bucket, to_address);

            // Deposit new assets back to the user vault
            trading_vault.deposit_asset(to_token_bucket);
        }

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

        fn extract_user_id(&self, user_token_proof: Proof) -> String {
            let checked_proof = user_token_proof.check(self.user_token_resource_address);
            checked_proof
                .as_non_fungible()
                .non_fungible_local_id()
                .to_string()
        }

        pub fn set_competition_start_time(&mut self, time: Instant) {
            self.competition_data.competition_start = time;
        }
        pub fn set_competition_end_time(&mut self, time: Instant) {
            self.competition_data.competition_end = time;
        }
        pub fn get_competition_start_time(&self) -> Instant {
            self.competition_data.competition_start
        }
        pub fn get_competition_end_time(&self) -> Instant {
            self.competition_data.competition_end
        }
    }
}
