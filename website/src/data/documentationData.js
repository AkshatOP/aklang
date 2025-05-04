export const documentationData = [
  {
    title: "Data Types",
    description: "Numbers and strings are like other languages. pass and fail are the boolean values.",
    examples: [
      {
        title: "Data Types",
        description: "Different Data Types.",
        code: `class chalu
  note kar a = 10;
  note kar b = 3.14;
  note kar c = "AK";
  note kar d = 'OP';
  note kar e = pass;
  note kar f = fail;
  bol a , b , c, d, e, f;
class khatam`
      }
    ]
  },
  {
    title: "Data Types",
    description: "Different Data Types built in AKLang.",
    examples: [
      {
        title: "Basic Variables",
        description: "Declare and use variables of different types.",
        code: `class chalu
        // String variable
        note kar naam = "Akshat Ji";
        bol "Naam:", naam;
        
        // Number variable
        note kar umar = 19;
        bol "Umar:", umar;
        
        // Boolean variable
        note kar desiHaiKya = pass;
        bol "Desi Hai Kya:", desiHaiKya;
        class khatam`
      },
      {
        title: "Variable Operations",
        description: "Perform arithmetic and string operations.",
        code: `class chalu
        note kar a = 10;
        note kar b = 5;
        bol "a + b =", a + b;
        bol "a - b =", a - b;
        bol "a * b =", a * b;
        bol "a / b =", a / b;
        bol "a ** b =", a ** b;
        
        note kar firstName = "Raj";
        note kar lastName = "Sharma";
        note kar fullName = firstName + " " + lastName;
        bol "Full Name:", fullName;
class khatam`
      }
    ]
  },
  {
    title: "Conditional Statements",
    description: "Use 'proxy mili toh' and 'nahi mili toh' and 'pakde gaye' for conditions.",
    examples: [
      {
        title: "If-ElseIf-Else Statement",
        description: "Use basic conditional logic with if-ElseIf-else.",
        code: `class chalu
        note kar umar = 20;
        proxy mili toh (umar >= 18) {
          bol "Aap vote de sakte ho!";
  } pakde gaye {
    bol "Abhi tum bacche ho.";
  }
  
  note kar marks = 85;
  proxy mili toh (marks >= 90) {
    bol "A+ grade, bohot badhiya!";
  } nahi mili toh (marks >= 80) {
    bol "A grade, badhiya!";
  } nahi mili toh (marks >= 70) {
    bol "B grade, theek hai.";
  } pakde gaye {
    bol "Padhai karo, beta.";
  }
  class khatam`
}
]
},
{
  title: "Loops",
  description: "Use 'jab tak' for while loops.",
  examples: [
    {
      title: "While Loop",
      description: "Repeat while condition is true.",
      code: `class chalu
      note kar count = 1;
      jab tak (count <= 5) {
        bol "Count is:", count;
    count += 1;
  }
class khatam`
}
]
}
];
