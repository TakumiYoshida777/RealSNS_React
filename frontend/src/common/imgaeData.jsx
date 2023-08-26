/**
 * 画像の拡張子を変更する
 * @param {*} file 
 * @param {*} newExtension 
 * @returns 
 */
function changeFileExtension(file, newExtension) {
    const newFileName = `${file.name.replace(/\..+$/, '')}.${newExtension}`;
    const newBlob = new Blob([file], { type: `image/${newExtension}` });
    return new File([newBlob], newFileName, { type: `image/${newExtension}` });
}

export { changeFileExtension };
