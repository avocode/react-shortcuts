import chai from 'chai';
import _ from 'lodash';
import { isArray, isPlainObject, findKey, compact, flatten, map } from '../src/utils';

describe('utils', () => {
  const { expect } = chai;
  let primitives;

  beforeEach(() => {
    function fn() { this.a = 1; }

    primitives = [
      ['array'],
      { object: true },
      Object.create(null),
      'string',
      null,
      undefined,
      NaN,
      new Map([[1, 'one'], [2, 'two']]),
      new fn(),
      true,
      42,
    ];
  });

  describe('isArray', () => {
    it('should be true for arrays', () => {
      primitives.forEach((val, idx) => {
        if (idx === 0) {
          expect(isArray(val)).to.be.true;
          expect(_.isArray(val)).to.be.true;
        } else {
          expect(isArray(val)).to.be.false;
          expect(_.isArray(val)).to.be.false;
        }
      });
    });
  });

  describe('isPlainObject', () => {
    it('should be true for plain objects', () => {
      primitives.forEach((val, idx) => {
        if (idx === 1 || idx === 2) {
          expect(isPlainObject(val)).to.be.true;
          expect(_.isPlainObject(val)).to.be.true;
        } else {
          expect(isPlainObject(val)).to.be.false;
          expect(_.isPlainObject(val)).to.be.false;
        }
      });
    });
  });

  describe('findKey', () => {
    it('should return the matching key', () => {
      const obj = {
        simple: 1,
        obj: {
          val: 4,
        },
      };

      const checkOne = val => val === 1;
      const checkTwo = val => typeof val === 'object';

      expect(findKey(obj, checkOne)).to.deep.equal(_.findKey(obj, checkOne));
      expect(findKey(obj, checkTwo)).to.deep.equal(_.findKey(obj, checkTwo));
    });
  });

  describe('compact', () => {
    it('removes falsy values', () => {
      const values = [
        true,
        false,
        10,
        0,
        null,
        undefined,
        NaN,
        '',
        'false, null, 0, "", undefined, and NaN are falsy',
      ];

      expect(compact(values)).to.deep.equal(_.compact(values));
    });
  });

  describe('flatten', () => {
    it('flattens an array 1 level', () => {
      const value = [1, [2, [3, [4]], 5, [[[6], 7], 8], 9]];
      expect(flatten(value)).to.deep.equal(_.flatten(value));
    });
  });

  describe('map', () => {
    it('should map an array', () => {
      const values = [1, 2, 3, 4];
      const mapFn = val => val * 10;

      expect(map(values, mapFn)).to.deep.equal(_.map(values, mapFn));
      expect(map(values, mapFn)).to.deep.equal([10, 20, 30, 40]);

      // ensure that values array is not mutated
      expect(values).to.deep.equal([1, 2, 3, 4]);
    });

    it('should map an object', () => {
      const obj = {
        one: 1,
        two: 2,
        three: 3,
      };
      const mapFn = (val, key) => `${key} - ${val * 10}`;

      expect(map(obj, mapFn)).to.deep.equal(_.map(obj, mapFn));
      expect(map(obj, mapFn)).to.deep.equal([
        'one - 10',
        'two - 20',
        'three - 30',
      ]);

      // ensure the object was not mutated
      expect(obj).to.deep.equal({
        one: 1,
        two: 2,
        three: 3,
      });
    });
  });
});
