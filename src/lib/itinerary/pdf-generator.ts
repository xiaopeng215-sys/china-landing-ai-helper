/**
 * Client-side PDF generation for itinerary export
 * Uses jsPDF + html2canvas to render the itinerary HTML to PDF
 */

import type { ItineraryRoute } from '@/data/types';

export function buildItineraryHTML(trip: ItineraryRoute): string {
  const TEAL = '#0D9488';
  const TEAL_LIGHT = '#CCFBF1';
  const AMBER = '#F59E0B';

  const activitiesHTML = trip.dayPlans
    .map(
      (day) => `
    <div class="day-block">
      <div class="day-header">
        <span class="day-num">Day ${day.day}</span>
        <span class="day-title">${day.titleEn ?? day.title}</span>
      </div>
      <p class="day-theme">${day.themeEn ?? day.theme}</p>
      <div class="activities">
        ${day.activities
          .map(
            (a) => `
          <div class="activity">
            <div class="activity-time">${a.time}</div>
            <div class="activity-body">
              <div class="activity-name">${a.nameEn}</div>
              <div class="activity-desc">${a.descriptionEn ?? a.description}</div>
              <div class="activity-meta">
                <span class="badge">${a.priceEn ?? a.price}</span>
                <span class="badge">${a.durationEn ?? a.duration}</span>
              </div>
            </div>
          </div>
        `
          )
          .join('')}
      </div>
      ${
        day.tips.length > 0
          ? `<div class="tips-box">
          <strong>💡 Tips</strong>
          <ul>${(day.tipsEn ?? day.tips).map((t) => `<li>${t}</li>`).join('')}</ul>
        </div>`
          : ''
      }
    </div>
  `
    )
    .join('');

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8"/>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: -apple-system, Arial, sans-serif; color: #1f2937; background: #fff; }
  .cover {
    background: linear-gradient(135deg, ${TEAL} 0%, #0f766e 100%);
    color: white; padding: 48px 40px; min-height: 200px;
  }
  .cover h1 { font-size: 32px; font-weight: 800; margin-bottom: 8px; }
  .cover .subtitle { font-size: 16px; opacity: 0.85; margin-bottom: 24px; }
  .cover .meta { display: flex; gap: 24px; flex-wrap: wrap; }
  .cover .meta-item { background: rgba(255,255,255,0.2); border-radius: 12px; padding: 10px 16px; }
  .cover .meta-item .label { font-size: 11px; opacity: 0.8; text-transform: uppercase; letter-spacing: 0.5px; }
  .cover .meta-item .value { font-size: 18px; font-weight: 700; }
  .tags { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 16px; }
  .tag { background: rgba(255,255,255,0.25); border-radius: 20px; padding: 4px 12px; font-size: 12px; }
  .section { padding: 32px 40px; }
  .section-title { font-size: 20px; font-weight: 700; color: ${TEAL}; border-bottom: 2px solid ${TEAL_LIGHT}; padding-bottom: 8px; margin-bottom: 20px; }
  .day-block { margin-bottom: 28px; }
  .day-header { display: flex; align-items: center; gap: 12px; margin-bottom: 4px; }
  .day-num { background: ${TEAL}; color: white; border-radius: 8px; padding: 4px 10px; font-size: 12px; font-weight: 700; }
  .day-title { font-size: 16px; font-weight: 700; color: #111827; }
  .day-theme { font-size: 13px; color: #6b7280; margin-bottom: 12px; margin-left: 2px; }
  .activities { display: flex; flex-direction: column; gap: 10px; }
  .activity { display: flex; gap: 12px; padding: 12px; background: #f9fafb; border-radius: 10px; border-left: 3px solid ${TEAL}; }
  .activity-time { font-size: 12px; color: ${TEAL}; font-weight: 600; min-width: 48px; padding-top: 2px; }
  .activity-body { flex: 1; }
  .activity-name { font-size: 14px; font-weight: 600; color: #111827; margin-bottom: 3px; }
  .activity-desc { font-size: 12px; color: #6b7280; margin-bottom: 6px; line-height: 1.5; }
  .activity-meta { display: flex; gap: 6px; }
  .badge { background: ${TEAL_LIGHT}; color: ${TEAL}; border-radius: 6px; padding: 2px 8px; font-size: 11px; font-weight: 500; }
  .tips-box { margin-top: 10px; background: #fffbeb; border: 1px solid #fde68a; border-radius: 10px; padding: 12px 14px; }
  .tips-box strong { font-size: 12px; color: ${AMBER}; display: block; margin-bottom: 6px; }
  .tips-box ul { padding-left: 16px; }
  .tips-box li { font-size: 12px; color: #92400e; margin-bottom: 3px; }
  .practical { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .practical-item { background: #f9fafb; border-radius: 10px; padding: 14px; }
  .practical-item .p-label { font-size: 11px; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; }
  .practical-item .p-value { font-size: 13px; color: #374151; }
  .footer { background: #f3f4f6; padding: 20px 40px; text-align: center; font-size: 12px; color: #9ca3af; }
  .footer strong { color: ${TEAL}; }
</style>
</head>
<body>
  <div class="cover">
    <h1>${trip.titleEn ?? trip.title}</h1>
    <p class="subtitle">${trip.subtitleEn ?? trip.subtitle}</p>
    <div class="meta">
      <div class="meta-item">
        <div class="label">Duration</div>
        <div class="value">${trip.days} Days</div>
      </div>
      <div class="meta-item">
        <div class="label">Budget</div>
        <div class="value">${trip.budget}</div>
      </div>
      <div class="meta-item">
        <div class="label">Best Season</div>
        <div class="value">${trip.bestSeasonEn ?? trip.bestSeason.split('/')[0]}</div>
      </div>
    </div>
    <div class="tags">
      ${(trip.themeEn ?? trip.theme).map((t) => `<span class="tag">${t}</span>`).join('')}
    </div>
  </div>

  <div class="section">
    <div class="section-title">📋 Overview</div>
    <p style="font-size:14px;color:#374151;line-height:1.7;">${trip.descriptionEn ?? trip.description}</p>
  </div>

  <div class="section" style="padding-top:0;">
    <div class="section-title">🗓️ Day-by-Day Itinerary</div>
    ${activitiesHTML}
  </div>

  <div class="section" style="padding-top:0;">
    <div class="section-title">ℹ️ Practical Info</div>
    <div class="practical">
      <div class="practical-item">
        <div class="p-label">🚇 Transport</div>
        <div class="p-value">${trip.practicalInfo.transport}</div>
      </div>
      <div class="practical-item">
        <div class="p-label">🌤️ Weather</div>
        <div class="p-value">${trip.practicalInfo.weather}</div>
      </div>
      <div class="practical-item">
        <div class="p-label">🍜 Food</div>
        <div class="p-value">${trip.practicalInfo.food}</div>
      </div>
      <div class="practical-item">
        <div class="p-label">🛡️ Safety</div>
        <div class="p-value">${trip.practicalInfo.safety}</div>
      </div>
    </div>
  </div>

  <div class="footer">
    Generated by <strong>TravelerLocal.ai</strong> · Your AI Travel Companion for China
  </div>
</body>
</html>`;
}

export async function downloadItineraryPDF(trip: ItineraryRoute): Promise<void> {
  // Dynamic import to avoid SSR issues
  const [{ default: jsPDF }, { default: html2canvas }] = await Promise.all([
    import('jspdf'),
    import('html2canvas'),
  ]);

  const html = buildItineraryHTML(trip);

  // Render in a hidden iframe
  const iframe = document.createElement('iframe');
  iframe.style.cssText = 'position:fixed;left:-9999px;top:-9999px;width:800px;height:1px;border:none;';
  document.body.appendChild(iframe);

  const iframeDoc = iframe.contentDocument!;
  iframeDoc.open();
  iframeDoc.write(html);
  iframeDoc.close();

  // Wait for fonts/images
  await new Promise((r) => setTimeout(r, 500));

  const body = iframeDoc.body;
  const fullHeight = body.scrollHeight;
  iframe.style.height = fullHeight + 'px';

  await new Promise((r) => setTimeout(r, 200));

  const canvas = await html2canvas(body, {
    scale: 2,
    useCORS: true,
    width: 800,
    windowWidth: 800,
  });

  document.body.removeChild(iframe);

  const imgData = canvas.toDataURL('image/jpeg', 0.92);
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'px', format: 'a4' });

  const pageW = pdf.internal.pageSize.getWidth();
  const pageH = pdf.internal.pageSize.getHeight();
  const imgW = pageW;
  const imgH = (canvas.height * pageW) / canvas.width;

  let yOffset = 0;
  let remaining = imgH;

  while (remaining > 0) {
    pdf.addImage(imgData, 'JPEG', 0, -yOffset, imgW, imgH);
    remaining -= pageH;
    yOffset += pageH;
    if (remaining > 0) pdf.addPage();
  }

  const filename = `${trip.cityEn}-${trip.days}day-itinerary.pdf`;
  pdf.save(filename);
}
