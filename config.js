/**
 * config.js — frontend configuration
 * Edit values here only. Same file is loaded by every page.
 */
const CONFIG = {

    // ── Google Apps Script web-app URL ───────────────────────
    // Paste the URL from: Apps Script editor → Deploy → Manage deployments
    SCRIPT_URL: 'PASTE_YOUR_DEPLOYED_SCRIPT_URL_HERE',

    // ── Direct link to the underlying Sheet (for "Open Sheet" buttons) ─
    SHEETS_URL: 'https://docs.google.com/spreadsheets/d/PASTE_SHEET_ID/edit',

    // ── App identity ─────────────────────────────────────────
    APP_NAME:     'סקר שימוש בכלי AI',
    APP_SUBTITLE: 'ארבעים ושתיים — סוכנות דיגיטל ופרסום',

    // ── Survey config ────────────────────────────────────────
    // Must match CORE_TOOLS in appscript.gs.
    CORE_TOOLS: [
        { name: 'ChatGPT',    category: 'טקסט',  emoji: '💬' },
        { name: 'Claude',     category: 'טקסט',  emoji: '🤖' },
        { name: 'Gemini',     category: 'טקסט',  emoji: '✨' },
        { name: 'Midjourney', category: 'תמונה', emoji: '🎨' },
        { name: 'Hedra',      category: 'וידאו', emoji: '🎬' },
        { name: 'Kling',      category: 'וידאו', emoji: '🎞️' },
        { name: 'ElevenLabs', category: 'אודיו', emoji: '🎤' },
        { name: 'Suno',       category: 'אודיו', emoji: '🎵' },
    ],

    USAGE_LEVELS: [
        { value: 'never',  label: 'לא משתמש/ת' },
        { value: 'rarely', label: 'נדיר — פחות מפעם בשבוע' },
        { value: 'weekly', label: 'שבועי — מספר פעמים בשבוע' },
        { value: 'daily',  label: 'יומי — כמעט כל יום' },
        { value: 'heavy',  label: 'כבד — כל היום, כל הזמן' },
    ],

    EFFECTIVENESS_LABELS: {
        1: 'חלש מאוד',
        2: 'בסדר, יש יותר טובים',
        3: 'עושה את העבודה',
        4: 'טוב מאוד',
        5: 'אי אפשר בלי',
    },

    TEAMS: [
        'קריאייטיב / עיצוב',
        'פרודקשן / וידאו',
        'סטרטגיה / אקאונט / קופי',
        'אופרציות / טראפיק / משרד',
        'מנהל/ת / ראש צוות',
        'אחר',
    ],

    AI_LEVELS: [
        'מתחיל/ה — שמעתי על זה',
        'בסיסי — משתמש/ת בכלי-שניים',
        'מתקדם/ת — חי/ה את זה יומיום',
        'אקספרט/ית — מלמד/ת אחרים',
    ],

    PAIN_POINTS: [
        'משלם/ת על מנויים שכמעט לא נוגע/ת בהם',
        'חסר לי כלי שיש לקולגה אבל אין לי',
        'עובד/ת בין הרבה טאבים, מאבד/ת את עצמי',
        'האסטים הולכים לאיבוד, אין סידור',
        'אין דרך להראות לקולגה איך הגעתי לתוצאה',
        'בריפים סודיים זורמים לכלי לא ברור',
        'חיוב פר לקוח / פרויקט בלתי אפשרי',
        'קימוץ ב-credits — שולח/ת לכלי חלש כי חבל',
    ],

    // ── Theme ────────────────────────────────────────────────
    DEFAULT_THEME: 'dark',
};
