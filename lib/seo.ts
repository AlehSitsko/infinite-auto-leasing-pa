import type { Metadata } from 'next';
export const siteUrl=process.env.SITE_URL || 'https://infiniteautoleasingpa.com';
export function pageMetadata(title:string,description:string,path:string):Metadata{return {title,description,alternates:{canonical:new URL(path,siteUrl).href},openGraph:{title:`${title} | Infinite Auto Leasing PA`,description,url:new URL(path,siteUrl).href,siteName:'Infinite Auto Leasing PA',type:'website',locale:'en_US'},twitter:{card:'summary',title,description}};}
