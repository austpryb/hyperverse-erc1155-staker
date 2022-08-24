// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Receiver.sol";
// https://bitbucket.org/rhitchens2/soliditycrud/src/master/contracts/SolidityCRUD-part1.sol

contract CollectionStaker is ERC1155Receiver {
    IERC1155 public NFT;

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

    constructor(address tokenContractAddress) {
        s_owner = msg.sender;
        NFT = IERC1155(tokenContractAddress);
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
        require(!isStaker(msg.sender), "msg.sender must be a unique staker");
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
        require(isStaker(msg.sender), "msg.sender must be a staker");
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

    /* ---- Web3 Signature Verification ----
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

    //function rotateNonce() external onlyOwner returns (uint256) {
    //    s_addressToBlocknum[msg.sender] = block.timestamp;
    //    return block.timestamp;
    //}
    /*
    function getMessageHash(
        address _to,
        string memory _message,
        uint _nonce
    ) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(_to, _message, _nonce));
    }
    */
    /*
    function getNonce(
        address _signer
    ) public view returns (uint256) {
        return s_addressToBlocknum[_signer];
    }
    */
    /*
    function getEthSignedMessageHash(bytes32 _messageHash)
        public
        pure
        returns (bytes32)
    {

        return
            keccak256(
                abi.encodePacked("\x19Ethereum Signed Message:\n32", _messageHash)
            );
    }

    function verify(
        address _signer,
        address _to,
        string memory _message,
        bytes memory signature
    ) public view returns (bool) {
        uint256 nonce = getNonce(_signer);
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
    */
}
