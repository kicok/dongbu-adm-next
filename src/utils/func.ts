export const makeNewFileName = (fileName: string): string => {
   const max = 99999999999;
   const min = 1;

   const index = fileName.lastIndexOf('.');
   const replaceStr = `${Date.now()}${Math.floor(Math.random() * (max - min) + min)}.`;
   const newFName = replaceAt(fileName, index, replaceStr);

   return newFName;
};

// 문자열 치환
// replacement + 확장자
export const replaceAt = (str: string, index: number, replacement: string) => {
   if (index >= str.length) {
      return str.valueOf();
   }

   return replacement + str.substring(index + 1); // replacement + 확장자
};

// 문자열 치환
// str + replacement + 확장자
export const replaceAt2 = (str: string, index: number, replacement: string) => {
   if (index >= str.length) {
      return str.valueOf();
   }

   return str.substring(0, index) + '-' + replacement + str.substring(index + 1); // str + replacement + 확장자
};
