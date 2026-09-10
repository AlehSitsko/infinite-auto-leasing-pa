export type Conversion='find_car_click'|'find_car_submission'|'call_click'|'text_click'|'partnership_inquiry'|'instagram_click'|'directions_click'|'contact_submission';
export function track(event:Conversion){if(typeof window==='undefined')return;window.dispatchEvent(new CustomEvent('infinite:conversion',{detail:{event}}));}
