// HELLO
describe("These are examples", () => {
  it("should return 3", () => expect(1 + 2).toEqual(3));

  it("should not return 5", () => expect(1 + 2).not.toEqual(5));

  it("should return undefined", () => {
    const z = 0;
    expect(z).toBeFalsy();
  });
});
