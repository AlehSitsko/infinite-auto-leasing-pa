'use client';
import { useEffect } from 'react';
import { track } from '@/lib/analytics';
import { business } from '@/config/business';
export function Analytics(){useEffect(()=>{const click=(event:MouseEvent)=>{const target=event.target instanceof Element?event.target.closest('a'):null;const href=target?.getAttribute('href')||'';if(href.startsWith('tel:'))track('call_click');else if(href.startsWith('sms:'))track('text_click');else if(href==='/find-a-car')track('find_car_click');else if(business.instagram&&href===business.instagram)track('instagram_click');else if(href===business.maps)track('directions_click');};document.addEventListener('click',click);return()=>document.removeEventListener('click',click);},[]);return null;}
