TESTS = test/*.spec.js

test:
	@NODE_ENV=test ./node_modules/.bin/mocha \
	  --reporter spec \
	  $(TESTS)

.PHONY: test