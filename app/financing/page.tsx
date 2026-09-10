import { permanentRedirect } from 'next/navigation';

// Infinite Auto Leasing PA does not provide financing or act as a credit broker.
// Financing is handled directly by the lender or selling dealer — explained on
// the How It Works page, so /financing permanently redirects there.
export default function FinancingRedirect() {
  permanentRedirect('/how-it-works');
}
