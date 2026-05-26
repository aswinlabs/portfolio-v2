export const themes = [
  {
    name: "Classic",
    className: "theme-classic",
    vars: {
      background: "#f8f0d8",
      foreground: "#8B5E3C",
      primary: "#6B8E23",
      text: "#333",
    },
  },
  {
    name: "Windows 95",
    className: "theme-windows95",
    vars: {
      background: "#c0c0c0",
      foreground: "#000000",
      primary: "#000080",
      text: "#000",
    },
  },
  {
    name: "Amber Terminal",
    className: "theme-amber",
    vars: {
      background: "#000000",
      foreground: "#ffbf00",
      primary: "#ff8000",
      text: "#ffbf00",
    },
  },
  {
    name: "DOS Blue",
    className: "theme-dos-blue",
    vars: {
      background: "#0000aa",
      foreground: "#ffffff",
      primary: "#55ffff",
      text: "#fff",
    },
  },
  {
    name: "Matrix",
    className: "theme-matrix",
    vars: {
      background: "#000000",
      foreground: "#00ff00",
      primary: "#009900",
      text: "#00ff00",
    },
  },
  {
    name: "OLED",
    className: "theme-oled",
    vars: {
      background: "#111111",
      foreground: "#eeeeee",
      primary: "#ff4c4c",
      text: "#eee",
    },
  },
  {
    name: "Commodore 64",
    className: "theme-c64",
    vars: {
      background: "#352879",
      foreground: "#6C5EB5",
      primary: "#F7E96B",
      text: "#fff",
    },
  },
  {
    name: "Apple II",
    className: "theme-appleii",
    vars: {
      background: "#000000",
      foreground: "#FF6A3A",
      primary: "#4AE029",
      text: "#FF6A3A",
    },
  },
  {
    name: "Game Boy Pocket",
    className: "theme-gbpocket",
    vars: {
      background: "#E2F3E4",
      foreground: "#8BAC0F",
      primary: "#306230",
      text: "#333",
    },
  },
  {
    name: "Peach Vintage",
    className: "theme-peach-vintage",
    vars: {
      background: "#fceee3",
      foreground: "#8B5E3C",
      primary: "#f7bfa0",
      text: "#4b2e2e",
    },
  },
  {
    name: "Retro Rose",
    className: "theme-retro-rose",
    vars: {
      background: "#ffe6ec",
      foreground: "#cc4e72",
      primary: "#ff99b3",
      text: "#4d002b",
    },
  },
  {
    name: "Sepia Toned",
    className: "theme-sepia-toned",
    vars: {
      background: "#f5ecd9",
      foreground: "#5c4324",
      primary: "#a68c5c",
      text: "#3b2d1f",
    },
  },
];

export type ThemeClassName = (typeof themes)[number]["className"];

export const defaultTheme = themes[0];

export const findTheme = (themeClass: string) => {
  return themes.find((theme) => theme.className === themeClass) || null;
};

export const applyTheme = (themeClass: string) => {
  const selectedTheme = findTheme(themeClass) || defaultTheme;
  const themeClasses = Array.from(document.body.classList).filter((className) =>
    className.startsWith("theme-")
  );

  document.body.classList.remove(...themeClasses);
  document.body.classList.add(selectedTheme.className);
  localStorage.setItem("theme", selectedTheme.className);

  return selectedTheme;
};

export const getSavedTheme = () => {
  if (typeof window === "undefined") return defaultTheme;
  return findTheme(localStorage.getItem("theme") || "") || defaultTheme;
};
