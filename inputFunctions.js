export const normalizeInput = (input) => {
    const semiPattern = /[;]/gm;
    const lineBreakPattern = /\n/gm;
    const patternMatchedInput = input.toLowerCase()
        .replaceAll(semiPattern, ',')
        .replaceAll(lineBreakPattern, '')
        .replaceAll('.', '')
        .split(', ');
    const finalInput = []
    for (const word of patternMatchedInput) {
        const tempWord = [];
        for (const char of word) {
            if (char.match(/[(]/)) {
                tempWord.pop()
                tempWord.push(', ')
                continue;
            }
            tempWord.push(char);
            if (char.match(/[)]/)) {
                tempWord.pop();
            }
        }
        const currentWord = tempWord.join('')
        const finalWord = currentWord.split(', ')
        finalWord.forEach((word) => finalInput.push(word));
    }
    return finalInput;
}