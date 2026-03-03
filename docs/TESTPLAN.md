# Test Plan: Student Account Management System

## Overview
This document provides a comprehensive test plan for the COBOL-based Student Account Management System. It covers all business logic, key functions, and edge cases to validate the application behavior against requirements.

---

## Test Cases

| Test Case ID | Test Case Description | Pre-conditions | Test Steps | Expected Result | Actual Result | Status | Comments |
|---|---|---|---|---|---|---|---|
| TC-001 | Verify Initial Account Balance | Application started | 1. Launch application<br>2. Select menu option 1 (View Balance) | Display shows "Current balance: 001000.00" | | | Initial balance should be 1000.00 |
| TC-002 | View Balance Multiple Times | Application running with no prior transactions | 1. Select menu option 1 (View Balance)<br>2. Observe displayed balance<br>3. Select menu option 1 again<br>4. Observe displayed balance | Both balance inquiries display the same amount "001000.00" | | | Confirms balance is persistent in session and no changes occur from read-only operation |
| TC-003 | Credit Account with Valid Amount | Application running with balance = 1000.00 | 1. Select menu option 2 (Credit Account)<br>2. Enter amount: 500<br>3. Note displayed new balance | Display shows "Amount credited. New balance: 001500.00" | | | Balance increases by exactly the credited amount |
| TC-004 | Credit Account with Small Amount | Application running with previous balance | 1. Select menu option 2 (Credit Account)<br>2. Enter amount: 0.01 | Display shows updated balance (1000.00 + 0.01 = 1000.01) | | | System handles decimal amounts correctly |
| TC-005 | Credit Account Multiple Times | Application running | 1. Credit 200, observe balance<br>2. Credit 300, observe balance<br>3. View Balance, confirm final total | Balance progresses: 1000.00 → 1200.00 → 1500.00. Final View Balance shows 1500.00 | | | Multiple credits accumulate correctly |
| TC-006 | Debit Account with Valid Amount (Sufficient Funds) | Application running with balance = 1000.00 | 1. Select menu option 3 (Debit Account)<br>2. Enter amount: 250<br>3. Note displayed new balance | Display shows "Amount debited. New balance: 000750.00" | | | Balance decreases by exactly the debited amount |
| TC-007 | Debit Account with Amount Equal to Balance | Application running with balance = 1000.00 | 1. Select menu option 3 (Debit Account)<br>2. Enter amount: 1000<br>3. Note displayed new balance | Display shows "Amount debited. New balance: 000000.00" | | | Account balance can reach zero; boundary condition (FINAL-BALANCE >= AMOUNT allows equality) |
| TC-008 | Debit Account with Insufficient Funds | Application running with balance = 1000.00 | 1. Select menu option 3 (Debit Account)<br>2. Enter amount: 1500<br>3. Observe error message<br>4. View Balance to confirm no change | Display shows "Insufficient funds for this debit."<br>New balance inquiry confirms balance remains 1000.00 | | | Critical business rule: debit rejected when amount > balance; balance unchanged |
| TC-009 | Debit Account Exceeding Balance After Credits | Application running with balance = 1500.00 (after crediting 500) | 1. Select menu option 3 (Debit Account)<br>2. Enter amount: 1600 | Display shows "Insufficient funds for this debit."<br>Balance remains 1500.00 on next inquiry | | | Insufficient funds check works correctly after prior credits |
| TC-010 | Debit Account with Exact Remaining Balance | Application running with balance = 500.00 | 1. Credit 0 (balance stays 1000)<br>2. Debit 500<br>3. View Balance | Display shows "Amount debited. New balance: 000500.00"<br>Next View Balance shows 000500.00 | | | Transaction is accepted when amount equals remaining balance |
| TC-011 | Invalid Menu Choice - Letter Input | Application displaying menu | 1. Select menu option<br>2. Enter: "A" (invalid input) | Display shows "Invalid choice, please select 1-4." or accepts as invalid<br>Menu re-displays for next choice | | | System handles invalid character input gracefully |
| TC-012 | Invalid Menu Choice - Out of Range Number | Application displaying menu | 1. Select menu option<br>2. Enter: 5 | Display shows "Invalid choice, please select 1-4."<br>Menu re-displays for next choice | | | Menu validation rejects choices outside 1-4 range |
| TC-013 | Invalid Menu Choice - Zero | Application displaying menu | 1. Select menu option<br>2. Enter: 0 | Display shows "Invalid choice, please select 1-4."<br>Menu re-displays for next choice | | | Menu validation rejects zero as invalid choice |
| TC-014 | Sequential Operations: Credit Then Debit | Application starting with 1000.00 | 1. Credit 300 (expected: 1300.00)<br>2. View Balance (confirm 1300.00)<br>3. Debit 200 (expected: 1100.00)<br>4. View Balance (confirm 1100.00) | Sequence executes correctly:<br>- After credit: 1300.00<br>- After debit: 1100.00 | | | State is maintained correctly across sequential operations |
| TC-015 | Sequential Operations: Multiple Debits | Application starting with 1000.00 | 1. Debit 300 (expected: 700.00)<br>2. Debit 200 (expected: 500.00)<br>3. Debit 500 (check if allowed)<br>4. View Balance | Last debit is rejected (500 = remaining balance, should be allowed)<br>Actually: 500 == 500 so debit succeeds<br>Final balance: 000000.00 | | | Boundary condition: amount equal to balance is accepted (>= operator) |
| TC-016 | Program Exit | Application with menu displayed | 1. Select menu option 4 (Exit) | Display shows "Exiting the program. Goodbye!"<br>Program terminates gracefully | | | Clean program termination |
| TC-017 | Menu Loop Continuation | Application running | 1. Perform operation 1 (View Balance)<br>2. Observe menu re-displays<br>3. Perform operation 2 (Credit)<br>4. Observe menu re-displays | Menu displays after each operation<br>Program continues until option 4 selected | | | Program loop functions correctly; menu repeats for user actions |
| TC-018 | Data Persistence Within Session | Application running | 1. Credit 500 (balance: 1500)<br>2. Exit and restart application | New run shows balance reset to 1000.00 | | | Confirms data persistence is session-based; data not persisted between program runs |
| TC-019 | Large Credit Amount | Application running with balance = 1000.00 | 1. Credit 999999.99 (max PIC 9(6)V99)<br>2. View Balance | Balance updates to 1000999.99 or error if overflow | | | Boundary test for large monetary amounts (6 digits before decimal) |
| TC-020 | Debit with Decimal Amount | Application running with balance = 500.00 | 1. Debit 100.50<br>2. View Balance | Display shows "Amount debited. New balance: 000399.50" | | | System correctly handles decimal amounts in debit operations |
| TC-021 | Credit with Decimal Amount | Application running with balance = 1000.00 | 1. Credit 50.75<br>2. View Balance | Display shows "Amount credited. New balance: 001050.75" | | | System correctly handles decimal amounts in credit operations |
| TC-022 | Debit Insufficient Funds (After Multiple Operations) | Application after: Credit 500, Debit 200, Credit 100 (Balance: 1400) | 1. Debit 1500 | Display shows "Insufficient funds for this debit."<br>Balance remains 1400.00 | | | Validation works correctly after complex operation sequence |
| TC-023 | Zero Amount Credit | Application running with balance = 1000.00 | 1. Credit 0<br>2. View Balance | Display shows "Amount credited. New balance: 001000.00" or rejects entry | | | Boundary test: crediting zero amount (should be allowed or validated) |
| TC-024 | Zero Amount Debit | Application running with balance = 1000.00 | 1. Debit 0<br>2. View Balance | Display shows "Amount debited. New balance: 001000.00" or rejects entry | | | Boundary test: debiting zero amount (should be allowed since 1000 >= 0) |
| TC-025 | Display Format Verification | Any operation that displays balance | 1. Perform operations to generate different balances<br>2. Verify format of displayed amounts | All amounts display in format: "00XXXX.XX" (6 digits before decimal, 2 after) | | | Confirms consistent monetary display format throughout application |

