import { filterWithLimit } from "../filterWithLimit";

describe("filterWithLimit", () => {
  const mockArray = new Array<number>(100).fill(4);
  const filter = (elem: number) => elem > 3;

  const result = Array.from(filterWithLimit(mockArray, filter, 5));

  describe("target array length is 5", () => {
    test("should only contain numbers greater than 3", () => {
      const foundElementLessThan3 = result.some((elem) => elem <= 3);
      expect(foundElementLessThan3).not.toBe(true);
    });

    test("result array length i 5", () => {
      expect(result.length).toBe(5);
    });
  });
});
