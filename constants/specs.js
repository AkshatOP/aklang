import { TokenTypes } from "../Parser/tokenizer/TokenTypes.js";

export const SPEC = [
  // Whitespace \t \r \n \r\n
//   { regex: /^[ \t\r\n]+/, tokenType: TokenTypes.NULL_TYPE },



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
  { regex: /^\bscene shuru\b/, tokenType: TokenTypes.SCENE_SHURU },
  { regex: /^\bscene khatam\b/, tokenType: TokenTypes.SCENE_KHATAM },
  { regex: /^\byaad rakh\b/, tokenType: TokenTypes.YAAD_RAKH },
  { regex: /^\bbol\b/, tokenType: TokenTypes.BOL },
  { regex: /^\bagar\b/, tokenType: TokenTypes.AGAR },
  { regex: /^\bwarna\b/, tokenType: TokenTypes.WARNA },
  { regex: /^\bjab tak\b/, tokenType: TokenTypes.JAB_TAK },
  { regex: /^\bab bas\b/, tokenType: TokenTypes.AB_BAS },
  { regex: /^\bagla dekh\b/, tokenType: TokenTypes.AGLA_DEKH },


  // Identifier (variable names)
  { regex: /^\w+/, tokenType: TokenTypes.IDENTIFIER_TYPE },
  
  // Assignment operators (=, +=, -=, *=, /=, %=)
  { regex: /^[\*\%\/\+\-]=/, tokenType: TokenTypes.COMPLEX_ASSIGN_TYPE },
  { regex: /^=/, tokenType: TokenTypes.SIMPLE_ASSIGN_TYPE },

  // String literals ("" or '')
  { regex: /^"[^"]*"/, tokenType: TokenTypes.STRING_TYPE },
  { regex: /^'[^']*'/, tokenType: TokenTypes.STRING_TYPE },
];
