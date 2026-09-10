import { normalizeMedia } from './normalize';
import type { SocialVehiclePost } from './types';
export async function fetchInstagramMedia():Promise<SocialVehiclePost[]> {
 const token=process.env.INSTAGRAM_ACCESS_TOKEN, id=process.env.INSTAGRAM_USER_ID, version=process.env.INSTAGRAM_API_VERSION;
 if(!token||!id||!version||!/^\d+$/.test(id)||!/^v\d+\.\d+$/.test(version))return [];
 const url=new URL(`https://graph.instagram.com/${version}/${id}/media`);
 url.searchParams.set('fields','id,caption,media_type,media_url,thumbnail_url,permalink,timestamp');url.searchParams.set('limit','50');
 const response=await fetch(url,{headers:{Authorization:`Bearer ${token}`},signal:AbortSignal.timeout(6000),cache:'no-store'});
 if(!response.ok)throw new Error('Social feed unavailable');
 const body=await response.json() as {data?:unknown};
 return normalizeMedia(body.data);
}
