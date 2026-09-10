import { Scene } from '@/components/scene';
import { Steps,FinalCta } from '@/components/sections';
import Link from 'next/link';
import { pageMetadata } from '@/lib/seo';
export const metadata=pageMetadata('How It Works','See how Infinite Auto Leasing PA helps Philadelphia drivers find, purchase, or lease a vehicle. Financing is provided directly by independent lenders or dealers, not by our company.','/how-it-works');
export default function Page(){return <main id="main"><Scene src="/images/interior.webp" alt="Leather and metal details in a modern vehicle interior" className="inner-scene"><p className="eyebrow">HOW IT WORKS</p><h1>A little conversation.<br/>A lot less legwork.</h1></Scene><section className="wrap section"><Steps/><div className="note-panel"><h3>Where financing fits.</h3><p>If you decide to finance, the lender or selling dealer handles the application, approval, rates, and contract directly. Infinite Auto Leasing PA does not provide financing, process credit applications, or act as a financing intermediary.</p><Link className="button dark" href="/find-a-car">Start a Conversation <span>↗</span></Link></div></section><FinalCta/></main>}
