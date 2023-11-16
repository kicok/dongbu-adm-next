'use client';
import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';

export default function SignInPage() {
   const searchParams = useSearchParams();
   const callbackUrl = searchParams.get('callbackUrl') as string;
   return (
      <div className="grid place-items-center h-screen pb-36">
         <main className="w-full max-w-md mx-auto">
            <div className="mt-0 bg-white border border-gray-200 rounded-xl shadow-sm dark:bg-gray-800 dark:border-gray-700">
               <div className="p-4 sm:p-7">
                  <div className="text-center">
                     <h1 className="block text-2xl font-bold text-gray-800 dark:text-white">Sign in</h1>
                     <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        {/* Don't have an account yet? */}
                        <a
                           className="text-blue-600 decoration-2 hover:underline font-medium dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                           href="../examples/html/signup.html"
                        >
                           {/* Sign up here */}
                        </a>
                     </p>
                  </div>

                  <div className="mt-5">
                     <button
                        type="button"
                        className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                        onClick={() => signIn('keycloak', { callbackUrl })}
                     >
                        로그인 및 재인증
                     </button>
                  </div>
               </div>
            </div>
         </main>
      </div>
   );
}
