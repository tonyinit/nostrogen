
importScripts("https://unpkg.com/nostr-tools/lib/nostr.bundle.js");

let privatekey;
let publickey;
let nsec;
let npub;
let start;
let found = false;
let counter = 0;

onmessage = (e) => {
    const { prefix, isPrefix } = e.data;
    start = Date.now();
    while(!found) {
      counter++;
      // update counter UI
      postMessage({counter: counter});
      
      // generate the keys
      privatekey = NostrTools.generatePrivateKey();
      publickey = NostrTools.getPublicKey(privatekey);
      nsec = NostrTools.nip19.nsecEncode(privatekey);
      npub = NostrTools.nip19.npubEncode(publickey);

      if(isMatched(prefix, npub, isPrefix)) {
        found = true;
        let end = Date.now();
        let time = (end - start) / 1000;
        // send the keys back to the main thread
        postMessage({ npub, nsec, publickey, privatekey, time });
      }
    }
    
};

function isMatched(prefix, npub, isPrefix){
  if(isPrefix) {
    if (npub.substring(5, 5 + prefix.length) === prefix) {
      return true;
    }
  } else {
    if (npub.substring(npub.length - prefix.length) === prefix) {
      return true;
    }
  }
  return false;
}