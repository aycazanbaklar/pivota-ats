/**
 * Teslim için ekran görüntüsü alır (yeni özellik değil, yalnızca kayıt aracı).
 * Çalıştırma: node scripts/capture-screenshots.mjs
 */
import { mkdir } from "node:fs/promises";
import puppeteer from "puppeteer-core";

const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const BASE = "http://localhost:3000";
const OUT = "docs/screenshots";

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

async function signIn(page, email) {
  await page.goto(`${BASE}/giris`, { waitUntil: "networkidle2" });
  await page.waitForSelector("#email");
  await page.type("#email", email);
  await page.type("#password", "password1");
  await Promise.all([
    page.click('form button[type="submit"]'),
    page.waitForNavigation({ waitUntil: "networkidle2" }).catch(() => {}),
  ]);
  await wait(2500);
}

async function signOut(page) {
  await page.evaluate(() => {
    Object.keys(localStorage).forEach((k) => localStorage.removeItem(k));
  });
  const cookies = await page.browserContext().cookies();
  await page.browserContext().deleteCookie(...cookies);
}

/** Next.js geliştirme göstergesi teslim görsellerinde görünmesin (yalnızca yakalama sırasında) */
const hideDevOverlay = (page) =>
  page
    .addStyleTag({ content: "nextjs-portal{display:none !important}" })
    .catch(() => {});

const shot = async (page, name) => {
  await hideDevOverlay(page);
  await page.screenshot({ path: `${OUT}/${name}.png` });
  console.log("✓", name);
};

const run = async () => {
  await mkdir(OUT, { recursive: true });
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: "new",
    args: ["--no-sandbox", "--hide-scrollbars"],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });

  /* ---------- 1. Mobil aday başvurusu (375px) ---------- */
  await page.setViewport({
    width: 375,
    height: 812,
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });
  await page.goto(`${BASE}/jobs/ILN-2026-014/apply`, { waitUntil: "networkidle2" });
  await wait(1200);
  await shot(page, "01-mobil-basvuru-ilan-ozeti");

  await page.click('form button[type="submit"]');
  await wait(1000);
  await page.evaluate(() => {
    const button = [...document.querySelectorAll("button")].find((b) =>
      b.innerText.trim().startsWith("LinkedIn ile doldur"),
    );
    button?.click();
  });
  await wait(2200);
  await shot(page, "02-mobil-basvuru-kisisel-bilgiler");

  await page.click('form button[type="submit"]');
  await wait(1200);
  await shot(page, "03-mobil-basvuru-cv-ve-profil");

  /* ---------- 2. Pipeline — üç rol görünümü (masaüstü) ---------- */
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });

  await signIn(page, "uzman@pivota.test");
  await shot(page, "04-pipeline-ik-uzmani-board");

  // Açık aday detay paneli
  await page.evaluate(() => {
    const card = document.querySelector('button[aria-label*="Detay panelini"]');
    card?.click();
  });
  await wait(1400);
  await shot(page, "05-aday-detay-paneli");
  await page.keyboard.press("Escape");
  await wait(600);

  await signOut(page);
  await signIn(page, "yonetici@pivota.test");
  await shot(page, "06-pipeline-hiring-manager-bekleyen-aksiyonlar");

  // Hiring manager scorecard paneli
  await page.evaluate(() => {
    document.querySelector("li button")?.click();
  });
  await wait(1400);
  await shot(page, "07-hiring-manager-scorecard-paneli");
  await page.keyboard.press("Escape");
  await wait(600);

  await signOut(page);
  await signIn(page, "mudur@pivota.test");
  await shot(page, "08-pipeline-ik-yoneticisi-kpi");

  await browser.close();
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
