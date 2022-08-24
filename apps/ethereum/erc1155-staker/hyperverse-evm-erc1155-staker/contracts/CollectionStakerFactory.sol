// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
pragma experimental ABIEncoderV2;

import "./hyperverse/CloneFactory.sol";
import "./hyperverse/IHyperverseModule.sol";
import "./CollectionStakerUpgradable.sol";
import "./utils/Counters.sol";

/**
 * @dev Clone Factory Implementation for ERC20 Token
 */

contract CollectionStakerFactory is CloneFactory {
	using Counters for Counters.Counter;

	/*@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ S T A T E @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@*/
	struct Tenant {
		CollectionStakerUpgradable COLLECTIONSTAKER;
		address owner;
	}

	Counters.Counter public tenantCounter;
	mapping(address => Tenant) public tenants;
	mapping(address => bool) public instance;

	address public immutable owner;
	address public immutable masterContract;
	address private hyperverseAdmin = 0x5e7564d9942F2073d20C6B65d0e73750a6EC8D81;

	/*@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ E V E N T S @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@*/
	event TenantCreated(address _tenant, address _proxy);

	/*@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ E R R O R S @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@*/
	error Unauthorized();
	error InstanceAlreadyInitialized();
	error InstanceDoesNotExist();
	error ZeroAddress();

	/*@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ M O D I F I E R S @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@*/
	modifier isAuthorized(address _tenant) {
		if (_tenant == address(0)) {
			revert ZeroAddress();
		}
		if (!(msg.sender == _tenant || msg.sender == hyperverseAdmin)) {
			revert Unauthorized();
		}
		_;
	}

	modifier hasAnInstance(address _tenant) {
		if (instance[_tenant]) {
			revert InstanceAlreadyInitialized();
		}
		_;
	}

	/*@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ C O N S T R U C T O R @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@*/
	constructor(address _masterContract, address _owner) {
		masterContract = _masterContract;
		owner = _owner;
	}

	/*@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ F U N C T I O N S @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@*/

	function createInstance(
        string memory _uri,
		    address _tenant,
        address _tokenContractAddress
	) external isAuthorized(_tenant) hasAnInstance(_tenant) {
		CollectionStakerUpgradable COLLECTIONSTAKER = CollectionStakerUpgradable(createClone(masterContract));

		//initializing tenant state of clone
		COLLECTIONSTAKER.initialize(_uri, _tenant, _tokenContractAddress);

		//set Tenant data
		Tenant storage newTenant = tenants[_tenant];
		newTenant.COLLECTIONSTAKER = COLLECTIONSTAKER;
		newTenant.owner = _tenant;
		instance[_tenant] = true;
		tenantCounter.increment();

		emit TenantCreated(_tenant, address(COLLECTIONSTAKER));
	}

	function getProxy(address _tenant) public view returns (CollectionStakerUpgradable) {
		if (!instance[_tenant]) {
			revert InstanceDoesNotExist();
		}
		return tenants[_tenant].COLLECTIONSTAKER;
	}
}
