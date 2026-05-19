const STORAGE_KEY = 'keyControlRecords';
const form = document.getElementById('keyForm');
const recordsBody = document.getElementById('recordsBody');
const recordCount = document.getElementById('recordCount');
const emptyMessage = document.getElementById('emptyMessage');

let records = [];

function loadRecords() {
  const saved = localStorage.getItem(STORAGE_KEY);
  records = saved ? JSON.parse(saved) : [];
}

function saveRecords() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

function formatTime(value) {
  if (!value) return '-';
  return value;
}

function renderRecords() {
  recordsBody.innerHTML = '';

  if (records.length === 0) {
    emptyMessage.style.display = 'block';
    recordCount.textContent = '0 registros';
    return;
  }

  emptyMessage.style.display = 'none';
  recordCount.textContent = `${records.length} registro${records.length === 1 ? '' : 's'}`;

  records.forEach((record) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${record.sector}</td>
      <td>${record.room}</td>
      <td>${record.responsible}</td>
      <td>${record.shift}</td>
      <td>${formatTime(record.pickupTime)}</td>
      <td>${formatTime(record.deliveryTime)}</td>
      <td>
        <button class="remove-button" data-id="${record.id}" type="button">Remover</button>
      </td>
    `;
    recordsBody.appendChild(row);
  });
}

function clearForm() {
  form.reset();
}

function validateForm() {
  const sector = form.sector.value.trim();
  const room = form.room.value.trim();
  const responsible = form.responsible.value.trim();
  const shift = form.shift.value;
  const pickupTime = form.pickupTime.value;
  const deliveryTime = form.deliveryTime.value;

  if (!sector || !room || !responsible || !shift || !pickupTime || !deliveryTime) {
    return false;
  }

  return true;
}

form.addEventListener('submit', (event) => {
  event.preventDefault();

  if (!validateForm()) {
    alert('Por favor preencha todos os campos antes de cadastrar.');
    return;
  }

  const record = {
    id: Date.now(),
    sector: form.sector.value,
    room: form.room.value,
    responsible: form.responsible.value.trim(),
    shift: form.shift.value,
    pickupTime: form.pickupTime.value,
    deliveryTime: form.deliveryTime.value,
  };

  records.push(record);
  saveRecords();
  renderRecords();
  clearForm();
});

recordsBody.addEventListener('click', (event) => {
  const target = event.target;
  if (target.matches('.remove-button')) {
    const id = Number(target.dataset.id);
    records = records.filter((record) => record.id !== id);
    saveRecords();
    renderRecords();
  }
});

loadRecords();
renderRecords();
