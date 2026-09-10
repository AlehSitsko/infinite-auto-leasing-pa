export type LeadKind = 'vehicle' | 'contact' | 'partnership';
export type Lead = { kind: LeadKind; fields: Record<string, string> };
export const fieldNames = ['name','phone','email','make','model','trim','condition','preference','budget','downPayment','tradeIn','color','timeline','notes','company','businessType','website','message'] as const;
const choices: Record<string, string[]> = { condition: ['New','Not sure'], preference: ['Purchase','Lease','Not sure'], tradeIn: ['Yes','No'], timeline: ['As soon as practical','Within a month','1–3 months','Just exploring'] };
export function validateLead(input: unknown): {ok: true; lead: Lead} | {ok: false; errors: Record<string,string>} {
 if (!input || typeof input !== 'object' || Array.isArray(input)) return {ok:false,errors:{form:'Please complete the form.'}};
 const data = input as Record<string,unknown>;
 if (!['vehicle','contact','partnership'].includes(String(data.kind))) return {ok:false,errors:{form:'Choose a valid inquiry type.'}};
 const kind = data.kind as LeadKind;
 const fields: Record<string,string> = {};
 const errors: Record<string,string> = {};
 for (const key of fieldNames) {
  if (data[key] === undefined) {fields[key]=''; continue;}
  if (typeof data[key] !== 'string') {errors[key]='Enter text for this field.'; continue;}
  const value = (data[key] as string).trim();
  const max = ['notes','message'].includes(key) ? 2000 : 200;
  if (value.length > max || /[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(value)) errors[key]=`Use no more than ${max} characters and ordinary text.`;
  fields[key]=value;
 }
 const required = kind==='vehicle' ? ['name','phone','make','model'] : kind==='partnership' ? ['name','company','phone','email','businessType','message'] : ['name','phone','message'];
 for (const key of required) if (!fields[key]) errors[key]='This field is required.';
 if (fields.phone && (!/^[+()\d\s.\-]+$/.test(fields.phone) || fields.phone.replace(/\D/g,'').length<10 || fields.phone.replace(/\D/g,'').length>15)) errors.phone='Enter a valid phone number, including area code.';
 if (fields.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) errors.email='Enter a valid email address.';
 for (const [key,values] of Object.entries(choices)) if (fields[key] && !values.includes(fields[key])) errors[key]='Choose one of the listed options.';
 for (const key of ['budget','downPayment']) if (fields[key] && (!/^\d{1,7}(\.\d{1,2})?$/.test(fields[key]))) errors[key]='Enter a positive dollar amount without commas.';
 if (fields.website) {try {const url=new URL(fields.website); if (!['https:','http:'].includes(url.protocol)) throw Error();} catch {errors.website='Enter a complete website or social URL, starting with https://.';}}
 // Only the relevant inquiry fields reach the delivery provider.
 const allowed = kind==='vehicle' ? ['name','phone','email','make','model','trim','condition','preference','budget','downPayment','tradeIn','color','timeline','notes'] : kind==='partnership' ? ['name','phone','email','company','businessType','website','message'] : ['name','phone','email','message'];
 return Object.keys(errors).length ? {ok:false,errors} : {ok:true,lead:{kind,fields:Object.fromEntries(allowed.map(key=>[key,fields[key]]))}};
}
