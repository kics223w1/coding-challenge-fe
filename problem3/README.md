# Problem 3 - Code Review and Refactoring

### 1. **Undefined Variable Error** ❌
**Location**: Line 39
```typescript
if (lhsPriority > -99) {
```
**Issue**: Variable `lhsPriority` is used but never defined. Should be `balancePriority`.

### 2. **Inverted Filter Logic** ❌
**Location**: Lines 40-41
```typescript
if (balance.amount <= 0) {
  return true;
}
```
**Issue**: The filter keeps balances with zero or negative amounts, which doesn't make sense. Should filter for balances with `amount > 0`.

### 3. **Missing Interface Property** ❌
**Location**: Line 38
```typescript
balance.blockchain
```
**Issue**: The `WalletBalance` interface doesn't define a `blockchain` property, but the code accesses it.

### 4. **Unnecessary Dependency in useMemo** ⚠️
**Location**: Line 54
```typescript
}, [balances, prices]);
```
**Issue**: `prices` is included in the dependency array but not used in the `sortedBalances` computation. This causes unnecessary recalculations when prices change.

### 5. **Redundant Mapping** ⚠️
**Location**: Lines 56-61
```typescript
const formattedBalances = sortedBalances.map(...)
```
**Issue**: `formattedBalances` is created but never used. The `rows` variable maps over `sortedBalances` again instead of using `formattedBalances`, causing duplicate iteration.

### 6. **Type Mismatch** ❌
**Location**: Line 63
```typescript
const rows = sortedBalances.map((balance: FormattedWalletBalance, index: number) => {
```
**Issue**: Mapping over `sortedBalances` (which contains `WalletBalance` items) but typing as `FormattedWalletBalance`. Then accessing `balance.formatted` which doesn't exist on these objects.

### 7. **Using Index as React Key** ⚠️
**Location**: Line 68
```typescript
key={index}
```
**Issue**: Using array index as key is an anti-pattern in React. Should use a unique identifier like `currency` or a combination of properties.

### 8. **Inefficient Multiple getPriority Calls** ⚠️
**Location**: Lines 38, 46-47
**Issue**: `getPriority` is called multiple times for the same blockchain (once during filter, twice during sort). Should cache the priority values.

### 9. **Incomplete Sort Comparator** ⚠️
**Location**: Lines 48-52
```typescript
if (leftPriority > rightPriority) {
  return -1;
} else if (rightPriority > leftPriority) {
  return 1;
}
// Missing: return 0 when equal
```
**Issue**: Sort function doesn't explicitly return 0 when priorities are equal, relying on implicit `undefined` return.

### 10. **Using `any` Type** ⚠️
**Location**: Line 19
```typescript
const getPriority = (blockchain: any): number => {
```
**Issue**: Using `any` defeats the purpose of TypeScript. Should use a proper string type or enum.

### 11. **Undefined Variable** ❌
**Location**: Line 67
```typescript
className={classes.row}
```
**Issue**: `classes` is never defined in the component.

### 12. **Unused Prop** ⚠️
**Location**: Line 15
```typescript
const { children, ...rest } = props;
```
**Issue**: `children` is destructured but never used in the component.


## How to Improve

1. **Fix the interface** to include the `blockchain` property
2. **Correct the filter logic** to keep only positive balances
3. **Optimize the useMemo dependencies** to only include what's actually used
4. **Combine the mapping operations** to format and render in one pass
5. **Use proper unique keys** for React list items
6. **Add proper TypeScript types** instead of `any`
7. **Cache priority calculations** to avoid redundant function calls
8. **Return explicit values** from the sort comparator
9. **Remove unused variables** and fix undefined references