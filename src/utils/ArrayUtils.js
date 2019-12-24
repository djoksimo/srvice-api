class ArrayUtils {

  static* filterWithLimit(array, condition, maxSize) {
    if (!maxSize || maxSize > array.length) {
      // eslint-disable-next-line no-param-reassign
      maxSize = array.length;
    }
    let count = 0;
    let i = 0;
    while (count < maxSize && i < array.length) {
      if (condition(array[i])) {
        yield array[i];
        // eslint-disable-next-line no-plusplus
        count++;
      }
      // eslint-disable-next-line no-plusplus
      i++;
    }
  }
}
module.exports = ArrayUtils;
