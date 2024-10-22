use scrypto::prelude::*;

type LazySet<K> = KeyValueStore<K, ()>;

#[derive(ScryptoSbor, ManifestSbor)]
struct CompetitionData {
    registration_start: Instant,
    registration_end: Instant,
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
            registration_start: Instant,
            registration_end: Instant,
            competition_start: Instant,
            competition_end: Instant,
        ) -> Global<Competition> {
            let competition_data = CompetitionData {
                registration_start,
                registration_end,
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
            self.trading_vaults.insert(trade_vault, ());
        }
    }
}
