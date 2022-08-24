// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

import "./hyperverse/IHyperverseModule.sol";
import "./utils/SafeMath.sol";
import "./utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC1155/extensions/ERC1155BurnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC1155/extensions/ERC1155SupplyUpgradeable.sol";


library Base64 {
    string internal constant TABLE_ENCODE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    bytes  internal constant TABLE_DECODE = hex"0000000000000000000000000000000000000000000000000000000000000000"
                                            hex"00000000000000000000003e0000003f3435363738393a3b3c3d000000000000"
                                            hex"00000102030405060708090a0b0c0d0e0f101112131415161718190000000000"
                                            hex"001a1b1c1d1e1f202122232425262728292a2b2c2d2e2f303132330000000000";

    function encode(bytes memory data) internal pure returns (string memory) {
        if (data.length == 0) return '';

        // load the table into memory
        string memory table = TABLE_ENCODE;

        // multiply by 4/3 rounded up
        uint256 encodedLen = 4 * ((data.length + 2) / 3);

        // add some extra buffer at the end required for the writing
        string memory result = new string(encodedLen + 32);

        assembly {
            // set the actual output length
            mstore(result, encodedLen)

            // prepare the lookup table
            let tablePtr := add(table, 1)

            // input ptr
            let dataPtr := data
            let endPtr := add(dataPtr, mload(data))

            // result ptr, jump over length
            let resultPtr := add(result, 32)

            // run over the input, 3 bytes at a time
            for {} lt(dataPtr, endPtr) {}
            {
                // read 3 bytes
                dataPtr := add(dataPtr, 3)
                let input := mload(dataPtr)

                // write 4 characters
                mstore8(resultPtr, mload(add(tablePtr, and(shr(18, input), 0x3F))))
                resultPtr := add(resultPtr, 1)
                mstore8(resultPtr, mload(add(tablePtr, and(shr(12, input), 0x3F))))
                resultPtr := add(resultPtr, 1)
                mstore8(resultPtr, mload(add(tablePtr, and(shr( 6, input), 0x3F))))
                resultPtr := add(resultPtr, 1)
                mstore8(resultPtr, mload(add(tablePtr, and(        input,  0x3F))))
                resultPtr := add(resultPtr, 1)
            }

            // padding with '='
            switch mod(mload(data), 3)
            case 1 { mstore(sub(resultPtr, 2), shl(240, 0x3d3d)) }
            case 2 { mstore(sub(resultPtr, 1), shl(248, 0x3d)) }
        }

        return result;
    }

    function decode(string memory _data) internal pure returns (bytes memory) {
        bytes memory data = bytes(_data);

        if (data.length == 0) return new bytes(0);
        require(data.length % 4 == 0, "invalid base64 decoder input");

        // load the table into memory
        bytes memory table = TABLE_DECODE;

        // every 4 characters represent 3 bytes
        uint256 decodedLen = (data.length / 4) * 3;

        // add some extra buffer at the end required for the writing
        bytes memory result = new bytes(decodedLen + 32);

        assembly {
            // padding with '='
            let lastBytes := mload(add(data, mload(data)))
            if eq(and(lastBytes, 0xFF), 0x3d) {
                decodedLen := sub(decodedLen, 1)
                if eq(and(lastBytes, 0xFFFF), 0x3d3d) {
                    decodedLen := sub(decodedLen, 1)
                }
            }

            // set the actual output length
            mstore(result, decodedLen)

            // prepare the lookup table
            let tablePtr := add(table, 1)

            // input ptr
            let dataPtr := data
            let endPtr := add(dataPtr, mload(data))

            // result ptr, jump over length
            let resultPtr := add(result, 32)

            // run over the input, 4 characters at a time
            for {} lt(dataPtr, endPtr) {}
            {
               // read 4 characters
               dataPtr := add(dataPtr, 4)
               let input := mload(dataPtr)

               // write 3 bytes
               let output := add(
                   add(
                       shl(18, and(mload(add(tablePtr, and(shr(24, input), 0xFF))), 0xFF)),
                       shl(12, and(mload(add(tablePtr, and(shr(16, input), 0xFF))), 0xFF))),
                   add(
                       shl( 6, and(mload(add(tablePtr, and(shr( 8, input), 0xFF))), 0xFF)),
                               and(mload(add(tablePtr, and(        input , 0xFF))), 0xFF)
                    )
                )
                mstore(resultPtr, shl(232, output))
                resultPtr := add(resultPtr, 3)
            }
        }

        return result;
    }
}

/**
 * @dev Implementation of https://eips.ethereum.org/EIPS/eip-721[ERC721] Non-Fungible Token Standard, including
 * the Metadata extension, but not including the Enumerable extension, which is available separately as
 * {ERC721Enumerable}.
 */

