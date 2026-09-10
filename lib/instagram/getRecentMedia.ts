import { unstable_cache } from 'next/cache';
import { fetchInstagramMedia } from './client';
import type { SocialVehiclePost } from './types';
import { siteUrl } from '@/lib/seo';
// Cache successes AND graceful fallbacks for 30 minutes: no per-view Meta requests.
export const getRecentMedia=unstable_cache(async()=>{
 const edge=typeof caches!=='undefined' ? (caches as CacheStorage & {default?:Cache}).default : undefined;
 const key=new Request(new URL(`/__social-cache/${process.env.INSTAGRAM_USER_ID||'unconfigured'}`,siteUrl));
 try{const cached=await edge?.match(key);if(cached)return await cached.json() as SocialVehiclePost[];}catch{/* Cache outages must not take down the page. */}
 let posts:SocialVehiclePost[]=[];
 try{posts=await fetchInstagramMedia();}catch{/* Return the contact/Instagram fallback. */}
 try{await edge?.put(key,Response.json(posts,{headers:{'Cache-Control':'public, max-age=1800'}}));}catch{/* Local framework cache still applies. */}
 return posts;
},['infinite-instagram-media-v1'],{revalidate:1800});
