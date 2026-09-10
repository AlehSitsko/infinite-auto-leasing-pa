'use client';
import { useEffect, useRef, useState } from 'react';
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { LeadKind } from '@/lib/forms/validation';
import { validateLead } from '@/lib/forms/validation';
import { business } from '@/config/business';
import { track } from '@/lib/analytics';
type Field={name:string;label:string;required?:boolean;type?:string;options?:string[];wide?:boolean;autoComplete?:string};
const contact:Field[]=[{name:'name',label:'Full name',required:true,autoComplete:'name'},{name:'phone',label:'Phone',required:true,type:'tel',autoComplete:'tel'},{name:'email',label:'Email',type:'email',autoComplete:'email'}];
const vehicle:Field[]=[{name:'make',label:'Vehicle make',required:true},{name:'model',label:'Vehicle model',required:true},{name:'trim',label:'Preferred trim'},{name:'condition',label:'Vehicle preference',options:['New','Not sure']},{name:'preference',label:'Purchase or lease?',options:['Purchase','Lease','Not sure']},{name:'budget',label:'Approximate monthly budget ($)',type:'number'},{name:'downPayment',label:'Desired down payment ($)',type:'number'},{name:'tradeIn',label:'Do you have a trade-in?',options:['Yes','No']},{name:'color',label:'Preferred color'},{name:'timeline',label:'Preferred timeline',options:['As soon as practical','Within a month','1–3 months','Just exploring']},{name:'notes',label:'Anything else we should know?',type:'textarea',wide:true}];
const partnership:Field[]=[{name:'company',label:'Company',required:true,autoComplete:'organization'},{name:'businessType',label:'Type of business',required:true},{name:'website',label:'Website / social media',type:'url'},{name:'message',label:'How do you see us working together?',type:'textarea',required:true,wide:true}];
export function LeadForm({kind}:{kind:LeadKind}) {
 const fields=[...contact.map(f=>f.name==='email'&&kind==='partnership'?{...f,required:true}:f),...(kind==='vehicle'?vehicle:kind==='partnership'?partnership:[{name:'message',label:'How can we help?',required:true,type:'textarea',wide:true}])];
 const formRef=useRef<HTMLFormElement>(null);
 const statusRef=useRef<HTMLDivElement>(null);
 const [errors,setErrors]=useState<Record<string,string>>({});
 const [status,setStatus]=useState<'idle'|'sending'|'success'|'error'>('idle');
 const [message,setMessage]=useState('');
 useEffect(()=>{
  type Context={registerTool:(tool:{name:string;description:string;inputSchema:object;execute:(input:unknown)=>unknown;annotations:object},options:{signal:AbortSignal})=>void|Promise<void>};
  const context=(document as Document & {modelContext?:Context}).modelContext;
  if(!context?.registerTool)return;
  const lifecycle=new AbortController();
  try {void Promise.resolve(context.registerTool({name:'stage_lead_request',description:'Fill this inquiry form for the visitor to review. Does not submit or send a message. The visitor uses the visible submit button to send.',inputSchema:{type:'object',properties:Object.fromEntries(fields.map(f=>[f.name,{type:'string'}])),additionalProperties:false},annotations:{readOnlyHint:false,untrustedContentHint:false},execute(input){
   if(!input||typeof input!=='object'||Array.isArray(input))throw new Error('Expected a field object.');
   const data=input as Record<string,unknown>;
   for(const [key,value] of Object.entries(data)){const field=fields.find(f=>f.name===key);if(!field||typeof value!=='string'||value.length>2000||(field.options&&!field.options.includes(value)))throw new Error('Invalid field value.');}
   for(const [key,value] of Object.entries(data)){const element=formRef.current?.elements.namedItem(key);if(element instanceof HTMLInputElement||element instanceof HTMLTextAreaElement||element instanceof HTMLSelectElement)element.value=String(value);}
   return {status:'staged',kind,requiresVisitorSubmission:true};
  }},{signal:lifecycle.signal})).catch(()=>{});}catch{}
  return()=>lifecycle.abort();
 // The field list depends only on inquiry kind.
 // eslint-disable-next-line react-hooks/exhaustive-deps
 },[kind]);
 async function submit(event:React.FormEvent<HTMLFormElement>){
  event.preventDefault();if(status==='sending')return;
  const data={...Object.fromEntries(new FormData(event.currentTarget)),kind};
  const result=validateLead(data);
  if(!result.ok){setErrors(result.errors);setStatus('error');setMessage('Please check the highlighted fields.');requestAnimationFrame(()=>formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus());return;}
  setErrors({});setStatus('sending');setMessage('Sending your request…');
  try{const response=await fetch('/api/leads',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data),signal:AbortSignal.timeout(15000)});const body=await response.json() as {errors?:Record<string,string>;error?:string;message:string};
   if(!response.ok){setErrors(body.errors||{});setStatus('error');setMessage(body.error||'Your request has not been sent. Please call us.');}
   else{setStatus('success');setMessage(body.message);formRef.current?.reset();track(kind==='partnership'?'partnership_inquiry':kind==='vehicle'?'find_car_submission':'contact_submission');}
  }catch{setStatus('error');setMessage('We could not confirm that your request was received. Please call or email our team before trying again.');}
  requestAnimationFrame(()=>statusRef.current?.focus());
 }
 return <form className="lead-form" ref={formRef} onSubmit={submit} noValidate><div className="form-top"><span className="eyebrow">{kind==='vehicle'?'YOUR NEXT CHAPTER STARTS HERE':kind==='partnership'?'LET’S MAKE A CONNECTION':'WE’RE HERE TO HELP'}</span><p>* Required fields</p></div><fieldset disabled={status==='sending'}><legend className="sr-only">{kind} inquiry</legend><div className="form-grid">{fields.map(field=><div className={field.wide?'field wide':'field'} key={field.name}><label htmlFor={field.name}>{field.label}{field.required?' *':<span> (optional)</span>}</label>{field.options?<NativeSelect id={field.name} name={field.name} aria-invalid={!!errors[field.name]} aria-describedby={errors[field.name]?`${field.name}-error`:undefined}><NativeSelectOption value="">Select an option</NativeSelectOption>{field.options.map(option=><NativeSelectOption key={option}>{option}</NativeSelectOption>)}</NativeSelect>:field.type==='textarea'?<Textarea id={field.name} name={field.name} rows={4} maxLength={2000} required={field.required} aria-invalid={!!errors[field.name]} aria-describedby={errors[field.name]?`${field.name}-error`:undefined}/>:<Input id={field.name} name={field.name} type={field.type||'text'} autoComplete={field.autoComplete||'off'} min={field.type==='number'?0:undefined} step={field.type==='number'?'0.01':undefined} maxLength={200} required={field.required} aria-invalid={!!errors[field.name]} aria-describedby={errors[field.name]?`${field.name}-error`:undefined}/>} {errors[field.name]&&<p className="field-error" id={`${field.name}-error`}>{errors[field.name]}</p>}</div>)}</div><div className="honeypot" aria-hidden="true"><label htmlFor="websiteConfirm">Leave this field empty</label><input id="websiteConfirm" name="websiteConfirm" tabIndex={-1} autoComplete="off"/></div><p className="form-disclaimer">This is an inquiry, not a credit application. Please don’t include Social Security numbers or sensitive financial information. We’ll use your details to respond to this request.</p><button className="button dark" type="submit">{status==='sending'?'Sending…':kind==='vehicle'?'Send My Car Request':kind==='partnership'?'Send Partnership Inquiry':'Send Message'} <span>↗</span></button></fieldset><div ref={statusRef} tabIndex={-1} role="status" aria-live="polite" className={`form-status ${status}`}>{message}</div>{status==='error'&&<div className="actions"><a className="text-link" href={business.phone.href}>Call {business.phone.display}</a><a className="text-link" href={business.sms}>Text us</a><a className="text-link" href={`mailto:${business.email}`}>Email us</a></div>}</form>;
}
