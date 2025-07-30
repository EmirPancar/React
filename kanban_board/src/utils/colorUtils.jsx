/**
 * Daha profesyonel, mat ve pastel tonlardan oluşan, genişletilmiş ve özenle seçilmiş renk paleti.
 * Bu renkler birbiriyle uyumlu ve göz yormayan tonlardadır.
 */
export const PALETTE = [
  '#fecaca', '#fca5a5', '#f87171', // Red
  '#fed7aa', '#fb923c', '#f97316', // Orange
  '#fde68a', '#facc15', '#eab308', // Amber
  '#d9f99d', '#a3e635', '#84cc16', // Lime
  '#bbf7d0', '#4ade80', '#22c55e', // Green
  '#a7f3d0', '#34d399', '#10b981', // Emerald
  '#99f6e4', '#2dd4bf', '#14b8a6', // Teal
  '#bae6fd', '#38bdf8', '#0ea5e9', // Sky
  '#bfdbfe', '#60a5fa', '#3b82f6', // Blue
  '#c7d2fe', '#818cf8', '#6366f1', // Indigo
  '#ddd6fe', '#a78bfa', '#8b5cf6', // Violet
  '#fbcfe8', '#f472b6', '#ec4899', // Pink
  '#fce7f3', '#f0abfc', '#d946ef', // Fuchsia
  '#e9d5ff', '#c084fc', '#a855f7', // Purple
  '#d1d5db', '#9ca3af', '#6b7280', // Gray
];

/**
 * Verilen bir string'i (örneğin, bir isim) deterministik bir şekilde
 * bir sayıya dönüştüren basit bir hash fonksiyonu.
 * @param {string} str - Hash'lenecek string.
 * @returns {number} - Pozitif bir tam sayı.
 */
export const simpleHash = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // 32bit integer'a dönüştür
  }
  return Math.abs(hash);
};

/**
 * Verilen bir hex renk kodunun algılanan parlaklığını (luminance) hesaplar.
 * Sonuca göre bu arka plan üzerinde en iyi okunacak metin rengini (siyah veya beyaz) döndürür.
 * @param {string} hexColor - #RRGGBB formatında renk kodu.
 * @returns {string} - Siyah ('#111827') veya beyaz ('#FFFFFF') renk kodu.
 */
export const getTextColorForBackground = (hexColor) => {
  // Hex'i RGB'ye çevir
  const r = parseInt(hexColor.substring(1, 3), 16);
  const g = parseInt(hexColor.substring(3, 5), 16);
  const b = parseInt(hexColor.substring(5, 7), 16);

  // Parlaklık formülü (WCAG standardına göre)
  // Renkleri 0-1 aralığına normalize et
  const a = [r, g, b].map(function (v) {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  const luminance = a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;

  // Parlaklık eşiğine göre renk seç (0.179 eşiği genellikle iyi sonuç verir)
  return luminance > 0.179 ? '#111827' : '#FFFFFF'; // Koyu Gri veya Beyaz
};