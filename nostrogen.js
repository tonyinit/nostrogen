// consts
const prefixRadioEl = document.getElementById("prefixRadio");
const suffixRadioEl = document.getElementById("suffixRadio");
const wordsOfInterestEl = document.getElementById("wordsOfInterestCheck");
const prefixEl = document.getElementById("prefix");
const progressEl = document.querySelector(".progress-bar");
const npubEl = document.getElementById("npub");
const nsecEl = document.getElementById("nsec");
const publicEl = document.getElementById("public");
const privateEl = document.getElementById("private");
const timeEl = document.getElementById("time");
const counterEl = document.getElementById("counter");
const tableOfInterestEl = document.getElementById("tableOfInterest");
const wordsOfInterestContainer = document.getElementById("wordsOfInterestContainer");

// lets
let worker;
let isPrefix = prefixRadioEl.checked;
let isSearchingWords = wordsOfInterestEl.checked;

function startWorker() {
  worker = new Worker('generator.js');
  worker.addEventListener('message', (e) => {
    // handle the received data
    if(e.data.counter) {
      counterEl.innerHTML = e.data.counter;
    }
    if(e.data.wordOfInterest) {
      tableOfInterestEl.innerHTML += `<tr><th>${e.data.wordOfInterest}</th><td>${e.data.npub}</td><td>${e.data.privatekey}</td></tr>`
    }
    if(e.data.npub && !e.data.wordOfInterest) {
      const { npub, nsec, publickey, privatekey, time } = e.data;
      stopWorker();
      finishUp(npub, nsec, publickey, privatekey, time);
    }
  })
}

function stopWorker() {
  worker.terminate();
}

prefixRadioEl.onclick = function() {
  suffixRadioEl.checked = false;
  prefixEl.placeholder = 'prefix';
  isPrefix = true;
}

suffixRadioEl.onclick = function() {
  prefixRadioEl.checked = false;
  prefixEl.placeholder = 'suffix';
  isPrefix = false;
}

// disallow b's, i's, o's, and 1's
prefixEl.onkeypress = function(e) {
  var chr = String.fromCharCode(e.which);
  if ("acdefghjklmnpqrstuvwxyz234567890".indexOf(chr) < 0)
      return false;
};

// input npub to decode public key
npubEl.addEventListener('input', (e) => {
  const { data } = NostrTools.nip19.decode(npubEl.value);
  publicEl.value = data;
})

// input private key to fill inputs
privateEl.addEventListener('input', (e) => {
  publicEl.value = NostrTools.getPublicKey(privateEl.value);
  nsecEl.value = NostrTools.nip19.nsecEncode(privateEl.value);
  npubEl.value = NostrTools.nip19.npubEncode(publicEl.value);
})

// handle words of interest checkbox
wordsOfInterestEl.onclick = function() {
  if(!isSearchingWords) {
    isSearchingWords = wordsOfInterestEl.checked;
    wordsOfInterestContainer.style.display = "block";
  } else {
    isSearchingWords = wordsOfInterestEl.checked;
    wordsOfInterestContainer.style.display = "none";
  }
}

// start looking...
async function generate() {
  progressEl.style="width: 100%";
  
  clear();
  startWorker();

  // gather the necessary data for the worker
  const prefix = prefixEl.value;
  const data = { prefix, isPrefix, isSearchingWords };
  
  // start the worker
  worker.postMessage(data);
}

// clear values
function clear() {
  npubEl.value = '';
  nsecEl.value =  '';
  publicEl.value = '';
  privateEl.value = '';
  timeEl.innerHTML = '0';
}

function finishUp(npub, nsec, publickey, privatekey, time) {
  progressEl.style="width: 0%";
  npubEl.value = npub;
  nsecEl.value =  nsec;
  publicEl.value = publickey;
  privateEl.value = privatekey;
  timeEl.innerHTML = time;
}

// copy to clipboard
function copy(element) {
  switch (element) {
    case 'npub':
      npubEl.select();
      npubEl.setSelectionRange(0, 99999);
      navigator.clipboard.writeText(npubEl.value);
      alert('copied!')
      break;
    case 'nsec':
      nsecEl.select();
      nsecEl.setSelectionRange(0, 99999);
      navigator.clipboard.writeText(nsecEl.value);
      alert('copied!')
      break;
    case 'public':
      publicEl.select();
      publicEl.setSelectionRange(0, 99999);
      navigator.clipboard.writeText(publicEl.value);
      alert('copied!')
      break;
    case 'private':
      privateEl.select();
      privateEl.setSelectionRange(0, 99999);
      navigator.clipboard.writeText(privateEl.value);
      alert('copied!')
      break;       
  }
}