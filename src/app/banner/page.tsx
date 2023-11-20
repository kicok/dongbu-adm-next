import { useFormik } from 'formik';
import { useRouter } from 'next/navigation';
import React from 'react';
import { object, string } from 'yup';

let validationSchema = object({
   title: string().required('제목은 필수 입력 사항입니다.'),
});

export default function Banner() {
   const router = useRouter();
   const formik = useFormik({
      initialValues: {
         banner: '',
      },

      validationSchema: validationSchema,
      onSubmit: async (values) => {
         const options = {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify(values),
         };

         const data = await fetch('/api/event', options)
            // .then((res) => res.json())
            // .then((res) => console.log(res))
            .then((res) => {
               if (res.status === 200) {
                  // redirect('/eventPopup/list'); // not working
                  // router.replace('/eventPopup/list');
                  router.push('/event/list');
               }
            });
      },
   });
   return (
      <div>
         <form>
            <input value={formik.values.banner} />
         </form>
      </div>
   );
}
