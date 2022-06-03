import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { test, expect, describe } from '@jest/globals';
import generateDiff from '../src/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const getFixturePath = (filename) => join(__dirname, '..', '__fixtures__', filename);

const json1 = getFixturePath('file1.json');
const json2 = getFixturePath('file2.json');
const yaml1 = getFixturePath('file1.yaml');
const yaml2 = getFixturePath('file2.yaml');
const stylishResult = `{
    common: {
      + follow: false
        setting1: Value 1
      - setting2: 200
      - setting3: true
      + setting3: null
      + setting4: blah blah
      + setting5: {
            key5: value5
        }
        setting6: {
            doge: {
              - wow: 
              + wow: so much
            }
            key: value
          + ops: vops
        }
    }
    group1: {
      - baz: bas
      + baz: bars
        foo: bar
      - nest: {
            key: value
        }
      + nest: str
    }
  - group2: {
        abc: 12345
        deep: {
            id: 45
        }
    }
  + group3: {
        deep: {
            id: {
                number: 45
            }
        }
        fee: 100500
    }
}`;

const plainResult = `Property 'common.follow' was added with value: false
Property 'common.setting2' was removed
Property 'common.setting3' was updated. From true to null
Property 'common.setting4' was added with value: 'blah blah'
Property 'common.setting5' was added with value: [complex value]
Property 'common.setting6.doge.wow' was updated. From '' to 'so much'
Property 'common.setting6.ops' was added with value: 'vops'
Property 'group1.baz' was updated. From 'bas' to 'bars'
Property 'group1.nest' was updated. From [complex value] to 'str'
Property 'group2' was removed
Property 'group3' was added with value: [complex value]`;

const jsonResult = `[
 {
  "name": "common",
  "value": "json",
  "status": "updated",
  "children": [
   {
    "name": "follow",
    "value": false,
    "status": "added"
   },
   {
    "name": "setting1",
    "value": "Value 1",
    "status": "unchanged"
   },
   {
    "name": "setting2",
    "value": 200,
    "status": "deleted"
   },
   {
    "name": "setting3",
    "value": null,
    "status": "added",
    "previousValue": true,
    "isPreviousValueObject": false
   },
   {
    "name": "setting4",
    "value": "blah blah",
    "status": "added"
   },
   {
    "name": "setting5",
    "value": {
     "key5": "value5"
    },
    "status": "added",
    "children": [
     {
      "name": "key5",
      "value": "value5",
      "status": "unchanged"
     }
    ]
   },
   {
    "name": "setting6",
    "value": "json",
    "status": "updated",
    "children": [
     {
      "name": "doge",
      "value": "json",
      "status": "updated",
      "children": [
       {
        "name": "wow",
        "value": "so much",
        "status": "added",
        "previousValue": "",
        "isPreviousValueObject": false
       }
      ]
     },
     {
      "name": "key",
      "value": "value",
      "status": "unchanged"
     },
     {
      "name": "ops",
      "value": "vops",
      "status": "added"
     }
    ]
   }
  ]
 },
 {
  "name": "group1",
  "value": "json",
  "status": "updated",
  "children": [
   {
    "name": "baz",
    "value": "bars",
    "status": "added",
    "previousValue": "bas",
    "isPreviousValueObject": false
   },
   {
    "name": "foo",
    "value": "bar",
    "status": "unchanged"
   },
   {
    "name": "nest",
    "value": "str",
    "status": "added",
    "previousValue": {
     "key": "value"
    },
    "isPreviousValueObject": true,
    "children": [
     {
      "name": "key",
      "value": "value",
      "status": "unchanged"
     }
    ]
   }
  ]
 },
 {
  "name": "group2",
  "value": {
   "abc": 12345,
   "deep": {
    "id": 45
   }
  },
  "status": "deleted",
  "children": [
   {
    "name": "abc",
    "value": 12345,
    "status": "unchanged"
   },
   {
    "name": "deep",
    "value": {
     "id": 45
    },
    "status": "unchanged",
    "children": [
     {
      "name": "id",
      "value": 45,
      "status": "unchanged"
     }
    ]
   }
  ]
 },
 {
  "name": "group3",
  "value": {
   "deep": {
    "id": {
     "number": 45
    }
   },
   "fee": 100500
  },
  "status": "added",
  "children": [
   {
    "name": "deep",
    "value": {
     "id": {
      "number": 45
     }
    },
    "status": "unchanged",
    "children": [
     {
      "name": "id",
      "value": {
       "number": 45
      },
      "status": "unchanged",
      "children": [
       {
        "name": "number",
        "value": 45,
        "status": "unchanged"
       }
      ]
     }
    ]
   },
   {
    "name": "fee",
    "value": 100500,
    "status": "unchanged"
   }
  ]
 }
]`;

const cases = [
  [json1, json2, 'stylish', stylishResult],
  [yaml1, yaml2, 'stylish', stylishResult],
  [json1, json2, 'plain', plainResult],
  [yaml1, yaml2, 'plain', plainResult],
  // [json1, json2, 'json', jsonResult],
  // [yaml1, yaml2, 'json', jsonResult],
];

describe('genDiff with all formatters', () => {
  test.each(cases)(
    'with %s and %s as args and %s as formatters return %s',
    (filename1, filename2, formatter, expectedResult) => {
      const result = generateDiff(filename1, filename2, formatter);
      expect(result).toEqual(expectedResult);
    },
  );
});
