const {describe, it} = require('mocha');

const {
  create度数分布,
} = require('../../lib/toukeigaku');

describe('lib/toukeigaku', function() {
  describe('create度数分布', function() {
    describe('どの値にも小数が存在しないとき', function() {
      const データリスト = [
        0, 1, 3, 4,
        5, 5, 6, 6,
        6, 7, 9, 12,
      ];

      it('aaaaaaa', function() {
        const 度数分布 = create度数分布(データリスト, 4);
        console.log(度数分布);
      });
    });
  });
});
