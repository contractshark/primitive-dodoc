# Car

## Methods

### move

```solidity
function move(bool left, bool down, bool right, bool up) external nonpayable returns (bool, bool downPos, bool rightPos, bool upPos)
```

#### Parameters

| Name  | Type | Description        |
| ----- | ---- | ------------------ |
| left  | bool | undefined          |
| down  | bool | Move the car down. |
| right | bool | undefined          |
| up    | bool | Move the car up.   |

#### Returns

| Name     | Type | Description                            |
| -------- | ---- | -------------------------------------- |
| \_0      | bool |                                        |
| downPos  | bool | Some description for down return param |
| rightPos | bool | undefined                              |
| upPos    | bool | Some description for up return param   |

### steer

```solidity
function steer(uint256 degLeft, uint256 degRight) external nonpayable returns (uint256 finalDegLeft, uint256 finalDegRight)
```

#### Parameters

| Name     | Type    | Description                                             |
| -------- | ------- | ------------------------------------------------------- |
| degLeft  | uint256 | undefined                                               |
| degRight | uint256 | The amount of degrees you steer the wheel to the right. |

#### Returns

| Name          | Type    | Description             |
| ------------- | ------- | ----------------------- |
| finalDegLeft  | uint256 | undefined               |
| finalDegRight | uint256 | Some return description |

## Internal Methods

### \_steer

```solidity
function _steer(uint256 degLeft, uint256 degRight) internal nonpayable returns (uint256 finalDegLeft, uint256 finalDegRight)
```

#### Parameters

| Name     | Type    | Description                                             |
| -------- | ------- | ------------------------------------------------------- |
| degLeft  | uint256 | undefined                                               |
| degRight | uint256 | The amount of degrees you steer the wheel to the right. |

#### Returns

| Name          | Type    | Description             |
| ------------- | ------- | ----------------------- |
| finalDegLeft  | uint256 | undefined               |
| finalDegRight | uint256 | Some return description |

### \_move

```solidity
function _move(bool left, bool down, bool right, bool up) internal nonpayable returns (bool, bool downPos, bool rightPos, bool upPos)
```

#### Parameters

| Name  | Type | Description        |
| ----- | ---- | ------------------ |
| left  | bool | undefined          |
| down  | bool | Move the car down. |
| right | bool | undefined          |
| up    | bool | Move the car up.   |

#### Returns

| Name     | Type | Description                            |
| -------- | ---- | -------------------------------------- |
| \_0      | bool |                                        |
| downPos  | bool | Some description for down return param |
| rightPos | bool | undefined                              |
| upPos    | bool | Some description for up return param   |
