use scrypto_test::prelude::*;

use the_trenches::trade_vault_test::*;

#[test]
fn test_hello() {
    // Setup the environment
    let mut ledger = LedgerSimulatorBuilder::new().build();

    // Create an account
    let (public_key, _private_key, account) = ledger.new_allocated_account();

    // Publish package
    let package_address = ledger.compile_and_publish(this_package!());

    // Test the `instantiate` function.
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
    let component = receipt.expect_commit(true).new_component_addresses()[0];

    // Test the `trade` method.
    let manifest = ManifestBuilder::new()
        .lock_fee_from_faucet()
        .call_method(component, "trade", manifest_args!())
        .build();
    let receipt = ledger.execute_manifest(
        manifest,
        vec![NonFungibleGlobalId::from_public_key(&public_key)],
    );
    println!("{:?}\n", receipt);
    receipt.expect_commit_success();
}

#[test]
fn test_hello_with_test_environment() -> Result<(), RuntimeError> {
    // Arrange
    let mut env = TestEnvironment::new();
    let package_address =
        PackageFactory::compile_and_publish(this_package!(), &mut env, CompileProfile::Fast)?;

    let mut hello = TradeVault::instantiate(package_address, &mut env)?;

    // Act
    let result = hello.trade(&mut env);

    // Assert
    assert!(result.is_ok());

    Ok(())
}
