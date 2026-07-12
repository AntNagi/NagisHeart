package com.antnagi.nagisheart.engine

import com.antnagi.nagisheart.data.GameState

class ConditionParser {

    fun evaluate(condition: String, state: GameState): Boolean {
        val tokens = tokenize(condition)
        val parser = ExprParser(tokens, state)
        return parser.parseOr()
    }

    // --- Tokenizer ---

    private sealed class Token {
        data class Identifier(val name: String) : Token()
        data class NumberLit(val value: Int) : Token()
        data class StringLit(val value: String) : Token()
        data class BoolLit(val value: Boolean) : Token()
        data class Op(val op: String) : Token()
        object And : Token()
        object Or : Token()
        object LParen : Token()
        object RParen : Token()
        object Not : Token()
    }

    private fun tokenize(input: String): List<Token> {
        val tokens = mutableListOf<Token>()
        var i = 0
        while (i < input.length) {
            when {
                input[i].isWhitespace() -> i++

                input[i] == '(' -> { tokens.add(Token.LParen); i++ }
                input[i] == ')' -> { tokens.add(Token.RParen); i++ }

                input.startsWith("===", i) -> { tokens.add(Token.Op("===")); i += 3 }
                input.startsWith("!==", i) -> { tokens.add(Token.Op("!==")); i += 3 }
                input.startsWith(">=", i) -> { tokens.add(Token.Op(">=")); i += 2 }
                input.startsWith("<=", i) -> { tokens.add(Token.Op("<=")); i += 2 }
                input.startsWith("&&", i) -> { tokens.add(Token.And); i += 2 }
                input.startsWith("||", i) -> { tokens.add(Token.Or); i += 2 }
                input[i] == '>' -> { tokens.add(Token.Op(">")); i++ }
                input[i] == '<' -> { tokens.add(Token.Op("<")); i++ }
                input[i] == '!' -> { tokens.add(Token.Not); i++ }

                input[i] == '\'' || input[i] == '"' -> {
                    val quote = input[i]
                    i++
                    val start = i
                    while (i < input.length && input[i] != quote) {
                        if (input[i] == '\\') i++
                        i++
                    }
                    tokens.add(Token.StringLit(input.substring(start, i)))
                    if (i < input.length) i++
                }

                input[i].isDigit() || (input[i] == '-' && i + 1 < input.length && input[i + 1].isDigit()) -> {
                    val start = i
                    if (input[i] == '-') i++
                    while (i < input.length && input[i].isDigit()) i++
                    tokens.add(Token.NumberLit(input.substring(start, i).toInt()))
                }

                input[i].isLetter() || input[i] == '_' -> {
                    val start = i
                    while (i < input.length && (input[i].isLetterOrDigit() || input[i] == '_')) i++
                    val word = input.substring(start, i)
                    when (word) {
                        "true" -> tokens.add(Token.BoolLit(true))
                        "false" -> tokens.add(Token.BoolLit(false))
                        else -> tokens.add(Token.Identifier(word))
                    }
                }

                else -> i++
            }
        }
        return tokens
    }

    // --- Recursive descent parser ---

    private class ExprParser(
        private val tokens: List<Token>,
        private val state: GameState
    ) {
        private var pos = 0

        private fun peek(): Token? = tokens.getOrNull(pos)

        private fun advance(): Token? = tokens.getOrNull(pos++)

        fun parseOr(): Boolean {
            var result = parseAnd()
            while (peek() is Token.Or) {
                advance()
                val right = parseAnd()
                result = result || right
            }
            return result
        }

        private fun parseAnd(): Boolean {
            var result = parseComparison()
            while (peek() is Token.And) {
                advance()
                val right = parseComparison()
                result = result && right
            }
            return result
        }

        private fun parseComparison(): Boolean {
            val left = parseAtom()
            val op = peek()
            if (op is Token.Op) {
                advance()
                val right = parseAtom()
                return compare(left, op.op, right)
            }
            return toBool(left)
        }

        private fun parseAtom(): Any? {
            return when (val t = peek()) {
                is Token.NumberLit -> { advance(); t.value }
                is Token.StringLit -> { advance(); t.value }
                is Token.BoolLit -> { advance(); t.value }
                is Token.Identifier -> { advance(); state.get(t.name) }
                is Token.LParen -> {
                    advance()
                    val result = parseOr()
                    if (peek() is Token.RParen) advance()
                    result
                }
                is Token.Not -> {
                    advance()
                    !toBool(parseAtom())
                }
                else -> { advance(); null }
            }
        }

        private fun compare(left: Any?, op: String, right: Any?): Boolean {
            return when (op) {
                "===" -> eq(left, right)
                "!==" -> !eq(left, right)
                ">=" -> toNum(left) >= toNum(right)
                "<=" -> toNum(left) <= toNum(right)
                ">" -> toNum(left) > toNum(right)
                "<" -> toNum(left) < toNum(right)
                else -> false
            }
        }

        private fun eq(a: Any?, b: Any?): Boolean {
            if (a == b) return true
            val sa = a?.toString() ?: "null"
            val sb = b?.toString() ?: "null"
            return sa == sb
        }

        private fun toNum(v: Any?): Int = when (v) {
            is Number -> v.toInt()
            is Boolean -> if (v) 1 else 0
            is String -> v.toIntOrNull() ?: 0
            else -> 0
        }

        private fun toBool(v: Any?): Boolean = when (v) {
            is Boolean -> v
            is Number -> v.toInt() != 0
            is String -> v.isNotEmpty() && v != "false"
            null -> false
            else -> true
        }
    }
}
