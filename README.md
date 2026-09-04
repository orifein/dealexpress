# DEAL EXPRESS

אתר דילים בעברית (RTL) — Next.js 16 App Router, TypeScript, Tailwind.

הסיסמה: **דיל אקספרס — כי בארץ זה סתם יקר**
המחיר **הסופי** בשקלים (≈ ₪) הוא הראשי בכרטיס כשקיים `landedIls`.

קישורי קנייה נושאים תגי שותפים אמיתיים:
- Amazon.com `tag=dealexpress20-20`
- Amazon.de `tag=dealexpress21-21`
- iHerb `rcode=DBO0874`
- AliExpress — קישור `https://s.click.aliexpress.com/e/_...` שנוצר ידנית ב-AliExpress Affiliate Portal (portals.aliexpress.com) עבור כל מוצר. **חשוב:** הוספת `tracking_id=deal_express`/`gatewayAdapt=glo2isr` לקישור מוצר רגיל **אינה** מהווה שיוך שותפים אמיתי — זה לא נתפס ע"י AliExpress בתור מכירה מזוהה. אסור לפרסם דיל AliExpress חדש בלי קישור `s.click.aliexpress.com` אמיתי מה-Portal; ראו `lib/affiliate.ts` וסוכן ה-QA.

## פיתוח

```bash
npm install
npm run dev
npm run build
```

קישור קבוצת הפייסבוק: `https://www.facebook.com/groups/dealexpress/`
(משתנה `NEXT_PUBLIC_FACEBOOK_URL`, ראו `.env.example`)

דילים אמיתיים ודוגמאות יושבים ב־`content/deals/`.
