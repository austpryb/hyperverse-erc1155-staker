// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Receiver.sol";

/* Signature Verification
How to Sign and Verify
# Signing
1. Create message to sign
2. Hash the message
3. Sign the hash (off chain, keep your private key secret)

# Verify
1. Recreate hash from the original message
2. Recover signer from signature and hash
3. Compare recovered signer to claimed signer
*/

contract CollectionStaker  {
    IERC1155 public NFT;

    mapping(address => Stake) public stakes;
    mapping(address => uint256) public stakingTime;
    mapping(address => uint256) public s_addressToBlocknum;
    mapping(address => address) public s_addressToOwnedCollections;
    address s_owner;
    // address tokenContractAddress = 0x67d88AA62A65F708719EFcC57A6fb6f4eAD1fA41; // ERC1155.sol

    event CreateCollection(address sender, uint256 tokenId);

    struct Stake {
        uint256 tokenId;
        uint256 amount;
        uint256 timestamp;
    }

    constructor(address _tokenContractAddress) {
        s_owner = msg.sender;
        NFT = IERC1155(_tokenContractAddress);
    }

    function stake(uint256 _tokenId, uint256 _amount) public {
        stakes[msg.sender] = Stake(_tokenId, _amount, block.timestamp);
        NFT.safeTransferFrom(msg.sender, address(this), _tokenId, _amount, "0x00");
    }

    function unstake(uint256 _amount) public {
        NFT.safeTransferFrom(address(this), msg.sender, stakes[msg.sender].tokenId, _amount,  "0x00");
        stakingTime[msg.sender] += (block.timestamp - stakes[msg.sender].timestamp);
        delete stakes[msg.sender];
    }

    function onERC1155Received(
        address operator,
        address from,
        uint256 id,
        uint256 value,
        bytes calldata data
    ) external pure returns (bytes4) {
        return bytes4(keccak256("onERC1155Received(address,address,uint256,uint256,bytes)"));
    }

    function mintCollectionItem(uint256 _tokenId, uint256 _amount) external payable {
        require(msg.value >= 100, "Not enough ETH sent; check price!");
        // NFT.mint(msg.sender, _tokenId, _amount);
        emit CreateCollection(msg.sender, _tokenId);
    }

    function rotateNonce() external onlyOwner returns (uint256) {

        s_addressToBlocknum[msg.sender] = block.timestamp;

        return block.timestamp;
    }

    modifier onlyOwner() {
        require(msg.sender == s_owner);
        _;
    }

    function getMessageHash(
        address _to,
        string memory _message,
        uint _nonce
    ) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(_to, _message, _nonce));
    }

    function getNonce(
        address _signer
    ) public view returns (uint256) {
        return s_addressToBlocknum[_signer];
    }

    function getEthSignedMessageHash(bytes32 _messageHash)
        public
        pure
        returns (bytes32)
    {
        /*
        Signature is produced by signing a keccak256 hash with the following format:
        "\x19Ethereum Signed Message\n" + len(msg) + msg
        */
        return
            keccak256(
                abi.encodePacked("\x19Ethereum Signed Message:\n32", _messageHash)
            );
    }

    function verify(
        address _signer,
        address _to,
        string memory _message,
        //uint _nonce,
        bytes memory signature
    ) public view returns (bool) { // from pure to view
        uint256 nonce = getNonce(_signer); // because this read from a state variable
        bytes32 messageHash = getMessageHash(_to, _message, nonce);
        bytes32 ethSignedMessageHash = getEthSignedMessageHash(messageHash);

        return recoverSigner(ethSignedMessageHash, signature) == _signer;
    }

    function recoverSigner(bytes32 _ethSignedMessageHash, bytes memory _signature)
        public
        pure
        returns (address)
    {
        (bytes32 r, bytes32 s, uint8 v) = splitSignature(_signature);

        return ecrecover(_ethSignedMessageHash, v, r, s);
    }

    function splitSignature(bytes memory sig)
        public
        pure
        returns (
            bytes32 r,
            bytes32 s,
            uint8 v
        )
    {
        require(sig.length == 65, "invalid signature length");

        assembly {
            r := mload(add(sig, 32))
            s := mload(add(sig, 64))
            v := byte(0, mload(add(sig, 96)))
        }

    }

}
