// ==========================================
// 1. IMPORTAÇÕES DO FIREBASE (TODAS NO TOPO)
// ==========================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  updatePassword,
  GoogleAuthProvider,
  signInWithPopup
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
  getFirestore,
  collection,
  addDoc,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// ==========================================
// 2. CONFIGURAÇÃO OFICIAL NEXUS GENERATIONS
// ==========================================
const firebaseConfig = {
  apiKey: "AIzaSyAvvzEngDXzS2aagzs0N0ylMDCjnJdm-mo",
  authDomain: "nexus-generations.firebaseapp.com",
  projectId: "nexus-generations",
  storageBucket: "nexus-generations.firebasestorage.app",
  messagingSenderId: "822576999757",
  appId: "1:822576999757:web:4ce7933942d8cf332d9b04"
};

// ==========================================
// 3. INICIALIZAÇÃO CONTROLADA
// ==========================================
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

// ==========================================
// 4. CONFIGURAÇÃO VISUAL DAS GUILDAS & PATENTES
// ==========================================
const guildConfig = {
  semideuses: { name: "CHALÉ DOS SEMIDEUSES", class: "guild-semideuses", icon: "bi-fire" },
  bruxos:     { name: "ORDEM DOS BRUXOS",     class: "guild-bruxos",     icon: "bi-stars" },
  patrulha:   { name: "GUARDA DA NOITE",      class: "guild-patrulha",   icon: "bi-shield-fill-x" },
  runners:    { name: "CYBORG RUNNERS",       class: "guild-runners",    icon: "bi-cpu-fill" },
  neutro:     { name: "SEM FAÇÃO",           class: "guild-neutro",     icon: "bi-shield-shaded" }
};

window.applyGuildBadge = function(guildKey) {
  let badge = document.getElementById('holoGuildTag');
  if (!badge) {
    badge = document.querySelector('.badge-guild-tag');
  }
  if (!badge) return;

  const conf = guildConfig[guildKey] || guildConfig.neutro;

  badge.className = 'badge-guild-tag ' + conf.class;
  badge.innerHTML = `<i class="bi ${conf.icon}"></i> <span id="holoGuildText">${conf.name}</span>`;

  const select = document.getElementById('selectPlayerFaction');
  if (select) select.value = guildKey;
};

function getTitleByLevel(lvl) {
  if (lvl >= 99) return "SOBERANO DOS TRÊS REINOS";
  if (lvl >= 90) return "SEMIDEUS VALIRIANO";
  if (lvl >= 80) return "ARQUIMAGO DAS RELÍQUIAS";
  if (lvl >= 70) return "CAVALEIRO DO DRAGÃO";
  if (lvl >= 60) return "CAMPEÃO DO OLIMPO";
  if (lvl >= 50) return "AUROR DA ORDEM";
  if (lvl >= 40) return "LORDE COMANDANTE";
  if (lvl >= 30) return "GUARDIÃO DO ORÁCULO";
  if (lvl >= 20) return "BRUXO DUELISTA";
  if (lvl >= 10) return "ESCUDEIRO DA PATRULHA";
  return "NOVIÇO DO CHALÉ";
}

window.updateBadgeXpHud = function(totalXp = 0) {
  let xpTotal = Number(totalXp) || 0;
  
  // Cada 999 XP sobe 1 Nível
  let calculatedLvl = 1 + Math.floor(xpTotal / 999);
  let currentLevel = Math.min(calculatedLvl, 99);
  
  // O que sobra é o progresso dentro do nível atual
  let xpInCurrentLevel = currentLevel >= 99 ? 999 : (xpTotal % 999);
  let percentage = currentLevel >= 99 ? 100 : ((xpInCurrentLevel / 999) * 100).toFixed(1);

  const formattedLvl = String(currentLevel).padStart(2, '0');
  const formattedNextLvl = String(Math.min(currentLevel + 1, 99)).padStart(2, '0');
  const tierTitle = `${getTitleByLevel(currentLevel)} // NÍVEL ${formattedLvl}`;

  const elTier = document.getElementById('holoXpTier');
  const elVal = document.getElementById('holoXpVal');
  const elFill = document.getElementById('holoXpFill');
  const elLvl = document.getElementById('holoLvlNumber');
  const elNextLvl = document.getElementById('holoNextLvlNumber');

  if (elTier) elTier.textContent = tierTitle;
  if (elVal) elVal.textContent = xpInCurrentLevel;
  if (elFill) elFill.style.width = `${percentage}%`;
  if (elLvl) elLvl.textContent = formattedLvl;
  if (elNextLvl) elNextLvl.textContent = currentLevel >= 99 ? 'MAX' : formattedNextLvl;
};

