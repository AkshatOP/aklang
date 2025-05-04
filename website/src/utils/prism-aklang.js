import Prism from 'prismjs';

Prism.languages.aklang = {
  keyword: /\b(?:class chalu|class khatam|note kar|bol|proxy mili toh|nahi mili toh|pakde gaye|jab tak|bunk maar|agli class|pass|fail)\b/,
  number: /\b\d+(?:\.\d+)?\b/,
  string: /(["'])(?:\\.|(?!\1)[^\\\r\n])*\1/,
  operator: /[=+\-*/%<>!]+/,
  punctuation: /[{}[\];(),.:]/,
};