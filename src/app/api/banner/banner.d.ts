type Banner = {
   id: number;
   createdDate: string;
   modifyDate: string;
   memo: string;
   count: number;
   endDate: string;
   firstname: string;
   flag: string;
   useCheck: boolean;
   lastname: string;
   startDate: string;
   title: string;
   username: string;
   del: number;
   banner: string;
   pos: string;
};

type BannerPageData = {
   totalPages: number;
   totalElements: number;
   size: number;
   content: Banner[];
   number: number;
   sort: PageSort;
   pageable: Pageable;
   first: boolean;
   last: boolean;
   empty: boolean;
};
