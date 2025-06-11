import fs from 'fs';
const sourceData = fs.readFileSync('./allergenList.json', 'utf8');

export const fetchSourceData = (data = sourceData) => {
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

export const searchData = (data, input) => {
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

export const pickySearch = (data, input) => {
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
