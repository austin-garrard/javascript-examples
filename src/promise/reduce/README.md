# Reducing to a promise
A promise can represent a series of actions. It can be built with each action defined explicitly:

```javascript
Promise.resolve()
    .then(actionOne)
    .then(actionTwo)
    .then(actionThree)
```

You can also build the promise dynamically given a list of actions:

```javascript
function buildPromise(actions) {
    return actions.reduce(
        (promise, action) => promise.then(action),
        Promise.resolve()
    );
}
```

One use of this is to create a test helper that can help limit framework-related boilerplate in your tests. For example, when testing Angular2 components you must trigger change detection after taking an action in order for the effects to be seen. If your test has many steps, maybe you should consider multiple smaller tests. But if it's a valuable test to have, you can remove a lot of the noise and have the test mostly comprise of just the actions and expectations you're interested in. You can also add some sugar that makes it very explicit what each step is doing.

This seems like a bit much, but when a single action in your test looks like this:

```javascript
componentFixture.debugElement
    .query(By.css('confirmation-modal'))
    .triggerEventHandler('proceedWithItems', {
        items: [/*...*/]
    }
```

and it is surrounded on all sides by test framework boilerplate, the test quickly gets hard to understand.