// ==========================================
// 5. FECHAMENTO DO PRELOADER
// ==========================================
function fecharPreloader() {
  const preloader = document.getElementById('preloader');
  if (preloader) {
    preloader.classList.add('fade-out');
  }
}

window.addEventListener('load', () => setTimeout(fecharPreloader, 400));
setTimeout(fecharPreloader, 1200);

// ==========================================
// 6. FUNÇÕES DOS TORNEIOS (FLIP CARD 3D)
// ==========================================
window.flipCardOpen = function(element) {
  const card = element.closest('.flip-card');
  if (card) card.classList.add('flipped');
};

window.flipCardBack = function(element) {
  const card = element.closest('.flip-card');
  if (card) card.classList.remove('flipped');
};

// ==========================================
// 7. CONTAGEM REGRESSIVA (24 DE ABRIL DE 2027)
// ==========================================
function iniciarContadorNexus() {
  const dataEvento = new Date('2027-04-24T00:00:00').getTime();

  const elDias = document.getElementById('days');
  const elHoras = document.getElementById('hours');
  const elMinutos = document.getElementById('minutes');
  const elSegundos = document.getElementById('seconds');

  if (!elDias || !elHoras || !elMinutos || !elSegundos) return;

  function atualizarRelogio() {
    const agora = new Date().getTime();
    const distancia = dataEvento - agora;

    if (distancia <= 0) {
      const containerTimer = document.getElementById('countdown-timer');
      if (containerTimer) {
        containerTimer.innerHTML = '<div style="color:var(--cyan);font-family:Orbitron;font-weight:900;letter-spacing:2px;width:100%;text-align:center;">O EVENTO COMEÇOU!</div>';
      }
      return;
    }

    const dias = Math.floor(distancia / (1000 * 60 * 60 * 24));
    const horas = Math.floor((distancia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutos = Math.floor((distancia % (1000 * 60 * 60)) / (1000 * 60));
    const segundos = Math.floor((distancia % (1000 * 60)) / 1000);

    elDias.textContent = String(dias).padStart(2, '0');
    elHoras.textContent = String(horas).padStart(2, '0');
    elMinutos.textContent = String(minutos).padStart(2, '0');
    elSegundos.textContent = String(segundos).padStart(2, '0');
  }

  atualizarRelogio();
  setInterval(atualizarRelogio, 1000);
}

// ==========================================
// 8. PATROCINADORES (EFEITO THANOS SNAP)
// ==========================================
const activePartners = [
  { name: "TEIXEIRA TURISMO", logo: "patrocinador1.JPEG" },
  { name: "NEXUS GENERATIONS", logo: "patrocinador2.png" },
  { name: "KIAÇAÍ", logo: "patrocinador4.JPEG" },
  { name: "TEIXEIRA QUADRI", logo: "patrocinador5.JPEG" },
  { name: "FLIPER GAMES", logo: "patrocinador6.JPEG" }
];

function initThanosPartners() {
  const container = document.getElementById('partners-container');
  if (!container) return;

  const visibleSlotsCount = Math.min(4, activePartners.length);
  container.innerHTML = '';

  for (let i = 0; i < visibleSlotsCount; i++) {
    const partner = activePartners[i];
    const card = document.createElement('div');
    card.className = 'thanos-partner-card cyber-hud-corners';
    card.id = `partner-slot-${i}`;
    card.innerHTML = `
      <div class="partner-logo-box">
        <img src="${partner.logo}" alt="${partner.name}" class="partner-logo-img">
        <span class="partner-title">${partner.name}</span>
      </div>
    `;
    container.appendChild(card);
  }

  if (activePartners.length > visibleSlotsCount) {
    let nextPartnerIndex = visibleSlotsCount;
    let slotToCycle = 0;

    setInterval(() => {
      const slotCard = document.getElementById(`partner-slot-${slotToCycle}`);
      if (!slotCard) return;

      const logoBox = slotCard.querySelector('.partner-logo-box');
      if (!logoBox) return;

      logoBox.classList.remove('thanos-reappear');
      logoBox.classList.add('thanos-disintegrate');

      setTimeout(() => {
        const incomingPartner = activePartners[nextPartnerIndex];
        logoBox.innerHTML = `
          <img src="${incomingPartner.logo}" alt="${incomingPartner.name}" class="partner-logo-img">
          <span class="partner-title">${incomingPartner.name}</span>
        `;

        logoBox.classList.remove('thanos-disintegrate');
        logoBox.classList.add('thanos-reappear');

        nextPartnerIndex = (nextPartnerIndex + 1) % activePartners.length;
        slotToCycle = (slotToCycle + 1) % visibleSlotsCount;
      }, 1200);

    }, 4000);
  }
}

// ==========================================
// 9. ABAS DE FILTRO DA GALERIA & LIGHTBOX
// ==========================================
function initGalleryFilters() {
  const tabBtns = document.querySelectorAll('.gallery-tabs .tab-btn');
  const mediaCards = document.querySelectorAll('.gallery-media-grid .media-card');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      mediaCards.forEach(card => {
        if (filter === 'all' || card.getAttribute('data-category') === filter) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

window.previewImage = function(src, title) {
  const modal = document.getElementById('imageModal');
  const modalImg = document.getElementById('modalImg');
  const modalCaption = document.getElementById('modalCaption');
  if (modal && modalImg && modalCaption) {
    modalImg.src = src;
    modalCaption.textContent = title;
    modal.classList.add('active');
  }
};

window.closeImageModal = function() {
  const modal = document.getElementById('imageModal');
  if (modal) modal.classList.remove('active');
};

// ==========================================
// 10. POPUPS JURÍDICOS (MODAIS BUROCRÁTICOS)
// ==========================================
const legalContents = {
  privacidade: {
    title: "POLÍTICA DE PRIVACIDADE E DADOS (LGPD)",
    body: `
      <h4>1. ESCOPO E CONSENTIMENTO</h4>
      <p>A NEXUS GENERATIONS compromete-se com a total privacidade e proteção dos dados pessoais de seus participantes, usuários, casters e parceiros, operando em estrita conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018 - LGPD).</p>
      <h4>2. COLETA E FINALIDADE</h4>
      <p>Coletamos dados fornecidos voluntariamente durante a aquisição de ingressos, inscrições em torneios e cadastros em newsletters. Esses dados têm por finalidade exclusiva emissão de credenciais, organização dos chaveamentos e comunicação institucional.</p>
      <h4>3. SEGURANÇA E NÃO REPASSE</h4>
      <p>Sob hipótese alguma comercializamos, cedemos ou monetizamos bases de dados com terceiros não autorizados.</p>
    `
  },
  termos: {
    title: "TERMOS DE USO E CONDUTA DA ARENA",
    body: `
      <h4>1. DIRETRIZES DA CONVENÇÃO</h4>
      <p>O ingresso nas dependências físicas ou plataformas digitais do evento NEXUS GENERATIONS 2027 constitui anuência irrestrita a todos os presentes termos.</p>
      <h4>2. NORMAS DE CONDUTA</h4>
      <p>A Nexus rege-se pelo princípio do refúgio seguro para a comunidade geek. Estão expressamente proibidas condutas discriminatórias, assédio a cosplayers e conduta antidesportiva.</p>
      <h4>3. DIREITO DE IMAGEM</h4>
      <p>Ao adentrar a arena, o participante anui com a veiculação de sua imagem e voz em transmissões oficiais ao vivo e materiais institucionais do evento.</p>
    `
  },
  seguranca: {
    title: "DIRETRIZES DE SEGURANÇA E BASTIDORES",
    body: `
      <h4>1. REVISTA E ITENS PROIBIDOS</h4>
      <p>Por razões de segurança coletiva, todo participante passará por detectores de metais nas portarias. Armas de fogo, réplicas contundentes de metal afiado ou substâncias inflamáveis estão terminantemente proibidas.</p>
      <h4>2. ADEREÇOS DE COSPLAY</h4>
      <p>Adereços de cosplay (props) passarão pela triagem de cenografia e receberão selo de inspeção na entrada do pavilhão.</p>
    `
  }
};

window.openLegalModal = function(type) {
  const modal = document.getElementById('legalModalOverlay');
  const title = document.getElementById('legalModalTitle');
  const body = document.getElementById('legalModalBody');

  if (legalContents[type] && modal) {
    title.textContent = legalContents[type].title;
    body.innerHTML = legalContents[type].body;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
};

window.closeLegalModal = function() {
  const modal = document.getElementById('legalModalOverlay');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
};

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    window.closeLegalModal();
    window.closeImageModal();
    window.closeAuthModal();
    window.closeHolodeckModal();
    window.closeWebcamCapture();
  }
});

// ==========================================
// 11. CONTROLE DO MODAL DE AUTENTICAÇÃO
// ==========================================
window.openAuthModal = function(mode = 'register') {
  const modal = document.getElementById('authModalOverlay');
  if (modal) {
    window.switchAuthMode(mode);
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
};

window.closeAuthModal = function() {
  const modal = document.getElementById('authModalOverlay');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
};

window.switchAuthMode = function(mode) {
  const regForm = document.getElementById('registerForm');
  const logForm = document.getElementById('loginForm');
  const tabReg = document.getElementById('tabRegisterBtn');
  const tabLog = document.getElementById('tabLoginBtn');
  const title = document.getElementById('authTitle');
  const subtitle = document.getElementById('authSubtitle');
  const promptText = document.getElementById('authPromptText');
  const toggleAction = document.getElementById('authToggleAction');

  if (mode === 'register') {
    if (regForm) regForm.style.display = 'flex';
    if (logForm) logForm.style.display = 'none';
    if (tabReg) tabReg.classList.add('active');
    if (tabLog) tabLog.classList.remove('active');
    if (title) title.innerHTML = 'CRIAR <span class="cyan-text cyber-flicker">CONTA</span>';
    if (subtitle) subtitle.textContent = 'Gere sua credencial digital para acessar torneios e ingressos exclusivos.';
    if (promptText) promptText.textContent = 'Já possui uma credencial de acesso?';
    if (toggleAction) {
      toggleAction.textContent = 'Acessar Terminal';
      toggleAction.setAttribute('onclick', "switchAuthMode('login')");
    }
  } else {
    if (regForm) regForm.style.display = 'none';
    if (logForm) logForm.style.display = 'flex';
    if (tabReg) tabReg.classList.remove('active');
    if (tabLog) tabLog.classList.add('active');
    if (title) title.innerHTML = 'LOGIN DE <span class="pink-text">ACESSO</span>';
    if (subtitle) subtitle.textContent = 'Insira suas chaves de credencial para entrar na sua conta Nexus.';
    if (promptText) promptText.textContent = 'Ainda não é um operador registrado?';
    if (toggleAction) {
      toggleAction.textContent = 'Criar Nova Conta';
      toggleAction.setAttribute('onclick', "switchAuthMode('register')");
    }
  }
};

window.togglePasswordVisibility = function(inputId, btn) {
  const input = document.getElementById(inputId);
  if (!input) return;
  const icon = btn.querySelector('i');
  if (input.type === 'password') {
    input.type = 'text';
    if (icon) {
      icon.classList.remove('bi-eye-slash-fill');
      icon.classList.add('bi-eye-fill');
    }
  } else {
    input.type = 'password';
    if (icon) {
      icon.classList.remove('bi-eye-fill');
      icon.classList.add('bi-eye-slash-fill');
    }
  }
};

// ==========================================
// 12. CONTROLE DO TERMINAL HOLO-DECK
// ==========================================
window.openHolodeckModal = function() {
  const modal = document.getElementById('holodeckModalOverlay');
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
};

window.closeHolodeckModal = function() {
  const modal = document.getElementById('holodeckModalOverlay');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
};

window.switchHolodeckTab = function(tabName) {
  const tabTickets = document.getElementById('tabBtnTickets');
  const tabTourneys = document.getElementById('tabBtnTournaments');
  const tabSettings = document.getElementById('tabBtnSettings');

  const paneTickets = document.getElementById('paneTickets');
  const paneTourneys = document.getElementById('paneTournaments');
  const paneSettings = document.getElementById('paneSettings');

  [tabTickets, tabTourneys, tabSettings].forEach(t => t && t.classList.remove('active'));
  [paneTickets, paneTourneys, paneSettings].forEach(p => p && (p.style.display = 'none'));

  if (tabName === 'tickets') {
    if (tabTickets) tabTickets.classList.add('active');
    if (paneTickets) paneTickets.style.display = 'block';
  } else if (tabName === 'tournaments') {
    if (tabTourneys) tabTourneys.classList.add('active');
    if (paneTourneys) paneTourneys.style.display = 'block';
  } else if (tabName === 'settings') {
    if (tabSettings) tabSettings.classList.add('active');
    if (paneSettings) paneSettings.style.display = 'block';
  }
};

// ==========================================
// 13. CONFIGURAÇÕES: NICKNAME, GUILDA E SENHA
// ==========================================
window.handleUpdateNickname = async function(e) {
  if (e && e.preventDefault) e.preventDefault();
  const newNick = document.getElementById('inputEditNickname')?.value.trim();
  const selectElem = document.getElementById('selectPlayerFaction');
  const selectedGuild = selectElem ? selectElem.value : 'neutro';

  localStorage.setItem('nexus_current_guild', selectedGuild);
  if (auth.currentUser) {
    localStorage.setItem(`nexus_guild_${auth.currentUser.uid}`, selectedGuild);
  }

  window.applyGuildBadge(selectedGuild);

  if (auth.currentUser && newNick) {
    try {
      await updateProfile(auth.currentUser, { displayName: newNick });
      const holoName = document.getElementById('holoDisplayName');
      const navNick = document.querySelector('.user-nickname');
      if (holoName) holoName.textContent = newNick;
      if (navNick) navNick.textContent = newNick;
    } catch (error) {
      console.warn("Aviso ao atualizar perfil:", error);
    }
  }

  alert("⚡ Identidade e Fação guardadas com sucesso!");
};

window.handleUpdatePassword = async function(e) {
  if (e && e.preventDefault) e.preventDefault();
  const newPass = document.getElementById('inputNewPassword')?.value;
  const confirmPass = document.getElementById('inputConfirmPassword')?.value;

  if (newPass !== confirmPass) {
    alert("⚠️ As novas palavras-passe não coincidem!");
    return;
  }

  const user = auth.currentUser;
  if (!user) return;

  try {
    await updatePassword(user, newPass);
    alert("🔒 Palavra-passe de acesso atualizada com sucesso!");
    document.getElementById('inputNewPassword').value = '';
    document.getElementById('inputConfirmPassword').value = '';
  } catch (error) {
    if (error.code === 'auth/requires-recent-login') {
      alert("⚠️ Por motivos de segurança, deves terminar e reiniciar sessão antes de alterar a palavra-passe.");
    } else {
      alert("Erro ao atualizar palavra-passe: " + error.message);
    }
  }
};

// ==========================================
// 14. MONITORIZAÇÃO DO ESTADO DE AUTENTICAÇÃO
// ==========================================
onAuthStateChanged(auth, (user) => {
  const navAuthArea = document.getElementById('navAuthArea');
  if (!navAuthArea) return;

  if (user) {
    const displayName = user.displayName || user.email.split('@')[0];
    const initial = displayName.charAt(0).toUpperCase();

    const holoName = document.getElementById('holoDisplayName');
    const holoEmail = document.getElementById('holoUserEmail');
    const holoLetter = document.getElementById('holoAvatarLetter');
    const holoImg = document.getElementById('holoAvatarImg');
    const holoId = document.getElementById('holoUserId');

    if (holoName) holoName.textContent = displayName;
    if (holoEmail) holoEmail.textContent = user.email;
    if (holoId) holoId.textContent = `#NX-${user.uid.slice(0, 6).toUpperCase()}`;

    // Aplica a fação gravada
    const savedGuild = localStorage.getItem(`nexus_guild_${user.uid}`) || 'semideuses';
    if (typeof window.applyGuildBadge === 'function') {
      window.applyGuildBadge(savedGuild);
    }

    // Carrega ingressos e total de XP acumulado no Firestore
    loadUserTickets(user.uid);
    loadUserTotalXp(user.uid);

    // Atualização de fotografia
    if (user.photoURL && holoImg && holoLetter) {
      holoImg.src = user.photoURL;
      holoImg.style.display = 'block';
      holoLetter.style.display = 'none';
    } else if (holoImg && holoLetter) {
      holoLetter.textContent = initial;
      holoImg.style.display = 'none';
      holoLetter.style.display = 'flex';
    }

    const avatarNavbarHtml = user.photoURL
      ? `<img src="${user.photoURL}" style="width:100%;height:100%;border-radius:50%;object-fit:cover;">`
      : initial;

    navAuthArea.innerHTML = `
      <div class="user-profile-nav" onclick="openHolodeckModal()" style="cursor:pointer;" title="Abrir Terminal de Operador">
        <div class="user-avatar-badge">${avatarNavbarHtml}</div>
        <div class="user-info-text">
          <span class="user-status-tag">ONLINE // OP</span>
          <span class="user-nickname" title="${displayName}">${displayName}</span>
        </div>
        <button type="button" class="btn-logout-cyber" id="btnLogout" title="Terminar Sessão" onclick="event.stopPropagation();">
          <i class="bi bi-box-arrow-right"></i>
        </button>
      </div>
    `;

    document.getElementById('btnLogout').addEventListener('click', (e) => {
      e.stopPropagation();
      signOut(auth).then(() => {
        alert("Sessão terminada com sucesso.");
      });
    });

    const holoLogout = document.getElementById('holoLogoutBtn');
    if (holoLogout) {
      holoLogout.onclick = () => {
        signOut(auth).then(() => {
          closeHolodeckModal();
          alert("Sessão terminada com sucesso.");
        });
      };
    }

  } else {
    navAuthArea.innerHTML = `
      <button type="button" class="btn-glow-cyan" onclick="openAuthModal('register')">
        <i class="bi bi-lightning-charge-fill"></i> SE INSCREVA
      </button>
    `;
    closeHolodeckModal();
  }
});

// ==========================================
// 15. SUBMIT DE REGISTO E LOGIN
// ==========================================
window.handleAuthSubmit = async function(event, type) {
  event.preventDefault();

  if (type === 'register') {
    const name = document.getElementById('regName').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const pass = document.getElementById('regPass').value;
    const confirm = document.getElementById('regPassConfirm').value;

    if (pass !== confirm) {
      alert("⚠️ As palavras-passe não coincidem!");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
      await updateProfile(userCredential.user, { displayName: name });
      alert(`🎉 Credencial gerada com sucesso! Bem-vindo, Operador ${name}!`);
      window.closeAuthModal();
    } catch (error) {
      alert("Erro ao criar conta: " + error.message);
    }
  } else {
    const email = document.getElementById('logEmail').value.trim();
    const pass = document.getElementById('logPass').value;

    try {
      await signInWithEmailAndPassword(auth, email, pass);
      alert("⚡ Acesso concedido!");
      window.closeAuthModal();
    } catch (error) {
      alert("Falha de autenticação: " + error.message);
    }
  }
};

// ==========================================
// 16. LOGIN COM GOOGLE
// ==========================================
window.handleGoogleSocialMock = async function() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    alert(`⚡ Acesso concedido via Google! Bem-vindo, ${result.user.displayName}!`);
    window.closeAuthModal();
  } catch (error) {
    alert("Falha no login Google: " + error.message);
  }
};

// ==========================================
// 17. INICIALIZAÇÃO DE EVENTOS DO DOM
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  iniciarContadorNexus();
  initThanosPartners();
  initGalleryFilters();

  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.cyber-link');
  const sections = document.querySelectorAll('main, section');

  window.addEventListener('scroll', () => {
    if (!navbar) return;
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });

  const playlistItems = document.querySelectorAll('.playlist-item');
  const ytPlayer = document.getElementById('youtube-player');
  const currentVideoTitle = document.getElementById('current-video-title');
  const currentVideoTag = document.getElementById('current-video-tag');

  playlistItems.forEach(item => {
    item.addEventListener('click', () => {
      playlistItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');

      const ytId = item.getAttribute('data-yt-id');
      const title = item.getAttribute('data-title');
      const tag = item.getAttribute('data-tag');

      if (ytPlayer && ytId) {
        ytPlayer.src = `https://www.youtube-nocookie.com/embed/${ytId}?autoplay=1&rel=0`;
      }

      if (currentVideoTitle) currentVideoTitle.textContent = title;
      if (currentVideoTag) currentVideoTag.textContent = tag;
    });
  });
});

