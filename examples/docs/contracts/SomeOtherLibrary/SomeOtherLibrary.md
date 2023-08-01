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

### SomeError

```solidity
error SomeError(bytes32 invalidHash)
```

Invalid hash.
*Reverts when hash has already been discovered.*




#### Parameters

| Name | Type | Description |
|---|---|---|
| invalidHash | bytes32 | Invalid hash.  |


