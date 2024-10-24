use scrypto::prelude::*;

type LazySet<K> = KeyValueStore<K, ()>;

#[derive(ScryptoSbor, ManifestSbor)]
struct CompetitionData {
    competition_start: Instant,
    competition_end: Instant,
}

#[blueprint]
mod competition {
    struct Competition {
        competition_data: CompetitionData,
        trading_vaults: LazySet<ComponentAddress>,
    }

    impl Competition {
        pub fn instantiate(
            competition_start: Instant,
            competition_end: Instant,
        ) -> Global<Competition> {
            let competition_data = CompetitionData {
                competition_start,
                competition_end,
            };

            Self {
                competition_data,
                trading_vaults: LazySet::new(),
            }
            .instantiate()
            .prepare_to_globalize(OwnerRole::None)
            .globalize()
        }

        pub fn register(&mut self, trade_vault: ComponentAddress) {
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

            self.trading_vaults.insert(trade_vault, ());
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
