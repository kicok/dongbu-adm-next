// 문자열 치환
const replaceAt = function (str: string, index: number, replacement: string) {
   if (index >= str.length) {
      return str.valueOf();
   }

   return str.substring(0, index) + replacement + str.substring(index + 1);
};

export default replaceAt;
