// consts
const prefixEl = document.getElementById("prefix");
const progressEl = document.querySelector(".progress-bar");
const npubEl = document.getElementById("npub");
const nsecEl = document.getElementById("nsec");
const publicEl = document.getElementById("public");
const privateEl = document.getElementById("private");
const timeEl = document.getElementById("time");

// lets
let found = false;
let counter = 0;
let privatekey = window.NostrTools.generatePrivateKey();
let publickey = window.NostrTools.getPublicKey(privatekey);
let nsec = window.NostrTools.nip19.nsecEncode(privatekey);
let npub = window.NostrTools.nip19.npubEncode(publickey);

// disallow b's, i's, o's, and 1's
prefixEl.onkeypress = function(e) {
  var chr = String.fromCharCode(e.which);
  if ("acdefghjklmnpqrstuvwxyz234567890".indexOf(chr) < 0)
      return false;
};

// start looking...
async function generate() {
  progressEl.style="width: 100%";
  setTimeout(() => {
    clear();
    console.log(`Looking for prefix: ${prefixEl.value}`);
    let start = Date.now();
    while (!found) {
      console.log(npub.length)
      if (counter % 1000 === 0) {
        console.log(`Generated and parsed ${counter} keys...`);
      }
      if (npub.substring(5, 5 + prefixEl.value.length) === prefixEl.value) {
        found = true;
        progressEl.style="width: 0%";
        console.log(`npub: ${npub}`);
        console.log(`nsec: ${nsec}`);
        console.log(`Public Key: ${publickey}`);
        console.log(`Private Key: ${privatekey}`);
        console.log(`Generated and parsed ${counter} keys...`);
        npubEl.value = npub;
        nsecEl.value =  nsec;
        publicEl.value = publickey;
        privateEl.value = privatekey;
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
  }, 10)
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