// SPDX-License-Identifier: GPL-3.0-only
pragma solidity >=0.8.6;

import {IExampleContract} from "./IExampleContract.sol";
import {FallbackContract} from "./FallbackContract.sol";

contract ExampleContract is IExampleContract, FallbackContract {
    /// @inheritdoc IExampleContract
    function doSomething(address a, uint256 b) external returns (uint256 foo, uint256 bar) {}

    /// @inheritdoc IExampleContract
    function pay() external payable {}

    /// @inheritdoc IExampleContract
    function anotherThing(uint256 num) external pure returns (uint256) {}

    /// @inheritdoc IExampleContract
    /// @dev New documentation, changing the interface
    function boop() external view returns (address) {}

    /// @notice New Func executed
    /// @dev Some dev information about New Func
    /// @param somth Something funny
    /// @param anoth Another thing funny
    function aNewFunc(uint256 somth, bytes memory anoth) public {}
}
