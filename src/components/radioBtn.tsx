type Props = {
   arr: { pos: string; str: string }[];
   checkedPos: string;
   radioChange: (val: string) => void;
};

export default function RadioBtn({ arr, checkedPos, radioChange }: Props) {
   const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      radioChange(e.target.value);
   };

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
                     defaultChecked={p.pos === checkedPos}
                     onChange={onChange}
                  />
                  <label htmlFor={p.pos} className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                     {p.str}
                  </label>
               </div>
            </li>
         ))}
      </ul>
   );
}
