import { LeadForm } from '@/components/forms/lead-form';
import { PageHeading, ContactAside } from '@/components/sections';
import { pageMetadata } from '@/lib/seo';
export const metadata=pageMetadata('Find a Car','Request a new vehicle in Philadelphia. Tell Infinite Auto Leasing PA your preferred make, model, and budget to explore purchase or lease options.','/find-a-car');
export default function Page(){return <main id="main"><PageHeading eyebrow="A CAR THAT FITS YOUR LIFE" title="You have a car in mind. Let’s find it."><p>A favorite model or just a starting point? Share a few details and our Philadelphia team will help you explore your options.</p></PageHeading><section className="wrap form-layout"><LeadForm kind="vehicle"/><ContactAside/></section></main>}
