import fs from 'fs';
const jsonData = fs.readFileSync('./allergenList.json', 'utf8');

export const handler = async (rawInput) => {
    let safe = false;
    const input = normalizeInput(rawInput);
    const sourceData = fetchSourceData();
    const result = searchData(sourceData, input);

    let risks = pickySearch(sourceData, input);

    if (result.length < 1 && risks.length < 1) {
        safe = true;
      }
    // Dedupe possibles and exact matches
    if (result.length > 0 && risks.length > 0) {
        risks = risks.filter((item) => {
          return !result.includes(item[0]);
        });
    }

    return {safe: safe, allergens: result, risks}
};


const fetchSourceData = (data = jsonData) => {
    const fullList = [];
    JSON.parse(data, (key, value) => {
        if (typeof value === 'string') {
            fullList.push(value);
        }
    });
    return normalizeList(fullList);
};
const normalizeList = (input) => {
   return input.map((word) => word.toLowerCase())
}

const searchData = (data, input) => {
    const forbiddenList = [];
    input.forEach((item) => {
        data.filter((ingredient) => {
            if (ingredient === item) {
                forbiddenList.push(ingredient);
            }
        })
   })
   return forbiddenList;
}

const pickySearch = (data, input) => {
    const reviewList = [];
    input.forEach((item) => {
        data.filter((ingredient) => {
            if (item.includes(ingredient)) {
                reviewList.push([item, ingredient])
            }
        })
    })
    return reviewList;
}


const normalizeInput = (input) => {
    const semiPattern = /[;]/gm;
    const lineBreakPattern = /\n/gm;
    const tailPattern = /(\\"})/gm
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
        const finalWord = currentWord.split(', ').replaceAll(tailPattern, '')
        finalWord.forEach((word) => finalInput.push(word));
    }
    
    return finalInput;
}