install:
					npm ci

gendiff:
					node bin/gendiff.js -h

publish:
					npm publish --dry-run

lint:
					npx eslint bin/** src/** __tests__/**

test:
					npm test