contract ERC1155 is ERC1155BurnableUpgradeable, ERC1155SupplyUpgradeable, IHyperverseModule {
	using SafeMath for uint256;
	using Counters for Counters.Counter;
	/*@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ S T A T E @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@*/
	// Account used to deploy contract
	address public immutable contractOwner;

	//stores the tenant owner
	address private _tenantOwner;

	Counters.Counter public tokenCounter;
	bool public publicMint;
  mapping (uint256 => string) private _uris;
	mapping (uint256 => string) private _models;
  mapping (address => bool) public policyModelWhitelist;
  mapping (uint256 => uint256) public tokenSupply;
	event ModelCreated(uint256 indexed tokenId, string model);

	/*@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ E R R O R S @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@*/
	error AlreadyInitialized();
	error ZeroAddress();
	error NonexistentToken();
	error SameAddress();
	error Unauthorized();
	error InvalidERC1155Receiver();
	error TokenNotOwnedBySender();

	/*@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ M O D I F I E R S @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@*/
	///+modifiers
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

	modifier checkMint() {
		if (publicMint == false && msg.sender != _tenantOwner) {
			revert Unauthorized();
		}
		_;
	}

  modifier onlyWhitelistModelAddress() {
      require(policyModelWhitelist[msg.sender] == true);
      _;
  }

	/*@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ C O N S T R U C T O R @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@*/
	constructor(address _owner) {
		metadata = ModuleMetadata(
			"ERC1155",
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
		address _tenant
	) external initializer canInitialize(_tenant) {
    __ERC1155_init(_uri);
		__ERC1155Burnable_init();
		__ERC1155Supply_init();
		_tenantOwner = _tenant;
    policyModelWhitelist[_tenantOwner] = true;
	}

	function togglePublicMint() external isTenantOwner {
		publicMint = !publicMint;
	}

	function getTenantOwner() external view returns (address) {
		return _tenantOwner;
	}

	function mint(address _to, uint256 _tokenId, uint256 _amount) public checkMint returns (uint256, uint256) {
		if (_to == address(0)) {
			revert ZeroAddress();
		}
		require(bytes(_models[_tokenId]).length > 0, "model must exist before access token can be minted");
    _mint(_to, _tokenId, _amount, "");
    tokenSupply[_tokenId] += 1;
		return (_tokenId, _amount);
	}

    function uri(uint256 tokenId) override public view returns (string memory) {
        return(_uris[tokenId]);
    }

    function setTokenUri(uint256 tokenId, string memory newUri) public {
        require(msg.sender == _tenantOwner, "only tenant owner can set tokenUri");
        require(bytes(_uris[tokenId]).length == 0, "cannot set uri twice");
        _uris[tokenId] = newUri;
    }

	/* ---- Set Model in Namespace ----
		[request_definition]
		r = sub, obj, act

		[policy_definition]
		p = sub, obj, act

		[role_definition]
		g = _, _

		[policy_effect]
		e = some(where (p.eft == allow))

		[matchers]
		m = g(r.sub, p.sub) && r.obj == p.obj && r.act == p.act
	*/

    function setModel(uint256 tokenId, string memory model) public onlyWhitelistModelAddress {
  		require(bytes(_models[tokenId]).length == 0, "cannot overwrite existing model");
  		_models[tokenId] = model;
  		tokenCounter.increment();
  		emit ModelCreated(tokenId, model);
    }

    function addWhitelistAddress (address _address) public isContractOwner {
        policyModelWhitelist[_address] = true;
    }

    function removeWhitelistAddress (address _address) public isContractOwner {
        policyModelWhitelist[_address] = false;
    }

    function _getModel(uint256 tokenId) private view returns (string memory) {
		    return _models[tokenId];
    }

	// Returns policy models by token id set in JSON
    function tokenMetadata(uint256 tokenId) public view returns (string memory) {
        string memory _tokenId = Strings.toString(tokenId);
        string memory json = Base64.encode(
            bytes(string(
                abi.encodePacked(
                    '{"name": "',
                    _tokenId,
                    '",',
                    '"image_data": "", ',
					          '"attributes": [{"trait_type": "policy", "value": "', _getModel(tokenId), '"}',
                    ']}'
                )
            ))
        );
        return string(abi.encodePacked('data:application/json;base64,', json));
    }

    function _beforeTokenTransfer(address operator, address from, address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data)
        internal
        override(ERC1155Upgradeable, ERC1155SupplyUpgradeable)
    {
        super._beforeTokenTransfer(operator, from, to, ids, amounts, data);
    }
}
