const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

const flows = {
  sales: [
    ['Новое обращение', 'Клиент оставил заявку на сайте'],
    ['Квалификация', 'ИИ определил объект и бюджет'],
    ['Задача в CRM', 'Менеджер получил карточку клиента'],
    ['3 сек', 'вместо 12 минут вручную']
  ],
  docs: [
    ['Получен документ', 'Смета поступила по электронной почте'],
    ['Проверка данных', 'Реквизиты и позиции распознаны'],
    ['Запись в реестр', 'Данные готовы для проверки сотрудником'],
    ['18 сек', 'вместо 20 минут вручную']
  ],
  reports: [
    ['Сбор показателей', 'Данные получены из трёх источников'],
    ['Сверка значений', 'Отклонения отмечены системой'],
    ['Готовый отчёт', 'Руководителю отправлена сводка'],
    ['1 мин', 'вместо 2 часов вручную']
  ]
};

document.querySelectorAll('.demo-tabs button').forEach((button) => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.demo-tabs button').forEach((b) => b.classList.remove('active'));
    button.classList.add('active');
    const data = flows[button.dataset.flow];
    const items = document.querySelectorAll('.flow-item');
    items.forEach((item, index) => {
      item.querySelector('strong').textContent = data[index][0];
      item.querySelector('span').textContent = data[index][1];
    });
    document.querySelector('.flow-result strong').textContent = data[3][0];
    document.querySelector('.flow-result small').textContent = data[3][1];
  });
});

document.getElementById('leadForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const button = form.querySelector('button[type="submit"]');
  const data = new FormData(form);
  button.disabled = true;
  button.textContent = 'Отправляем…';
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);
  try {
    const response = await fetch('/api/lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(Object.fromEntries(data.entries())),
      signal: controller.signal
    });
    if (!response.ok) throw new Error('Request failed');
    document.querySelector('.form-success').classList.add('show');
    form.reset();
    button.textContent = 'Заявка отправлена ✓';
  } catch {
    button.disabled = false;
    button.textContent = 'Заказать звонок ↗';
    alert('Не удалось отправить заявку. Позвоните нам: +7 967 822-90-79');
  } finally {
    clearTimeout(timeout);
  }
});

const menu = document.querySelector('.menu');
menu.addEventListener('click', () => {
  document.getElementById('solutions').scrollIntoView({ behavior: 'smooth' });
});
