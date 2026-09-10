import { Scene } from '@/components/scene';
import { LeadForm } from '@/components/forms/lead-form';
import { ContactAside } from '@/components/sections';
import { pageMetadata } from '@/lib/seo';
export const metadata=pageMetadata('Partnerships','Interested in working with Infinite Auto Leasing PA? Contact our Philadelphia team about automotive, transportation, and local business collaboration.','/partnerships');
export default function Page(){return <main id="main"><Scene src="/images/coastal-suv.webp" alt="Illustrative automotive scene" className="inner-scene"><p className="eyebrow">PARTNERSHIPS</p><h1>Good business starts with a conversation.</h1></Scene><section className="wrap form-layout"><LeadForm kind="partnership"/><ContactAside/></section></main>}
