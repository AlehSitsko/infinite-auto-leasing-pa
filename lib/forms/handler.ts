import { validateLead } from './validation.ts';
import type { Lead } from './validation';
const MAX_BODY=16_384;
export async function handleLead(request: Request, deps: {allow:(key:string)=>boolean; deliver:(lead:Lead,id:string)=>Promise<boolean>}) {
 const respond=(body:object,status:number,headers:Record<string,string>={})=>Response.json(body,{status,headers:{'Cache-Control':'no-store',...headers}});
 const origin=request.headers.get('origin');
 if (!origin || origin!==new URL(request.url).origin) return respond({error:'Please submit this form from our website.'},403);
 if(!request.headers.get('content-type')?.startsWith('application/json')) return respond({error:'Unsupported request format.'},415);
 const rawIp=request.headers.get('cf-connecting-ip') || 'local';
 const hash=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(rawIp));
 const key=Array.from(new Uint8Array(hash)).map(x=>x.toString(16).padStart(2,'0')).join('');
 if(!deps.allow(key)) return respond({error:'Too many requests. Please wait a few minutes or call us.'},429,{'Retry-After':'600'});
 if(Number(request.headers.get('content-length'))>MAX_BODY) return respond({error:'Your message is too long.'},413);
 let data: Record<string,unknown>;
 try {
  const reader=request.body?.getReader(); if(!reader) throw Error();
  let length=0; const chunks:Uint8Array[]=[];
  while(true){const {value,done}=await reader.read();if(done)break;length+=value.length;if(length>MAX_BODY){await reader.cancel();return respond({error:'Your message is too long.'},413);}chunks.push(value);}
  const bytes=new Uint8Array(length);let at=0;for(const chunk of chunks){bytes.set(chunk,at);at+=chunk.length;}
  data=JSON.parse(new TextDecoder().decode(bytes));
 }catch{return respond({error:'Please check your form and try again.'},400);}
 if(data && typeof data==='object' && data.websiteConfirm) return respond({error:'We could not process this request. Please call us.'},400);
 const result=validateLead(data);
 if(!result.ok) return respond({error:'Please check the highlighted fields.',errors:result.errors},400);
 const delivered=await deps.deliver(result.lead,crypto.randomUUID());
 if(!delivered) return respond({error:'Your request has not been sent. Please call, text, or email our team, or try again later.'},503);
 return respond({message:'Thanks — we’ll review your request and contact you to discuss available options.'},200);
}
