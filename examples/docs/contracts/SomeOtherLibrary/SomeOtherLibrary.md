# SomeOtherLibrary












## Internal Methods

### someFunction

```solidity
function someFunction(string someText) internal pure returns (bytes32)
```

Hash returned.
*This function uses `keccak256(..)` to hash text.*




#### Parameters

| Name | Type | Description |
|---|---|---|
| someText | string | Any text that you want to hash. |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bytes32 | The hash that was sent as a parameter. |

### someOtherFunction

```solidity
function someOtherFunction(string someText) internal pure returns (bytes32 hash)
```

Hash returned.
*This function uses `sha256(..)` to hash text.*




#### Parameters

| Name | Type | Description |
|---|---|---|
| someText | string | Any text that you want to hash. |

#### Returns

| Name | Type | Description |
|---|---|---|
| hash | bytes32 | The hash that was sent as a parameter. |




## Errors

### WhateverError

```solidity
WhateverError(bytes16)
```







#### Parameters

| Name | Type | Description |
|---|---|---|
| somethingElse | bytes16 |  |

### ThirdError

```solidity
ThirdError(bytes4,uint256)
```


*this is the third error*

**Danger:** *Be careful, this Error is dangerous*


#### Parameters

| Name | Type | Description |
|---|---|---|
| functionSelector | bytes4 | fucntionMask This is a function mask |
| fucntionMask | uint256 | This is a function mask |

### SomeOtherError

```solidity
SomeOtherError()
```

Some Other Error fired!!!!






### SomeError

```solidity
SomeError(bytes32)
```

Invalid hash
*Reverts when hash has already been discovered*




#### Parameters

| Name | Type | Description |
|---|---|---|
| invalidHash | bytes32 | Invalid hash. |


