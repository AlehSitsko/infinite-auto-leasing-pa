import type { SocialVehiclePost } from './types';
import { classifyPost } from './classifyPost.ts';
function safeUrl(value:unknown, media=false): string | null {
 if(typeof value!=='string')return null;
 try{const u=new URL(value);if(u.protocol!=='https:' || u.username || u.password)return null;
 const hosts=media ? ['cdninstagram.com','fbcdn.net','instagram.com'] : ['instagram.com'];
 return hosts.some(host=>u.hostname===host||u.hostname.endsWith(`.${host}`)) ? u.href : null;
 }catch{return null;}
}
export function normalizeMedia(value:unknown):SocialVehiclePost[] {
 if(!Array.isArray(value))return [];
 return value.flatMap((raw)=>{
  if(!raw || typeof raw!=='object' || typeof raw.id!=='string' || !['IMAGE','VIDEO','CAROUSEL_ALBUM'].includes(raw.media_type))return [];
  const image=safeUrl(raw.media_type==='VIDEO' ? raw.thumbnail_url : raw.media_url,true);
  const permalink=safeUrl(raw.permalink);
  if(!image||!permalink||typeof raw.timestamp!=='string'||!Number.isFinite(Date.parse(raw.timestamp)))return [];
  const caption=typeof raw.caption==='string' ? raw.caption.slice(0,2200) : '';
  return [{id:raw.id,imageUrl:image,permalink,caption,timestamp:raw.timestamp,vehicleTitle:caption.split('\n').find((line:string)=>line.trim()&&!line.trim().startsWith('#'))?.replace(/#\w+/g,'').trim().slice(0,100) || 'A customer delivery',status:classifyPost(caption),mediaType:raw.media_type} as SocialVehiclePost];
 });
}
