const assert = require('assert');
const Decimal = require('decimal.js');
const {describe, it} = require('mocha');

const {
  create度数分布,
} = require('../../lib/toukeigaku');

describe('lib/toukeigaku', function() {
  describe('create度数分布', function() {
    describe('相対度数・累積相対度数を除く数値が整数になる度数分布のとき', function() {
      const データセット = [
        0, 1, 3, 4,
        5, 5, 6, 6,
        6, 7, 9, 12,
      ];

      before(function() {
        this.度数分布 = create度数分布(データセット, 0, 12, 4);
      });

      it('階層数', function() {
        assert.strictEqual(this.度数分布.length, 4);
      });

      it('no', function() {
        assert.strictEqual(this.度数分布[0].no, 1);
        assert.strictEqual(this.度数分布[1].no, 2);
        assert.strictEqual(this.度数分布[2].no, 3);
        assert.strictEqual(this.度数分布[3].no, 4);
      });

      it('階層の最小値', function() {
        assert.strictEqual(Number(this.度数分布[0].階級の最小値), 0);
        assert.strictEqual(Number(this.度数分布[1].階級の最小値), 3);
        assert.strictEqual(Number(this.度数分布[2].階級の最小値), 6);
        assert.strictEqual(Number(this.度数分布[3].階級の最小値), 9);
      });

      it('階層の最大値', function() {
        assert.strictEqual(Number(this.度数分布[0].階級の最大値), 3);
        assert.strictEqual(Number(this.度数分布[1].階級の最大値), 6);
        assert.strictEqual(Number(this.度数分布[2].階級の最大値), 9);
        assert.strictEqual(Number(this.度数分布[3].階級の最大値), 12);
      });

      it('階層幅', function() {
        const expected = 3;
        assert.strictEqual(Number(this.度数分布[0].階級幅), expected);
        assert.strictEqual(Number(this.度数分布[1].階級幅), expected);
        assert.strictEqual(Number(this.度数分布[2].階級幅), expected);
        assert.strictEqual(Number(this.度数分布[3].階級幅), expected);
      });

      it('度数の合計がデータセットの長さと等しい', function() {
        const expected = 12;
        assert.strictEqual(
          this.度数分布.reduce((memo, 階級) => {
            return memo + 階級.度数;
          }, 0),
          expected
        );
      });

      it('最大階層の累積度数がデータセットの長さと等しい', function() {
        assert.strictEqual(Number(this.度数分布[3].累積度数), 12);
      });

      it('最大階層の累積相対度数がおおよそ 1.0 に近い値である', function() {
        const actual = Number(this.度数分布[3].累積相対度数);
        assert.ok(actual > 0.99 && actual < 1.01);
      });
    });
  });
});
