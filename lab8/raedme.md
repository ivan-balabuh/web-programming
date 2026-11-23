# Лабораторна робота №8
**Тема:** Робота з API-даними на TypeScript.

---

## 1. Мета роботи
Навчитися працювати з TypeScript (статична типізація, інтерфейси, класи) та компілювати код за допомогою збирача модулів Webpack. Закріпити навички асинхронної роботи з REST API з використанням архітектурного патерну Repository та модульної архітектури ES-модулів.

---

## 2. Хід виконання роботи

1. Створено окрему гілку `lab8` у локальному Git-репозиторії та організовано структуру каталогів проєкту (`lab8/index.html`, `lab8/src/scss/style.scss`, `lab8/src/models/Todo.ts`, `lab8/src/repositories/TodoRepository.ts`, `lab8/src/repositories/ApiTodoRepository.ts`, `lab8/src/index.ts`, `lab8/img/sprite.svg`).
2. Ініціалізовано Node.js-проєкт (`npm init -y`), встановлено залежності (`webpack`, `webpack-cli`, `typescript`, `ts-loader`, `sass`, `sass-loader`, `css-loader`, `style-loader`) та налаштовано конфігураційні файли `tsconfig.json`, `webpack.config.js` і скрипти збірки в `package.json`.
3. Описано інтерфейс моделі даних `Todo` у файлі `src/models/Todo.ts`, а також задано власний номер студента за журналом (`const USER_ID = 1;`) у файлі `src/index.ts`.
4. Виконано **Завдання 1** у файлі `src/repositories/TodoRepository.ts`:
   * створено інтерфейс `TodoRepository`, який визначає контракт для взаємодії з даними: `getAll()`, `add(todo: Todo)`, `update(id: string, data: Partial<Todo>)` та `remove(id: string)`.
5. Виконано **Завдання 2** у файлі `src/repositories/ApiTodoRepository.ts`:
   * реалізовано асинхронний метод `remove(id: string): Promise<void>`, який виконує `DELETE`-запит за адресою `${this.apiUrl}/${id}` та генерує виняток у разі помилки відповіді сервера (`!response.ok`).
6. Виконано **Завдання 3** у файлі `src/repositories/ApiTodoRepository.ts`:
   * реалізовано асинхронний метод `update(id: string, data: Partial<Todo>): Promise<Todo>`, який відправляє `PUT`-запит за адресою `${this.apiUrl}/${id}` із заголовком `"Content-Type": "application/json"`, серіалізованим тілом запиту та повертає оновлений об'єкт завдання у форматі JSON.
7. Зібрано проєкт за допомогою Webpack (`npm run dev` та фінальна продакшн-збірка `npm run build`), протестовано створення, редагування, зміну статусу виконання та видалення завдань у браузері.
8. Додано посилання на лабораторну роботу №8 у меню головної сторінки курсу `labs/index.html`, виконано злиття гілки `lab8` з основною гілкою `main`, відправлено зміни у віддалений репозиторій GitHub та перевірено оновлення проєкту на хостингу.

---

## 3. Лістинг коду (TypeScript)

### Інтерфейс репозиторію (`src/repositories/TodoRepository.ts`)
```typescript
import { Todo } from "../models/Todo";

export interface TodoRepository {
  getAll(): Promise<Todo[]>;
  add(todo: Todo): Promise<Todo>;
  update(id: string, data: Partial<Todo>): Promise<Todo>;
  remove(id: string): Promise<void>;
}
```

