import { handleLead } from '@/lib/forms/handler';
import { allowLead } from '@/lib/forms/rateLimit';
import { deliverLead } from '@/lib/forms/deliver';
export async function POST(request:Request) {return handleLead(request,{allow:allowLead,deliver:deliverLead});}
