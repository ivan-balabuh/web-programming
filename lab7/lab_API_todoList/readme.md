Причина в тому, що всередині загального блоку коду був вкладений блок із трьома лапками (````javascript`) — через це розмітка розірвалася на половині, і кнопка **«Копіювати»** скопіювала лише першу частину звіту (без результатів, відповідей на 10 запитань та висновку).

Нижче — **повний файл звіту** в одному цілісному блоці (обгорнутий у чотири лапки, щоб нічого не обрізалося при копіюванні):

```markdown
# Лабораторна робота №7
**Тема:** Завантаження даних з публічного API та відображення на сторінці.

---

## 1. Мета роботи
Навчитися виконувати HTTP-запити з використанням Fetch API, отримувати дані у форматі JSON, обробляти відповіді сервера та відображати інформацію на веб-сторінці з використанням `Promise`, `then/catch` та синтаксису `async/await` для роботи з асинхронними операціями.

---

## 2. Хід виконання роботи

1. Створено окрему гілку `lab7` у локальному Git-репозиторії та організовано структуру каталогів лабораторної роботи (`lab7/index.html`, `lab7/css/style.css`, `lab7/js/index.js`, `lab7/img/sprite.svg`).
2. Запущено веб-застосунок та перевірено початкове завантаження списку завдань з публічного REST API (MockAPI) із відображенням індикатора завантаження.
3. У файлі `lab7/js/index.js` задано власний порядковий номер студента у журналі для константи `USER_ID` та протестовано створення нових записів (`POST`-запит) зі збереженням даних на сервері після перезавантаження сторінки.
4. Виконано **Завдання 1** у файлі `lab7/js/index.js`:
   * реалізовано асинхронний `fetch`-запит із методом `DELETE` за адресою `${API_URL}/${taskId}`;
   * додано перевірку успішності відповіді (`response.ok`), видалення відповідної картки зі сторінки (`card.remove()`) та обробку помилок за допомогою конструкції `try...catch`.
5. Виконано **Завдання 2** у файлі `lab7/js/index.js`:
   * реалізовано асинхронний `fetch`-запит із методом `PUT` за адресою `${API_URL}/${currentEditId}` із заголовком `"Content-Type": "application/json"` та серіалізованим тілом запиту `JSON.stringify(taskData)`;
   * після успішного оновлення запису на сервері налаштовано повторне завантаження списку завдань (`await fetchTodos()`) та скидання стану форми (`resetFormState()`) із обробкою помилок у блоці `try...catch`.
6. Створено тестові завдання та перевірено коректність роботи всіх CRUD-операцій (отримання, створення, редагування, зміна статусу виконання та видалення записів) у браузері та на вкладці **Network** у Chrome Developer Tools.
7. Додано посилання на лабораторну роботу №7 у меню головної сторінки курсу `labs/index.html`, виконано злиття гілки `lab7` з основною гілкою `main`, відправлено зміни у віддалений репозиторій GitHub та перевірено оновлення проєкту на хостингу Netlify.

---

## 3. Лістинг коду (JavaScript)

Фрагмент файлу `lab7/js/index.js` із реалізацією завдань 1 та 2 (видалення та редагування записів через Fetch API):

```javascript
const API_URL = "https://69b11abdadac80b427c3fff2.mockapi.io/api/v1/todoItem";

// Номер студента за журналом
const USER_ID = 1;

document.addEventListener("DOMContentLoaded", () => {
  const mainHeader = document.getElementById("mainHeader");
  if (mainHeader) mainHeader.textContent += ` - Студент #${USER_ID}`;

  const form = document.getElementById("todoForm");
  const list = document.getElementById("todoList");
  const template = document.getElementById("task-template");
  const submitBtn = form.querySelector('button[type="submit"]');
  const loadingIndicator = document.getElementById("loadingIndicator");

  let isEditing = false;
  let currentEditId = null;

  async function fetchTodos() {
    loadingIndicator.style.display = "block";
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("Помилка завантаження");
      const data = await response.json();

      list.innerHTML = "";
      data.forEach((task) => addTaskToDOM(task, true));
    } catch (error) {
      console.error(error);
      alert("Не вдалося завантажити завдання з сервера.");
    } finally {
      loadingIndicator.style.display = "none";
    }
  }

  // ... (допоміжні функції formatDate та addTaskToDOM) ...

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(form);

    const taskData = {
      userId: USER_ID,
      title: formData.get("title"),
      description: formData.get("description"),
      tag: formData.get("tag"),
      deadline: formData.get("deadline"),
      createdAt: isEditing ? undefined : Math.floor(Date.now() / 1000),
      isDone: false,
    };

    submitBtn.disabled = true;

    if (isEditing && currentEditId) {
      // Завдання 2 — збереження відредагованих даних на сервері (PUT)
      try {
        const response = await fetch(`${API_URL}/${currentEditId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(taskData),
        });

        if (!response.ok) throw new Error("Помилка оновлення запису");

        await fetchTodos();
        resetFormState();
      } catch (error) {
        console.error("Помилка оновлення:", error);
        alert("Не вдалося оновити запис.");
      }
    } else {
      // Створення нового запису (POST)
      try {
        const response = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(taskData),
        });

        if (!response.ok) throw new Error("Помилка сервера");

        const createdTask = await response.json();
        addTaskToDOM(createdTask);
        form.reset();
      } catch (error) {
        console.error("Помилка створення:", error);
        alert("Не вдалося створити запис.");
      }
    }
    submitBtn.disabled = false;
  });

  list.addEventListener("click", async (event) => {
    const btn = event.target.closest(".btn");
    if (!btn) return;

    const card = btn.closest(".task-card");
    const taskId = card.dataset.id;

    // Завдання 1 — видалення запису із сервера (DELETE)
    if (btn.classList.contains("btn--delete")) {
      if (confirm("Видалити цю задачу з сервера?")) {
        try {
          const response = await fetch(`${API_URL}/${taskId}`, {
            method: "DELETE",
          });

          if (!response.ok) throw new Error("Помилка видалення запису");

          card.remove();
        } catch (error) {
          console.error("Помилка видалення:", error);
          alert("Не вдалося видалити запис.");
        }
      }
    }

    // ... (обробка кнопок btn--complete та btn--edit-action) ...
  });

  fetchTodos();
});
```

---

## 4. Результати роботи 

![](./img1/Знімок%20екрана%202026-11-23%20о%2014.21.45.png)

![](./img1/Знімок%20екрана%202026-11-23%20о%2014.22.18.png)

![](./img1/Знімок%20екрана%202026-11-23%20о%2014.23.07.png)

---

## 5. Відповіді на питання вихідного контролю

### 1. Що таке API і для чого воно використовується у веброзробці?
**API (Application Programming Interface)** — це прикладний програмний інтерфейс, який визначає набір правил і протоколів для взаємодії між різними програмами. У веброзробці API використовується для обміну даними між клієнтською частиною (браузером) та віддаленим сервером за допомогою HTTP-запитів.

### 2. Що таке REST API?
**REST (Representational State Transfer)** — це архітектурний стиль побудови веб-сервісів, за якого кожен ресурс на сервері має власну унікальну адресу (URL), а всі операції з даними виконуються за допомогою стандартних HTTP-методів.

### 3. Які HTTP-методи використовуються для роботи з ресурсами?
Основними HTTP-методами для роботи з ресурсами в REST API є:
* `GET` — отримання списку записів або одного конкретного запису;
* `POST` — створення нового запису на сервері;
* `PUT` (та `PATCH`) — оновлення існуючого запису;
* `DELETE` — видалення запису із сервера.

### 4. Яке призначення Fetch API?
**Fetch API** — це вбудований у сучасні браузери інтерфейс мови JavaScript, призначений для асинхронного виконання мережевих HTTP-запитів до серверів та обробки отриманих відповідей без перезавантаження веб-сторінки.

### 5. Що повертає функція `fetch()`?
Функція `fetch()` повертає об'єкт **`Promise`**, який після завершення мережевого запиту переходить у стан виконання (`fulfilled`) і повертає об'єкт відповіді **`Response`**, що містить статус запиту (`status`, `ok`), заголовки та тіло відповіді.

### 6. Яка різниця між використанням `then/catch` та `async/await`?
Обидва підходи працюють із промісами (`Promise`), але відрізняються синтаксисом та зручністю читання:
* **`then/catch`** будує ланцюжок колбек-функцій (`.then()` для обробки успішного результату, `.catch()` для перехоплення помилок), що при складній логіці може призводити до громіздкої вкладеності;
* **`async/await`** є синтаксичною надбудовою над промісами, яка дозволяє писати асинхронний код лінійно — майже так само, як звичайний синхронний код, а помилки обробляти стандартним блоком `try...catch`.

### 7. Який формат даних найчастіше використовується при передачі даних через API?
Найчастіше використовується текстовий формат **JSON (JavaScript Object Notation)**, оскільки він компактний, зрозумілий для людини та легко перетворюється у стандартні об'єкти JavaScript і навпаки.

### 8. Для чого використовується метод `response.json()`?
Метод `response.json()` асинхронно зчитує потік даних із тіла HTTP-відповіді сервера та парсить отриманий JSON-рядок у повноцінний JavaScript-об'єкт або масив об'єктів (повертаючи `Promise`).

### 9. Яка структура ресурсу `todoItem` у даному API?
Кожен об'єкт ресурсу `todoItem` містить такі поля:
* `id` (`ObjectID` / рядок з числом) — унікальний ідентифікатор запису;
* `userId` (`Number`) — ідентифікатор користувача (номер студента в журналі);
* `title` (`String`) — назва завдання;
* `description` (`String`) — детальний опис завдання;
* `isDone` (`Boolean`) — статус виконання (`true` або `false`);
* `tag` (`String`) — категорія (тег) завдання;
* `deadline` (`Date` / рядок) — дата завершення;
* `createdAt` (`Date` / мітка часу) — дата створення запису.

### 10. Які операції можна виконувати з ресурсом у REST API?
З ресурсом у REST API можна виконувати повний набір операцій **CRUD**:
* **Create** (створення нового запису — `POST`);
* **Read** (читання списку записів або одного запису за ідентифікатором — `GET`);
* **Update** (оновлення даних існуючого запису — `PUT` / `PATCH`);
* **Delete** (видалення запису — `DELETE`).

---

## 6. Висновок
Під час виконання лабораторної роботи №7 було опановано принципи взаємодії веб-застосунків із віддаленими серверами за архітектурою REST API з використанням вбудованого інтерфейсу Fetch API. На практиці реалізовано асинхронні HTTP-запити (`GET`, `POST`, `PUT`, `DELETE`) із застосуванням синтаксису `async/await` та обробкою винятків через `try...catch`, налаштовано парсинг і серіалізацію даних у форматі JSON, а також забезпечено динамічне оновлення DOM-дерева сторінки відповідно до стану даних на сервері.

```