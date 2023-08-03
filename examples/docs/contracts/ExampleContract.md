# ExampleContract

## Methods

### fallback

```solidity
fallback(bytes calldata value) external nonpayable returns (bytes memory returnValue)
```

A notice for the fallback
_A developer documentation comment for the fallback_

#### Parameters

| Name  | Type  | Description                        |
| ----- | ----- | ---------------------------------- |
| value | bytes | Some random value for the fallback |

#### Returns

| Name        | Type  | Description                          |
| ----------- | ----- | ------------------------------------ |
| returnValue | bytes | A nice return value post-computation |

### aNewFunc

```solidity
function aNewFunc(uint256 somth, bytes anoth) external nonpayable
```

New Func executed
_Some dev information about New Func_

#### Parameters

| Name  | Type    | Description         |
| ----- | ------- | ------------------- |
| somth | uint256 | Something funny     |
| anoth | bytes   | Another thing funny |

### anotherThing

```solidity
function anotherThing(uint256 num) external pure returns (uint256)
```

Does another thing when the function is called.
_More info about doing another thing when the function is called._

#### Parameters

| Name | Type    | Description     |
| ---- | ------- | --------------- |
| num  | uint256 | A random number |

#### Returns

| Name | Type    | Description       |
| ---- | ------- | ----------------- |
| \_0  | uint256 | A random variable |

### boop

```solidity
function boop() external view returns (address)
```

Poorly documented function starting with weird spaces.
_New documentation, changing the interface_

#### Returns

| Name | Type    | Description |
| ---- | ------- | ----------- |
| \_0  | address | undefined   |

### doSomething

```solidity
function doSomething(address a, uint256 b) external nonpayable returns (uint256 foo, uint256 bar)
```

Does something when this function is called.
_More info about the doSomething, and this even works when the explanation is on two lines._

#### Parameters

| Name | Type    | Description             |
| ---- | ------- | ----------------------- |
| a    | address | Address to do something |
| b    | uint256 | Number to do something  |

#### Returns

| Name | Type    | Description            |
| ---- | ------- | ---------------------- |
| foo  | uint256 | First return variable  |
| bar  | uint256 | Second return variable |

### pay

```solidity
function pay() external payable
```

A bad documented payable function.

## Events

### DoSomething

```solidity
event DoSomething(address indexed a, uint256 b)
```

Emitted when the function doSomething is called.
_More info about the event can be added here._

#### Parameters

| Name        | Type    | Description        |
| ----------- | ------- | ------------------ |
| a `indexed` | address | Address of someone |
| b           | uint256 | A random number    |

## Errors

### RandomError

```solidity
error RandomError(address expected, address actual)
```

Thrown when an error happens.
_More info about the error._

#### Parameters

| Name     | Type    | Description      |
| -------- | ------- | ---------------- |
| expected | address | Expected address |
| actual   | address | Actual address   |
