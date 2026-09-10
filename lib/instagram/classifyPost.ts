import type { SocialVehiclePost } from './types';
export function classifyPost(caption=''): SocialVehiclePost['status'] {
 // Conservative precedence: sold wins conflicting tags; words alone never establish inventory.
 if(/(?:^|\s)#IALsold\b/i.test(caption)) return 'sold';
 if(/(?:^|\s)#IALcomingsoon\b/i.test(caption)) return 'coming-soon';
 if(/(?:^|\s)#IALavailable\b/i.test(caption)) return 'available';
 return 'unknown';
}
