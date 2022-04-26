import Observable from 'Observable/Observable';

type TObserve = {
  'someKey': number,
  'anotherKey': number
}

describe('Observable', () => {
  class Observe extends Observable<TObserve> {
    constructor() {
      super();
    }

    makeNotification(key: keyof TObserve, data: number) {
      this.notifyListener(key, data);
    }
  };

  const eventDispatcher = new Observe();
  const someKeyFollower = jest.fn(x => 42 + x);
  const someKeyFollower2 = jest.fn(x => 4 + x);
  const anotherKeyFollower = jest.fn(x => 17 + x);
  const fakeListener = jest.fn(x => x);
  
  
  beforeEach(() => {
    jest.restoreAllMocks();
  })

  test('notify listeners in relevance with eventKey', () => {
    eventDispatcher.addListener('someKey', someKeyFollower);
    eventDispatcher.addListener('someKey', someKeyFollower2);
    eventDispatcher.addListener('anotherKey', anotherKeyFollower);
    eventDispatcher.makeNotification('someKey', 11);
    eventDispatcher.makeNotification('anotherKey', 3);

    expect(someKeyFollower).toHaveBeenCalledWith(11);
    expect(someKeyFollower2).toHaveBeenCalledWith(11);
    expect(anotherKeyFollower).toHaveBeenCalledWith(3);
  });

  test('delete by eventKey and Listener removes mentioned listener from eventKey section', () => {
    eventDispatcher.deleteListener('someKey', someKeyFollower2);

    eventDispatcher.makeNotification('someKey', 13);

    expect(someKeyFollower).toHaveBeenCalledWith(13);
    expect(someKeyFollower2).not.toHaveBeenCalledWith(13);
  });

  test('delete by eventKey and nonexisting Listener changes nothing', () => {
    eventDispatcher.deleteListener('someKey', fakeListener);

    eventDispatcher.makeNotification('someKey', 17);

    expect(someKeyFollower).toHaveBeenCalledWith(17);
  })
});
