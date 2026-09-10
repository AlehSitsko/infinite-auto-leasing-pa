import type { Lead } from './validation';
import { business } from '@/config/business';
export async function deliverLead(lead: Lead, requestId: string): Promise<boolean> {
 const key=process.env.RESEND_API_KEY;
 const from=process.env.LEAD_FROM_EMAIL;
 if (!key || !from) return false;
 const title={vehicle:'Find a Car',contact:'Contact',partnership:'Partnership inquiry'}[lead.kind];
 const text=Object.entries(lead.fields).filter(([,v])=>v).map(([k,v])=>`${k}: ${v}`).join('\n\n');
 try {
  const response=await fetch('https://api.resend.com/emails',{method:'POST',headers:{Authorization:`Bearer ${key}`,'Content-Type':'application/json','Idempotency-Key':requestId},body:JSON.stringify({from,to:[process.env.LEAD_TO_EMAIL || business.email],subject:`Infinite Auto Leasing PA — ${title}`,text, ...(lead.fields.email ? {reply_to:lead.fields.email} : {})}),signal:AbortSignal.timeout(10_000)});
  return response.ok;
 } catch { return false; }
}
