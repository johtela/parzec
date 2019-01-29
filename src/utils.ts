export function initObject(members: [string, any][]): any {
    let res: any = {}
    for (let i = 0; i < members.length; i++) {
        let [m, v] = members[i];
        res[m] = v
    }
    return res
}

export function escapeWhitespace(text: string): string {
    return text.replace("\n", "\\n").replace("\r", "\\r").replace("\t", "\\t");
}