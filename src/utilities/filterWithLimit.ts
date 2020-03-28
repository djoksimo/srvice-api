export function* filterWithLimit(
  array: any[],
  filter: (element: Parameters<typeof filterWithLimit>[0][0]) => boolean,
  maxSize: number,
) {
  if (!maxSize || maxSize > array.length) {
    // eslint-disable-next-line no-param-reassign
    maxSize = array.length;
  }
  let count = 0;
  let i = 0;
  while (count < maxSize && i < array.length) {
    if (filter(array[i])) {
      yield array[i];
      // eslint-disable-next-line no-plusplus
      count++;
    }
    // eslint-disable-next-line no-plusplus
    i++;
  }
}
