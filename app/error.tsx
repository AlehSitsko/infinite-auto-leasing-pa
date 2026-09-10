'use client';
import { business } from '@/config/business';
export default function ErrorPage({reset}:{reset:()=>void}){return <main id="main" className="wrap section"><h1>We hit a bump in the road.</h1><p className="section-copy">Please try again, or contact our team directly.</p><div className="actions"><button className="button dark" onClick={reset}>Try again</button><a className="button outline" href={business.phone.href}>Call {business.phone.display}</a></div></main>}
