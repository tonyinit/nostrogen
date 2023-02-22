importScripts("https://unpkg.com/nostr-tools/lib/nostr.bundle.js");

let bech32words;
let wordOfInterest = "";
let searchWords;
let workerCount;

onmessage = async (e) => {
  const { prefix, isPrefix, isSearchingWords, workers } = e.data;

  searchWords = isSearchingWords;
  workerCount = workers;

  if (isSearchingWords) {
    await fetch('bech32words.txt')
      .then(response => response.text())
      .then(text => {
        bech32words = text.split('\n').filter(word => word !== '');
      });
  }

  for (let i = 0; i < workerCount; i++) {
    const worker = new Worker('worker.js');
    worker.postMessage({ workerId: i, prefix, isPrefix });
    worker.onmessage = (e) => {
      if (e.data.wordOfInterest !== "") {
        postMessage({ wordOfInterest: e.data.wordOfInterest, npub: e.data.npub, privatekey: e.data.privatekey });
      } else {
        postMessage({ npub: e.data.npub, nsec: e.data.nsec, publickey: e.data.publickey, privatekey: e.data.privatekey, time: e.data.time });
      }
    }
  }
}
