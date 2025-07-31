const userForm = document.getElementById('user-form');
const expenseSection = document.getElementById('expense-section');
const userNameInput = document.getElementById('user-name');
const monthlyBudgetInput = document.getElementById('monthly-budget');
const displayName = document.getElementById('display-name');
const budgetAmountEl = document.getElementById('budget-amount');
const remainingAmountEl = document.getElementById('remaining-amount');

const form = document.getElementById('expense-form');
const desc = document.getElementById('desc');
const amount = document.getElementById('amount');
const list = document.getElementById('expense-list');
const totalEl = document.getElementById('total');
const submitBtn = document.getElementById('submit-btn');

let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
let userInfo = JSON.parse(localStorage.getItem('userInfo')) || null;
let editIndex = null;

function formatDateTime() {
  const now = new Date();
  const date = now.toLocaleDateString();
  const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const month = now.toLocaleString('default', { month: 'long' });
  return `${date} ${time} (${month})`;
}

function updateList() {
  list.innerHTML = '';
  let total = 0;
  expenses.forEach((item, index) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <span>${item.desc} - ₹${item.amount} on ${item.datetime}</span>
      <div class="actions">
        <button class="like-btn">❤️</button>
        <button class="edit-btn" onclick="editExpense(${index})">✏️</button>
        <button class="delete-btn" onclick="deleteExpense(${index})">🗑️</button>
      </div>
    `;
    list.appendChild(li);
    total += Number(item.amount);
  });
  totalEl.textContent = total.toFixed(2);
  remainingAmountEl.textContent = (userInfo.budget - total).toFixed(2);
  localStorage.setItem('expenses', JSON.stringify(expenses));
}

function editExpense(index) {
  desc.value = expenses[index].desc;
  amount.value = expenses[index].amount;
  editIndex = index;
  submitBtn.textContent = "🔁 Update Expense";
}

function deleteExpense(index) {
  expenses.splice(index, 1);
  updateList();
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (editIndex !== null) {
    expenses[editIndex].desc = desc.value;
    expenses[editIndex].amount = amount.value;
    expenses[editIndex].datetime = formatDateTime();
    editIndex = null;
    submitBtn.textContent = "➕ Add Expense";
  } else {
    expenses.push({
      desc: desc.value,
      amount: amount.value,
      datetime: formatDateTime()
    });
  }
  desc.value = '';
  amount.value = '';
  updateList();
});

userForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = userNameInput.value;
  const budget = Number(monthlyBudgetInput.value);
  userInfo = { name, budget };
  localStorage.setItem('userInfo', JSON.stringify(userInfo));
  showExpenseSection();
});

function showExpenseSection() {
  displayName.textContent = userInfo.name;
  budgetAmountEl.textContent = userInfo.budget.toFixed(2);
  expenseSection.style.display = 'block';
  userForm.style.display = 'none';
  updateList();
}

if (userInfo) {
  showExpenseSection();
}