// ==========================================
// 18. CONSULTA E SINCRONIZAÇÃO DE INGRESSOS VIP
// ==========================================
async function loadUserTickets(userId) {
  const container = document.getElementById('ticketsContainer');
  const redeemBox = document.getElementById('vipRedeemCard');
  const badgeAccessTag = document.querySelector('.badge-data-row span.cyan-text, .badge-data-row span.pink-text');

  // Elementos do QR Code no crachá holográfico da esquerda
  const holoQrSection = document.getElementById('holoBadgeQrSection');
  const holoLockNotice = document.getElementById('holoBadgeLockNotice');
  const holoQrImg = document.getElementById('holoBadgeQrImg');

  if (!container) return;

  try {
    const q = query(
      collection(db, "tickets"),
      where("userId", "==", userId),
      where("tier", "==", "KITSUNINE VIP DELUXE")
    );
    const querySnapshot = await getDocs(q);

    // Se NÃO possui passe VIP ativo
    if (querySnapshot.empty) {
      if (redeemBox) redeemBox.style.display = 'block';
      if (badgeAccessTag) {
        badgeAccessTag.textContent = "AGUARDANDO ATIVAÇÃO VIP";
        badgeAccessTag.className = "data-val pink-text";
      }

      // Oculta o QR Code da catraca e mostra o aviso de bloqueio
      if (holoQrSection) holoQrSection.style.display = 'none';
      if (holoLockNotice) holoLockNotice.style.display = 'block';

      container.innerHTML = `
        <div class="empty-tickets-box" style="text-align: center; padding: 2rem 1rem; background: rgba(0,0,0,0.3); border-radius: 14px; border: 1px dashed rgba(255,255,255,0.15); margin-bottom: 1.2rem;">
          <i class="bi bi-shield-lock" style="font-size: 2.2rem; color: #ff007f;"></i>
          <h5 style="font-family:'Orbitron',sans-serif; color:#cbd5e1; margin: 0.8rem 0 0.4rem;">Nenhum Passe VIP Ativo</h5>
          <p style="color:#94a3b8; font-size:0.85rem;">Insere o código do teu voucher uTicket no campo acima para desbloquear as vantagens do crachá.</p>
        </div>
      `;
      return;
    }

    // Se POSSUI o VIP confirmado
    const firstTicket = querySnapshot.docs[0].data();
    if (redeemBox) redeemBox.style.display = 'none';
    if (badgeAccessTag) {
      badgeAccessTag.textContent = "VIP DELUXE ATIVO";
      badgeAccessTag.className = "data-val cyan-text";
    }

    // Ativa o QR Code no crachá da esquerda com o código resgatado
    if (holoLockNotice) holoLockNotice.style.display = 'none';
    if (holoQrSection) holoQrSection.style.display = 'flex';
    if (holoQrImg) {
      const qrData = `NEXUS-VIP-${firstTicket.ticketCode}-${userId}`;
      holoQrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(qrData)}&color=00f2fe&bgcolor=080614`;
    }

    let ticketsHTML = '';
    querySnapshot.forEach((docSnap) => {
      const t = docSnap.data();
      const qrData = `NEXUS-VIP-${t.ticketCode}-${t.userId}`;
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(qrData)}&color=00f2fe&bgcolor=080614`;

      ticketsHTML += `
        <div class="cyber-ticket-card">
          <div class="ticket-left">
            <span class="ticket-badge-tier badge-pink">${t.tier}</span>
            <h3 class="ticket-title">${t.eventName}</h3>
            <p class="ticket-desc">${t.description}</p>
            <div class="ticket-details-grid">
              <div><strong>PORTÃO:</strong> <span>${t.gate}</span></div>
              <div><strong>DATA:</strong> <span>${t.eventDate}</span></div>
              <div><strong>VOUCHER:</strong> <span class="cyan-text">#${t.ticketCode}</span></div>
              <div><strong>STATUS:</strong> <span class="cyan-text">${t.status}</span></div>
            </div>
          </div>
          <div class="ticket-divider-strip">
            <div class="notch notch-top"></div>
            <div class="dashed-line"></div>
            <div class="notch notch-bottom"></div>
          </div>
          <div class="ticket-right">
            <img src="${qrUrl}" alt="QR Code VIP" class="ticket-qr">
            <span class="ticket-code">#${t.ticketCode}</span>
          </div>
        </div>
      `;
    });

    container.innerHTML = ticketsHTML;

  } catch (error) {
    console.error("Erro ao carregar credenciais:", error);
    container.innerHTML = `<p style="color:#ff007f;">Falha ao carregar credencial: ${error.message}</p>`;
  }
}

