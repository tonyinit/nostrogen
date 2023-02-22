importScripts("https://unpkg.com/nostr-tools/lib/nostr.bundle.js");

let found = false;
let counter = 0;
let npub;
let nsec;
let publickey;
let privatekey;

onmessage = async (e) => {
  const { workerId, prefix, isPrefix } = e.data;

  while (!found) {
    counter++;

    privatekey = NostrTools.generatePrivateKey();
    publickey = NostrTools.getPublicKey(privatekey);
    nsec = NostrTools.nip19.nsecEncode(privatekey);
    npub = NostrTools.nip19.npubEncode(publickey);

    if (isMatched(prefix, npub, isPrefix)) {
      if (wordOfInterest !== "") {
        postMessage({ wordOfInterest, npub, privatekey });
        wordOfInterest = "";
      } else {
        const end = Date.now();
        const time = (end - start) / 1000;
        postMessage({ npub, nsec, publickey, privatekey, time });
      }

      found = true;
    }
  }
};

function isMatched(prefix, npub, isPrefix) {
  if (isPrefix) {
    if (npub.slice(5, 5 + prefix.length) === prefix) {
      found = true;
      return true;
    }
  } else {
    if (npub.slice(npub.length - prefix.length) === prefix) {
      found = true;
      return true;
    }
  }

  if (searchWords) {
    for (const word of bech32words) {
      if (npub.slice(5).startsWith(word) || npub.slice(5).endsWith(word)) {
        wordOfInterest = word;
        found = true;
        return true;
      }
    }
  }

  return false;
}
