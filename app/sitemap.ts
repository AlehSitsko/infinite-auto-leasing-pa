import type { MetadataRoute } from 'next';
import { navigation } from '@/config/business';
import { siteUrl } from '@/lib/seo';
export default function sitemap():MetadataRoute.Sitemap{return navigation.map(([path])=>({url:new URL(path,siteUrl).href,changeFrequency:path==='/deliveries'?'weekly':'monthly',priority:path==='/'?1:path==='/find-a-car'?.9:.7}));}
