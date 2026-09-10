import Link from 'next/link';
import { Infinity as InfinityIcon } from 'lucide-react';
export function Brand(){return <Link href="/" className="brand" aria-label="Infinite Auto Leasing PA home"><InfinityIcon className="brand-symbol" aria-hidden="true" strokeWidth={1.65}/><span className="brand-wordmark"><span className="brand-name">INFINITE</span><span className="brand-sub">AUTO LEASING PA</span></span></Link>}