// ==========================================
// 19. RESGATE DE CÓDIGO VIP DA UTICKET COM +10.000 XP
// ==========================================
window.handleRedeemVipTicket = async function(e) {
  e.preventDefault();
  const inputCode = document.getElementById('inputVipCode');
  const code = inputCode ? inputCode.value.trim().toUpperCase() : '';

  if (!auth.currentUser) {
    alert("⚠️ É necessário iniciar sessão antes de resgatar o voucher.");
    openAuthModal('login');
    return;
  }

  if (!code) return;

  const btn = document.getElementById('btnSubmitVip');
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = `<i class="bi bi-arrow-repeat"></i> A VALIDAR...`;
  }

  try {
    const q = query(
      collection(db, "valid_vip_codes"),
      where("code", "==", code)
    );
    const snap = await getDocs(q);

    if (snap.empty) {
      alert("❌ Código inválido. Certifique-se de que inseriu o código exato do seu voucher VIP da uTicket.");
      resetRedeemBtn();
      return;
    }

    const docData = snap.docs[0].data();
    const docRef = doc(db, "valid_vip_codes", snap.docs[0].id);

    if (docData.used) {
      alert("⚠️ Este código VIP já foi resgatado por outro operador.");
      resetRedeemBtn();
      return;
    }

    // 1. Marca código como usado na coleção de códigos válidos
    await updateDoc(docRef, {
      used: true,
      usedBy: auth.currentUser.uid,
      usedByEmail: auth.currentUser.email,
      redeemedAt: serverTimestamp()
    });

    // 2. Grava o ingresso VIP na conta do operador
    await addDoc(collection(db, "tickets"), {
      userId: auth.currentUser.uid,
      userEmail: auth.currentUser.email,
      userName: auth.currentUser.displayName || auth.currentUser.email.split('@')[0],
      ticketCode: code,
      tier: "KITSUNINE VIP DELUXE",
      price: 150,
      status: "CONFIRMADO",
      gate: "ALPHA VIP EXCLUSIVO",
      eventName: "NEXUS CONVENTION 2027",
      eventDate: "24/04/2027",
      batch: "LOTE OFICIAL UTICKET",
      description: "Acesso total aos bastidores, box de colecionáveis, crachá holográfico e fila prioritária.",
      createdAt: serverTimestamp()
    });

    // 3. Concede o bônus de 10.000 XP
    await addDoc(collection(db, "user_xp"), {
      userId: auth.currentUser.uid,
      amount: 10000,
      reason: "BÔNUS_ATIVACAO_VIP_DELUXE",
      createdAt: serverTimestamp()
    });

    alert("🎉 Credencial VIP ativada com sucesso! Você recebeu um bônus lendário de +10.000 XP!");
    if (inputCode) inputCode.value = '';

    // Atualiza imediatamente a tela
    loadUserTickets(auth.currentUser.uid);
    loadUserTotalXp(auth.currentUser.uid);

  } catch (err) {
    console.error("Erro no resgate VIP:", err);
    alert("Falha ao resgatar voucher: " + err.message);
  } finally {
    resetRedeemBtn();
  }
};

