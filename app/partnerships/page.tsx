import { LeadForm } from '@/components/forms/lead-form';
import { PageHeading,ContactAside } from '@/components/sections';
import { pageMetadata } from '@/lib/seo';
export const metadata=pageMetadata('Partnerships','Interested in working with Infinite Auto Leasing PA? Contact our Philadelphia team about automotive, transportation, and local business collaboration.','/partnerships');
export default function Page(){return <main id="main"><PageHeading eyebrow="GOOD CONNECTIONS. NEW POSSIBILITIES." title="Let’s work together."><p>We’re open to new business relationships and collaboration opportunities within the automotive industry and beyond.</p><p>Whether you represent a dealership, automotive service, transportation company, local business, or have another partnership idea, we’d be happy to hear from you.</p></PageHeading><section className="wrap form-layout"><LeadForm kind="partnership"/><ContactAside/></section></main>}