### Реалізація API-репозиторію (`src/repositories/ApiTodoRepository.ts`)
```typescript
import { Todo } from "../models/Todo";
import { TodoRepository } from "./TodoRepository";

export class ApiTodoRepository implements TodoRepository {
  private apiUrl = "[https://69b11abdadac80b427c3fff2.mockapi.io/api/v1/todoItem](https://69b11abdadac80b427c3fff2.mockapi.io/api/v1/todoItem)";

  async getAll(): Promise<Todo[]> {
    const response = await fetch(this.apiUrl);
    if (!response.ok) throw new Error("Помилка завантаження");
    return await response.json();
  }

  async add(todo: Todo): Promise<Todo> {
    const response = await fetch(this.apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(todo),
    });
    if (!response.ok) throw new Error("Помилка сервера");
    return await response.json();
  }

  // Завдання 3 — оновлення запису на сервері (PUT)
  async update(id: string, data: Partial<Todo>): Promise<Todo> {
    const response = await fetch(`${this.apiUrl}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Помилка оновлення запису");
    return await response.json();
  }

  // Завдання 2 — видалення запису із сервера (DELETE)
  async remove(id: string): Promise<void> {
    const response = await fetch(`${this.apiUrl}/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Помилка видалення запису");
  }
}
```

---


---

## 4. Відповіді на питання вихідного контролю

### 1. Які переваги дає статична типізація TypeScript під час формування об'єкта `taskData` порівняно зі звичайним JavaScript?
Статична типізація дозволяє перевірити відповідність структури об'єкта `taskData` інтерфейсу `Todo` ще на етапі написання та компіляції коду. Компілятор одразу попередить, якщо пропущено обов'язкову властивість, допущено помилку в назві поля або передано значення неправильного типу (наприклад, рядок замість числа для `userId`), що унеможливлює відправлення некоректних даних на сервер.

### 2. Для чого у проєкті використовуються інтерфейси `Todo` та `TodoRepository` і як компілятор відреагує на неповну реалізацію методів у класі `ApiTodoRepository`?
Інтерфейс `Todo` описує структуру даних окремого завдання, а `TodoRepository` виступає контрактом, що визначає перелік методів для роботи зі сховищем даних. Якщо клас `ApiTodoRepository` реалізує цей інтерфейс (`implements TodoRepository`), але в ньому відсутній хоча б один обов'язковий метод або не збігаються типи параметрів чи результату, компілятор TypeScript видасть помилку компіляції (`Property '...' is missing in type 'ApiTodoRepository'`) і не дозволить зібрати проєкт.

### 3. Чому при пошуку DOM-елементів у TypeScript вимагається приведення типів за допомогою ключового слова `as` (наприклад, `as HTMLFormElement`)?
Стандартний метод `document.getElementById()` повертає узагальнений тип `HTMLElement | null`, який містить лише базові властивості всіх HTML-тегів. Ключове слово `as` (Type Assertion) уточнює для компілятора конкретний тип елемента (наприклад, `HTMLFormElement` або `HTMLInputElement`), щоб отримати безпечний доступ до специфічних властивостей і методів, таких як `form.reset()`, `form.elements` або `input.value`.

### 4. Чому методи в інтерфейсі `TodoRepository` повертають значення, обгорнуті в `Promise`, і як це пов'язано з використанням асинхронної функції `fetch`?
HTTP-запити через мережу виконуються асинхронно, оскільки потребують часу на отримання відповіді від сервера. Функція `fetch` повертає `Promise`, а будь-яка `async`-функція в TypeScript/JavaScript автоматично обгортає результат свого виконання в `Promise` (наприклад, `Promise<Todo[]>` або `Promise<void>`), що дозволяє викликати методи репозиторію через `await` і коректно типізувати майбутній результат.

### 5. Яку функцію виконує вбудований тип `Partial<Todo>` у методі оновлення запису і чому його доцільно використовувати для `PUT`-запитів?
Утилітарний тип `Partial<Todo>` перетворює всі властивості інтерфейсу `Todo` на необов'язкові (`?`). Це доцільно при оновленні запису, оскільки дає змогу передавати в метод `update()` не лише повний об'єкт завдання під час редагування форми, а й лише окремі змінені поля — наприклад, `{ isDone: !isCurrentlyDone }` при перемиканні статусу виконання.

### 6. З якою метою властивість `apiUrl` у класі `ApiTodoRepository` оголошена з модифікатором доступу `private`?
Модифікатор `private` інкапсулює адресу сервера всередині класу `ApiTodoRepository`, забороняючи прямий доступ до неї чи її випадкову зміну ззовні (наприклад, із коду роботи з DOM у `index.ts`). Усі взаємодії з API відбуваються виключно через публічні методи класу.

### 7. У чому полягає суть архітектурного патерну "Repository" і чому логіка обробки DOM-подій звертається до методів репозиторію, а не викликає `fetch` напряму?
Суть патерну **Repository** полягає у відокремленні логіки отримання та збереження даних від бізнес-логіки та інтерфейсу користувача (DOM). Завдяки цьому файл `index.ts` працює лише з абстрактним інтерфейсом `TodoRepository` і не залежить від способу зберігання даних: за потреби джерело даних можна легко замінити (наприклад, з REST API на `LocalStorage`), створивши новий клас репозиторію без змін у коді інтерфейсу.

### 8. Яким чином механізм ES-модулів (`import` та `export`) допомагає структурувати проєкт на окремі логічні файли?
Ключове слово `export` відкриває доступ до інтерфейсів, класів або функцій за межами файлу, а `import` підключає їх лише там, де вони потрібні. Це дозволяє розбити застосунок на незалежні модулі зі своєю зоною відповідальності (моделі, репозиторії, стилі, головна логіка), уникає засмічення глобальної області видимості та спрощує підтримку коду.

### 9. Яку роль відіграють конфігураційні файли `tsconfig.json` та `webpack.config.js` і що відбувається з кодом після виконання команди `npm run build`?
* **`tsconfig.json`** визначає правила компіляції TypeScript у JavaScript (версію стандарту `ES2020`, строгу перевірку типів `strict`, алгоритм пошуку модулів).
* **`webpack.config.js`** задає точку входу (`./src/index.ts`), правила обробки файлів через лоадери (`ts-loader` для TypeScript, `sass-loader`, `css-loader` та `style-loader` для SCSS) і шлях збереження результату (`dist/bundle.js`).
* Після виконання команди **`npm run build`** Webpack компілює весь TypeScript і SCSS у стандартний JavaScript та CSS, об'єднує всі модулі в один оптимізований та мініфікований файл `dist/bundle.js`, готовий до публікації на хостингу.

### 10. Як за допомогою `fetch` відправити `DELETE`-запит та правильно обробити ситуацію, коли сервер повертає статус помилки?
Щоб виконати видалення, у `fetch` передається URL конкретного ресурсу з його ідентифікатором (`${this.apiUrl}/${id}`) та об'єкт налаштувань `{ method: "DELETE" }`. Оскільки `fetch` не відхиляє проміс при HTTP-помилках на кшталт `404` або `500`, необхідно явно перевірити властивість `response.ok` і, якщо вона дорівнює `false`, викинути виняток (`if (!response.ok) throw new Error(...)`), який буде перехоплено у блоці `try...catch` під час виклику методу.

---

## 6. Висновок
Під час виконання лабораторної роботи №8 було опановано розробку модульних веб-застосунків із використанням мови TypeScript, препроцесора SCSS та збирача модулів Webpack. На практиці застосовано статичну типізацію, інтерфейси та класи з модифікаторами доступу, реалізовано архітектурний патерн Repository для ізоляції роботи з REST API від логіки взаємодії з DOM-деревом, а також налаштовано збірку проєкту в єдиний бандл.