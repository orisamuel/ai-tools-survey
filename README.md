# סקר שימוש בכלי AI — ארבעים ושתיים

טופס סקר לעובדי המשרד + דאשבורד אדמין לצפייה בתוצאות.
מבוסס על Google Sheets כדאטה-בייס, Apps Script כשרת, ו-GitHub Pages לפרונטנד.

## מבנה הקבצים

```
ai-tools-survey/
├── index.html      # טופס הסקר (פתוח לעובדים, ללא לוגין)
├── admin.html      # דאשבורד תוצאות (דורש לוגין)
├── login.html      # מסך כניסת אדמין
├── config.js       # SCRIPT_URL, רשימת כלים, צוותים, רמות שימוש
├── utils.js        # apiCall, theme, auth, toast
├── styles.css      # עיצוב מלא (dark/light, RTL, Heebo)
├── appscript.gs    # כל הבקאנד — להעתיק לעורך Apps Script
└── README.md
```

## איך לפרוס

### 1. צור Google Sheet

צור גיליון חדש ב-Google Drive. תן לו שם (למשל "סקר AI — ארבעים ושתיים").
אין צורך להעתיק ID — נחבר את הסקריפט לגיליון ישירות.

### 2. הדבק את הבקאנד

- בתוך הגיליון: **Extensions → Apps Script**.
- מחק את כל הקוד הקיים, הדבק את התוכן של [appscript.gs](appscript.gs).
- שמור (💾 Ctrl+S).
- **חשוב:** הסקריפט מצורף (container-bound) לגיליון הזה אוטומטית, ויקרא/יכתוב אליו ישירות. אין SHEET_ID לעדכן.

### 3. פרוס כ-Web App

- בעורך Apps Script: **Deploy → New deployment**.
- ⚙ → **Web app**.
- **Execute as:** Me
- **Who has access:** Anyone
- לחץ Deploy. אשר את ההרשאות.
- העתק את ה-Web app URL.

### 4. חבר את הפרונטנד

- פתח את `config.js`.
- הדבק את ה-URL מהשלב הקודם לתוך `SCRIPT_URL` (שורה 9).
- ב-`SHEETS_URL` (שורה 12) — החלף את `PASTE_SHEET_ID` ב-ID של הגיליון (החלק הארוך ב-URL בין `/d/` ל-`/edit`). זה רק כדי שכפתור "פתח גיליון" בדאשבורד יעבוד.

### 5. הגדר סיסמת אדמין

- אחרי הפריסה, גליון `settings` ייווצר אוטומטית עם:
  - `admin` / `changeme`
- שנה את הסיסמה ל-משהו אמיתי לפני שתשלח את הקישור.

### 6. העלה ל-GitHub Pages

- צור repo חדש ב-GitHub, העלה את התיקייה.
- **Settings → Pages → Branch:** main, root → Save.
- אחרי 1-2 דקות הסקר זמין ב-`https://<username>.github.io/<repo>/`.

### 7. שלח את הקישור לעובדים

- **קישור לטופס:** `https://<username>.github.io/<repo>/`
- **קישור לאדמין:** `https://<username>.github.io/<repo>/login.html`

---

## איך הדאטה נשמרת בגיליון

הסקיפט יוצר אוטומטית 3 גליונות:

### `responses`
שורה אחת לכל תשובה.
עמודות: `id`, `timestamp`, `name`, `role`, `team`, `ai_level`, `paid_from_pocket`, `pain_points`, `dream_tool`, `free_text`.

### `tool_responses`
שורה אחת לכל צמד עובד × כלי.
עמודות: `response_id`, `tool_name`, `is_custom`, `usage_level`, `effectiveness`, `daily_output`.

- `usage_level`: `never` / `rarely` / `weekly` / `daily` / `heavy`
- `effectiveness`: 1–5
- `daily_output`: מספר תוצרים ביום פעיל

### `settings`
שם משתמש וסיסמה לאדמין.

---

## הוספה / הסרה של כלים

הרשימה הראשית של כלים מופיעה בשני מקומות שצריך להיות תואמים:

1. `config.js` → `CONFIG.CORE_TOOLS` (מה שמשתמשים רואים).
2. `appscript.gs` → `CORE_TOOLS` (לייצוא ב-CSV).

הוסף את הכלי בשני המקומות, ופרוס מחדש את ה-Apps Script.

עובדים יכולים גם להוסיף בעצמם כלים שלא ברשימה (כפתור "הוסף כלי" בסוף סקציית הכלים).

---

## חשוב לדעת

- **כל שינוי ב-appscript.gs דורש פריסה מחדש:**
  Deploy → Manage deployments → ✏ Edit → Version: New version → Deploy.
  אחרת ה-URL הקיים ימשיך לשרת את הקוד הישן.
- **אבטחה:** הלוגין הוא טקסט פתוח בגיליון. מתאים לסביבה פנימית בלבד. אל תשתמש בזה לדאטה רגיש שמעבר לכאב המשרדי הזה.
- **הטופס עצמו פתוח לכל מי שיש לו את הקישור** — אין צורך בלוגין מצד העובד. אם תרצה להגביל, אפשר להוסיף `requireAuth()` בתחילת ה-`<script>` ב-`index.html`.

---

## ייצוא CSV

בדאשבורד יש כפתור "ייצוא CSV". מייצא טבלה רחבה: עמודה לכל שילוב של כלי × שדה (`Midjourney__usage`, `Midjourney__effectiveness`, וכו'). ה-CSV נפתח טוב ב-Excel בעברית.
