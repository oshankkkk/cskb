# Debugging Ballerina Basic Values & Boxed Types

This is a guide to help you understand the current state, why the issue was opened, and what files you should look into to implement the fix.

### 1. Understanding the Current Implementation & the Problem
Currently, in the Ballerina Go interpreter, basic values are represented as Go primitives. You can see in `values/values.go` that a Ballerina value (`BalValue`) is just an alias for Go's `any`:
```go
type BalValue any
```
When an integer is created, it's just a raw Go `int64`. However, because `BalValue` is an `any` (which is an interface under the hood), assigning an `int64` to `BalValue` forces Go to allocate memory and store it as a pointer internally anyway.

The side effect of using raw primitives is that we cannot attach any metadata to them. If you look at `SemTypeForValue(v BalValue)` in `values/values.go`, you'll see:
```go
	case int64:
		return semtypes.IntConst(v)
```
Every time the runtime needs the semantic type of a basic value, it has to recompute its singleton type (e.g., `semtypes.IntConst(v)`).

### 2. The Proposed Solution
The goal is to stop using raw Go primitives for `BalValue` and instead create custom **boxed types** (structs) for them. 

For example, instead of passing around an `int64`, you would define a struct like this in the `values` package:
```go
type Int struct {
    V int64
    T semtypes.SemType
}
```
When a new `Int` is created, you compute `semtypes.IntConst(v)` **once**, store it in the `T` field, and reuse it. Because Go was already allocating a pointer for `any` anyway, allocating this struct adds no real overhead, but it saves the runtime from constantly recalculating type analysis.

### 3. Where to look and what to change (Your Action Plan)

Here is a breakdown of the files you will need to check and modify:

#### A. Creating the new Boxed Types
*   **Directory:** `values/`
*   **Action:** You'll likely want to create new files (e.g., `int.go`, `float.go`, `boolean.go`, `string.go`) to define your new boxed structs (`Int`, `Float`, `Boolean`, `String`).
*   **Tip:** For booleans, since there are only two possible values (`true` and `false`), you can create two global singleton instances and just reuse them to save memory!

#### B. Updating Value Utilities
*   **File:** `values/values.go`
*   **Action:** Update functions like `SemTypeForValue()` and `toString()` to switch on your new types (`*Int`, `*String`, etc.) instead of the Go primitives (`int64`, `string`, etc.). `SemTypeForValue` will now simply return the cached `T` field from your struct.
*   **Files:** `values/compare.go` and `values/equal.go`
*   **Action:** Update the comparison logic. Right now, they do type assertions like `v1 := x.(int64)`. You will need to change this to assert to your new struct and extract the inner primitive value (e.g., `x.(*Int).V`).

#### C. Updating the Interpreter (Runtime)
*   **Files:** `runtime/internal/exec/binary.go` and `runtime/internal/exec/non_terminators.go`
*   **Action:** This is where the actual bytecode execution happens. You will see a lot of places where operands are fetched and directly type-asserted to primitives (e.g., `op1.(int64)` or `op.(bool)`). You will need to update these to assert to your new boxed types and extract the underlying value for the operation.
*   **Action:** When an operation computes a new result (like adding two integers), you must wrap the result in your new boxed type before storing it back into the execution frame.

#### D. Standard Library & Externs
*   **Directory:** `lib/*/runtime/*.go` (e.g., `lib/http/runtime/http.go`, `lib/array/runtime/array.go`)
*   **Action:** Look for standard library functions or extern definitions that accept or return `values.BalValue`. If any of them expect native Go `int64` or `string` inside the `BalValue`, you'll need to update them to expect your new structs.
