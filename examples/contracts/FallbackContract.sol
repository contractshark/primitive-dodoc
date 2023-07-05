// SPDX-License-Identifier: GPL-3.0-only
pragma solidity >=0.8.6;

contract FallbackContract {
    /// @notice A notice for the fallback
    /// @dev A developer documentation comment for the fallback
    /// @param value Some random value for the fallback
    /// @return returnValue A nice return value post-computation
    fallback(bytes calldata value) external returns(bytes memory returnValue) {
        value;
        return "";
    }
}