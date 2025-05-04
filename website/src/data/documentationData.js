// export const documentationData = [
//   {
//     title: "Variables and Data Types",
//     description: "BhaiLang uses variables to store and manipulate data. Here are some examples:",
//     examples: [
//       {
//         title: "Basic Variables",
//         description: "Declare and use variables with different data types.",
//         code: `// Number variables
// class chalu
//   //string variables
//   note kar naam = "Sharma Ji";
//   bol "Naam:" , naam;

//   //number variables
//   note kar umar = 19;
//   bol "Umar:", umar;

//   // Boolean variables
//   note kar desiHaiKya = pass;
//   bol "Desi Hai Kya:", desiHaiKya;


// class khatam`
//       },
//       {
//         title: "Variable Operations",
//         description: "Perform operations with variables.",
//         code: `// Arithmetic operations
// let a = 10;
// let b = 5;
// console.log("a + b =", a + b);
// console.log("a - b =", a - b);
// console.log("a * b =", a * b);
// console.log("a / b =", a / b);

// // String operations
// let firstName = "Raj";
// let lastName = "Sharma";
// let fullName = firstName + " " + lastName;
// console.log("Full Name:", fullName);`
//       }
//     ]
//   },
//   {
//     title: "Conditional Statements",
//     description: "Control the flow of execution based on conditions.",
//     examples: [
//       {
//         title: "If-Else Statement",
//         description: "Basic conditional logic using if and else.",
//         code: `let umar = 20;

// if (umar >= 18) {
//   console.log("Aap vote de sakte ho!");
// } else {
//   console.log("Abhi tum bacche ho.");
// }

// // Multiple conditions
// let marks = 85;

// if (marks >= 90) {
//   console.log("A+ grade, bohot badhiya!");
// } else if (marks >= 80) {
//   console.log("A grade, badhiya!");
// } else if (marks >= 70) {
//   console.log("B grade, theek hai.");
// } else {
//   console.log("Padhai karo, beta.");
// }`
//       },
//       {
//         title: "Switch Statement",
//         description: "Use switch for multiple case handling.",
//         code: `let day = 3;
// let dayName;

// switch (day) {
//   case 1:
//     dayName = "Monday";
//     break;
//   case 2:
//     dayName = "Tuesday";
//     break;
//   case 3:
//     dayName = "Wednesday";
//     break;
//   case 4:
//     dayName = "Thursday";
//     break;
//   case 5:
//     dayName = "Friday";
//     break;
//   case 6:
//     dayName = "Saturday";
//     break;
//   case 7:
//     dayName = "Sunday";
//     break;
//   default:
//     dayName = "Invalid day";
// }

// console.log("Today is", dayName);`
//       }
//     ]
//   },
//   {
//     title: "Loops",
//     description: "Repeat actions with different types of loops.",
//     examples: [
//       {
//         title: "For Loop",
//         description: "Iterate a specific number of times.",
//         code: `// Basic for loop
// for (let i = 1; i <= 5; i++) {
//   console.log("Counter:", i);
// }

// // Looping through an array
// let fruits = ["Apple", "Banana", "Orange", "Grapes"];
// for (let i = 0; i < fruits.length; i++) {
//   console.log("Fruit", i+1, ":", fruits[i]);
// }`
//       },
//       {
//         title: "While Loop",
//         description: "Execute code while a condition is true.",
//         code: `// Basic while loop
// let count = 1;
// while (count <= 5) {
//   console.log("Count is:", count);
//   count++;
// }

// // Do-while loop (executes at least once)
// let num = 10;
// do {
//   console.log("Number is:", num);
//   num -= 2;
// } while (num > 0);`
//       }
//     ]
//   },
//   {
//     title: "Functions",
//     description: "Reusable blocks of code for specific tasks.",
//     examples: [
//       {
//         title: "Basic Functions",
//         description: "Define and call functions.",
//         code: `// Basic function
// function namaste() {
//   console.log("Namaste Duniya!");
// }

// // Call the function
// namaste();

// // Function with parameters
// function jodna(a, b) {
//   return a + b;
// }

// let result = jodna(5, 7);
// console.log("Sum is:", result);

// // Function with default parameters
// function introduction(name, city = "Delhi") {
//   console.log("Hello, I am " + name + " from " + city);
// }

// introduction("Rahul");
// introduction("Priya", "Mumbai");`
//       },
//       {
//         title: "Arrow Functions",
//         description: "Modern way to write concise functions.",
//         code: `// Arrow function
// const multiply = (a, b) => a * b;
// console.log("5 × 3 =", multiply(5, 3));

// // Arrow function with multiple statements
// const checkAge = (age) => {
//   if (age >= 18) {
//     return "Adult";
//   } else {
//     return "Minor";
//   }
// };

// console.log("Age 20 is:", checkAge(20));
// console.log("Age 15 is:", checkAge(15));`
//       }
//     ]
//   },
//   {
//     title: "Objects",
//     description: "Store related data and functionality together.",
//     examples: [
//       {
//         title: "Creating Objects",
//         description: "Define and use objects with properties and methods.",
//         code: `// Basic object
// let person = {
//   name: "Rakesh",
//   age: 28,
//   city: "Pune",
//   isMarried: false
// };

// console.log("Person:", person);
// console.log("Name:", person.name);
// console.log("Age:", person.age);

// // Object with methods
// let calculator = {
//   add: function(a, b) {
//     return a + b;
//   },
//   subtract: function(a, b) {
//     return a - b;
//   }
// };

// console.log("5 + 3 =", calculator.add(5, 3));
// console.log("10 - 4 =", calculator.subtract(10, 4));`
//       },
//       {
//         title: "Object Operations",
//         description: "Manipulate objects and their properties.",
//         code: `// Creating an object
// let student = {
//   name: "Ankit",
//   rollNo: 21,
//   marks: 85
// };

// // Adding properties
// student.subject = "Mathematics";
// console.log("Updated student:", student);

// // Deleting properties
// delete student.marks;
// console.log("After deletion:", student);

// // Nested objects
// let college = {
//   name: "IIT Delhi",
//   location: "New Delhi",
//   departments: {
//     cse: {
//       students: 120,
//       faculty: 15
//     },
//     ece: {
//       students: 100,
//       faculty: 12
//     }
//   }
// };

// console.log("College:", college.name);
// console.log("CSE Students:", college.departments.cse.students);`
//       }
//     ]
//   }
// ];


export const documentationData = [
  {
    title: "Variables and Data Types",
    description: "AkLang uses 'note kar' to declare variables and 'bol' to print values.",
    examples: [
      {
        title: "Basic Variables",
        description: "Declare and use variables of different types.",
        code: `class chalu
  // String variable
  note kar naam = "Sharma Ji";
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
