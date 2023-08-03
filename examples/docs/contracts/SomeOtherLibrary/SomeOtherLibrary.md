# SomeOtherLibrary

## Internal Methods

### someFunction

```solidity
function someFunction(string someText) internal pure returns (bytes32)
```

Hash returned.
_This function uses `keccak256(..)` to hash text._

#### Parameters

| Name     | Type   | Description                     |
| -------- | ------ | ------------------------------- |
| someText | string | Any text that you want to hash. |

#### Returns

| Name | Type    | Description                            |
| ---- | ------- | -------------------------------------- |
| \_0  | bytes32 | The hash that was sent as a parameter. |

### someOtherFunction

```solidity
function someOtherFunction(string someText) internal pure returns (bytes32 hash)
```

Hash returned.
_This function uses `sha256(..)` to hash text._

#### Parameters

| Name     | Type   | Description                     |
| -------- | ------ | ------------------------------- |
| someText | string | Any text that you want to hash. |

#### Returns

| Name | Type    | Description                            |
| ---- | ------- | -------------------------------------- |
| hash | bytes32 | The hash that was sent as a parameter. |

## Errors

### SomeError

```solidity
SomeError(bytes32)
```

Invalid hash
_Reverts when hash has already been discovered_

#### Parameters

| Name        | Type    | Description   |
| ----------- | ------- | ------------- |
| invalidHash | bytes32 | Invalid hash. |

### SomeOtherError

```solidity
SomeOtherError()
```

Some Other Error fired!!!!

### ThirdError

```solidity
ThirdError(bytes4,uint256)
```

\*This is the third error.
The error does the following things:

- Shows you the `functionSelector`.
- Shows you the `functionMask`.
- Shows you an error\*

**Danger:** _Be careful, this Error is dangerous_

#### Parameters

| Name             | Type    | Description                          |
| ---------------- | ------- | ------------------------------------ |
| functionSelector | bytes4  | functionMask This is a function mask |
| functionMask     | uint256 | This is a function mask              |

### ErrorWithoutNatspec

```solidity
ErrorWithoutNatspec(bytes16)
```

#### Parameters

| Name          | Type    | Description |
| ------------- | ------- | ----------- |
| somethingElse | bytes16 |             |
