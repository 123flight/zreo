// https://github.com/florian/range.js/blob/master/lib/range.js

let letters: string = 'abcdefghijklmnopqrstuvwxyz';
letters = letters.toUpperCase() + letters + letters.toUpperCase();

function range(from: string | number, to?: number | string, step: number = 1) {
  let isExclusive, isReversed, isNumberRange, index, finalIndex, parts, tmp;

  let method: string;
  const self: (string | number)[]  = [];

  // Ruby style range? `range('a..z') or `range('a..z', 2)`
  if (arguments.length == 1 || typeof from === 'string' && typeof to == 'number') {
    isExclusive = (from as string).indexOf('...') > -1;
    step = to as number;

    parts = (from as string).split(/\.{2,3}/);
    from = parts[0];
    to = parts[1];
  }

  // Check if the first range part is numeric.
  // `isNaN` is broken, but NaN is the only value that doesn't equal itself.
  isNumberRange = Number(from) == Number(from);

  // 是数字范围
  if (isNumberRange) {
    // JS floats are broken: `0.1 + 0.2 == 0.3 + 4e-17 == 0.30000000000000004`.
    // Dirty fix to make `range(0, 1, 0.1)` work as expected.
    finalIndex = Number(to) + 1e-16;
    index = Number(from);
  } else {

    index = letters.indexOf(from as string);
    method = (from == (from as string).toLowerCase() && to == (to as string).toUpperCase()) ? 'lastIndexOf' : 'indexOf';
    // @ts-ignore
    finalIndex = letters[method](to as string);
  }

  isReversed = index > finalIndex;
  if (isReversed) {
    tmp = index;
    index = finalIndex;
    finalIndex = tmp;
  }

  while (index <= finalIndex) {
    self.push(isNumberRange ? index : letters.charAt(index));
    index += step;
  }

  if (isReversed) self.reverse();
  if (isExclusive) self.pop();

  return self;
}

function equals(one: any, two: any) {
  return one.join() == two.join();
}

function overlaps(one: any, two: any) {
  return one[0] <= two.slice(-1)[0] && two[0] <= one.slice(-1)[0];
};
