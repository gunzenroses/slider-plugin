import Observable from "mvp/Observable/Observable";

describe("Observable", () => {
  const eventDispatcher = new Observable();
  const follower = jest.fn(x => 42 + x);
  const anotherFollower = jest.fn(x => 17 + x);
  eventDispatcher.add("someKey", follower);
  eventDispatcher.add("anotherKey", anotherFollower);
  eventDispatcher.notify("someKey", 13);
  eventDispatcher.notify("anotherKey", -8);
  
  beforeEach(() => {
    jest.restoreAllMocks();
  })

  test("method add(): notify listeners in relevance with eventKey", () => {
    expect(follower).toHaveBeenCalledTimes(1);
    expect(anotherFollower).toHaveBeenCalledTimes(1);
  });

  test("method notify(): pass arguments when it notifies listeners", () => {
    expect(follower).toHaveReturnedWith(55);
    expect(anotherFollower).toHaveReturnedWith(9);
  });
});
