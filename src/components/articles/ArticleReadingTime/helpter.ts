export const estimateReadingTimeArticle = (numberWords: number) => {
    if (typeof numberWords !== 'number') return 0;

    if (numberWords <= 200) {
        return 1;
    }
    
    return Math.ceil(numberWords / 200);
};
