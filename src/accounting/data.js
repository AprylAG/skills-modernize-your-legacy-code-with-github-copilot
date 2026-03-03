/**
 * Data Module
 * Corresponds to: data.cob (DataProgram)
 * 
 * Handles data persistence for the account system.
 * Maintains the storage balance and provides READ/WRITE operations.
 */

class DataProgram {
  constructor() {
    // STORAGE-BALANCE: Initial balance is 1000.00
    this.storageBalance = 1000.00;
  }

  /**
   * Performs READ or WRITE operation on the balance
   * 
   * @param {string} operation - Type of operation: 'READ' or 'WRITE'
   * @param {number} balance - Balance value (only used for WRITE operations)
   * @returns {number|undefined} - Returns balance for READ operations, undefined for WRITE
   */
  performOperation(operation, balance = null) {
    if (operation === 'READ') {
      // OPERATION-TYPE = 'READ': MOVE STORAGE-BALANCE TO BALANCE
      return this.storageBalance;
    } else if (operation === 'WRITE') {
      // OPERATION-TYPE = 'WRITE': MOVE BALANCE TO STORAGE-BALANCE
      this.storageBalance = balance;
      return undefined;
    }
  }

  /**
   * Alternative method names matching COBOL-style READ/WRITE
   */
  read() {
    return this.performOperation('READ');
  }

  write(balance) {
    this.performOperation('WRITE', balance);
  }

  /**
   * Get current balance
   */
  getBalance() {
    return this.storageBalance;
  }

  /**
   * Set balance (for WRITE operations)
   */
  setBalance(balance) {
    this.storageBalance = balance;
  }
}

export default DataProgram;
