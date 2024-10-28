use crate::competition::competition::Competition;
use scrypto::prelude::*;

#[blueprint]
mod trade_vault {
    struct TradeVault {
        competition: Global<Competition>,
    }

    impl TradeVault {
        pub fn instantiate(competition: ComponentAddress) -> Global<TradeVault> {
            let (address_reservation, component_address) =
                Runtime::allocate_component_address(TradeVault::blueprint_id());

            // let competition: Global<AnyComponent> = competition.into();
            let competition: Global<Competition> = competition.into();

            // competition.call::<(ComponentAddress,), ()>("register", &(component_address,));
            competition.register(component_address);

            Self { competition }
                .instantiate()
                .prepare_to_globalize(OwnerRole::None)
                .with_address(address_reservation)
                .globalize()
        }

        pub fn trade(
            &mut self,
            from_address: ResourceAddress,
            to_address: ResourceAddress,
            amount: Decimal,
        ) {
            assert!(
                Clock::current_time_is_at_or_after(
                    self.competition.get_competition_start_time(),
                    TimePrecisionV2::Second
                ),
                "Competition has not started, yet!"
            );

            assert!(
                Clock::current_time_is_strictly_before(
                    self.competition.get_competition_end_time(),
                    TimePrecisionV2::Second
                ),
                "Competition has already finished."
            );
            info!(
                "I want to trade {:?} of {:?} into {:?}",
                amount, from_address, to_address
            );
        }
    }
}
