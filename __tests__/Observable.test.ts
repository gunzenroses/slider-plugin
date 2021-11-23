import Observable from "mvp/Observable/Observable";

describe("Observable", () => {
  const keeper = new Observable();
  const follower = jest.fn(x => 42 + x);
  const anotherFollower = jest.fn(x => 17 + x);
  keeper.add("someKey", follower);
  keeper.add("anotherKey", anotherFollower);
  keeper.notify("someKey", 13);
  keeper.notify("anotherKey", -8);
  
  beforeEach(() => {
    jest.restoreAllMocks();
  })

  test("method add(): notify listeners in relevance with eventKey", () => {
    expect(follower).toHaveBeenCalledTimes(1);
    expect(anotherFollower).toHaveBeenCalledTimes(1);
  });

  test("method notify(): pass arguments when it notifies listeners", () => {
    expect(follower).toBe(55);
    expect(anotherFollower).toBe(11);
  });
});
