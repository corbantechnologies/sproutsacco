// use formik
// no yup validation
// fields: name, category, code, is_active
// category is a select field with the following options:
// CATEGORIES = [
//     ("ASSET", "Asset"),  # Bank, M - Pesa, Loan Receivables: 100000 - 199999
//         (
//             "LIABILITY",
//             "Liability",
//         ),  # Loans Payable, Deposits Payable, Member Savings, Ventures: 200000 - 299999
//             ("EQUITY", "Equity"),  # Share Capital, Retained Earnings: 300000 - 399999
//                 (
//                     "REVENUE",
//                     "Revenue",
//                 ),  # Interest Income, Fees Income, Loan Interest Income: 400000 - 499999
//                     ("EXPENSE", "Expense"),  # Interest Expense, Operating Expenses: 500000 - 599999
// ]
