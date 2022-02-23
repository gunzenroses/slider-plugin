import Observable from 'Observable/Observable';

describe('Observable', () => {
  const eventDispatcher = new Observable();
  const someKeyFollower = jest.fn(x => 42 + x);
  const someKeyFollower2 = jest.fn(x => 4 + x);
  const anotherKeyFollower = jest.fn(x => 17 + x);
  eventDispatcher.add('someKey', someKeyFollower);
  eventDispatcher.add('someKey', someKeyFollower2);
  eventDispatcher.add('anotherKey', anotherKeyFollower);
  eventDispatcher.notify('someKey', 13);
  eventDispatcher.notify('anotherKey', -8);

  
  beforeEach(() => {
    jest.restoreAllMocks();
  })

  test('method add(): notify listeners in relevance with eventKey', () => {
    expect(someKeyFollower).toHaveBeenCalledTimes(1);
    expect(someKeyFollower2).toHaveBeenCalledTimes(1);
  });

  test('method notify(): pass arguments when it notifies listeners', () => {
    expect(someKeyFollower).toHaveReturnedWith(55);
    expect(anotherKeyFollower).toHaveReturnedWith(9);
  });

  describe('method delete()', () => {
    test('when only 1 argument is passed delete eventKey and all listeners', () => {
      eventDispatcher.delete('anotherKey');

      eventDispatcher.notify('anotherKey', 13);

      expect(anotherKeyFollower).toHaveBeenCalledTimes(1);
    }),
    test('when 2 argument is passed delete eventKey for mentioned listener', () => {
      eventDispatcher.delete('someKey', someKeyFollower2);

      eventDispatcher.notify('someKey', 13);

      expect(someKeyFollower).toHaveBeenCalledTimes(2);
      expect(someKeyFollower2).toHaveBeenCalledTimes(1);
    })
  })
});
