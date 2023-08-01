// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.6;

contract SomeOtherLibrary {
    /// @dev This function uses `keccak256(..)` to hash text.
    /// @notice Hash returned.
    /// @param someText Any text that you want to hash.
    /// @return The hash that was sent as a parameter.
    function someFunction(string memory someText) internal pure returns(bytes32) {
        return keccak256(bytes(someText));
    }
    /// @dev This function uses `sha256(..)` to hash text.
    /// @notice Hash returned.
    /// @param someText Any text that you want to hash.
    /// @return hash The hash that was sent as a parameter.
    function someOtherFunction(string memory someText) internal pure returns(bytes32 hash) {
        return sha256(bytes(someText));
    }
}