#  AKlang

***AKlang*** is a fun, desi-college-themed programming language designed to feel like you're coding straight from a class with your gang. With keywords like `class chalu`, `note kar`, `proxy mili toh`, and `agli class`, it mixes meme culture and Hindi College slang with basic programming constructs to make coding more expressive, nostalgic, and relatable.

---
Official Website - https://aklang.vercel.app/
---

## ✨ Features

* Dramatic Hindi syntax (because *normal* is boring)
* Supports:

  * Variable declarations
  * Arithmetic expressions
  * Print statements
  * If-else conditions
  * While loops
* Friendly error messages
* Extensible and easy to play with

---

## 🛠 Example Code

```ak
class chalu
 bol "Hello World";
 
  note kar a = 1;
  note kar b = 0;

  jab tak (b < 5) {
    bol b;

    proxy mili toh (b == a) {
      bol "b is equal to a";
      agli class;
    } nahi mili toh (b == 0) {
      bol "b is equal to zero";
      
    } pakde gaye {
      bol "b is neither a nor 0";
    }

    b += 1;
  }
class khatam
```

---

<h2 align="center">Installation</h2>

```
npm i -g aklang
```

<h2 align="center">Usage</h2>

<h4 align="left">Create a new file (<code>test.ak</code>)</h4>


<h4 align="left">Edit the file with a text editor.
You can also try out your code on <a href="https://aklang.vercel.app/">AKLANG PlayGround</a></h4>

```
class chalu
  bol "All iz Well";
class khatam

```

<h4 align="left">Run</h4>

```
aklang test.ak
```

<h4 align="left">Output</h4>

```
All iz Well
```



---

## 🎯 Syntax Reference

| Concept       | aklang Syntax                   | Description      |
| ------------- | ------------------------------- | ---------------- |
| Program Start | `class chalu`                   | Entry point      |
| Program End   | `class khatam`                  | Exit point       |
| Variable Declare | `note kar x = 10`           | Declare variable |
| Print         | `bol "hello"`                | Print output     |
| If Condition  | `proxy mili toh (condition) { ... }` | If block         |
| Else If Condition  | `nahi mili toh (condition) { ... }` | Else If block         |
| Else          | `pakde gaye { ... }`              | Else block       |
| While Loop    | `jab tak (condition) {}`   | While loop       |
| Boolean True  | `pass`                          | true             |
| Boolean False | `fail`                        | false            |
| Break Loop    | `bunk maar`                     | break            |
| Break Loop    | `agli class`                     | continue            |

---

## 🧱 Built With JavaScript (Node.js)


## ⚠️ Roadmap

* [✅] Parser
* [✅] Interpreter
* [✅] Conditionals & loops
* [✅] Web playground
* [✅] Error handling enhancements
* [ ] Functions
* [ ] Arrays

---

## 🤝 Contributing

Feel free to open issues or PRs. Go ahead! 🎉


---

## 📜 License

MIT – because sharing is caring.

---

## 🙏 Acknowledgements

Inspired by:

* [Bhailang](https://github.com/DulLabs/bhai-lang) - Greatly Inspired by them 
* All Indian coders who learned `if-else` before they learned to say *"Tu sahi bol raha hai."*
