// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

contract Car {

    uint256 wheelPos;
    mapping (string => uint256) carPos;

    /// @param degRight The amount of degrees you steer the wheel to the right.
    /// @return finalDegLeft
    /// @return finalDegRight Some return description
    function steer(uint256 degLeft, uint256 degRight) public returns(uint256 finalDegLeft, uint256 finalDegRight) {
        _steer(degLeft, degRight);

        finalDegLeft;
        finalDegRight;
    }

    /// @param down Move the car down.
    /// @param up Move the car up.
    /// @return 
    /// @return downPos Some description for down return param
    /// @return rightPos
    /// @return upPos Some description for up return param
    function move(bool left, bool down, bool right, bool up) public returns(bool, bool downPos, bool rightPos, bool upPos) {
        _move(left, down, right, up);

        return (
            true,
            downPos,
            rightPos,
            upPos
        );
    }



    /// @param degRight The amount of degrees you steer the wheel to the right.
    /// @return finalDegLeft
    /// @return finalDegRight Some return description
    function _steer(uint256 degLeft, uint256 degRight) internal returns(uint256 finalDegLeft, uint256 finalDegRight) {
        wheelPos -= degLeft;
        wheelPos += degRight;

        finalDegLeft;
        finalDegRight;
    }

    /// @param down Move the car down.
    /// @param up Move the car up.
    /// @return 
    /// @return downPos Some description for down return param
    /// @return rightPos
    /// @return upPos Some description for up return param
    function _move(bool left, bool down, bool right, bool up) internal returns(bool, bool downPos, bool rightPos, bool upPos) {}

}