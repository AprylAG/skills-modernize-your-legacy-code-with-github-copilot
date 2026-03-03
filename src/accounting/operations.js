/**
 * Operations Module
 * Corresponds to: operations.cob (Operations Program)
 * 
 * Implements business logic for account operations:
 * - TOTAL: View current balance
 * - CREDIT: Add amount to account
 * - DEBIT: Subtract amount from account (with validation)
 */

class Operations {
  constructor(dataProgram, inputHandler) {
    this.dataProgram = dataProgram;
    this.inputHandler = inputHandler;
  }

  /**
   * Process operations based on operation type
   * 
   * @param {string} operationType - Type of operation: 'TOTAL ', 'CREDIT', or 'DEBIT '
   * @returns {Promise<void>}
   */
  async processOperation(operationType) {
    // OPERATION-TYPE = PASSED-OPERATION
    const opType = operationType.trim();

    if (opType === 'TOTAL') {
      // IF OPERATION-TYPE = 'TOTAL '
      // CALL DataProgram USING 'READ', FINAL-BALANCE
      // DISPLAY "Current balance: " FINAL-BALANCE
      await this.handleTotal();
    } else if (opType === 'CREDIT') {
      // ELSE IF OPERATION-TYPE = 'CREDIT'
      // DISPLAY "Enter credit amount: "
      // ACCEPT AMOUNT
      // ... ADD AMOUNT TO FINAL-BALANCE
      // ... CALL DataProgram USING 'WRITE', FINAL-BALANCE
      // ... DISPLAY "Amount credited. New balance: " FINAL-BALANCE
      await this.handleCredit();
    } else if (opType === 'DEBIT') {
      // ELSE IF OPERATION-TYPE = 'DEBIT '
      // DISPLAY "Enter debit amount: "
      // ACCEPT AMOUNT
      // ... IF FINAL-BALANCE >= AMOUNT
      // ... ELSE DISPLAY "Insufficient funds for this debit."
      await this.handleDebit();
    }
  }

  /**
   * TOTAL Operation: View current balance
   * Corresponds to: WHEN 1 - CALL 'Operations' USING 'TOTAL '
   */
  async handleTotal() {
    // CALL 'DataProgram' USING 'READ', FINAL-BALANCE
    const balance = this.dataProgram.read();
    // DISPLAY "Current balance: " FINAL-BALANCE
    console.log(`Current balance: ${this.formatBalance(balance)}`);
  }

  /**
   * CREDIT Operation: Add amount to account
   * Corresponds to: WHEN 2 - CALL 'Operations' USING 'CREDIT'
   */
  async handleCredit() {
    // DISPLAY "Enter credit amount: "
    // ACCEPT AMOUNT
    const amount = await this.inputHandler.askQuestion('Enter credit amount: ');

    if (!this.isValidAmount(amount)) {
      console.log('Invalid amount. Please enter a valid number.');
      return;
    }

    const numAmount = parseFloat(amount);

    // CALL 'DataProgram' USING 'READ', FINAL-BALANCE
    let finalBalance = this.dataProgram.read();
    // ADD AMOUNT TO FINAL-BALANCE
    finalBalance += numAmount;
    // CALL 'DataProgram' USING 'WRITE', FINAL-BALANCE
    this.dataProgram.write(finalBalance);
    // DISPLAY "Amount credited. New balance: " FINAL-BALANCE
    console.log(`Amount credited. New balance: ${this.formatBalance(finalBalance)}`);
  }

  /**
   * DEBIT Operation: Subtract amount from account (with validation)
   * Corresponds to: WHEN 3 - CALL 'Operations' USING 'DEBIT '
   * 
   * Business Rule: IF FINAL-BALANCE >= AMOUNT (Insufficient funds protection)
   */
  async handleDebit() {
    // DISPLAY "Enter debit amount: "
    // ACCEPT AMOUNT
    const amount = await this.inputHandler.askQuestion('Enter debit amount: ');

    if (!this.isValidAmount(amount)) {
      console.log('Invalid amount. Please enter a valid number.');
      return;
    }

    const numAmount = parseFloat(amount);

    // CALL 'DataProgram' USING 'READ', FINAL-BALANCE
    let finalBalance = this.dataProgram.read();

    // IF FINAL-BALANCE >= AMOUNT (CRITICAL BUSINESS RULE)
    if (finalBalance >= numAmount) {
      // SUBTRACT AMOUNT FROM FINAL-BALANCE
      finalBalance -= numAmount;
      // CALL 'DataProgram' USING 'WRITE', FINAL-BALANCE
      this.dataProgram.write(finalBalance);
      // DISPLAY "Amount debited. New balance: " FINAL-BALANCE
      console.log(`Amount debited. New balance: ${this.formatBalance(finalBalance)}`);
    } else {
      // ELSE DISPLAY "Insufficient funds for this debit."
      console.log('Insufficient funds for this debit.');
    }
  }

  /**
   * Validate amount input
   * 
   * @param {string} amountStr - Amount as string from user input
   * @returns {boolean} - True if valid number, false otherwise
   */
  isValidAmount(amountStr) {
    const num = parseFloat(amountStr);
    return !isNaN(num) && isFinite(num) && num >= 0;
  }

  /**
   * Format balance for display (matching COBOL output format)
   * COBOL format: PIC 9(6)V99 displays as "00XXXX.XX"
   * 
   * @param {number} balance - Balance value
   * @returns {string} - Formatted balance string
   */
  formatBalance(balance) {
    // Format as 6 digits before decimal, 2 after (matching COBOL's PIC 9(6)V99)
    return balance.toFixed(2).padStart(9, '0');
  }
}

export default Operations;
