type EventPopup = {
   id: number;
   createdDate: string;
   modifyDate: string;
   content: string;
   count: number;
   endDate: string;
   firstname: string;
   flag: string;
   useCheck: number;
   lastname: string;
   startDate: string;
   title: string;
   username: string;
   del: number;
};

type PageSort = {
   empty: boolean;
   sorted: boolean;
   unsorted: boolean;
};
type Pageable = {
   offset: number;
   sort: PageSort;
   pageNumber: number;
   pageSize: number;
   paged: boolean;
   unpaged: boolean;
};

type EventPageData = {
   totalPages: number;
   totalElements: number;
   size: number;
   content: EventPopup[];
   number: number;
   sort: PageSort;
   pageable: Pageable;
   first: boolean;
   last: boolean;
   empty: boolean;
};
