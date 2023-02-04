importScripts("https://unpkg.com/nostr-tools/lib/nostr.bundle.js");

let privatekey;
let publickey;
let nsec;
let npub;
let start;
let found = false;
let counter = 0;
let bech32words;
let wordOfInterest = "";
let searchWords;

onmessage = async (e) => {
  const { prefix, isPrefix, isSearchingWords } = e.data;

  searchWords = isSearchingWords;
  if(isSearchingWords) {
    await fetch('bech32words.txt')
    .then(response => response.text())
    .then(text => {
      bech32words = text.split('\n').filter(word => word !== '');
    });
  }

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
      if(wordOfInterest !== "") {
        postMessage({wordOfInterest, npub, privatekey});
        wordOfInterest = "";
      } else {
        let end = Date.now();
        let time = (end - start) / 1000;
        // send the keys back to the main thread
        postMessage({ npub, nsec, publickey, privatekey, time });
      }
    }
  }
};

function isMatched(prefix, npub, isPrefix){
  if(isPrefix) {
    if (npub.substring(5, 5 + prefix.length) === prefix) {
      found = true;
      return true;
    }
  } else {
    if (npub.substring(npub.length - prefix.length) === prefix) {
      found = true;
      return true;
    }
  }
  if(searchWords) {
    for(const word of bech32words) {
      if(npub.substring(5).startsWith(word) || npub.substring(5).endsWith(word)){
        wordOfInterest = word;
        return true;
      }
    }
  }
  
  return false;
}