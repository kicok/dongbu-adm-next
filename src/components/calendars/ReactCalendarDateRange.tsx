'use client';
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import Calendar from 'react-calendar';
// import 'react-calendar/dist/Calendar.css';
import './ReactCalendarDateRange.light.css';
import './ReactCalendarDateRange.dark.css';
import dayjs from 'dayjs';
// import { Box, useMediaQuery, Modal } from '@mui/material';

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

type arrType = (string | undefined)[];
export type calenderRefType = {
   toMainFromCalendar: () => arrType;
};

type Props = {
   open: boolean;
   onClose: () => void;
   mainFunc: (arr: arrType) => void;
};
const ReactCalendarDateRange = forwardRef<calenderRefType, Props>((props, calenderRef) => {
   const { open, onClose, mainFunc } = props;
   const [rangeDate, setRangeDate] = useState<Value>(new Date());
   const [checkInDateFullYear, setCheckInDateFullYear] = useState<string>();
   const [checkOutDateFullYear, setCheckOutDateFullYear] = useState<string>();
   const [checkInDate, setCheckInDate] = useState<string>();
   const [checkOutDate, setCheckOutDate] = useState<string>();
   const [nights, setNights] = useState<number>();

   const today = dayjs();
   const ref = useRef(null);

   const style = {
      position: 'absolute' as 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      overflow: 'hidden',
   };

   useEffect(() => {
      setRangeDate(null);
   }, []);

   // 메인(MainReservationForm.tsx)의 함수 mainFunc(...) 를 직접 실행해서 메인에 값을 전달한다.
   // 반드시 useEffect로 감싸야 한다. 그렇지 않으면 에러발생.
   // 이유는 MainReservationForm.tsx 의 mainFunc 함수내에서 setState를 하고 있기 때문
   // 메인 파일내에서는 직접 useEffcet 를 직접 실행하면 값이 빠져나가서 원하는 방식대로 메인의 체크인 체크아웃 날짜가 실시간으로 변동이 안됨.
   // 현재 사용중
   useEffect(() => {
      mainFunc([checkInDateFullYear, checkOutDateFullYear, nights + '박']);
   });

   // 메인에 전달하기위해 체크인과 체크아웃 날짜를 배열로 리턴한다.
   // 현재 사용안함. 생각보다 한템포 느림. 느린 이유는 아직 모름.
   const toMainFromCalendar = () => {
      return [checkInDateFullYear, checkOutDateFullYear, nights + '박'];
   };

   useImperativeHandle(calenderRef, () => ({
      toMainFromCalendar,
   }));

   // 날짜를 클릭할때마다 배열에 담아서 날짜를 비교해 시작일[0]과 종료일[1]로 구분한다.
   let ranges: number[] = [];
   const rangeMake = (value: Date) => {
      const day = Number(dayjs(value).format('YYYYMMDD'));

      ranges.push(day);
      if (ranges.length === 2) {
         ranges.sort((a: number, b: number) => a - b);

         const chIn = ranges[0].toString();
         const chOut = ranges[1].toString();

         setCheckInDateFullYear(dayjs(chIn).format('YYYY-MM-DD'));
         setCheckOutDateFullYear(dayjs(chOut).format('YYYY-MM-DD'));

         setCheckInDate(dayjs(chIn).format('YY-MM-DD'));
         setCheckOutDate(dayjs(chOut).format('YY-MM-DD'));

         ranges.length = 0; // 배열을 비움
      }
   };

   useEffect(() => {
      // 몇 박을 자는지 계산
      setNights((prev) => dayjs(checkOutDateFullYear).diff(checkInDateFullYear, 'days'));
      const dateB = dayjs(checkOutDateFullYear);
      const dateC = dayjs(checkInDateFullYear);
   }, [checkInDateFullYear, checkOutDateFullYear]);

   // const themeMode = useTheme().palette.mode + '-version'; // dark-version, light-version

   // const match = useMediaQuery('(min-width:700px)');
   // const showDoubleView = match ? true : false;
   // const viewSdate = match ? checkInDateFullYear : checkInDate;
   // const viewEdate = match ? checkOutDateFullYear : checkOutDate;

   // 달력이 처음 열렸을때 초기 셋팅값 지정
   useEffect(() => {
      const today = dayjs();
      const tomorrowStr = today.add(1, 'day').format('YYYY-MM-DD');
      const tomorrow = new Date(tomorrowStr); // 내일날짜로 지정
      setRangeDate([new Date(), tomorrow]); // 기간설정 : 오늘과 내일
      setNights(1); // 처음 로딩됐을때 1박으로 지정

      const now = dayjs();

      setCheckInDateFullYear(dayjs(today).format('YYYY-MM-DD'));
      setCheckOutDateFullYear(tomorrowStr);

      setCheckInDate(dayjs(today).format('YY-MM-DD'));
      setCheckOutDate(dayjs(tomorrowStr).format('YY-MM-DD'));
   }, []);

   return (
      <div>
         <div className="relative z-10" aria-labelledby="modal-calendar" role="dialog" aria-modal="true">
            <div className="flex flex-col items-center themeMode">
               {/* // sx={{ ...style, display: 'flex', flexDirection: 'column', alignItems: 'center' }} className={themeMode}> */}
               <div className="h-9 w-full flex justify-around items-center">
                  {/* width={'100%'} height={38} display={'flex'} justifyContent={'space-around'} alignItems={'center'}> */}
                  {checkInDateFullYear && checkOutDateFullYear && (
                     <>
                        <sub>체크인</sub>
                        <div className="min-w-[700px]:hidden">{checkInDateFullYear}</div>

                        <div>
                           <sub>{nights}박</sub>
                        </div>

                        <sub>체크아웃</sub>
                        <div>{checkOutDateFullYear}</div>
                     </>
                  )}
                  {!checkInDateFullYear && !checkOutDateFullYear && (
                     <div>
                        <h4>예약기간을 선택하세요.</h4>
                     </div>
                  )}
               </div>
               <Calendar
                  formatDay={(locale, date) => dayjs(date).format('DD')} // 날'일' 제외하고 숫자만 보이도록 설정
                  selectRange={true}
                  // showDoubleView={showDoubleView}
                  showDoubleView={true}
                  goToRangeStartOnSelect={false}
                  // defaultActiveStartDate={new Date('2023,10,15')}
                  allowPartialRange={false}
                  showNeighboringMonth={true}
                  // false  이전,이후 달의 날짜는 보이지 않도록 설정:showDoubleView일때는 작동안됨 임시로 visibility: hidden; 설정함
                  calendarType="hebrew"
                  // onViewChange={}
                  // minDetail="month" // 상단 네비게이션에서 '월' 단위만 보이게 설정
                  // maxDetail="month" // 상단 네비게이션에서 '월' 단위만 보이게 설정
                  returnValue="range"
                  inputRef={ref}
                  defaultValue={null}
                  onClickDay={(value: Date, event: React.MouseEvent<HTMLButtonElement>) => {
                     rangeMake(value);
                  }}
                  onChange={(value: Value, event: React.MouseEvent<HTMLButtonElement>) => {
                     setRangeDate((prev) => value);
                     onClose();
                  }}
                  maxDate={new Date(today.year(), today.month() + 1 + 5)}
                  minDate={new Date()}
                  value={rangeDate}
                  locale="ko"
                  tileClassName={({ date, view }) => {
                     if (marks.find((x) => x === dayjs(date).format('YYYY-MM-DD'))) {
                        return 'highlight';
                     }
                  }}
                  tileContent={({ date, view }) => {
                     if (marks.find((x) => x === dayjs(date).format('YYYY-MM-DD'))) {
                        return (
                           <>
                              <div className="dot">날</div>
                           </>
                        );
                     }
                  }}
               />
            </div>
         </div>
      </div>
   );
});

ReactCalendarDateRange.displayName = 'ReactCalendarDateRange';

export default ReactCalendarDateRange;

const marks: string[] = [];
// const marks:string[] = ['2023-10-11', '2023-10-13', '2023-10-15', '2023-10-17'];

//https://blog.logrocket.com/react-calendar-tutorial-build-customize-calendar/#styling-your-calendar

// https://github.com/wojtekmaj/react-calendar/wiki/Recipes
//https://velog.io/@khy226/%EB%A6%AC%EC%95%A1%ED%8A%B8-%EC%95%B1%EC%97%90-%EB%8B%AC%EB%A0%A5react-calendar-%EC%A0%81%EC%9A%A9%ED%95%98%EA%B8%B0
