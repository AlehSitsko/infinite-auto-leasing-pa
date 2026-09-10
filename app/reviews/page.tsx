import Link from 'next/link';
import { Scene } from '@/components/scene';
import { FinalCta } from '@/components/sections';
import { business } from '@/config/business';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata(
  'Reviews',
  'Customer feedback for Infinite Auto Leasing PA. We publish only genuine reviews — never invented testimonials or ratings.',
  '/reviews',
);

export default function Page() {
  return (
    <main id="main">
      <Scene src="/images/coastal-suv.webp" alt="Illustrative automotive scene" className="inner-scene">
        <p className="eyebrow">WHAT PEOPLE SAY</p>
        <h1>Real words.<br />No fiction.</h1>
      </Scene>
      <section className="wrap section">
        <div className="social-fallback">
          <div className="social-mark" aria-hidden="true">★</div>
          <div>
            <h3>Reviews are on the way.</h3>
            <p>
              We publish only genuine customer feedback — never invented testimonials or ratings.
              As customers share their experience, their words will appear here.
              {business.googleBusiness ? ' In the meantime, you can read and leave reviews on Google.' : ''}
            </p>
          </div>
          {business.googleBusiness
            ? <a className="button outline" href={business.googleBusiness} target="_blank" rel="noreferrer">Read Reviews on Google ↗</a>
            : <Link className="button outline" href="/contact">Talk to Us ↗</Link>}
        </div>
      </section>
      <FinalCta />
    </main>
  );
}
