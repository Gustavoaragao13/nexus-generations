// ==========================================================
// BANCO DE DADOS DE DOWNLOADS // MEDIA KIT NEXUS
// ==========================================================

const mediaAssets = [
  // --- CATEGORIA: MASCOTE ---
  {
    titulo: "Kitsunine // Render Oficial",
    categoria: "mascote",
    arquivo: "assets/mascote/mascote_01.png",
    fallback: "mascote.jpg",
    resolucao: "PNG // 300 DPI",
    formato: "PNG",
    badgeClass: "badge-purple",
    descricao: "Render oficial com canal alfa transparente para streamers e artes."
  },
  {
    titulo: "Kitsunine // Avatar Quadrado",
    categoria: "mascote",
    arquivo: "assets/mascote/mascote_02.png",
    fallback: "mascote.jpg",
    resolucao: "1000x1000",
    formato: "PNG",
    badgeClass: "badge-emerald",
    descricao: "Corte 1:1 perfeito para Discord, Steam e fotos de perfil."
  },

  // --- CATEGORIA: LOGO ---
  {
    titulo: "Logo Nexus // Emblema Ciano",
    categoria: "logo",
    arquivo: "assets/logo/logo_ciano.png",
    fallback: "mascote.jpg",
    resolucao: "VETOR / 4K",
    formato: "PNG",
    badgeClass: "badge-cyan",
    descricao: "Versão oficial com iluminação neon ciano e alta definição."
  },

  // --- CATEGORIA: WALLPAPERS ---
  {
    titulo: "Arena Nexus // Key Visual 4K",
    categoria: "wallpapers",
    arquivo: "assets/wallpapers/wall_01.jpg",
    fallback: "mascote.jpg",
    resolucao: "3840x2160",
    formato: "JPG",
    badgeClass: "badge-cyan",
    descricao: "Wallpaper widescreen ultra HD para monitores e televisores gamers."
  },

  // --- CATEGORIA: MOBILE ---
  {
    titulo: "Kitsunine // Lockscreen AMOLED",
    categoria: "mobile",
    arquivo: "assets/mobile/mobile_01.jpg",
    fallback: "mascote.jpg",
    resolucao: "1080x2400",
    formato: "JPG",
    badgeClass: "badge-pink",
    descricao: "Otimizado para telas 20:9 verticais de smartphones e stories."
  }
];

// DICA PARA QUANDO TIVER 150 IMAGENS SEQUENCIAIS:
// Se você tiver 150 imagens numeradas (ex: wall_1.jpg até wall_150.jpg),
// pode gerá-las automaticamente com este laço em segundos:
/*
for (let i = 1; i <= 150; i++) {
  mediaAssets.push({
    titulo: `Wallpaper Oficial #${String(i).padStart(3, '0')}`,
    categoria: "wallpapers",
    arquivo: `assets/wallpapers/wall_${i}.jpg`,
    fallback: "mascote.jpg",
    resolucao: "4K // 3840x2160",
    formato: "JPG",
    badgeClass: "badge-cyan",
    descricao: "Arte digital oficial da Arena Nexus Generations."
  });
}
*/