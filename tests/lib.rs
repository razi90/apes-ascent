use scrypto_test::prelude::*;

use the_trenches::competition::competition_test::*;
use the_trenches::trade_vault::trade_vault_test::*;

#[test]
fn test_instatiate_competition_and_register() {
    // Setup the environment
    let mut ledger = LedgerSimulatorBuilder::new().build();

    // Create an account
    let (public_key, _private_key, account) = ledger.new_allocated_account();

    // Publish package
    let package_address = ledger.compile_and_publish(this_package!());

    // Test the `instantiate` function of a competition.
    let registration_start = ledger.get_current_time(TimePrecisionV2::Minute);
    let registration_end = registration_start.add_days(5).unwrap();
    let competition_start = registration_end.add_days(1).unwrap();
    let competition_end = competition_start.add_days(7).unwrap();

    let manifest = ManifestBuilder::new()
        .lock_fee_from_faucet()
        .call_function(
            package_address,
            "Competition",
            "instantiate",
            manifest_args!(
                registration_start,
                registration_end,
                competition_start,
                competition_end
            ),
        )
        .build();
    let receipt = ledger.execute_manifest(
        manifest,
        vec![NonFungibleGlobalId::from_public_key(&public_key)],
    );
    println!("{:?}\n", receipt);
    let competition_component = receipt.expect_commit(true).new_component_addresses()[0];

    // Test the `instantiate` function of a trade vault.
    let manifest = ManifestBuilder::new()
        .lock_fee_from_faucet()
        .call_function(
            package_address,
            "TradeVault",
            "instantiate",
            manifest_args!(),
        )
        .build();
    let receipt = ledger.execute_manifest(
        manifest,
        vec![NonFungibleGlobalId::from_public_key(&public_key)],
    );
    println!("{:?}\n", receipt);
    let trade_vault_component = receipt.expect_commit(true).new_component_addresses()[0];

    // Test vault registration
    let manifest = ManifestBuilder::new()
        .lock_fee_from_faucet()
        .call_method(
            competition_component,
            "register",
            manifest_args!(trade_vault_component),
        )
        .build();
    let receipt = ledger.execute_manifest(
        manifest,
        vec![NonFungibleGlobalId::from_public_key(&public_key)],
    );
    println!("{:?}\n", receipt);
    receipt.expect_commit_success();

    // Test the `trade` method.
    let manifest = ManifestBuilder::new()
        .lock_fee_from_faucet()
        .call_method(trade_vault_component, "trade", manifest_args!())
        .build();
    let receipt = ledger.execute_manifest(
        manifest,
        vec![NonFungibleGlobalId::from_public_key(&public_key)],
    );
    println!("{:?}\n", receipt);
    receipt.expect_commit_success();
}

#[test]
fn test_execute_trade() -> Result<(), RuntimeError> {
    // Arrange
    let mut env = TestEnvironment::new();
    let package_address =
        PackageFactory::compile_and_publish(this_package!(), &mut env, CompileProfile::Fast)?;

    let mut trade_vault = TradeVault::instantiate(package_address, &mut env)?;

    // Act
    let result = trade_vault.trade(&mut env);

    // Assert
    assert!(result.is_ok());

    Ok(())
}
