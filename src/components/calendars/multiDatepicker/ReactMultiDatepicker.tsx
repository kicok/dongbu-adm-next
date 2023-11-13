import React, { useEffect, useReducer, useRef, useState } from 'react';
import DatePicker, { Calendar, DateObject } from 'react-multi-date-picker';
import weekends from 'react-multi-date-picker/plugins/highlight_weekends';
import Footer from 'react-multi-date-picker/plugins/range_picker_footer';
import 'react-multi-date-picker/styles/backgrounds/bg-dark.css';
import 'react-multi-date-picker/styles/colors/teal.css';
import 'react-multi-date-picker/styles/layouts/mobile.css';
import './ReactMultiDatepicker.css';
import dayjs from 'dayjs';

type ReactMultiDatepickerType = {
   toParentEventDates: (values: string[] | undefined) => void;
   dates?: string[];
};
export default function ReactMultiDatepicker({ toParentEventDates, dates }: ReactMultiDatepickerType) {
   const datepickerRef = useRef<HTMLDivElement>();
   const [values, setValues] = useState<string[]>();

   const weekDays = ['일', '월', '화', '수', '목', '금', '토'];
   const months = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];

   useEffect(() => {
      if (dates) {
         setValues(dates);
      } else {
         const today = dayjs();
         const todayStr = today.add(0, 'day').format('YYYY-MM-DD');
         const tomorrowStr = today.add(1, 'day').format('YYYY-MM-DD');

         setValues([todayStr, tomorrowStr]);
      }
   }, [dates]);

   const handleChange = (dates: DateObject[]) => {
      const dateArr = [dates[0].format('YYYY-MM-DD'), dates[1].format('YYYY-MM-DD')];
      setValues((prev) => dateArr);

      toParentEventDates(dateArr);
   };

   return (
      <>
         <DatePicker
            id="datePicker"
            ref={datepickerRef}
            weekDays={weekDays}
            months={months}
            className="rmdp-mobile"
            mobileLabels={{
               OK: '확인',
               CANCEL: '닫기',
            }}
            // value={values}
            value={values}
            range
            rangeHover
            numberOfMonths={2}
            minDate={new Date().setDate(5)}
            disableMonthPicker
            disableYearPicker
            plugins={[
               weekends(),
               // <DatePanel key={1} position="top" header="이벤트 기간" />,
               <Footer
                  position="top"
                  format="YY-MM-DD"
                  names={{
                     selectedDates: '이벤트 일정',
                     from: '시작일',
                     to: '종료일',
                     selectDate: '',
                     close: '닫기',
                     separator: ` ~`,
                  }}
                  key={2}
               />,
            ]}
            onChange={handleChange}
            placeholder="이벤트 기간 선택"
            style={{ width: '40vw', height: '48px' }}
            zIndex={10}
         ></DatePicker>
      </>
   );
}
