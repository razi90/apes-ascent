use scrypto_test::prelude::*;

pub struct SimulatorTestEnvironment {
    pub ledger_simulator: DefaultLedgerSimulator,
    pub competition: ComponentAddress,
}

impl SimulatorTestEnvironment {
    pub fn new() -> Self {
        let mut ledger_simulator = LedgerSimulatorBuilder::new().without_kernel_trace().build();

        // The account that everything gets deposited into throughout the tests.
        let (public_key, private_key, account) = ledger_simulator.new_account(false);

        let protocol_manager_badge = ledger_simulator.create_fungible_resource(dec!(1), 0, account);
        let protocol_owner_badge = ledger_simulator.create_fungible_resource(dec!(1), 0, account);

        let protocol_manager_rule = rule!(require(protocol_manager_badge));

        // Compile and publish package
        let package_address = ledger_simulator.compile_and_publish(this_package!());

        // Create FUSD resource
        let fusd = ledger_simulator.create_freely_mintable_fungible_resource(
            OwnerRole::None,
            None,
            DIVISIBILITY_MAXIMUM,
            account,
        );

        // Create FUSD resource
        let user_token =
            ledger_simulator.create_everything_allowed_non_fungible_resource(OwnerRole::None);

        // Initialize a simple oracle
        let simple_oracle = ledger_simulator
            .execute_manifest(
                ManifestBuilder::new()
                    .lock_fee_from_faucet()
                    .call_function(
                        package_address,
                        "SimpleOracle",
                        "instantiate",
                        (
                            protocol_manager_rule.clone(),
                            MetadataInit::default(),
                            OwnerRole::None,
                            None::<ManifestAddressReservation>,
                        ),
                    )
                    .build(),
                vec![],
            )
            .expect_commit_success()
            .new_component_addresses()
            .first()
            .copied()
            .unwrap();

        // Initialize trade simulator
        let trade_simulator = ledger_simulator
            .execute_manifest(
                ManifestBuilder::new()
                    .lock_fee_from_faucet()
                    .call_function(
                        package_address,
                        "TradeSimulator",
                        "instantiate",
                        (
                            protocol_manager_rule.clone(),
                            OwnerRole::None,
                            simple_oracle,
                        ),
                    )
                    .build(),
                vec![],
            )
            .expect_commit_success()
            .new_component_addresses()
            .first()
            .copied()
            .unwrap();

        let init_competition_manifest = ManifestBuilder::new()
            .lock_fee_from_faucet()
            .call_function(
                package_address,
                "Competition",
                "instantiate",
                (
                    OwnerRole::None,
                    i64::from(0),
                    i64::from(1),
                    trade_simulator,
                    fusd,
                    user_token,
                ),
            )
            .try_deposit_entire_worktop_or_abort(account, None);

        // dump_manifest_to_file_system(
        //     init_competition_manifest.object_names(),
        //     &init_competition_manifest.build(),
        //     "./tests/manifest_dump/",
        //     Some("create_non_fungible"),
        //     &NetworkDefinition::stokenet(),
        // )
        // .err();

        // Initialize competition
        let competition = ledger_simulator
            .execute_manifest(init_competition_manifest.build(), vec![])
            .expect_commit_success()
            .new_component_addresses()
            .first()
            .copied()
            .unwrap();

        Self {
            ledger_simulator,
            competition,
        }
    }
}
