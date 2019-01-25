# `parzec` - Parser Combinators for Typescript

Parser combinator library inspired by [Parsec] for building parsers for languages 
that can described using the [PEG] grammar. The parsers built with the library 
have infinite lookahead and backtracking capabilities. This means that they can
recognize both context-free and context-sensitive languages. To keep the performance
reasonable, some combinators have been inlined. Backtracking can be limited by using 
special combinators that guide the parsing.

Parser input is represented by an abstract [interface]. Consequently, the input can be 
anything from simple strings to files, or even tokenized data streams.

[Parsec]: http://hackage.haskell.org/package/parsec
[PEG]: https://en.wikipedia.org/wiki/Parsing_expression_grammar
[interface]: src/parser-input.ts
