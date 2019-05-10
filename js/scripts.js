function test(val) {
  console.log('This is from JS FILE: ' + val);
}

function isPalindrom(str) {
  let parseStr = str
    .toLowerCase()
    .split(' ')
    .filter(item => !!item)
    .join('');
  return parseStr === [...parseStr].reverse().join('');
}
