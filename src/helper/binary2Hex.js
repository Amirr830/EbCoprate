export function binary2Hex(binary) {
    binary = binary.padEnd(binary.length+(4-binary.length%4),'0')
    let hex = "";
    for (const group of binary.match(/.{4}/g)) {
        const byte = parseInt(group, 2);
        hex += byte.toString(16);
    }
    return hex;
}