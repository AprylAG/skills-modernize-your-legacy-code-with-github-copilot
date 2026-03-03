#!/usr/bin/env node

/**
 * Main Program
 * Corresponds to: main.cob (MainProgram)
 * 
 * Student Account Management System
 * Node.js port of the COBOL application
 * 
 * This application provides a menu-driven interface for managing student
 * account operations: View Balance, Credit Account, Debit Account, and Exit.
 */

import readline from 'readline';
import DataProgram from './data.js';
import Operations from './operations.js';

/**
 * Input handler for interactive menu prompts
 */
class InputHandler {
  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
  }

  /**
   * Ask question and return user response
   * @param {string} question - Question to ask user
   * @returns {Promise<string>} - User's answer
   */
  askQuestion(question) {
    return new Promise((resolve) => {
      this.rl.question(question, (answer) => {
        resolve(answer);
      });
    });
  }

  /**
   * Close the readline interface
   */
  close() {
    this.rl.close();
  }
}

/**
 * Main Application Class
 * Corresponds to: MAIN-LOGIC in main.cob
 */
class MainProgram {
  constructor() {
    this.dataProgram = new DataProgram();
    this.inputHandler = new InputHandler();
    this.operations = new Operations(this.dataProgram, this.inputHandler);
    this.continueFlag = true; // CONTINUE-FLAG = 'YES'
  }

  /**
   * Display menu
   * Corresponds to: DISPLAY statements for menu in COBOL
   */
  displayMenu() {
    console.log('--------------------------------');
    console.log('Account Management System');
    console.log('1. View Balance');
    console.log('2. Credit Account');
    console.log('3. Debit Account');
    console.log('4. Exit');
    console.log('--------------------------------');
  }

  /**
   * Main application loop
   * Corresponds to: PERFORM UNTIL CONTINUE-FLAG = 'NO' in COBOL
   */
  async run() {
    // PERFORM UNTIL CONTINUE-FLAG = 'NO'
    while (this.continueFlag) {
      this.displayMenu();

      // DISPLAY "Enter your choice (1-4): "
      // ACCEPT USER-CHOICE
      const choice = await this.inputHandler.askQuestion('Enter your choice (1-4): ');

      // EVALUATE USER-CHOICE
      await this.handleMenuChoice(choice);
    }

    // DISPLAY "Exiting the program. Goodbye!"
    console.log('Exiting the program. Goodbye!');
    // STOP RUN
    this.inputHandler.close();
    process.exit(0);
  }

  /**
   * Handle menu choice selection
   * Corresponds to: EVALUATE USER-CHOICE ... END-EVALUATE
   * 
   * @param {string} choice - User's menu choice
   */
  async handleMenuChoice(choice) {
    // Convert to number for comparison
    const numChoice = parseInt(choice, 10);

    switch (numChoice) {
      case 1:
        // WHEN 1: CALL 'Operations' USING 'TOTAL '
        await this.operations.processOperation('TOTAL ');
        break;
      case 2:
        // WHEN 2: CALL 'Operations' USING 'CREDIT'
        await this.operations.processOperation('CREDIT');
        break;
      case 3:
        // WHEN 3: CALL 'Operations' USING 'DEBIT '
        await this.operations.processOperation('DEBIT ');
        break;
      case 4:
        // WHEN 4: MOVE 'NO' TO CONTINUE-FLAG
        this.continueFlag = false;
        break;
      default:
        // WHEN OTHER: DISPLAY "Invalid choice, please select 1-4."
        console.log('Invalid choice, please select 1-4.');
    }
  }
}

/**
 * Entry point
 */
async function main() {
  const mainProgram = new MainProgram();
  await mainProgram.run();
}

// Run the application if called directly (not during tests)
if (process.argv[1] && process.argv[1].endsWith('index.js')) {
  main().catch(console.error);
}

// export for testing
export { MainProgram };
