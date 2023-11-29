export const S3BannerPrefix = 'banner/';
export const S3Url = 'https://dongbu-hotel-front-s3.s3.ap-northeast-2.amazonaws.com/';
export const S3BannerUrl = S3Url + S3BannerPrefix;

export const bannerPositionObj = [
   {
      pos: 'carousel',
      str: '메인 롤링 이미지',
   },
   {
      pos: 'm1',
      str: '메인 상단 배너',
   },
   {
      pos: 'm2',
      str: '메인 중단 배너',
   },
   {
      pos: 'm3',
      str: '메인 하단 배너',
   },
];

export const getPosStr = (pos: string) => {
   const posStr = bannerPositionObj.find((p) => p.pos === pos)?.str;
   return posStr;
};
