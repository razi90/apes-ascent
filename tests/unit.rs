use scrypto_test::prelude::*;

use the_trenches::competition::competition_test::*;
use the_trenches::oracle::simple_oracle_test::*;
use the_trenches::trade_simulator::trade_simulator_test::*;
use the_trenches::trade_vault::trade_vault_test::*;

struct ResourceAddresses {
    bitcoin: ResourceAddress,
    ethereum: ResourceAddress,
    solana: ResourceAddress,
    fusd: ResourceAddress,
}

impl ResourceAddresses {
    fn as_vec(&self) -> Vec<&ResourceAddress> {
        vec![&self.bitcoin, &self.ethereum, &self.solana, &self.fusd]
    }
}

struct UnitTestEnvironment {
    env: TestEnvironment<InMemorySubstateDatabase>,
    package_address: PackageAddress,
    competition: Competition,
    competition_address: ComponentAddress,
    trade_vault: TradeVault,
    resource_addresses: ResourceAddresses,
}

impl UnitTestEnvironment {
    pub fn new() -> Result<Self, RuntimeError> {
        let mut env = TestEnvironmentBuilder::new().build();

        env.disable_auth_module();
        env.disable_limits_module();

        // Compile package
        let package_address =
            PackageFactory::compile_and_publish(this_package!(), &mut env, CompileProfile::Fast)?;

        // Create a badge and the access rules
        let protocol_manager_badge = ResourceBuilder::new_fungible(OwnerRole::None)
            .divisibility(0)
            .mint_initial_supply(1, &mut env)?;

        let protocol_manager_rule = protocol_manager_badge
            .resource_address(&mut env)
            .map(|address| rule!(require(address)))?;

        // Create resources
        let resource_addresses = ResourceAddresses {
            bitcoin: Self::create_resource(&mut env),
            ethereum: Self::create_resource(&mut env),
            solana: Self::create_resource(&mut env),
            fusd: Self::create_resource(&mut env),
        };

        // Init the oracle
        let mut oracle = SimpleOracle::instantiate(
            protocol_manager_rule.clone(),
            Default::default(),
            OwnerRole::None,
            None,
            package_address,
            &mut env,
        )?;

        // Submitting some dummy prices to the oracle
        for &resource_address in resource_addresses.as_vec() {
            oracle.set_price(resource_address, dec!(1), &mut env);
        }

        // Init the trade simulator
        let mut trade_simulator =
            TradeSimulator::instantiate(oracle.try_into().unwrap(), package_address, &mut env)?;

        // Add resources to whitelist
        for &resource_address in resource_addresses.as_vec() {
            trade_simulator.add_new_resource(resource_address, &mut env);
        }

        // Init a competition
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
            resource_addresses,
        })
    }

    fn create_resource(env: &mut TestEnvironment<InMemorySubstateDatabase>) -> ResourceAddress {
        ResourceBuilder::new_fungible(OwnerRole::Fixed(rule!(allow_all)))
            .divisibility(DIVISIBILITY_MAXIMUM)
            .mint_roles(mint_roles! {
                minter => rule!(allow_all);
                minter_updater => rule!(allow_all);
            })
            .burn_roles(burn_roles! {
                burner => rule!(allow_all);
                burner_updater => rule!(allow_all);
            })
            .mint_initial_supply(dec!(0), env)
            .and_then(|bucket| bucket.resource_address(env))
            .unwrap()
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
        resource_addresses,
        ..
    } = UnitTestEnvironment::new()?;

    let competition_start_time = competition.get_competition_start_time(env).unwrap();
    env.set_current_time(competition_start_time.add_days(2).unwrap());

    // Act
    let result = trade_vault.trade(
        resource_addresses.fusd,
        resource_addresses.bitcoin,
        Decimal::one(),
        env,
    );

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
        resource_addresses,
        ..
    } = UnitTestEnvironment::new()?;

    // Act
    let result = trade_vault.trade(
        resource_addresses.fusd,
        resource_addresses.bitcoin,
        Decimal::one(),
        env,
    );

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
        resource_addresses,
        ..
    } = UnitTestEnvironment::new()?;

    let competition_end_time = competition.get_competition_end_time(env).unwrap();

    env.set_current_time(competition_end_time.add_days(10).unwrap());

    // Act
    let result = trade_vault.trade(
        resource_addresses.fusd,
        resource_addresses.bitcoin,
        Decimal::one(),
        env,
    );

    // Assert
    assert!(result.is_err());
    Ok(())
}
