import { TokenTypes } from "../Parser/tokenizer/TokenTypes.js";

export const SPEC = [


  //Whitespace (spaces, tabs, newlines)  
  { regex: /^\s+/, tokenType: TokenTypes.NULL_TYPE },


  // Single-line Comments
  { regex: /^\/\/.*/, tokenType: TokenTypes.NULL_TYPE },

  // Multi-line Comments
  { regex: /^\/\*[\s\S]*?\*\//, tokenType: TokenTypes.NULL_TYPE },

  // Symbols
  { regex: /^;/, tokenType: TokenTypes.SEMI_COLON_TYPE },
  { regex: /^\{/, tokenType: TokenTypes.OPEN_CURLY_BRACE_TYPE },
  { regex: /^\}/, tokenType: TokenTypes.CLOSED_CURLY_BRACE_TYPE },
  { regex: /^\(/, tokenType: TokenTypes.OPEN_PARENTHESIS_TYPE },
  { regex: /^\)/, tokenType: TokenTypes.CLOSED_PARENTHESIS_TYPE },
  { regex: /^,/, tokenType: TokenTypes.COMMA_TYPE },

  // AkLang Keywords
  { regex: /^\bclass chalu\b/, tokenType: TokenTypes.CLASS_CHALU },
  { regex: /^\bclass khatam\b/, tokenType: TokenTypes.CLASS_KHATAM },
  { regex: /^\bnote kar\b/, tokenType: TokenTypes.NOTE_KAR },
  { regex: /^\bbol abhi\b/, tokenType: TokenTypes.BOL_ABHI },
  { regex: /^\bbol\b/, tokenType: TokenTypes.BOL },
  { regex: /^\bproxy mili toh\b/, tokenType: TokenTypes.PROXY_MILI_TOH },
  { regex: /^\bnahi mili toh\b/, tokenType: TokenTypes.NAHI_MILI_TOH },
  { regex: /^\bpakde gaye\b/, tokenType: TokenTypes.PAKDE_GAYE },
  { regex: /^\bjab tak\b/, tokenType: TokenTypes.JAB_TAK },
  { regex: /^\bbunk maar\b/, tokenType: TokenTypes.BUNK_MAAR },
  { regex: /^\bagli class\b/, tokenType: TokenTypes.AGLI_CLASS },

  // Number
  { regex: /^[+-]?([\d]*[.])?[\d]+/, tokenType: TokenTypes.NUMBER_TYPE },

  
  // Boolean
  { regex: /^\bpass\b/, tokenType: TokenTypes.BOOLEAN_TYPE },
  { regex: /^\bfail\b/, tokenType: TokenTypes.BOOLEAN_TYPE },
  
  // Identifier (variable names)
  { regex: /^\w+/, tokenType: TokenTypes.IDENTIFIER_TYPE },

  // Equality operator: ==, !=
  {regex: /^[=!]=/, tokenType: TokenTypes.EQUALITY_OPERATOR},
  
  // Assignment operators (=, +=, -=, *=, /=, %=)
  { regex: /^[\*\%\/\+\-]=/, tokenType: TokenTypes.COMPLEX_ASSIGN_TYPE },
  { regex: /^=/, tokenType: TokenTypes.SIMPLE_ASSIGN_TYPE },

  

  // Operators (+, -, *, /, %)
  // Note: We use [+\-] to match both + and - for additive operators
  { regex: /^[+\-]/, tokenType: TokenTypes.ADDITIVE_OPERATOR_TYPE },
  { regex: /^\*\*|^[*\/\%]/, tokenType: TokenTypes.MULTIPLICATIVE_OPERATOR_TYPE },
  { regex: /^[><]=?/, tokenType: TokenTypes.RELATIONAL_OPERATOR },

  
  // Logical operators (&&, ||)
  { regex: /^&&/, tokenType: TokenTypes.LOGICAL_AND },
  { regex: /^\|\|/, tokenType: TokenTypes.LOGICAL_OR },

  // String literals ("" or '')
  { regex: /^"[^"]*"/, tokenType: TokenTypes.STRING_TYPE },
  { regex: /^'[^']*'/, tokenType: TokenTypes.STRING_TYPE },
];
