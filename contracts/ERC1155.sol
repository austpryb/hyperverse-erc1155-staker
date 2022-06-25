// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./hyperverse/IHyperverseModule.sol";
import "./utils/SafeMath.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC1155/ERC1155Upgradeable.sol";

/**
 * @dev Implementation of https://eips.ethereum.org/EIPS/eip-721[ERC721] Non-Fungible Token Standard, including
 * the Metadata extension, but not including the Enumerable extension, which is available separately as
 * {ERC721Enumerable}.
 */
 
contract ERC1155 is ERC1155Upgradeable, IHyperverseModule {
		using SafeMath for uint256;

		/*@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ S T A T E @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@*/

		// Account used to deploy contract
		address public immutable contractOwner;

		//stores the tenant owner
		address private _tenantOwner;

		bool public publicMint;
	    uint256 public constant NEUTRINO = 0;
	    mapping (uint256 => string) private _uris;
		/*@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ E R R O R S @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@*/
		error AlreadyInitialized();
		error ZeroAddress();
		error NonexistentToken();
		error SameAddress();
		error Unauthorized();
		error InvalidERC721Receiver();
		error TokenAlreadyMinted();
		error TokenNotOwnedBySender();
		/*@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ M O D I F I E R S @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@*/

		///+modifiers
		modifier isTenantOwner() {
			if (msg.sender != _tenantOwner) {
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

		/*@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ C O N S T R U C T O R @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@*/

		constructor(address _owner) {
			metadata = ModuleMetadata(
				"ERC1155",
				Author(_owner, "https://externallink.net"),
				"0.0.1",
				3479831479814,
				"https://externalLink.net"
			);
			contractOwner = _owner;
		}

		function initialize(
			string memory _uri,
			address _tenant
		) external initializer canInitialize(_tenant) {
	    __ERC1155_init(_uri);
			_tenantOwner = _tenant;
		}

		function togglePublicMint() external isTenantOwner {
			publicMint = !publicMint;
		}

		function mint(address _to, uint256 _tokenId, uint256 _amount) public checkMint returns (uint256, uint256) {
			if (_to == address(0)) {
				revert ZeroAddress();
			}
	    _mint(msg.sender, _tokenId, _amount, "");

			return (_tokenId, _amount);
		}

		function unSafeMint(uint256 _tokenId, uint256 _amount) public returns (uint256, uint256) {
	    _mint(msg.sender, _tokenId, _amount, "");

			return (_tokenId, _amount);
		}

    function uri(uint256 tokenId) override public view returns (string memory) {
        return(_uris[tokenId]);
    }

    function setTokenUri(uint256 tokenId, string memory newUri) public {
        require(msg.sender == _tenantOwner, "Only tenant owner can set tokenUri");
        require(bytes(_uris[tokenId]).length == 0, "Cannot set uri twice");
        _uris[tokenId] = newUri;
    }

    function dynamicUri(uint256 tokenId) public pure returns (string memory) {
        return(
            string(abi.encodePacked(
                "https://gateway.pinata.cloud/ipfs/QmRobNQ5bc77ZJU52G7dm1uWoKyMUCgUavy3i4U1HTkDN6/",
                Strings.toString(tokenId),
                ".json"
            ))
            );
    }
}
