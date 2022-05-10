import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { test, expect } from '@jest/globals';
import generateDiff from '../src/index.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const getFixturePath = (filename) => join(__dirname, '..', '__fixtures__', filename);

test('test JSON diff with stylish formatter', () => {
  const answer = `{
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

  const filename1 = getFixturePath('file1.json');
  const filename2 = getFixturePath('file2.json');
  expect(generateDiff(filename1, filename2, 'stylish')).toEqual(answer);
});

test('test YAML diff with stylish formatter', () => {
  const answer = `{
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

  const filename1 = getFixturePath('file1.yaml');
  const filename2 = getFixturePath('file2.yaml');
  expect(generateDiff(filename1, filename2, 'stylish')).toEqual(answer);
});

test('test JSON diff with plain formatter', () => {
  const answer =
    `Property 'common.follow' was added with value: false
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

  const filename1 = getFixturePath('file1.json');
  const filename2 = getFixturePath('file2.json');

  expect(generateDiff(filename1, filename2, 'plain')).toEqual(answer);
});

test('test YAML diff with plain formatter', () => {
  const answer =
    `Property 'common.follow' was added with value: false
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

  const filename1 = getFixturePath('file1.yaml');
  const filename2 = getFixturePath('file2.yaml');

  expect(generateDiff(filename1, filename2, 'plain')).toEqual(answer);
});

test('test JSON diff with json formatter', () => {
  const answer =
    `[
 {
  "name": "common",
  "value": "json",
  "type": "json",
  "status": "updated",
  "children": [
   {
    "name": "follow",
    "value": false,
    "type": "primitive",
    "status": "added"
   },
   {
    "name": "setting1",
    "value": "Value 1",
    "type": "primitive",
    "status": "unchanged"
   },
   {
    "name": "setting2",
    "value": 200,
    "type": "primitive",
    "status": "deleted"
   },
   {
    "name": "setting3",
    "value": null,
    "type": "primitive",
    "status": "added",
    "previousValue": true,
    "previousValueType": "primitive"
   },
   {
    "name": "setting4",
    "value": "blah blah",
    "type": "primitive",
    "status": "added"
   },
   {
    "name": "setting5",
    "value": {
     "key5": "value5"
    },
    "type": "json",
    "status": "added",
    "children": [
     {
      "name": "key5",
      "value": "value5",
      "type": "primitive",
      "status": "unchanged"
     }
    ]
   },
   {
    "name": "setting6",
    "value": "json",
    "type": "json",
    "status": "updated",
    "children": [
     {
      "name": "doge",
      "value": "json",
      "type": "json",
      "status": "updated",
      "children": [
       {
        "name": "wow",
        "value": "so much",
        "type": "primitive",
        "status": "added",
        "previousValue": "",
        "previousValueType": "primitive"
       }
      ]
     },
     {
      "name": "key",
      "value": "value",
      "type": "primitive",
      "status": "unchanged"
     },
     {
      "name": "ops",
      "value": "vops",
      "type": "primitive",
      "status": "added"
     }
    ]
   }
  ]
 },
 {
  "name": "group1",
  "value": "json",
  "type": "json",
  "status": "updated",
  "children": [
   {
    "name": "baz",
    "value": "bars",
    "type": "primitive",
    "status": "added",
    "previousValue": "bas",
    "previousValueType": "primitive"
   },
   {
    "name": "foo",
    "value": "bar",
    "type": "primitive",
    "status": "unchanged"
   },
   {
    "name": "nest",
    "value": "str",
    "type": "primitive",
    "status": "added",
    "previousValue": {
     "key": "value"
    },
    "previousValueType": "json",
    "children": [
     {
      "name": "key",
      "value": "value",
      "type": "primitive",
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
  "type": "json",
  "status": "deleted",
  "children": [
   {
    "name": "abc",
    "value": 12345,
    "type": "primitive",
    "status": "unchanged"
   },
   {
    "name": "deep",
    "value": {
     "id": 45
    },
    "type": "json",
    "status": "unchanged",
    "children": [
     {
      "name": "id",
      "value": 45,
      "type": "primitive",
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
  "type": "json",
  "status": "added",
  "children": [
   {
    "name": "deep",
    "value": {
     "id": {
      "number": 45
     }
    },
    "type": "json",
    "status": "unchanged",
    "children": [
     {
      "name": "id",
      "value": {
       "number": 45
      },
      "type": "json",
      "status": "unchanged",
      "children": [
       {
        "name": "number",
        "value": 45,
        "type": "primitive",
        "status": "unchanged"
       }
      ]
     }
    ]
   },
   {
    "name": "fee",
    "value": 100500,
    "type": "primitive",
    "status": "unchanged"
   }
  ]
 }
]`;

  const filename1 = getFixturePath('file1.json');
  const filename2 = getFixturePath('file2.json');

  expect(generateDiff(filename1, filename2, 'json')).toEqual(answer);
});

test('test JSON diff with json formatter', () => {
  const answer =
    `[
 {
  "name": "common",
  "value": "json",
  "type": "json",
  "status": "updated",
  "children": [
   {
    "name": "follow",
    "value": false,
    "type": "primitive",
    "status": "added"
   },
   {
    "name": "setting1",
    "value": "Value 1",
    "type": "primitive",
    "status": "unchanged"
   },
   {
    "name": "setting2",
    "value": 200,
    "type": "primitive",
    "status": "deleted"
   },
   {
    "name": "setting3",
    "value": null,
    "type": "primitive",
    "status": "added",
    "previousValue": true,
    "previousValueType": "primitive"
   },
   {
    "name": "setting4",
    "value": "blah blah",
    "type": "primitive",
    "status": "added"
   },
   {
    "name": "setting5",
    "value": {
     "key5": "value5"
    },
    "type": "json",
    "status": "added",
    "children": [
     {
      "name": "key5",
      "value": "value5",
      "type": "primitive",
      "status": "unchanged"
     }
    ]
   },
   {
    "name": "setting6",
    "value": "json",
    "type": "json",
    "status": "updated",
    "children": [
     {
      "name": "doge",
      "value": "json",
      "type": "json",
      "status": "updated",
      "children": [
       {
        "name": "wow",
        "value": "so much",
        "type": "primitive",
        "status": "added",
        "previousValue": "",
        "previousValueType": "primitive"
       }
      ]
     },
     {
      "name": "key",
      "value": "value",
      "type": "primitive",
      "status": "unchanged"
     },
     {
      "name": "ops",
      "value": "vops",
      "type": "primitive",
      "status": "added"
     }
    ]
   }
  ]
 },
 {
  "name": "group1",
  "value": "json",
  "type": "json",
  "status": "updated",
  "children": [
   {
    "name": "baz",
    "value": "bars",
    "type": "primitive",
    "status": "added",
    "previousValue": "bas",
    "previousValueType": "primitive"
   },
   {
    "name": "foo",
    "value": "bar",
    "type": "primitive",
    "status": "unchanged"
   },
   {
    "name": "nest",
    "value": "str",
    "type": "primitive",
    "status": "added",
    "previousValue": {
     "key": "value"
    },
    "previousValueType": "json",
    "children": [
     {
      "name": "key",
      "value": "value",
      "type": "primitive",
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
  "type": "json",
  "status": "deleted",
  "children": [
   {
    "name": "abc",
    "value": 12345,
    "type": "primitive",
    "status": "unchanged"
   },
   {
    "name": "deep",
    "value": {
     "id": 45
    },
    "type": "json",
    "status": "unchanged",
    "children": [
     {
      "name": "id",
      "value": 45,
      "type": "primitive",
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
  "type": "json",
  "status": "added",
  "children": [
   {
    "name": "deep",
    "value": {
     "id": {
      "number": 45
     }
    },
    "type": "json",
    "status": "unchanged",
    "children": [
     {
      "name": "id",
      "value": {
       "number": 45
      },
      "type": "json",
      "status": "unchanged",
      "children": [
       {
        "name": "number",
        "value": 45,
        "type": "primitive",
        "status": "unchanged"
       }
      ]
     }
    ]
   },
   {
    "name": "fee",
    "value": 100500,
    "type": "primitive",
    "status": "unchanged"
   }
  ]
 }
]`;

  const filename1 = getFixturePath('file1.yaml');
  const filename2 = getFixturePath('file2.yaml');

  expect(generateDiff(filename1, filename2, 'json')).toEqual(answer);
});
