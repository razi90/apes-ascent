use scrypto_test::prelude::*;

use the_trenches::competition::competition_test::*;
use the_trenches::trade_vault::trade_vault_test::*;

struct UnitTestEnvironment {
    env: TestEnvironment<InMemorySubstateDatabase>,
    package_address: PackageAddress,
    competition: Competition,
    competition_address: ComponentAddress,
    trade_vault: TradeVault,
}

impl UnitTestEnvironment {
    pub fn new() -> Result<Self, RuntimeError> {
        let mut env = TestEnvironmentBuilder::new().build();

        env.disable_auth_module();
        env.disable_limits_module();

        let package_address =
            PackageFactory::compile_and_publish(this_package!(), &mut env, CompileProfile::Fast)?;

        let competition_start = env.get_current_time().add_days(1).unwrap();
        let competition_end = competition_start.add_days(7).unwrap();

        let competition = Competition::instantiate(
            competition_start,
            competition_end,
            package_address,
            &mut env,
        )?;

        let trade_vault =
            TradeVault::instantiate(competition.try_into().unwrap(), package_address, &mut env)?;

        Ok(Self {
            env,
            package_address,
            competition,
            competition_address: competition.try_into().unwrap(),
            trade_vault,
        })
    }
}

#[test]
fn test_vault_cannot_register_after_competition_started() -> Result<(), RuntimeError> {
    // Arrange
    let UnitTestEnvironment {
        ref mut env,
        package_address,
        competition_address,
        ..
    } = UnitTestEnvironment::new()?;

    env.set_current_time(Instant::new(0).add_days(2).unwrap());

    // Act
    let result = TradeVault::instantiate(competition_address, package_address, env);

    // Assert
    assert!(result.is_err());
    Ok(())
}

#[test]
fn test_vault_can_trade_in_running_competition() -> Result<(), RuntimeError> {
    // Arrange
    let UnitTestEnvironment {
        ref mut env,
        mut trade_vault,
        competition,
        ..
    } = UnitTestEnvironment::new()?;

    let competition_start_time = competition.get_competition_start_time(env).unwrap();
    env.set_current_time(competition_start_time.add_days(2).unwrap());

    // Act
    let result = trade_vault.trade(env);

    // Assert
    assert!(result.is_ok());

    Ok(())
}

#[test]
fn test_vault_cannot_trade_before_competition_starts() -> Result<(), RuntimeError> {
    // Arrange
    let UnitTestEnvironment {
        ref mut env,
        mut trade_vault,
        ..
    } = UnitTestEnvironment::new()?;

    // Act
    let result = trade_vault.trade(env);

    // Assert
    assert!(result.is_err());

    Ok(())
}

#[test]
fn test_vault_cannot_trade_after_competition_ends() -> Result<(), RuntimeError> {
    // Arrange
    let UnitTestEnvironment {
        ref mut env,
        mut trade_vault,
        competition,
        ..
    } = UnitTestEnvironment::new()?;

    let competition_end_time = competition.get_competition_end_time(env).unwrap();

    env.set_current_time(competition_end_time.add_days(10).unwrap());

    // Act
    let result = trade_vault.trade(env);

    // Assert
    assert!(result.is_err());
    Ok(())
}