function resetRedeemBtn() {
  const btn = document.getElementById('btnSubmitVip');
  if (btn) {
    btn.disabled = false;
    btn.innerHTML = `<i class="bi bi-unlock-fill"></i> RESGATAR CREDENCIAL VIP`;
  }
}

// ==========================================
// 20. CONSULTA E SOMA TOTAL DE XP DO USUÁRIO
// ==========================================
async function loadUserTotalXp(userId) {
  try {
    const q = query(
      collection(db, "user_xp"),
      where("userId", "==", userId)
    );
    const snap = await getDocs(q);

    let totalXp = 0;
    snap.forEach(docSnap => {
      const data = docSnap.data();
      totalXp += Number(data.amount) || 0;
    });

    // Atualiza o HUD visual do crachá holográfico
    window.updateBadgeXpHud(totalXp);
  } catch (err) {
    console.error("Erro ao carregar XP:", err);
  }
}

// ==========================================
// 21. FOTO DE PERFIL: UPLOAD E WEBCAM
// ==========================================
let mediaStream = null;

window.toggleAvatarOptions = function() {
  const menu = document.getElementById('avatarDropdown');
  if (menu) menu.classList.toggle('active');
};

document.addEventListener('click', (e) => {
  const avatarWrap = document.querySelector('.badge-avatar-wrap');
  const menu = document.getElementById('avatarDropdown');
  if (menu && avatarWrap && !avatarWrap.contains(e.target)) {
    menu.classList.remove('active');
  }
});

