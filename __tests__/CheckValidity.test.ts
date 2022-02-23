/*
 * @jest-environment jsdom
 */

import CheckValidity from 'helpers/CheckValidity';

const container = document.createElement('div');
document.body.append(container);

const item = document.createElement('input');
item.type = 'number';

describe('helpers: class CheckValidity', () => {
  test('return false when input.value === "" ', () => {
    item.value = '';

    const checkItem = new CheckValidity(item, container);
    checkItem.init();

    expect(checkItem.checkValidity()).toBeFalsy();
  });

  test('add error-message when value is not a number', () => {
    item.value = 'cat';

    const checkItem = new CheckValidity(item, container);
    checkItem.init();

    expect(checkItem.invalidities).toContain('Should be a number');
  });

  test('return nothing when input has a proper value', () => {
    item.value = '15';
    item.step = '5';
    item.min = '0';
    item.max = '30';

    const checkItem = new CheckValidity(item, container);
    checkItem.init();

    expect(checkItem.invalidities).toEqual([]);
  });

  test('add error-message when value > item', () => {
    item.value = '31';
    item.max = '30';

    const checkItem = new CheckValidity(item, container);
    checkItem.init();

    expect(checkItem.invalidities).toContain(`Number should be maximum ${ 
      item. max }`);
  });

  test('add error-message when stepMismatch and min === 0', () => {
    item.min = '0';
    item.step = '4';
    item.value = '11';
    item.name = 'from';

    const checkItem = new CheckValidity(item, container);
    checkItem.init();

    expect(checkItem.invalidities).toContain(`Number should be multiple of ${ 
      item.step }`);
  });

  test('add error-message when stepMismatch and min > 0', () => {
    item.min = '10';
    item.step = '8';
    item.value = '25';
    item.name = 'from'
    
    const checkItem = new CheckValidity(item, container);
    checkItem.init();

    expect(checkItem.invalidities).toContain(`Number should be: ${ 
      item.min } + multiple of ${ item.step }`);
  });

  test('add error-message when value < min', () => {
    item.min = '1';
    item.value = '0';

    const checkItem = new CheckValidity(item, container);
    checkItem.init();

    expect(checkItem.invalidities).toContain(`Number should be more than ${ 
      item.min }`);
  });
});
