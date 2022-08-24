// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./hyperverse/IHyperverseModule.sol";
import "./utils/SafeMath.sol";
import "./utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC1155/IERC1155Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC1155/IERC1155ReceiverUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC1155/utils/ERC1155ReceiverUpgradeable.sol";


contract CollectionStakerUpgradable is ERC1155ReceiverUpgradeable, IHyperverseModule  {
    IERC1155Upgradeable public NFT;
    //ERC1155ReceiverUpgradeable public NFT;

	using SafeMath for uint256;
	using Counters for Counters.Counter;
	/*@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ S T A T E @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@*/
	// Account used to deploy contract
	address public immutable contractOwner;

	//stores the tenant owner
	address private _tenantOwner;

    mapping(address => Stake) public stakes;
    mapping(address => uint256) public stakingTime;
    mapping(address => uint256) public s_addressToBlocknum;
    //mapping(address => address) public s_addressToOwnedCollections;
    address public s_owner;

    address[] private stakerIndex;

    event NewStaker(address indexed stakerAddress, uint256 index);
    event DeleteStaker(address indexed stakerAddress, uint256 index);
    // event UpdateStaker(address indexed stakerAddress, uint index);
    // event CreateCollection(address indexed stakerAddress, uint256 tokenId);
    event NamespaceCreated(address indexed namespaceAddress);

    struct Stake {
        uint256 tokenId;
        uint256 amount;
        uint256 timestamp;
        uint256 index;
    }

	/*@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ E R R O R S @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@*/
	error AlreadyInitialized();
	error ZeroAddress();
	error NonexistentToken();
	error SameAddress();
	error Unauthorized();
	error InvalidERC1155Receiver();
	error TokenNotOwnedBySender();

	/*@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ M O D I F I E R S @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@*/
	modifier isTenantOwner() {
		if (msg.sender != _tenantOwner) {
			revert Unauthorized();
		}
		_;
	}

    modifier isContractOwner() {
		if (msg.sender != contractOwner) {
			revert Unauthorized();
		}
		_;
	}

	modifier canInitialize(address _tenant) {
		if (_tenantOwner != address(0)) {
			revert AlreadyInitialized();
		}
		_;
	}

    constructor(address _owner) {
		metadata = ModuleMetadata(
			"CollectionStaker",
			Author(_owner, "https://externallink.net"),
			"0.0.1",
			3479831479814,
			"https://externallink.net"
		);
		contractOwner = _owner;
	}

    /*@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ F U N C T I O N S @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@*/
	function initialize(
		string memory _uri,
		address _tenant,
        address _tokenContractAddress
	) external initializer canInitialize(_tenant) {
        __ERC1155Receiver_init();
        s_owner = msg.sender;
        NFT = IERC1155Upgradeable(_tokenContractAddress);
        emit NamespaceCreated(address(this));
	}


    function isStaker(address stakerAddress) public view returns(bool assertIsStaker)
    {
        if(stakerIndex.length == 0) return false;
        return (stakerIndex[stakes[stakerAddress].index] == stakerAddress);
    }

    function insertStaker(
        uint256 tokenId,
        uint256 amount)
        public
        returns(uint256 index)
    {
        //require(!isStaker(msg.sender), "msg.sender must be a staker");
        stakerIndex.push(msg.sender);
        stakes[msg.sender] = Stake(tokenId, amount, block.timestamp, stakerIndex.length - 1);
        NFT.safeTransferFrom(msg.sender, address(this), tokenId, amount, "0x00");
        emit NewStaker(
            msg.sender,
            stakes[msg.sender].index
            );
        return stakerIndex.length-1;
    }

    function getStaker(address stakerAddress)
        public
        view
        returns(
            uint256 tokenId,
            uint256 amount,
            uint256 timestamp,
            uint256 index,
            uint256 secondsStaked
            )
    {
        require(!isStaker(msg.sender), "msg.sender must be a staker");
        return(
            stakes[stakerAddress].tokenId,
            stakes[stakerAddress].amount,
            stakes[stakerAddress].timestamp,
            stakes[stakerAddress].index,
            block.timestamp - stakes[stakerAddress].timestamp
        );
    }

    function getStakerCount()
        public
        view
        returns(uint256 count)
    {
        return stakerIndex.length;
    }

    function getStakerAtIndex(uint256 index)
        public
        view
        returns(address stakerAddress)
    {
        return stakerIndex[index];
    }

    function getStakers()
        public
        view
        returns(address[] memory)
    {
        return stakerIndex;
    }

    function unstakeStaker(uint256 amount)
        public
        returns(uint index)
    {
        require(!isStaker(msg.sender), "msg.sender must be a unique staker");
        uint256 rowToDelete = stakes[msg.sender].index;
        address keyToMove = stakerIndex[stakerIndex.length-1];
        stakingTime[msg.sender] += (block.timestamp - stakes[msg.sender].timestamp);
        require(rowToDelete >= stakerIndex.length, "staker index must exist in array");
        for (uint256 i = index; i < stakerIndex.length-1; i++){
            stakerIndex[i] = stakerIndex[i + 1];
        }
        stakerIndex.pop();
        delete stakes[keyToMove];
        NFT.safeTransferFrom(address(this), msg.sender, stakes[msg.sender].tokenId, amount,  "0x00");
        emit DeleteStaker(msg.sender, rowToDelete);
        return rowToDelete;
    }

    function onERC1155Received(
        address operator,
        address from,
        uint256 id,
        uint256 value,
        bytes calldata data
    ) external override pure returns (bytes4) {
        return bytes4(keccak256("onERC1155Received(address,address,uint256,uint256,bytes)"));
    }

    function onERC1155BatchReceived(
        address operator,
        address from,
        uint256[] calldata ids,
        uint256[] calldata values,
        bytes calldata data
    ) external override pure returns (bytes4) {
        return bytes4(keccak256("onERC1155BatchReceived(address,address,uint256[],uint256[],bytes)"));
    }


    modifier onlyOwner() {
        require(msg.sender == s_owner);
        _;
    }
}