---

## Test Execution Notes

### Test Environment
- **Platform**: COBOL (GnuCOBOL/cobc compiler)
- **Application**: accountsystem (compiled executable)
- **Build Command**: `cobc -x src/cobol/main.cob src/cobol/operations.cob src/cobol/data.cob -o accountsystem`
- **Run Command**: `./accountsystem`

### Test Assumptions
1. Each test case starts with a fresh application session OR explicitly states initial balance conditions
2. User input is accepted via standard input (ACCEPT statements)
3. Output is displayed via standard output (DISPLAY statements)
4. Initial balance is always 1000.00 at program start
5. Monetary values are decimal numbers with up to 2 decimal places

### Known Limitations & Dependencies
- **Session-based persistence**: Balance data is lost when application terminates
- **No database integration**: Cannot persist data between program runs
- **Limited input validation**: Application accepts any numeric input; no range checking on amounts
- **No negative number handling**: Test plan assumes non-negative amounts only
- **Menu input**: Accepts numeric choices 1-4; invalid choices prompt for re-entry

### Priority & Coverage
- **P0 (Critical)**: TC-001, TC-006, TC-008, TC-014 (core business logic)
- **P1 (High)**: TC-003, TC-007, TC-009, TC-016 (important operations)
- **P2 (Medium)**: TC-002, TC-004, TC-005, TC-011, TC-012, TC-015, TC-017 (extended scenarios)
- **P3 (Low)**: TC-018, TC-019, TC-020, TC-021, TC-022, TC-023, TC-024, TC-025 (edge cases)

---

## Migration Notes for Node.js Implementation

When converting this COBOL application to Node.js, ensure the following test cases are preserved:

1. **Core Business Logic**
   - View Balance: Simple read operation [TC-001, TC-002]
   - Credit Account: Add amount to balance [TC-003, TC-004, TC-005]
   - Debit Account: Subtract with validation [TC-006, TC-007, TC-008, TC-009]

2. **Data Validation**
   - Insufficient funds protection [TC-008, TC-009, TC-010]
   - Menu choice validation [TC-011, TC-012, TC-013]
   - Numeric amount handling [TC-020, TC-021]

3. **State Management**
   - Balance persists across transactions [TC-014, TC-015, TC-017]
   - Consider persistent storage (database) for Node.js [TC-018]

4. **Boundary Conditions**
   - Balance = 0 after debit [TC-007]
   - Amount = Balance for debit [TC-010, TC-015]
   - Large amounts within PIC 9(6)V99 range [TC-019]

5. **User Experience**
   - Menu re-displays after each operation [TC-017]
   - Error messages for invalid input [TC-011, TC-012]
   - Clear exit message [TC-016]
