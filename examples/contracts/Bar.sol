// SPDX-License-Identifier: GPL-3.0-only
pragma solidity 0.8.9;

interface IBar {
    /// @notice Notice of T
    /// @dev Dev of T
    /// @param paramA A number
    /// @param paramB An address
    struct T {
        uint256 paramA;
        address paramB;
    }

    /// @notice Sets a T
    /// @dev Uses a struct
    /// @param t T struct FTW
    function set(T memory t) external;

    function boop(uint256 bar) external;

    /// @notice Emitted when transfer
    /// @dev Transfer some stuff
    /// @param foo Amount of stuff
    /// @custom:danger This event exposes private info
    event Transfer(uint256 foo);

    /// @notice Thrown when doh
    /// @dev Bad doh error
    /// @param yay A bool
    /// @custom:info Additional info
    error Doh(bool yay);
}

/// @title   Bar contract
/// @author  Primitive
/// @notice  Manages the bar
/// @dev     Blablou
/// @custom:version v2.0.1
contract Bar is IBar {
    /// @dev This is a constructor
    /// @notice This is the notice of the constructor
    /// @custom:tip A custom blah tag
    /// @param someNumber The description of the parameter
    constructor(uint256 someNumber) {someNumber;}

    /// @dev This is a `receive()` function
    /// @notice This is the notice of the `receive()` function
    /// @custom:info if sending native tokens with some graffiti, check the {`fallback()`} function documentation.
    receive() external payable {
        // ...
    }

    /// @dev This is a fallback
    /// @notice This is the notice of the fallback
    /// @custom:warning the fallback function can return some data via assembly, but it will not be abi-encoded
    /// @param fallbackParam some details about the param
    /// @return testtest result some details about the result
    /// @custom:hey hey hey hey
    /// @custom:ho ho ho ho
    fallback(bytes calldata fallbackParam) external returns (bytes memory testtest) {
        // ...
    }

    /// @inheritdoc IBar
    function set(T memory t) external { }

    /// @notice Cool function bro
    /// @custom:requirement Check first requirement
    /// @custom:requirement Check second requirement
    function boop(uint256 bar) external { }

    /// @notice Alt cool function bro
    function boop(uint256 bar, uint256 bar2) external { }

    /// @param someCallData hello tic tac toe
    function hello(bytes calldata someCallData) external {

    }

    /// @notice Baaps the yaps
    /// @param bar Number of bar
    /// @param aar Address of aar
    function baap(uint256 bar, address aar) external { _baap(bar, aar); }

    /// @notice Baaps the yaps internally
    /// @param bar Number of bar
    /// @param aar Address of aar
    function _baap(uint256 bar, address aar) internal {}
}
