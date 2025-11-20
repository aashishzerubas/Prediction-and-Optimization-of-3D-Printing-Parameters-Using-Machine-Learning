/* ---------- Data & Persistence ---------- */
const PRICE = 250;
const STORAGE_KEY = 'train_booking_v1';

/* initialize seats 1..80 */
function makeInitialSeats(){
  const arr = [];
  for(let i=1;i<=80;i++){
    arr.push({seat_no: String(i), status:'available', passenger:null});
  }
  return arr;
}

/* load or create data in localStorage */
function loadState(){
  const raw = localStorage.getItem(STORAGE_KEY);
  if(!raw){
    const initial = makeInitialSeats();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
    return initial;
  }
  try{
    return JSON.parse(raw);
  }catch(e){
    const initial = makeInitialSeats();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
    return initial;
  }
}
function saveState(state){ localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }

/* ---------- UI rendering ---------- */
let state = loadState();
const seatContainer = document.getElementById('seat-container');
const selectedList = document.getElementById('selectedList');
const seatSelect = document.getElementById('seatSelect');
const passTableBody = document.querySelector('#passTable tbody');
const totalSeatsEl = document.getElementById('totalSeats');
const totalAmountEl = document.getElementById('totalAmount');
const payBtn = document.getElementById('payBtn');

let selectedSeats = new Set(); // ids (seat_no strings) currently selected (not yet assigned)

/* render seat grid */
function renderSeats(){
  seatContainer.innerHTML = '';
  state.forEach((s, idx) => {
    const div = document.createElement('div');
    div.className = 'seat';
    if(s.status==='available') div.classList.add('available');
    else div.classList.add('booked');

    div.textContent = s.seat_no;
    div.dataset.seat = s.seat_no;

    // click behavior
    if(s.status==='available'){
      div.addEventListener('click', ()=> {
        toggleSelect(s.seat_no);
      });
    }

    seatContainer.appendChild(div);

    if ((idx % 4) === 2) {
      const aisle = document.createElement('div');
      aisle.className = 'aisle';
      seatContainer.appendChild(aisle);
    }
  });
  updateSelectedList();
  renderPassengers();
  updateSummary();
}

/* toggle selection of an available seat */
function toggleSelect(seatNo){
  if(selectedSeats.has(seatNo)) selectedSeats.delete(seatNo);
  else selectedSeats.add(seatNo);
  updateSelectedList();
}

/* update selected list UI and seatSelect dropdown */
function updateSelectedList(){
  selectedList.innerHTML = '';
  seatSelect.innerHTML = '<option value="">(choose seat)</option>';
  const arr = Array.from(selectedSeats).sort((a,b)=>Number(a)-Number(b));
  if(arr.length===0){
    selectedList.textContent = '— none —';
  } else {
    arr.forEach(s=>{
      const chip = document.createElement('div');
      chip.className='chip';
      chip.textContent = s;
      selectedList.appendChild(chip);

      const opt = document.createElement('option');
      opt.value = s;
      opt.text = s;
      seatSelect.appendChild(opt);
    });
  }
  document.querySelectorAll('.seat').forEach(el=>{
    const sn = el.dataset.seat;
    el.classList.remove('selected');
    if(selectedSeats.has(sn)) el.classList.add('selected');
  });
}

/* render passenger assignments table */
function renderPassengers(){
  passTableBody.innerHTML = '';
  state.forEach(s=>{
    if(s.status==='booked' && s.passenger){
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${s.seat_no}</td><td>${escapeHtml(s.passenger.name)}</td><td>${s.passenger.age}</td><td>${escapeHtml(s.passenger.phone)}</td>`;
      passTableBody.appendChild(tr);
    }
  });
}

/* update total summary and pay button state */
function updateSummary(){
  const bookedCount = state.filter(s=>s.status==='booked').length;
  totalSeatsEl.textContent = bookedCount;
  totalAmountEl.textContent = `₹${bookedCount * PRICE}`;
  payBtn.disabled = bookedCount===0;
}

/* ---------- passenger assign flow ---------- */
const assignBtn = document.getElementById('assignBtn');
const clearSelBtn = document.getElementById('clearSelection');

assignBtn.addEventListener('click', ()=>{
  const seatNo = seatSelect.value;
  const name = document.getElementById('pName').value.trim();
  const age = document.getElementById('pAge').value.trim();
  const gender = document.getElementById('pGender').value;
  const phone = document.getElementById('pPhone').value.trim();

  if(!seatNo){ alert('Choose a seat from "Selected Seats".'); return; }
  if(!name || !age || !gender || !phone){ alert('Fill all passenger fields.'); return; }
  if(!/^\d{10}$/.test(phone)){ alert('Enter a valid 10-digit phone number.'); return; }
  const idx = state.findIndex(x=>x.seat_no===seatNo);
  if(idx===-1) { alert('Seat not found'); return; }

  state[idx].status = 'booked';
  state[idx].passenger = {name, age:Number(age), gender, phone};
  saveState(state);

  selectedSeats.delete(seatNo);
  document.getElementById('pName').value='';
  document.getElementById('pAge').value='';
  document.getElementById('pGender').value='';
  document.getElementById('pPhone').value='';
  updateSelectedList();
  renderSeats();
});

/* clear selection */
clearSelBtn.addEventListener('click', ()=>{
  selectedSeats.clear();
  updateSelectedList();
});

/* Pay Now simulation */
payBtn.addEventListener('click', ()=>{
  const bookedNow = state.filter(s => s.status==='booked' && s.passenger);
  if(bookedNow.length===0){ alert('No booked seats to pay for. Assign passengers first.'); return; }
  payBtn.disabled=true;
  payBtn.textContent='Processing...';
  setTimeout(()=>{
    payBtn.textContent='Pay Now';
    alert('Payment successful! Booking confirmed — check passengers list.');
    saveState(state);
    renderSeats();
  }, 1200);
});

/* Reset all bookings */
document.getElementById('resetBtn').addEventListener('click', ()=>{
  if(!confirm('Reset will clear all bookings & passenger data in this browser. Continue?')) return;
  state = makeInitialSeats();
  saveState(state);
  selectedSeats.clear();
  renderSeats();
});

/* escape HTML */
function escapeHtml(s){
  return String(s).replace(/[&<>"]/g, ch=>({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;" }[ch]));
}

/* initial render */
renderSeats();

/* live storage sync */
window.addEventListener('storage', (e)=>{
  if(e.key===STORAGE_KEY) {
    state = loadState();
    renderSeats();
  }
});
