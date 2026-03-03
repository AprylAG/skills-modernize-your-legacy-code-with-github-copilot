import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';

import DataProgram from './data.js';
import Operations from './operations.js';
import { MainProgram } from './index.js';

// stub input handler for operations
class StubInput {
  constructor(responses = []) {
    this.responses = responses;
    this.index = 0;
  }

  askQuestion(_question) {
    const resp = this.responses[this.index++] || '';
    return Promise.resolve(resp);
  }
}

describe('DataProgram', () => {
  let data;

  beforeEach(() => {
    data = new DataProgram();
  });

  it('initial balance is 1000.00', () => {
    assert.strictEqual(data.read(), 1000.0);
  });

  it('write updates balance and read returns new value', () => {
    data.write(123.45);
    assert.strictEqual(data.read(), 123.45);
  });
});

describe('Operations business logic', () => {
  let data;
  let ops;
  let consoleSpy;
  let originalLog;

  beforeEach(() => {
    data = new DataProgram();
    // stub console.log manually
    originalLog = console.log;
    consoleSpy = [];
    console.log = (...args) => {
      consoleSpy.push(args.join(' '));
    };
  });

  afterEach(() => {
    console.log = originalLog;
  });

  function setupOperations(responses) {
    const input = new StubInput(responses);
    ops = new Operations(data, input);
    return input;
  }

  it('TOTAL operation displays current balance', async () => {
    setupOperations();
    await ops.processOperation('TOTAL ');
    assert.ok(consoleSpy.includes('Current balance: 001000.00'));
  });

  it('CREDIT operation with integer amount updates balance', async () => {
    setupOperations(['500']);
    await ops.processOperation('CREDIT');
    assert.strictEqual(data.read(), 1500);
    assert.ok(consoleSpy.includes('Amount credited. New balance: 001500.00'));
  });

  it('CREDIT operation with decimal amount', async () => {
    setupOperations(['0.01']);
    await ops.processOperation('CREDIT');
    assert.strictEqual(data.read(), 1000.01);
    assert.ok(consoleSpy.includes('Amount credited. New balance: 001000.01'));
  });

  it('multiple CREDIT operations accumulate correctly', async () => {
    setupOperations(['200']);
    await ops.processOperation('CREDIT');
    assert.strictEqual(data.read(), 1200);
    setupOperations(['300']);
    await ops.processOperation('CREDIT');
    assert.strictEqual(data.read(), 1500);
  });

  it('DEBIT operation with sufficient funds updates balance', async () => {
    data.write(1000);
    setupOperations(['250']);
    await ops.processOperation('DEBIT ');
    assert.strictEqual(data.read(), 750);
    assert.ok(consoleSpy.includes('Amount debited. New balance: 000750.00'));
  });

  it('DEBIT operation equal to balance allowed and zeroes out', async () => {
    data.write(1000);
    setupOperations(['1000']);
    await ops.processOperation('DEBIT ');
    assert.strictEqual(data.read(), 0);
    assert.ok(consoleSpy.includes('Amount debited. New balance: 000000.00'));
  });

  it('DEBIT operation with insufficient funds does not change balance', async () => {
    data.write(1000);
    setupOperations(['1500']);
    await ops.processOperation('DEBIT ');
    assert.strictEqual(data.read(), 1000);
    assert.ok(consoleSpy.includes('Insufficient funds for this debit.'));
  });

  it('DEBIT operation with decimal amount', async () => {
    data.write(500);
    setupOperations(['100.5']);
    await ops.processOperation('DEBIT ');
    assert.strictEqual(data.read(), 399.5);
    assert.ok(consoleSpy.includes('Amount debited. New balance: 000399.50'));
  });

  it('CREDIT zero amount leaves balance unchanged', async () => {
    data.write(1000);
    setupOperations(['0']);
    await ops.processOperation('CREDIT');
    assert.strictEqual(data.read(), 1000);
  });

  it('DEBIT zero amount leaves balance unchanged', async () => {
    data.write(1000);
    setupOperations(['0']);
    await ops.processOperation('DEBIT ');
    assert.strictEqual(data.read(), 1000);
    assert.ok(consoleSpy.includes('Amount debited. New balance: 001000.00'));
  });

  it('CREDIT large amount within PIC range', async () => {
    data.write(1000);
    setupOperations(['999999.99']);
    await ops.processOperation('CREDIT');
    assert.strictEqual(data.read(), 1000999.99);
    assert.ok(consoleSpy.includes('Amount credited. New balance: 1000999.99'));
  });

  it('formatBalance produces correct string', () => {
    setupOperations();
    assert.strictEqual(ops.formatBalance(123), '0000123.00');
    assert.strictEqual(ops.formatBalance(0), '0000000.00');
    assert.strictEqual(ops.formatBalance(1000999.99), '1000999.99');
  });
});

// integration test replicating a sequence through MainProgram

describe('Integration: MainProgram menu flow', () => {
  let consoleSpy;
  let originalLog;

  beforeEach(() => {
    originalLog = console.log;
    consoleSpy = [];
    console.log = (...args) => {
      consoleSpy.push(args.join(' '));
    };
  });

  afterEach(() => {
    console.log = originalLog;
  });

  it('credit then debit sequence via menu', async () => {
    const answers = ['2', '300', '1', '3', '200', '4'];

    class MenuInputStub {
      constructor(arr) { this.arr = arr; this.idx = 0; }
      askQuestion(_q) { return Promise.resolve(this.arr[this.idx++] || ''); }
    }

    const main = new MainProgram();
    main.inputHandler = new MenuInputStub(answers);
    main.operations.inputHandler = main.inputHandler;

    await main.run();

    assert.ok(consoleSpy.includes('Amount credited. New balance: 001300.00'));
    assert.ok(consoleSpy.includes('Current balance: 001300.00'));
    assert.ok(consoleSpy.includes('Amount debited. New balance: 001100.00'));
  });
});
