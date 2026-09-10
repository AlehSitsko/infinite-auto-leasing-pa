import { PageHeading,Deliveries,FinalCta } from '@/components/sections';
import { pageMetadata } from '@/lib/seo';
export const metadata=pageMetadata('Cars We’ve Delivered','See past customer vehicle deliveries from Infinite Auto Leasing PA. A look at the vehicles our Philadelphia team has helped customers get into.','/deliveries');
export default function Page(){return <main id="main"><PageHeading eyebrow="NEW KEYS. REAL STORIES." title="Cars we’ve delivered."><p>A look at vehicles we’ve helped customers get into. These are past deliveries, shared from our Instagram—not vehicles currently listed for sale.</p></PageHeading><section className="wrap section"><Deliveries/></section><FinalCta/></main>}
