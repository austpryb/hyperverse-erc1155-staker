// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface ICollection {

    //function cancelSubscription(uint64 subId, address to) external;
    function  mint(address _to, uint256 _tokenId, uint256 _amount) external;

    // ERC721 --> function safeTransferFrom(address from, address to, uint256 tokenId) external;
    function safeTransferFrom(address from, address to, uint256 tokenId, uint256 amount, bytes calldata data) external;

    function stake(uint256 _tokenId, uint256 _amount) external;

    function unstake() external;
}
