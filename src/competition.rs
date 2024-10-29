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
                "Competition has already started. Registration in not possible anymore!"
            );

            // Get user ID
            let checked_proof = user_token_proof.check(self.get_user_token_resource_address());
            let user_id = checked_proof
                .as_non_fungible()
                .non_fungible_local_id()
                .to_string();

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
            assert!(
                Clock::current_time_is_at_or_after(
                    self.get_competition_start_time(),
                    TimePrecisionV2::Second
                ),
                "Competition has not started, yet!"
            );

            assert!(
                Clock::current_time_is_strictly_before(
                    self.get_competition_end_time(),
                    TimePrecisionV2::Second
                ),
                "Competition has already finished."
            );
            info!(
                "I want to trade {:?} of {:?} into {:?}",
                amount, from_address, to_address
            );

            // Get user ID
            let checked_proof = user_token_proof.check(self.get_user_token_resource_address());
            let user_id = checked_proof
                .as_non_fungible()
                .non_fungible_local_id()
                .to_string();

            // Withdraw asset from the user vault
            let trading_vault = self.trading_vaults.get(&user_id).unwrap();
            let from_token_bucket = trading_vault.withdraw_asset(from_address, amount);

            // Swap asset
            let to_token_bucket = self
                .get_trade_sumulator()
                .trade(from_token_bucket, to_address);

            // Deposit new assets back to the user vault
            trading_vault.deposit_asset(to_token_bucket);
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
        pub fn get_trade_sumulator(&self) -> Global<TradeSimulator> {
            self.trade_simulator
        }
        pub fn get_user_token_resource_address(&self) -> ResourceAddress {
            self.user_token_resource_address
        }
    }
}
