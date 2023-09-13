# Bar

_Primitive_

> Bar contract

Manages the bar

_Blablou_

**Version:** _v2.0.1_

## Methods

### constructor

```solidity
constructor(uint256 someNumber)
```

This is the notice of the constructor
_This is a constructor_

#### Parameters

| Name       | Type    | Description                      |
| ---------- | ------- | -------------------------------- |
| someNumber | uint256 | The description of the parameter |

### fallback

```solidity
fallback(bytes calldata fallbackParam) external nonpayable returns (bytes memory testtest)
```

This is the notice of the fallback
_This is a fallback_

#### Parameters

| Name          | Type  | Description                  |
| ------------- | ----- | ---------------------------- |
| fallbackParam | bytes | some details about the param |

#### Returns

| Name     | Type  | Description                          |
| -------- | ----- | ------------------------------------ |
| testtest | bytes | result some details about the result |

### baap

```solidity
function baap(uint256 bar, address aar) external nonpayable
```

Baaps the yaps

#### Parameters

| Name | Type    | Description    |
| ---- | ------- | -------------- |
| bar  | uint256 | Number of bar  |
| aar  | address | Address of aar |

### boop

```solidity
function boop(uint256 bar) external nonpayable
```

Cool function bro

**Requirement:** _Check first requirementCheck second requirement_

#### Parameters

| Name | Type    | Description |
| ---- | ------- | ----------- |
| bar  | uint256 | undefined   |

### boop

```solidity
function boop(uint256 bar, uint256 bar2) external nonpayable
```

Alt cool function bro

#### Parameters

| Name | Type    | Description |
| ---- | ------- | ----------- |
| bar  | uint256 | undefined   |
| bar2 | uint256 | undefined   |

### hello

```solidity
function hello(bytes someCallData) external nonpayable
```

#### Parameters

| Name         | Type  | Description       |
| ------------ | ----- | ----------------- |
| someCallData | bytes | hello tic tac toe |

### set

```solidity
function set(IBar.T t) external nonpayable
```

Sets a T
_Uses a struct_

#### Parameters

| Name | Type   | Description  |
| ---- | ------ | ------------ |
| t    | IBar.T | T struct FTW |

### receive

```solidity
receive() external payable
```

This is the notice of the `receive()` function
_This is a `receive()` function_

**Info:** _if sending native tokens with some graffiti, check the {`fallback()`} function documentation._

## Internal Methods

### \_baap

```solidity
function _baap(uint256 bar, address aar) internal nonpayable
```

Baaps the yaps internally

#### Parameters

| Name | Type    | Description    |
| ---- | ------- | -------------- |
| bar  | uint256 | Number of bar  |
| aar  | address | Address of aar |

## Events

### Transfer

```solidity
event Transfer(uint256 foo)
```

Emitted when transfer
_Transfer some stuff_

**Danger:** _This event exposes private info_

#### Parameters

| Name | Type    | Description     |
| ---- | ------- | --------------- |
| foo  | uint256 | Amount of stuff |

## Errors

### Doh

```solidity
error Doh(bool yay)
```

Thrown when doh
_Bad doh error_

**Info:** _Additional info_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| yay  | bool | A bool      |
