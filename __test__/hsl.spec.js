const utils = require("../src/utils");

test("rgb to hsl", () => {
  expect(utils.rgb2hsl(255, 255, 255)).toBe([360, 100, 100]);
});
