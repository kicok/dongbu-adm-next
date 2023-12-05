import { useEffect, useState } from 'react';

type Props = {
   arr: { pos: string; str: string }[];
   defaultCheckPos: string | null;
   radioChange: (val: string) => void;
};

export default function RadioBtn({ arr, defaultCheckPos, radioChange }: Props) {
   const [cheekedPos, setCheckedPos] = useState<string | null>();
   const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setCheckedPos(e.target.value);
      radioChange(e.target.value);
   };

   useEffect(() => {
      // 초기 라디오버튼 체크값
      setCheckedPos(defaultCheckPos ?? 'carousel');
   }, [defaultCheckPos]);

   return (
      <ul className="items-center w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg sm:flex dark:bg-gray-700 dark:border-gray-600 dark:text-white">
         {arr.map((p) => (
            <li key={p.pos} className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
               <div className="flex items-center ps-3">
                  <input
                     id={p.pos}
                     type="radio"
                     value={p.pos}
                     name="position"
                     className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                     // defaultChecked={p.pos === defaultCheckPos}
                     checked={p.pos === cheekedPos}
                     onChange={onChange}
                  />
                  <label htmlFor={p.pos} className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                     {p.str}
                     {defaultCheckPos && p.pos === defaultCheckPos && <span className="pr-10"> *</span>}
                  </label>
               </div>
            </li>
         ))}
      </ul>
   );
}
