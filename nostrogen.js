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
const counterEl = document.getElementById("counter");

// lets
let worker;
let isPrefix = prefixRadioEl.checked;

function startWorker() {
  worker = new Worker('generator.js');
  worker.addEventListener('message', (e) => {
    // handle the received data
    if(e.data.counter) {
      counterEl.innerHTML = e.data.counter;
    }
    if(e.data.npub) {
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

// start looking...
async function generate() {
  progressEl.style="width: 100%";
  
  clear();
  startWorker();

  // gather the necessary data for the worker
  const prefix = prefixEl.value;
  const data = { prefix, isPrefix };
  
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