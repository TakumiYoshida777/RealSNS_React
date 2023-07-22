/**
 * 配列の中にある要素の重複削除処理
 * @param {Array} data 
 * @returns 
 */
const removeDuplicatesById = (data) => {
    const uniqueData = data.reduce((acc, current) => {
        const x = acc.find(item => item._id === current._id);
        if (!x) {
            return acc.concat([current]);
        }
        return acc;
    }, []);

    return uniqueData;
};

/**
 * 配列から指定した要素を削除（indexは使用しない）
 * @param {Array} data 
 * @param {String} target 
 * @returns 
 */
const filterDuplicatesById = (data, target) => {
    const result = data.filter(item => item != target);
    return result;
};

export { removeDuplicatesById, filterDuplicatesById };