---
title: Lexer
date: 2026-05-20
tags:
  - frontend
---
Notes on building a language tokenizer/lexer from scratch
### Lexical analysis
- Breaking characters into different tokens so the computer can easily understand them.
- We like move through each character and group them into set of predefined tokens
- Its just bunch of if statements, you check each character in the source with if statements and make Token objects and pass source as values
- You also need to track the line number and column numbers, handle white spaces and quotes and \n stuff.
- The output is a flat list of token objects
### Scanning on demand

