use scrypto_test::prelude::*;

use the_trenches::competition::competition_test::*;
use the_trenches::trade_vault::trade_vault_test::*;

struct UnitTestEnvironment {
    env: TestEnvironment<InMemorySubstateDatabase>,
    competition: Competition,
    trade_vault: TradeVault,
}

impl UnitTestEnvironment {
    pub fn new() -> Result<Self, RuntimeError> {
        let mut env = TestEnvironmentBuilder::new().build();

        env.disable_auth_module();
        env.disable_limits_module();

        let package_address =
            PackageFactory::compile_and_publish(this_package!(), &mut env, CompileProfile::Fast)?;

        let registration_start = env.get_current_time();
        let registration_end = registration_start.add_days(5).unwrap();
        let competition_start = registration_end.add_days(1).unwrap();
        let competition_end = competition_start.add_days(7).unwrap();

        let mut competition = Competition::instantiate(
            registration_start,
            registration_end,
            competition_start,
            competition_end,
            package_address,
            &mut env,
        )?;

        let trade_vault = TradeVault::instantiate(package_address, &mut env)?;

        competition.register(trade_vault.try_into().unwrap(), &mut env)?;

        Ok(Self {
            env,
            competition,
            trade_vault,
        })
    }
}

#[test]
fn test_vault_can_trade_in_running_competition() -> Result<(), RuntimeError> {
    // Arrange
    let UnitTestEnvironment {
        ref mut env,
        competition: _,
        mut trade_vault,
    } = UnitTestEnvironment::new()?;

    // Act
    let result = trade_vault.trade(env);

    // Assert
    assert!(result.is_ok());

    Ok(())
}

#[test]
fn test_vault_cannot_trade_without_registration() -> Result<(), RuntimeError> {
    // Arrange
    let mut env = TestEnvironment::new();
    let package_address =
        PackageFactory::compile_and_publish(this_package!(), &mut env, CompileProfile::Fast)?;
    let mut trade_vault = TradeVault::instantiate(package_address, &mut env)?;

    // Act
    let result = trade_vault.trade(&mut env);

    // Assert
    assert!(result.is_err());
    Ok(())
}

#[test]
fn test_vault_cannot_trade_before_competition_starts() -> Result<(), RuntimeError> {
    // Arrange
    let mut env = TestEnvironment::new();
    let package_address =
        PackageFactory::compile_and_publish(this_package!(), &mut env, CompileProfile::Fast)?;
    let mut trade_vault = TradeVault::instantiate(package_address, &mut env)?;

    // Act
    let result = trade_vault.trade(&mut env);

    // Assert
    assert!(result.is_err());
    Ok(())
}

#[test]
fn test_vault_cannot_trade_after_competition_ends() -> Result<(), RuntimeError> {
    // Arrange
    let mut env = TestEnvironment::new();
    let package_address =
        PackageFactory::compile_and_publish(this_package!(), &mut env, CompileProfile::Fast)?;
    let mut trade_vault = TradeVault::instantiate(package_address, &mut env)?;

    // Act
    let result = trade_vault.trade(&mut env);

    // Assert
    assert!(result.is_err());
    Ok(())
}
