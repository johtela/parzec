# Parser Combinators for Typescript

Parzec is a parser combinator library adapted from Haskell's famous [Parsec][]
library. A parser combinator library consist of [higher order functions][] which 
make it easy to build [recursive descent parsers][]. Parsers composed from 
Parzec's combinators can recognize languages in the [PEG][] class of grammars. 
PEG grammars can be context-sensitive, so the parsers have infinite lookahead 
and backtracking capabilities. 

Parzec also supports efficient parsing of [LL(1)][] grammars by enabling the 
backtracking only when a special combinator is used. Also, to improve 
performance, some combinators have been inlined rather than built from lower 
level combinators.

Parzec's input is represented by an abstract [interface][]. Consequently, the 
parsers' input can be anything from simple strings to files, or even tokenized 
data streams. Parzec includes functionality to create [lexical analyzers][] or 
_lexers_ from [regular expressions][]. The lexer converts input strings into 
tokens, and makes the parsing simpler and more efficient. 

[Parsec]: http://hackage.haskell.org/package/parsec
[higher order functions]: https://en.wikipedia.org/wiki/Higher-order_function
[recursive descent parsers]: https://en.wikipedia.org/wiki/Recursive_descent_parser
[PEG]: https://en.wikipedia.org/wiki/Parsing_expression_grammar
[LL(1)]: https://en.wikipedia.org/wiki/LL_parser
[interface]: src/input.html
[lexical analyzers]: https://en.wikipedia.org/wiki/Lexical_analysis
[regular expressions]: https://en.wikipedia.org/wiki/Regular_expression