export const CDN_FPS = 30;
export const SHOT_FRAMES = 180;
export const CDN_SHOTS = [
 {label:'THE ROUND TRIP',title:'How a CDN\nspeeds up your site.',body:'Without a CDN, this image travels\nfrom your origin to the visitor.',status:'One request. A long way to go.'},
 {label:'THE BOTTLENECK',title:'Distance\nadds waiting.',body:'Longer network round trips can\nincrease the wait for a response.',status:'The response still has to travel back.'},
 {label:'THE NETWORK',title:'Put your content\ncloser to people.',body:'A Content Delivery Network places\nedge servers closer to visitors.',status:'CDN = Content Delivery Network'},
 {label:'THE FIRST REQUEST',title:'Not cached yet?\nFetch it once.',body:'The edge asks the origin, then stores\na copy if the response is cacheable.',status:'CACHE MISS → FETCH → STORE → DELIVER'},
 {label:'THE NEXT REQUEST',title:'Already cached?\nServe it nearby.',body:'A fresh cached copy can be sent\nwithout another trip to the origin.',status:'CACHE HIT → DELIVER FROM THE EDGE'},
 {label:'THE TAKEAWAY',title:'Less travel.\nFaster delivery.',body:'Cached files can arrive faster, with\nfewer requests reaching your origin.',status:'Cache policy controls what stays fresh.'},
] as const;
export const CDN_DURATION = CDN_SHOTS.length * SHOT_FRAMES;
