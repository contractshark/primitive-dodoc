// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.6;

/// @notice Invalid hash.
/// @dev Reverts when hash has already been discovered.
/// @param invalidHash Invalid hash.
error SomeError(bytes32 invalidHash);

/// @notice Some Other Error fired!!!!
error SomeOtherError();

/// @dev This is the third error.
/// The error does the following things:
/// - Shows you the `functionSelector`.
/// - Shows you the `functionMask`.
/// - Shows you an error.
/// @custom:danger Be careful, this Error is dangerous!
/// @param functionSelector This is a function selector
/// @param functionMask This is a function mask
error ThirdError(bytes4 functionSelector, uint256 functionMask);

error ErrorWithoutNatspec(bytes16 somethingElse);

library SomeOtherLibrary {
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
