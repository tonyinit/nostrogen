// consts
const prefixRadioEl = document.getElementById("prefixRadio");
const suffixRadioEl = document.getElementById("suffixRadio");
const prefixEl = document.getElementById("prefix");
const progressEl = document.querySelector(".progress-bar");
const npubEl = document.getElementById("npub");
const nsecEl = document.getElementById("nsec");
const publicEl = document.getElementById("public");
const privateEl = document.getElementById("private");
const timeEl = document.getElementById("time");

// lets
let isPrefix = prefixRadioEl.checked;
let found = false;
let counter = 0;
let privatekey;
let publickey;
let nsec;
let npub;

prefixRadioEl.onclick = function() {
  suffixRadioEl.checked = false;
  isPrefix = true;
}

suffixRadioEl.onclick = function() {
  prefixRadioEl.checked = false;
  isPrefix = false;
}

// disallow b's, i's, o's, and 1's
prefixEl.onkeypress = function(e) {
  var chr = String.fromCharCode(e.which);
  if ("acdefghjklmnpqrstuvwxyz234567890".indexOf(chr) < 0)
      return false;
};

// start looking...
async function generate() {
  progressEl.style="width: 100%";
  clear();
  console.log(`Looking for prefix: ${prefixEl.value}`);
  let start = Date.now();
  while (!found) {
    if (counter % 1000 === 0) {
      console.log(`Generated and parsed ${counter} keys...`);
    }
    if(isMatched(npub, prefixEl.value)) {
      found = true;
      finishUp();
    } else {
      privatekey = window.NostrTools.generatePrivateKey();
      publickey = window.NostrTools.getPublicKey(privatekey);
      nsec = window.NostrTools.nip19.nsecEncode(privatekey);
      npub = window.NostrTools.nip19.npubEncode(publickey);
      counter++;
    }
  }
  let end = Date.now();
  let time = (end - start) / 1000;
  timeEl.innerHTML = time;
  console.log(`Took ${time} sec to compute`);
}

// clear values
function clear() {
  counter = 0;
  found = false;
  npubEl.value = '';
  nsecEl.value =  '';
  publicEl.value = '';
  privateEl.value = '';
  privatekey = window.NostrTools.generatePrivateKey();
  publickey = window.NostrTools.getPublicKey(privatekey);
  nsec = window.NostrTools.nip19.nsecEncode(privatekey);
  npub = window.NostrTools.nip19.npubEncode(publickey);
}

function isMatched(npub){
  console.log(isPrefix)
  if(isPrefix) {
    if (npub.substring(5, 5 + prefixEl.value.length) === prefixEl.value) {
      return true;
    }
  } else {
    if (npub.substring(npub.length - prefixEl.value.length) === prefixEl.value) {
      return true;
    }
  }
  return false;
}

function finishUp() {
  progressEl.style="width: 0%";
  console.log(`Generated and parsed ${counter} keys...`);
  npubEl.value = npub;
  nsecEl.value =  nsec;
  publicEl.value = publickey;
  privateEl.value = privatekey;
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