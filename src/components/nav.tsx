'use client';
import { useState } from 'react';

import { ArrowLongRightIcon, Bars3Icon } from '@heroicons/react/24/solid';
import DarkSwitch from './darkSwitch';
import AuthStatus from './authStatus';
import Link from 'next/link';
import LogoText from './logos/logoText';

// import ArrowNarrowRightIcon from '~icons/tabler/arrow-narrow-right.tsx';
// import MenuIcon from '~icons/tabler/menu-2.tsx';

/** Links */
interface NavLink {
   title: string;
   href: string;
   children?: NavLink[];
}

const links: NavLink[] = [
   {
      title: 'Home',
      href: '/',
   },
   {
      title: '배너관리',
      href: '/banner',
      children: [
         {
            title: 'Web development',
            href: '/services/web-development',
         },
         {
            title: 'Digital marketing',
            href: '/services/digital-marketing',
         },
         {
            title: 'Brand strategy',
            href: '/services/brand-strategy',
         },
      ],
   },
   {
      title: '이벤트/팝업관리',
      href: '/event/list',
   },
   {
      title: 'Contact',
      href: '/contact',
   },
];

/** NavLink */
interface NavLinkProps extends React.HTMLProps<HTMLLinkElement> {
   currentPath?: string;
}

function NavLink({ children, className, currentPath, href }: NavLinkProps) {
   return (
      <Link
         className={`
        block whitespace-nowrap px-3 py-2 text-sm font-semibold no-underline transition hover:text-slate-900 dark:hover:text-slate-50
        ${currentPath === href ? 'text-slate-900 dark:text-slate-50' : 'text-slate-400'}
        ${className}
      `}
         href={href as string}
      >
         {children}
      </Link>
   );
}

/** Navigation */
interface NavigationProps {
   mobile?: boolean;
   navLinks?: NavLink[];
}

function Navigation({ mobile = false, navLinks = [] }: NavigationProps) {
   const [mobileNavigationOpened, setMobileNavigationOpened] = useState(false);

   const navClassName = `
    bg-white text-base dark:bg-slate-900
    ${
       mobile
          ? `transition transform -right-1/2 fixed top-0 z-20 h-full w-1/2 overflow-y-auto py-4 sm:hidden ${
               mobileNavigationOpened ? '-translate-x-full shadow-2xl' : ''
            }`
          : 'hidden sm:block'
    }
  `;
   const navListClassName = `
    flex
    ${mobile ? 'flex-col space-y-2' : 'items-center space-x-2'}
  `;
   const navListItemClassName = `
    group relative
    ${mobile ? 'w-full overflow-x-visible text-right' : ''}
  `;
   const navListLinkClassName = mobile ? 'mx-4' : '';
   const navChildrenClassName = `
    delay-75 ease-in-out space-y-2 
    ${
       mobile
          ? 'h-0 overflow-y-hidden bg-slate-50 px-4 py-0 transition-all group-hover:h-full group-hover:py-4 dark:bg-slate-800'
          : 'invisible absolute z-30 rounded-lg border border-slate-50 bg-white p-4 opacity-0 shadow-xl transition-opacity group-hover:visible group-hover:opacity-100 dark:bg-slate-900 dark:border-slate-800'
    }
  `;

   const closeMobileNavigation = () => setMobileNavigationOpened(false);

   return (
      <>
         {mobile && (
            <button
               className="block text-slate-400 hover:text-slate-900 dark:hover:text-slate-50 sm:hidden"
               onClick={() => setMobileNavigationOpened(true)}
               title="Open navigation menu"
            >
               <Bars3Icon width={30} />
            </button>
         )}

         {mobile && mobileNavigationOpened && (
            <div
               className="fixed top-0 right-0 z-10 h-full w-full bg-slate-900 opacity-70 dark:opacity-90 sm:hidden"
               onClick={closeMobileNavigation}
            ></div>
         )}

         <nav className={navClassName}>
            <ul className={navListClassName}>
               {mobile && (
                  <li className="text-right">
                     <button className="px-6 py-2 text-slate-400 hover:text-slate-900 dark:hover:text-slate-50" onClick={closeMobileNavigation}>
                        <ArrowLongRightIcon width={30} />
                     </button>
                  </li>
               )}
               {navLinks.map(({ title, href, children }) => (
                  <li className={navListItemClassName} key={href}>
                     <NavLink className={navListLinkClassName} currentPath="/contact" href={href}>
                        {title}
                     </NavLink>
                     {!!children?.length && (
                        <ul className={navChildrenClassName}>
                           {children.map((child) => (
                              <li key={child.href}>
                                 <NavLink href={child.href}>{child.title}</NavLink>
                              </li>
                           ))}
                        </ul>
                     )}
                  </li>
               ))}
               <li className={navListItemClassName}>
                  <DarkSwitch />
               </li>
               <li className={navListItemClassName}>
                  <AuthStatus />
               </li>
            </ul>
         </nav>
      </>
   );
}

/** Header */
interface HeaderProps {
   navLinks?: NavLink[];
}

function Header({ navLinks = links }: HeaderProps) {
   return (
      <header className="container mx-auto flex w-full items-center justify-between py-4 px-6">
         <Link href="/">
            <LogoText />
         </Link>
         <Navigation navLinks={navLinks} />
         <Navigation mobile navLinks={navLinks} />
      </header>
   );
}

/** Page */
export default function Nav() {
   return (
      <div>
         <Header />
      </div>
   );
}
