export function hex2Binary(hex) {
    let binary = "";
    if (hex)
        for (const char of hex) {
            const value = parseInt(char, 16);
            binary += value.toString(2).padStart(4, 0);
        }
    return binary;
}