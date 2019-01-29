export function escapeWhitespace(text: string): string {
    return text.replace("\n", "\\n").replace("\r", "\\r").replace("\t", "\\t");
}