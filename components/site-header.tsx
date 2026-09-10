'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Brand } from './brand';
import { business, navigation } from '@/config/business';

export function SiteHeader(){
 const pathname=usePathname();
 const [open,setOpen]=useState(false);
 const [scrolled,setScrolled]=useState(false);
 useEffect(()=>{const update=()=>setScrolled(window.scrollY>40);update();window.addEventListener('scroll',update,{passive:true});return()=>window.removeEventListener('scroll',update)},[]);
 useEffect(()=>{if(!open)return;const previous=document.body.style.overflow;document.body.style.overflow='hidden';const escape=(e:KeyboardEvent)=>{if(e.key==='Escape')setOpen(false)};window.addEventListener('keydown',escape);return()=>{document.body.style.overflow=previous;window.removeEventListener('keydown',escape)}},[open]);
 return <header className={`site-header ${pathname==='/'&&!scrolled&&!open?'over-hero':''}`}><Brand/><nav className="desktop-nav" aria-label="Main navigation">{navigation.filter(([href])=>href!=='/').map(([href,label])=><Link key={href} href={href} aria-current={pathname===href?'page':undefined}>{href==='/deliveries'?'Delivered':label}</Link>)}</nav><Link className="header-cta" href="/find-a-car">Find My Car <span>↗</span></Link><button className="menu-toggle" onClick={()=>setOpen(!open)} aria-expanded={open} aria-controls="site-menu">{open?'Close':'Menu'} <span>{open?'×':'☰'}</span></button>{open&&<nav id="site-menu" className="menu-panel" aria-label="Mobile navigation">{navigation.filter(([href])=>href!=='/').map(([href,label],i)=><Link key={href} href={href} onClick={()=>setOpen(false)}><small>0{i+1}</small>{label}<span>↗</span></Link>)}<a className="menu-phone" href={business.phone.href}>{business.phone.display}</a><p>{business.languages.join(' · ')}</p></nav>}</header>
}
