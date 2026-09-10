// Best-effort per-isolate abuse protection, not a global quota. Add an edge WAF rule at launch.
export function createRateLimiter(limit=5, windowMs=600_000, maxKeys=2000) {
 const entries=new Map<string,{count:number;reset:number}>();
 return (key:string, now=Date.now()) => {
  for (const [id,entry] of entries) if(entry.reset<=now) entries.delete(id);
  const entry=entries.get(key);
  if(entry) {if(entry.count>=limit) return false; entry.count++; return true;}
  if(entries.size>=maxKeys) return false;
  entries.set(key,{count:1,reset:now+windowMs}); return true;
 };
}
export const allowLead=createRateLimiter();
