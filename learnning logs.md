#### Separation of concerns + explicit state ownership.
- Be explict on how data travels in your code.
A function should either:
produce a value (pure output)
OR mutate its own internal state in a predictable way
But not:
produce + mutate + coordinate with external logic
If a value is important, it should be: returned explicitly, not stored implicitly
Make data flow visible in the code

- Create your wont type when need in data structs for multiple values



