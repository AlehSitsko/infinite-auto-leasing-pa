import { Scene } from '@/components/scene';
import { LeadForm } from '@/components/forms/lead-form';
import {  ContactAside } from '@/components/sections';
import { pageMetadata } from '@/lib/seo';
export const metadata=pageMetadata('Find a Car','Request a new vehicle in Philadelphia. Tell Infinite Auto Leasing PA your preferred make, model, and budget to explore purchase or lease options.','/find-a-car');
export default function Page(){return <main id="main"><Scene src="/images/interior.webp" alt="Illustrative automotive scene" className="inner-scene"><p className="eyebrow">YOUR NEXT CAR STARTS HERE</p><h1>Tell us what you’re looking for.</h1></Scene><section className="wrap form-layout"><LeadForm kind="vehicle"/><ContactAside/></section></main>}
