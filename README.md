# alicesmaps — Задание 2

Expo-приложение на React Native, которое показывает полноэкранную карту, позволяет долгим нажатием добавлять метки, просматривать их детали и прикреплять изображения.
Добавлена локальная база SQLite и глобальный контекст Базы Данных для сохранения меток и изображений между запусками приложения.
Код строго типизирован TypeScript-интерфейсами.

---

## Быстрый старт

### Клонируем репозиторий и ставим зависимости

```bash
git clone https://github.com/alise-fox/alicesmaps2.git
cd alicesmaps2
```

### Node ≥ 18
```bash
npm install
```
### Устанавливаем Expo CLI (глобально или через npx)
```bash
npm install -g expo-cli
```

### Запускаем проект
```bash
npx expo start
```

## Документация схемы БД
| Таблица             | Колонки                                                                                                                                         | Особенности                                                      |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| **`markers`**       | `id INTEGER PK AUTOINCREMENT`  <br>`latitude REAL NOT NULL`  <br>`longitude REAL NOT NULL`  <br>`created_at DATETIME DEFAULT CURRENT_TIMESTAMP` | Хранит координаты точек                                          |
| **`marker_images`** | `id INTEGER PK AUTOINCREMENT`  <br>`marker_id INTEGER NOT NULL`  <br>`uri TEXT NOT NULL`  <br>`created_at DATETIME DEFAULT CURRENT_TIMESTAMP`   | `FOREIGN KEY (marker_id)` → **`markers.id`** `ON DELETE CASCADE` |

## Реализация и обработка ошибок
| Слой                               | Что происходит                                                                                        | Как ловим ошибки                                                                                    |
| ---------------------------------- | ----------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| **Инициализация** (`initDatabase`) | `openDatabaseAsync('markers.db')` → `withTransactionAsync { CREATE TABLE … }`                         | `try/catch` — ошибки схемы выводятся в `console.error` и сохраняются в `DatabaseContext.error`      |
| **CRUD-операции**                  | `runAsync / getAllAsync / withTransactionAsync`                                                       | каждая функция возвращает `Promise`; ошибки прокидываются наверх и показываются через `Alert.alert` |
| **Транзакции**                     | сложные операции (удаление маркера + его картинок) выполняются в `withTransactionAsync`, всё атомарно | Expo SQLite откатывает транзакцию автоматически при throw                                           |
| **Версионирование**                | версия хранится в `PRAGMA user_version`; при обновлении проверяем и выполняем миграцию                | пока одна версия (`1`), но каркас подготовлен                                                       |
| **Очистка соединения**             | при размонтировании провайдера вызываем `db.closeAsync?.()`                                           | если закрытие падает — сообщение в консоль, но приложение продолжает работу (safe-shutdown)         |
