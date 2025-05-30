const map = function (arr, fn) {
  const result = [];
  arr.forEach((elem) => {
    result.push(fn(elem));
  });
  return result;
};

const newArray = map([1, 2, 3], (n) => {
  return n + 1;
});

console.log(newArray);
