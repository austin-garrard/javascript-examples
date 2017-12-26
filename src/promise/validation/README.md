# Validations

This example illustrates how promises can be used to accomplish error handling similar to typical synchronous code. The goal is not to show that promises are necessarily better for this sort of pattern, rather it's to show that promises' error handling and flow control facilities can model familiar patterns, regardless of synchronicity.

To demonstrate this, we implement a validation composer which takes groups of simple validators and runs them against a value. The composer will run all validations in a group together. If any of the validations in that group fail, the composer will not move on to the next group. The composer will report all validations that fail within a group. The order the groups are executed in is determined by the order they are given to the constructor.

The validation composer is first implemented with a forEach that is interrupted by a throw. The code must be run in a try/catch block. Then, the validation composer is implemented with promises. The code must be run with then/catch handlers for a promise. Both implementations have the same test cases, and you can see the similar structure of each test.

Note that most of the test cases have an `expect(false).toEqual(true)`, yet still all pass. Those expectations are meant to make it very explicit which code path is executed in the test. All the tests should pass as written.