async function saveAndUpdateAvatar(photoDataUrl) {
  if (!auth.currentUser) return;
  try {
    await updateProfile(auth.currentUser, { photoURL: photoDataUrl });

    const imgEl = document.getElementById('holoAvatarImg');
    const letterEl = document.getElementById('holoAvatarLetter');
    if (imgEl && letterEl) {
      imgEl.src = photoDataUrl;
      imgEl.style.display = 'block';
      letterEl.style.display = 'none';
    }

    const navBadge = document.querySelector('.user-avatar-badge');
    if (navBadge) {
      navBadge.innerHTML = `<img src="${photoDataUrl}" style="width:100%;height:100%;border-radius:50%;object-fit:cover;">`;
    }

    alert("⚡ Registo biométrico atualizado com sucesso!");
  } catch (err) {
    alert("Falha ao atualizar a fotografia: " + err.message);
  }
}

window.handleFileUpload = function(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    const img = new Image();
    img.onload = function() {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = 180;
      canvas.height = 180;
      ctx.drawImage(img, 0, 0, 180, 180);
      const optimizedData = canvas.toDataURL('image/jpeg', 0.85);
      saveAndUpdateAvatar(optimizedData);
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
};

window.openWebcamCapture = async function() {
  const overlay = document.getElementById('webcamModalOverlay');
  const video = document.getElementById('webcamStream');
  const menu = document.getElementById('avatarDropdown');
  if (menu) menu.classList.remove('active');

  try {
    mediaStream = await navigator.mediaDevices.getUserMedia({ video: { width: 400, height: 400 } });
    if (video) {
      video.srcObject = mediaStream;
      overlay.classList.add('active');
    }
  } catch (err) {
    alert("Não foi possível aceder à câmara: " + err.message);
  }
};

window.closeWebcamCapture = function() {
  const overlay = document.getElementById('webcamModalOverlay');
  const video = document.getElementById('webcamStream');
  if (mediaStream) {
    mediaStream.getTracks().forEach(track => track.stop());
    mediaStream = null;
  }
  if (video) video.srcObject = null;
  if (overlay) overlay.classList.remove('active');
};

window.capturePhotoFromStream = function() {
  const video = document.getElementById('webcamStream');
  const canvas = document.getElementById('webcamCanvas');
  if (!video || !canvas) return;

  canvas.width = 180;
  canvas.height = 180;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(video, 0, 0, 180, 180);

  const capturedImage = canvas.toDataURL('image/jpeg', 0.85);
  window.closeWebcamCapture();
  saveAndUpdateAvatar(capturedImage);
};