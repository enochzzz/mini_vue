import { isReactive, readonly } from "../reactive";

describe('readonly', () => {
  it('readonly', () => {
    const original = { foo: 1, bar: { baz: 2 } };
    const warpped = readonly(original);
    expect(warpped.foo).toBe(1);
    expect(warpped).not.toBe(original);
    expect(isReactive(warpped)).toBe(true);
    expect(isReactive(original)).toBe(false);
  });

  it('warn then call set', () => {
    console.warn = jest.fn()
    const user = readonly({
      age: 10
    })
    user.age = 11
    expect(console.warn).toBeCalled()
  });
  
});