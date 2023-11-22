import { useRef, useState } from 'react';
import { UsePaginationArgs } from './pagination';

// 한 페이지 당 보여지는 상품의 개수는 limitPageCount 개.
// 한 번에 보이는 페이지의 갯수는 limitPageCount 개.
// 페이지 클릭 시 url path가 변경됨.
// 이전 범위 버튼 클릭 시 이전 범위의 마지막 페이지를 보여줌.
// 다음 범위 버튼 클릭 시 다음 범위의 첫 번째 페이지를 보여줌.
// 이전/디음 페이지가 없다면 이전/다음 범위 버튼을 안보이게 하거나 비활성화 시킴.

// 전체 페이지 갯수 (totalPageCount) - (전체 컨텐츠 / 한 페이지에 보여줄 컨텐츠 갯수)내림 한 수
// 현재 속한 페이지 숫자 (currentPage) - 현재 머물고 있는 페이지의 url path
// 핸들러 함수(onChange) - 페이지 클릭 시 해당 페이지로 url이동

const range = (size: number, start: number) => {
   return Array(size)
      .fill(start)
      .map((x, y) => x + y);
};

// 페이지 (limitCount)씩 그룹지어 배열 생성 [1,2,3,4,5], [6,7,8,9,10],[11]...
const createPagesGroupList = (totalPageCount: number, limitPageCount: number) => {
   const totalPagesGroupList = range(totalPageCount, 1);
   const pagesGroupList = [];
   for (let i = 0; i < totalPagesGroupList.length; i += limitPageCount) {
      pagesGroupList.push(totalPagesGroupList.slice(i, i + limitPageCount));
   }
   return pagesGroupList;
};

// 현재 페이지가 속한 그룹의 index를 구하기 위한 함수(각 페이지를 직접 접근했을 때의 초기화를 위함)
const getCurrentGroupIndex = (currentPage: number, limitPageCount: number) => {
   return Math.ceil(currentPage / limitPageCount) - 1;
};

const usePagination = ({ totalPageCount, limitPageCount, currentPage, onChange }: UsePaginationArgs) => {
   // 두 값을 pagesGroupList, currentGroupIndex ref변수에 초기값으로 할당. (렌더링과 관련 없으므로 ref사용)
   // 두 ref값들을 이용해 현재 페이지가 속한 그룹 변수를 pages상태에 초기값으로 넣어주어 페이지네이션을 첫 렌더링을 한다.
   const pagesGroupList = useRef<number[][]>(createPagesGroupList(totalPageCount, limitPageCount));
   const currentGroupIndex = useRef<number>(getCurrentGroupIndex(currentPage, limitPageCount));

   const [pages, setPages] = useState<number[]>(pagesGroupList.current[currentGroupIndex.current]);

   const isFirstGroup = currentGroupIndex.current === 0;
   const isLastGroup = currentGroupIndex.current === pagesGroupList.current.length - 1;

   // ***  페이지 클릭 시 ***
   // 페이지 버튼의 textContent로 입력된 숫자를 가져옵니다.
   // 해당 숫자를 path로 설정해 url을 변경합니다. (숫자만 넘기고 부모 컴포넌트에서 수행)
   const handleClickPage = (event: any) => {
      const { textContent } = event.target;
      const selectedPage = Number(textContent);
      onChange(selectedPage); // 클릭한 페이지로 url변경
   };

   // ***   이전 범위 버튼 클릭 시 ***
   // currentGroupIndex가 1감소되고 이 값을 이용해 이전 범위 그룹으로 리렌더링 한다.
   // 현재 그룹의 가장 마지막 요소의 숫자를 path로 설정해 url을 변경한다.
   const handleClickLeft = () => {
      if (isFirstGroup) return;
      currentGroupIndex.current -= 1;
      setPages(pagesGroupList.current[currentGroupIndex.current]); // 이전 그룹으로 ui변경
      onChange(pagesGroupList.current[currentGroupIndex.current][limitPageCount - 1]); //현재 속한 그룹의 가장 마지막 페이지로 url변경
   };

   // ***  다음 범위 버튼 클릭 시 ***
   // currentGroupIndex가 1증가되고 다음 범위 그룹으로 리렌더링합니다.
   // 현재 그룹의 가장 첫번째 요소의 숫자를 path로 설정해 url을 변경합니다.
   const handleClickRight = () => {
      if (isLastGroup) return;
      currentGroupIndex.current += 1;
      setPages(pagesGroupList.current[currentGroupIndex.current]); // 다음 그룹으로 ui변경
      onChange(pagesGroupList.current[currentGroupIndex.current][0]); //현재 속한 그룹의 가장 첫번째 페이지로 url변경
   };

   return {
      pages,
      isFirstGroup,
      isLastGroup,
      handleClickPage,
      handleClickLeft,
      handleClickRight,
   };
};

export default usePagination;
