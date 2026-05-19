# MapMyMood v3

Оновлена версія сайту для подорожей.

## Що змінено

- Прибрана окрема вкладка **Backend** з навігації.
- Вхід / реєстрація / вихід з акаунта залишились.
- Обране, історія тестів і чернетки бронювань працюють через localStorage або Firebase, якщо заповнити `.env`.
- Matchmaker перероблено: бюджет, настрій, темп і клімат тепер мають різну вагу, а дорогі поїздки не отримують високий бал для малого бюджету.
- У деталях подорожі показується правильний Match Score саме за останнім тестом.
- Додано блок “Твій travel-профіль”, пояснення “Чому підходить” і кнопку **Здивуй мене**.
- Додано більше ідей подорожей: 20 напрямків.

## Запуск локально

```bash
npm install
npm run dev
```

## Оновлення GitHub Pages через /docs

```powershell
npm install
npm run build
if (Test-Path docs) { Remove-Item -Recurse -Force docs }
Copy-Item -Recurse dist docs
git add .
git commit -m "update MapMyMood v3"
git push
```

У GitHub Pages має бути:

- Source: Deploy from a branch
- Branch: main
- Folder: /docs
