const assert = require('assert');
const Decimal = require('decimal.js');
const {describe, it} = require('mocha');

const {
  create度数分布,
  calculate度数分布の平均値,
} = require('../../lib/toukeigaku');

describe('lib/toukeigaku', function() {
  describe('create度数分布', function() {
    describe('各プロパティ', function() {
      // 端数処理が入ると別論点が混入してしまうので、相対度数・累積相対度数以外に端数が生じないデータにする
      const データセット = [
        0, 1, 3, 4,
        5, 5, 6, 6,
        6, 7, 9, 12,
      ];

      before(function() {
        this.度数分布 = create度数分布(データセット, 0, 12, 4);
      });

      it('階級数', function() {
        assert.strictEqual(this.度数分布.length, 4);
      });

      it('no', function() {
        assert.strictEqual(this.度数分布[0].no, 1);
        assert.strictEqual(this.度数分布[1].no, 2);
        assert.strictEqual(this.度数分布[2].no, 3);
        assert.strictEqual(this.度数分布[3].no, 4);
      });

      it('階級の最小値', function() {
        assert.strictEqual(Number(this.度数分布[0].階級の最小値), 0);
        assert.strictEqual(Number(this.度数分布[1].階級の最小値), 3);
        assert.strictEqual(Number(this.度数分布[2].階級の最小値), 6);
        assert.strictEqual(Number(this.度数分布[3].階級の最小値), 9);
      });

      it('階級の最大値', function() {
        assert.strictEqual(Number(this.度数分布[0].階級の最大値), 3);
        assert.strictEqual(Number(this.度数分布[1].階級の最大値), 6);
        assert.strictEqual(Number(this.度数分布[2].階級の最大値), 9);
        assert.strictEqual(Number(this.度数分布[3].階級の最大値), 12);
      });

      it('階級幅', function() {
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

      it('最大階級の累積度数がデータセットの長さと等しい', function() {
        assert.strictEqual(Number(this.度数分布[3].累積度数), 12);
      });

      it('最大階級の累積相対度数がおおよそ 1.0 に近い値である', function() {
        const actual = Number(this.度数分布[3].累積相対度数);
        assert.ok(actual > 0.9 && actual < 1.1);
      });
    });

    describe('端数処理', function() {
      describe('切り上げ', function() {
        describe('小数点第2位までのとき', function() {
          it('正しい処理である', function() {
            const 度数分布 = create度数分布([0, 0, 1], 0, 3, 3, {
              相対度数の丸め桁数: 2,
              相対度数の丸め手法: '切り上げ',
            });

            assert.strictEqual(度数分布[0].相対度数, '0.67');
            assert.strictEqual(度数分布[1].相対度数, '0.34');
            assert.strictEqual(度数分布[2].相対度数, '0.00');
          });
        });

        describe('小数点第0位までのとき', function() {
          it('正しい処理である', function() {
            const 度数分布 = create度数分布([0, 0, 1], 0, 3, 3, {
              相対度数の丸め桁数: 0,
              相対度数の丸め手法: '切り上げ',
            });

            assert.strictEqual(度数分布[0].相対度数, '1');
            assert.strictEqual(度数分布[1].相対度数, '1');
            assert.strictEqual(度数分布[2].相対度数, '0');
          });
        });
      });

      describe('切り捨て', function() {
        describe('小数点第2位までのとき', function() {
          it('正しい処理である', function() {
            const 度数分布 = create度数分布([0, 0, 1], 0, 3, 3, {
              相対度数の丸め桁数: 2,
              相対度数の丸め手法: '切り捨て',
            });

            assert.strictEqual(度数分布[0].相対度数, '0.66');
            assert.strictEqual(度数分布[1].相対度数, '0.33');
            assert.strictEqual(度数分布[2].相対度数, '0.00');
          });
        });

        describe('小数点第0位までのとき', function() {
          it('正しい処理である', function() {
            const 度数分布 = create度数分布([0, 0, 1], 0, 3, 3, {
              相対度数の丸め桁数: 0,
              相対度数の丸め手法: '切り捨て',
            });

            assert.strictEqual(度数分布[0].相対度数, '0');
            assert.strictEqual(度数分布[1].相対度数, '0');
            assert.strictEqual(度数分布[2].相対度数, '0');
          });
        });
      });

      describe('四捨五入', function() {
        describe('小数点第2位までのとき', function() {
          it('正しい処理である', function() {
            const 度数分布 = create度数分布([0, 0, 1], 0, 3, 3, {
              相対度数の丸め桁数: 2,
              相対度数の丸め手法: '四捨五入',
            });

            assert.strictEqual(度数分布[0].相対度数, '0.67');
            assert.strictEqual(度数分布[1].相対度数, '0.33');
            assert.strictEqual(度数分布[2].相対度数, '0.00');
          });
        });

        describe('小数点第0位までのとき', function() {
          it('正しい処理である', function() {
            const 度数分布 = create度数分布([0, 0, 1], 0, 3, 3, {
              相対度数の丸め桁数: 0,
              相対度数の丸め手法: '四捨五入',
            });

            assert.strictEqual(度数分布[0].相対度数, '1');
            assert.strictEqual(度数分布[1].相対度数, '0');
            assert.strictEqual(度数分布[2].相対度数, '0');
          });
        });
      });
    });
  });

  describe('calculate度数分布の平均値', function() {
    it('正しく計算している', function() {
      const 度数分布 = create度数分布([1, 1, 1, 19, 19], 0, 20, 2);
      // (5 * 3 + 15 * 2) / 5 = 9
      assert.strictEqual(calculate度数分布の平均値(度数分布), '9');
    });
  });
});
