export const PALETTE = [
  '#fecaca', '#fca5a5', '#f87171', 
  '#fed7aa', '#fb923c', '#f97316', 
  '#fde68a', '#facc15', '#eab308', 
  '#d9f99d', '#a3e635', '#84cc16', 
  '#bbf7d0', '#4ade80', '#22c55e', 
  '#a7f3d0', '#34d399', '#10b981', 
  '#99f6e4', '#2dd4bf', '#14b8a6', 
  '#bae6fd', '#38bdf8', '#0ea5e9', 
  '#bfdbfe', '#60a5fa', '#3b82f6', 
  '#c7d2fe', '#818cf8', '#6366f1', 
  '#ddd6fe', '#a78bfa', '#8b5cf6', 
  '#fbcfe8', '#f472b6', '#ec4899', 
  '#fce7f3', '#f0abfc', '#d946ef', 
  '#e9d5ff', '#c084fc', '#a855f7', 
  '#d1d5db', '#9ca3af', '#6b7280', 
];


 
export const simpleHash = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; 
  }
  return Math.abs(hash);
};

export const getTextColorForBackground = (hexColor) => {
  const r = parseInt(hexColor.substring(1, 3), 16);
  const g = parseInt(hexColor.substring(3, 5), 16);
  const b = parseInt(hexColor.substring(5, 7), 16);

  const a = [r, g, b].map(function (v) {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  const luminance = a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;

  return luminance > 0.179 ? '#111827' : '#FFFFFF'; 
};