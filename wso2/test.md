# Running and testing the ballerina-lang-go repository

In this repository, a lot of the tests are "corpus" tests. They run the Ballerina code and compare the actual compiler/interpreter output against an expected "golden" output file (like `.json` or `.txt` files in the `testdata` directory). 

When you just ran `go test ./...`, the tests failed because some of those expected output files were either missing or didn't match the new output from recent code changes. 

By running `go test ./... --update`, you told the test framework: *"Don't fail on a mismatch or a missing file; instead, write the current output to the expected file."* 

So that command created/updated all the missing JSON files, and now a normal `go test ./...` passes because the actual output matches the newly saved expected output.
  