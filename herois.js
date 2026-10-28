// ==========================================
// 1. IMPORTAÇÕES OFICIAIS DO FIREBASE
// ==========================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
  getFirestore,
  collection,
  addDoc,
  query,
  where,
  getDocs,
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

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// ==========================================
// 3. BANCO DE DADOS DOS 20 SEMIDEUSES
// ==========================================
const personagens = [
  {
    nome: "Samantha Belanova",
    dominio: "Linhagem De Palladium",
    estrelas: 5,
    idade: 19,
    personalidade: "A ARQUITETA GENIAL, Focada, fria, analítica e estrategista nata.",
    ocupacao: "Dona Das Indústrias Belanova",
    distrito: "Distrito De Palladium",
    numero_ficha: "NR-6151",
    lore: "A Garota de Ouro de Nova Roma. Uma genial inventora que construiu o império militar do seu distrito. Após ser sequestrada por mercenários e ver os danos causados por suas próprias criações no mundo mortal, Sam teve um despertar moral. Ela desmantelou sua própria empresa e declarou independência dos deuses, tornando-se pilota da armadura nanotecnológica Égide-X.",
    rank: "HERÓI",
    afiliacao: "Time 404",
    arma: "Égide X",
    poderes: "Inteligência Aprimorada E Protocollo Pallas",
    prefixo: "Samantha"
  },
  {
    nome: "Helena Smith",
    dominio: "Linhagem De Trivia",
    estrelas: 5,
    idade: 16,
    personalidade: "A MAGA DO CAOS, Misteriosa, sarcástica e com humor implacável.",
    ocupacao: "Estagiária Nas Indústrias Belanova",
    distrito: "Distrito De Darkness",
    numero_ficha: "NR-5122",
    lore: "Rejeitada pela prestigiada academia de magia por sua falta de disciplina e notas baixas, Helena sempre se considerou uma inútil, um mero NPC na grandiosa Nova Roma. Filha de uma deusa menor, ela não via futuro até cruzar o caminho da CEO Samantha Belanova, que lhe deu um emprego e um propósito.",
    rank: "HERÓI",
    afiliacao: "Time 404",
    arma: "Varinha",
    poderes: "Manipulação Da Realidade",
    prefixo: "Helena"
  },
  {
    nome: "Nicolas Henderson",
    dominio: "Linhagem De Darkness",
    estrelas: 5,
    idade: 19,
    personalidade: "O HERDEIRO DAS SOMBRAS, Corajoso, intenso, mas profundamente leal.",
    ocupacao: "Estudante de Ciência Forense",
    distrito: "Distrito De Darkness",
    numero_ficha: "NR-6152",
    lore: "Cresceu no Brooklyn acreditando ser um órfão mortal comum criado pela tia. Sua vida perfeitamente calculada e cética ruiu após uma febre intensa, despertando o adormecido Fogo de Vesta em seu DNA. Agora, foi arrastado para o mundo que seus pais tentaram lhe esconder.",
    rank: "HERÓI",
    afiliacao: "Time 404",
    arma: "Espada Do Submundo",
    poderes: "Fogo Negro e Necromancia",
    prefixo: "Nicolas"
  },
  {
    nome: "Ciro Martinez",
    dominio: "Linhagem De Éolo",
    estrelas: 4,
    idade: 18,
    personalidade: "O ENGENHEIRO PREGUIÇOSO, Genial, preguiçoso e descontraído.",
    ocupacao: "Estrategista de Voo",
    distrito: "Distrito De Júpiter",
    numero_ficha: "NR-5115",
    lore: "Morador de Nova Roma, Ciro Martinez foi abençoado por Éolo devido à sua paixão pelo céu e intelecto brilhante. Com QI de 180, ele não sofre pressão alguma; em vez disso, usa sua genialidade para criar formas de ser preguiçoso e descansar. Casual e leal, Ciro é o melhor amigo de Jéssica Jones e raramente ativa seu lado analítico estruturado.",
    rank: "LÍDER",
    afiliacao: "Time Alpha",
    arma: "Dispositivo De Vento",
    poderes: "Vento",
    prefixo: "Ciro"
  },
  {
    nome: "Yan Miller",
    dominio: "Linhagem De Becca",
    estrelas: 2,
    idade: 18,
    personalidade: "O ILUSIONISTA, Ambicioso, autoritário, com alta autoestima.",
    ocupacao: "Treinador De Academia",
    distrito: "Distrito De Becca",
    numero_ficha: "NR-5112",
    lore: "Abençoado por Becca após salvar um símbolo sagrado, Yan Miller possui alta autoestima e ambição desmedida. Em Nova Roma, formou equipe com os melhores amigos Jéssica e Ciro. Embora se considere o líder autoritário e viva reclamando, sua liderança é nula; os amigos apenas o deixam mandar para evitar confusão. Leal ao time, Yan busca constantemente provar seu valor.",
    rank: "VETERANO",
    afiliacao: "Time Alpha",
    arma: "Adaga",
    poderes: "Ilusões",
    prefixo: "Yan"
  },
  {
    nome: "Jéssica Jones",
    dominio: "Linhagem De Ceres",
    estrelas: 3,
    idade: 18,
    personalidade: "A DEUSA PIMENTA, Doce, protetora e extremamente leal.",
    ocupacao: "Guardiã Botânica De Ceres",
    distrito: "Distrito De Ceres",
    numero_ficha: "NR-5116",
    lore: "Abençoada por Ceres ao demonstrar amor profundo pela natureza, Jéssica Jones é a melhor amiga de Ciro desde a infância. Inseparáveis, os dois chegaram juntos a Nova Roma para cumprir seus destinos. Embora oculte uma paixão secreta por ele, ela utiliza seus poderes sobre a terra para protegê-lo, florescendo vida por onde passa com lealdade e doçura inabaláveis.",
    rank: "VETERANO",
    afiliacao: "Time Alpha",
    arma: "Nenhum",
    poderes: "Expansão E Deusa Pimenta",
    prefixo: "Jéssica"
  },
  {
    nome: "Aaron Madoxx",
    dominio: "Linhagem De Bellona",
    estrelas: 3,
    idade: 19,
    personalidade: "A FÚRIA CONTIDA, Tranquilo, benevolente, mas mortal quando necessário.",
    ocupacao: "Vanguarda Protetora De Bellona",
    distrito: "Distrito De Bellona",
    numero_ficha: "NR-1499",
    lore: "Abençoado por Bellona após salvar um vilarejo de um ataque monstruoso, Aaron Maddox utiliza seus poderes divinos para praticar o bem em Nova Roma. Tranquilo e benevolente, ele recorre à violência apenas contra o mal. Ao lado de Luna Tagarela e Peter, compõe o respeitado Trio Ômega, protegendo o império com coragem e mantendo a paz entre os mortais.",
    rank: "VETERANO",
    afiliacao: "Time Ômega",
    arma: "Machado De Fogo",
    poderes: "Fogo E Fúria De Bellona",
    prefixo: "Aaron"
  },
  {
    nome: "Luna Mantovani",
    dominio: "Linhagem De Lunus",
    estrelas: 4,
    idade: 17,
    personalidade: "A CAÇADORA MORTAL, Falante, provocadora e muito confiante.",
    ocupacao: "Protetora Das Florestas De Lunus",
    distrito: "Santuário De Lunus",
    numero_ficha: "NR-1489",
    lore: "Abençoada por Lunus após ser resgatada de um incêndio florestal, Luna Mantovani foi criada e treinada pelo próprio deus como filha. Única semideusa autorizada a morar no distrito de Lunus com criaturas mágicas, ela é extremamente falante e confiante. Sempre desafiando outros para duelos, Luna acaba ignorada por muitos, que consideram suas constantes provocações uma total perda de tempo.",
    rank: "VETERANA",
    afiliacao: "Time Ômega",
    arma: "Arco Lunar",
    poderes: "Lua",
    prefixo: "Luna"
  },
  {
    nome: "Harry Castellan",
    dominio: "Linhagem De Venilia",
    estrelas: 3,
    idade: 19,
    personalidade: "O LAGO, Pacífico e focado na proteção.",
    ocupacao: "Protetor Marítimo Do Porto De Venilia",
    distrito: "Distrito De Venilia",
    numero_ficha: "NR-1352",
    lore: "Abençoados por sua profunda conexão com o mar, os gêmeos Harry e David tomaram rumos opostos. Harry, pacífico, rejeitou o destino de guerreiro, causando a fúria e o desprezo de Poseidon. Já David abraçou o caos e passou a odiar o irmão, por acreditar que ele desperdiçou o dom divino. Em Nova Roma, essa rivalidade marca o destino de ambos.",
    rank: "VETERANO",
    afiliacao: "Time Ômega",
    arma: "Espada De Água",
    poderes: "Hidrocinese",
    prefixo: "Harry"
  },
  {
    nome: "David Allen",
    dominio: "Linhagem de Venilia",
    estrelas: 4,
    idade: 19,
    personalidade: "O MAR TEMPESTUOSO, Caótico, ambicioso e ressentido.",
    ocupacao: "???",
    distrito: "???",
    numero_ficha: "NR-1353",
    lore: "Abençoado por Venilia e irmão gêmeo de Harry, David Allen era inseparável do irmão até que o despertar de seus poderes o transformou. Consumido pelo caos, ele passou a desprezar Harry, julgando-o fraco por sua natureza pacífica e falta de ambição. Com o objetivo sombrio de se tornar o semideus mais poderoso, David agora busca dominar o mundo.",
    rank: "???",
    afiliacao: "Nenhuma",
    arma: "Tridente Negro",
    poderes: "Hidrocinese Corrompida",
    prefixo: "David"
  },
  {
    nome: "Karen Antonelli",
    dominio: "Linhagem de Júpiter",
    estrelas: 5,
    idade: 25,
    personalidade: "A FILHA DO TROVÃO, Autoritária, sábia e estrategista impecável.",
    ocupacao: "Pretora de Nova Roma",
    distrito: "Capitólio Divino",
    numero_ficha: "NR-001",
    lore: "Abençoada por Júpiter ao demonstrar uma liderança formidável desde a infância, Karen Antonelli conquistou o direito de governar Nova Roma. Como Pretora da cidade, ela detém o respeito absoluto de todos, administrando com sabedoria tanto o império quanto seu lar. Sua autoridade divina e competência estratégica fazem dela o pilar central da ordem e justiça entre os semideuses.",
    rank: "Herói",
    afiliacao: "Alto Comando",
    arma: "Espada Do Trovão",
    poderes: "Aerocinese e Eletrocinese",
    prefixo: "Karen"
  },
  {
    nome: "Valeria Brown",
    dominio: "Mortal",
    estrelas: 1,
    idade: 40,
    personalidade: "A FAZ-TUDO, Maternal, prática e extremamente experiente.",
    ocupacao: "Faz-Tudo / Conselheira",
    distrito: "Distrito De Héstia",
    numero_ficha: "NR-000",
    lore: "Valeria Brown, conhecida como Mama V, é uma mortal de quarenta anos que reside em Nova Roma há décadas. Sem nunca receber bênçãos divinas, ela atua como faz-tudo e conselheira essencial para os novatos da cidade. Apesar de sua dedicação e vasta experiência, Mama V carrega o fardo de nunca ter conquistado o respeito ou o reconhecimento dos deuses.",
    rank: "MORTAL",
    afiliacao: "Conselheira Dos Novatos",
    arma: "Ferramentas Diversas",
    poderes: "Nenhum",
    prefixo: "Valeria"
  },
  {
    nome: "Clóvis Weaver",
    dominio: "Linhagem de Somnus",
    estrelas: 4,
    idade: 32,
    personalidade: "O LOUCO SONHADOR, Místico, sonhador e conselheiro sábio.",
    ocupacao: "Oráculo dos Sonhos",
    distrito: "Distrito De Darkness",
    numero_ficha: "NR-0111",
    lore: "Abençoado por Somnus devido ao seu empenho em desvendar os mistérios dos sonhos, Clóvis Weaver partiu para Nova Roma aos vinte e cinco anos. Na cidade sagrada, ele utiliza seus dons divinos para atuar como um dos oráculos oficiais, interpretando visões e mensagens oníricas. Sua sabedoria é fundamental para guiar os semideuses, revelando destinos ocultos através das brumas do sono.",
    rank: "VETERANO",
    afiliacao: "Oráculos",
    arma: "Báculo das Brumas",
    poderes: "Oneirocinese",
    prefixo: "Clovis"
  },
  {
    nome: "Lara Richard",
    dominio: "Linhagem de Volkana",
    estrelas: 2,
    idade: 20,
    personalidade: "A INVENTORA PACÍFICA, Tranquila, inventiva e muito focada.",
    ocupacao: "Engenheira Mecânica De Volkana",
    distrito: "Distrito De Volkana",
    numero_ficha: "NR-0121",
    lore: "Abençoada por Volkana devido ao seu talento nato para invenções, Lara Richard é o oposto do fogo destrutivo. Tranquila e gentil, ela utiliza sua inteligência para modificar mecanismos e criar utilitários pacíficos. Lara evita conflitos a todo custo, preferindo a paz de sua oficina às batalhas do império.",
    rank: "VETERANO",
    afiliacao: "Time Zeta",
    arma: "Vários Apetrechos Diversos",
    poderes: "Pirocinese e Forja Mágica",
    prefixo: "Lara"
  },
  {
    nome: "Emily Taylor",
    dominio: "Linhagem de Vênus",
    estrelas: 2,
    idade: 21,
    personalidade: "A GUERREIRA DIVINA, Bela, agressiva e sedenta por adrenalina.",
    ocupacao: "Treinadora De Academia",
    distrito: "Distrito De Vênus",
    numero_ficha: "NR-1022",
    lore: "Emily Taylor, abençoada por Vênus, possui uma beleza estonteante: pele morena, curvas definidas e longos cabelos cacheados. Enquanto a deusa exige que ela lidere concursos de elegância, Emily ignora os holofotes. Sua verdadeira paixão é a adrenalina do combate. Em vez de passarelas, ela percorre ruas desertas, sempre à procura de um oponente digno e de uma boa confusão para vencer.",
    rank: "VETERANO",
    afiliacao: "Lobos Solitários",
    arma: "Punhos Nua",
    poderes: "Encantamento e Força Ampliada",
    prefixo: "Emily"
  },
  {
    nome: "Billy Foster",
    dominio: "Linhagem de Íris",
    estrelas: 4,
    idade: 28,
    personalidade: "O GIGANTE GENTIL, Bondoso, pacífico e extremamente protetor.",
    ocupacao: "Guardião da Ponte",
    distrito: "Distrito De Júpiter",
    numero_ficha: "NR-066",
    lore: "Conhecido como o Gigante Gentil, Billy é um homem com físico de lenhador e coração puro que encontrou paz cuidando das flores no Templo de Íris. Sua bênção divina, no entanto, sofreu uma grave mutação: sob ameaça, ele se transforma em um monstro de minerais prismáticos, ganhando invulnerabilidade ao custo de sua própria consciência.",
    rank: "VETERANO",
    afiliacao: "Guarda Da Paz",
    arma: "Espada De Íris",
    poderes: "Gigante De Prisma",
    prefixo: "Billy"
  },
  {
    nome: "Franklin Watson",
    dominio: "Linhagem de Mercúria",
    estrelas: 4,
    idade: 24,
    personalidade: "O ANDARILHO, Ágil, inquisitivo e ardiloso.",
    ocupacao: "Caçador De Recompensas",
    distrito: "Mundo Mortal",
    numero_ficha: "???",
    lore: "Franklin sempre viveu no limite. Um caçador de tesouros galanteador e endividado, ele viajava o multiverso pilotando sua amada nave P90, buscando o roubo que o deixaria milionário. Abençoado por Mercúrio com supervelocidade, confia mais no charme e na rapidez do que na força bruta.",
    rank: "???",
    afiliacao: "Os Mercenários",
    arma: "Adagas Duplas",
    poderes: "Super Velocidade",
    prefixo: "Marcus"
  },
  {
    nome: "Sarah Robinson",
    dominio: "Linhagem De Solari",
    estrelas: 4,
    idade: 27,
    personalidade: "A MÉDICA LEGAL, Companheira, radiante e misericordiosa.",
    ocupacao: "Curandeira da Luz",
    distrito: "Distrito De Solari",
    numero_ficha: "NR-3544",
    lore: "Com 27 anos, Sarah ilumina qualquer ambiente. Foi abençoada por Solari devido à sua compaixão e desejo de curar os oprimidos, emitindo calor purificador e luz para trazer esperança aos cantos sombrios.",
    rank: "NOVATO",
    afiliacao: "Clínicas da Alvorada",
    arma: "Aura Solar",
    poderes: "Manipulação de Luz e Cura",
    prefixo: "Sarah"
  },
  {
    nome: "Julian Vance",
    dominio: "Linhagem De Juno",
    estrelas: 4,
    idade: 32,
    personalidade: "O BRAÇO DIREITO DE JUNO, Metódico, leal e aristocrático.",
    ocupacao: "Diplomata Militar",
    distrito: "Capitólio",
    numero_ficha: "NR-017",
    lore: "Estrategista metódico com porte imponente. Juno o abençoou por sua capacidade de liderança. Ele comanda legiões com pulso firme, sendo o pilar diplomático e militar que sustenta a ordem em Nova Roma.",
    rank: "LÍDER",
    afiliacao: "Diplomatas Arcadianos",
    arma: "Nenhuma",
    poderes: "Aura de Inspiração e Vínculo Vital",
    prefixo: "Julian"
  },
  {
    nome: "Elena Avalon",
    dominio: "Linhagem De Nêmesis",
    estrelas: 4,
    idade: 26,
    personalidade: "A TIRANA PERVERSA, Severa, fria e implacável com as leis.",
    ocupacao: "Juíza De Nova Roma",
    distrito: "Distrito De Bellona",
    numero_ficha: "NR-018",
    lore: "Com olhar severo, Nêmesis a abençoou por seu senso absoluto de retribuição. Elena atua como juiz solitário nas ruas de Nova Roma, garantindo que nenhum transgressor fique impune.",
    rank: "HERÓI",
    afiliacao: "Justiça Cega",
    arma: "Balança E Lâmina Gêmea",
    poderes: "Rastreamento Kármico e Retribuição",
    prefixo: "Elena"
  }
];

// ==========================================
// 4. LISTA DOS 60 CÓDIGOS SECRETOS
// ==========================================
const secretCodes = [
  "NR-K89X", "NR-7B2M", "NR-9Q1Z", "NR-3F8L", "NR-5V2W", "NR-8T4P", "NR-2M9Y", "NR-6C1D", "NR-4H7K", "NR-1N5R",
  "NR-9E3S", "NR-7X8A", "NR-2Q4F", "NR-6L1T", "NR-8P9C", "NR-3W5V", "NR-5D7H", "NR-1Z2M", "NR-4K8B", "NR-9Y6N",
  "NR-7R1Q", "NR-2T8X", "NR-6F4W", "NR-8C9P", "NR-3M5L", "NR-5H7K", "NR-1V2D", "NR-4B8Y", "NR-9S6T", "NR-7A1Z",
  "NR-2W4E", "NR-6K8R", "NR-8X9M", "NR-3P5C", "NR-5L7F", "NR-1Q2V", "NR-4T8H", "NR-9D6B", "NR-7M1Y", "NR-2Y4S",
  "NR-6Z8A", "NR-8E9W", "NR-3C5K", "NR-5F7R", "NR-1H2X", "NR-4V8M", "NR-9B6P", "NR-7T1L", "NR-2K4C", "NR-6W8F",
  "NR-8S9D", "NR-3Y5H", "NR-5M7B", "NR-1R2T", "NR-4X8A", "NR-9F6V", "NR-7C1E", "NR-2D4W", "NR-6P8Y", "NR-8L9Z"
];

const variantes = [
  { tipo: "CASUAL", sufixo: "_casual.png", tagClass: "variant-casual" },
  { tipo: "HEROICO", sufixo: "_heroico.png", tagClass: "variant-heroico" },
  { tipo: "DIVINO", sufixo: "_divino.png", tagClass: "variant-divino" }
];

const heroesData = [];
let cardCounter = 1;

personagens.forEach((p) => {
  variantes.forEach((v) => {
    const idStr = String(cardCounter).padStart(3, '0');
    const secretCode = secretCodes[cardCounter - 1];

    heroesData.push({
      id: idStr,
      secretCode: secretCode,
      recordCode: `${p.numero_ficha}-${v.tipo.charAt(0)}`,
      name: p.nome,
      occupation: p.ocupacao,
      district: p.distrito,
      powers: p.poderes,
      tag: v.tipo,
      tagClass: v.tagClass,
      age: `${p.idade} ANOS`,
      role: p.rank,
      lineage: p.dominio,
      starsCount: p.estrelas,
      quote: `"${p.personalidade}"`,
      history: p.lore,
      image: `${p.prefixo}${v.sufixo}`,
      fallbackImage: "mascote.jpg"
    });
    cardCounter++;
  });
});

let unlockedHeroIds = new Set();
let scannerStream = null;
let scanningActive = false;

// ==========================================
// 5. RENDERIZAÇÃO DA GRELHA DE CARDS
// ==========================================
function renderHeroesGrid() {
  const grid = document.getElementById('heroesGrid');
  if (!grid) return;

  grid.innerHTML = heroesData.map(hero => {
    const isUnlocked = unlockedHeroIds.has(hero.id);
    const starString = "★".repeat(hero.starsCount);

    return `
      <div class="hero-card cyber-hud-corners ${isUnlocked ? 'unlocked' : 'locked'}" id="card-hero-${hero.id}">
        <div class="hero-card-viewport">
          <div class="view-panel active" id="view-photo-${hero.id}">
            <img src="${hero.image}" alt="${hero.name}" class="view-photo-img" onerror="this.src='${hero.fallbackImage}'">
          </div>

          <div class="view-panel view-text-panel" id="view-tactics-${hero.id}">
            <h4 class="view-panel-title">DADOS TÁTICOS</h4>
            <div class="tactic-field">
              <div class="tactic-label">NOME COMPLETO</div>
              <div class="tactic-val">${hero.name}</div>
            </div>
            <div class="tactic-field">
              <div class="tactic-label">OCUPAÇÃO</div>
              <div class="tactic-val">${hero.occupation}</div>
            </div>
            <div class="tactic-field">
              <div class="tactic-label">DISTRITO RESIDENTE</div>
              <div class="tactic-val">${hero.district}</div>
            </div>
            <div class="tactic-field">
              <div class="tactic-label">PODERES REGISTRADOS</div>
              <div class="tactic-val">${hero.powers}</div>
            </div>
            <div class="tactic-field">
              <div class="tactic-label">NÚMERO DE FICHA DE HERÓI</div>
              <div class="tactic-val cyan-text">${hero.recordCode} (ID: #${hero.id})</div>
            </div>
          </div>

          <div class="view-panel view-text-panel" id="view-history-${hero.id}">
            <h4 class="view-panel-title">ARQUIVO HISTÓRICO</h4>
            <p class="history-text">${hero.history}</p>
          </div>

          <div class="hero-tab-dock">
            <button type="button" class="dock-btn" data-hero="${hero.id}" data-mode="tactics" title="Dados Táticos">
              <i class="bi bi-file-earmark-text"></i>
            </button>
            <button type="button" class="dock-btn" data-hero="${hero.id}" data-mode="history" title="Arquivo Histórico">
              <i class="bi bi-bar-chart-steps"></i>
            </button>
            <button type="button" class="dock-btn active" data-hero="${hero.id}" data-mode="photo" title="Visualizar Fotografia">
              <i class="bi bi-eye"></i>
            </button>
          </div>
        </div>

        <div class="hero-footer-data">
          <div class="hero-main-row">
            <h3 class="hero-name" title="${hero.name}">${hero.name}</h3>
            <span class="hero-badge-tag ${hero.tagClass}">${hero.tag}</span>
          </div>
          <div class="hero-sub-row">
            <span>${hero.age}</span>
            <span class="hero-rank-tag">${hero.role}</span>
          </div>
          <p class="hero-lineage-title">${hero.lineage}</p>
          <div class="hero-stars">${starString}</div>
          <p class="hero-quote">${hero.quote}</p>
        </div>
      </div>
    `;
  }).join('');

  document.querySelectorAll('.dock-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const heroId = btn.getAttribute('data-hero');
      const mode = btn.getAttribute('data-mode');
      switchCardView(heroId, mode);
    });
  });

  const counterElem = document.getElementById('unlockedCount');
  if (counterElem) counterElem.textContent = unlockedHeroIds.size;
}

function switchCardView(heroId, mode) {
  const card = document.getElementById(`card-hero-${heroId}`);
  if (!card) return;

  const panels = card.querySelectorAll('.view-panel');
  panels.forEach(p => p.classList.remove('active'));

  const btns = card.querySelectorAll('.dock-btn');
  btns.forEach(b => b.classList.remove('active'));

  if (mode === 'photo') {
    card.querySelector(`#view-photo-${heroId}`).classList.add('active');
    btns[2].classList.add('active');
  } else if (mode === 'tactics') {
    card.querySelector(`#view-tactics-${heroId}`).classList.add('active');
    btns[0].classList.add('active');
  } else if (mode === 'history') {
    card.querySelector(`#view-history-${heroId}`).classList.add('active');
    btns[1].classList.add('active');
  }
}

// ==========================================
// 6. FIRESTORE: SINCRONIZAÇÃO E DESBLOQUEIO COM +150 XP
// ==========================================
async function loadUnlockedHeroes(userId) {
  try {
    const q = query(collection(db, "user_heroes"), where("userId", "==", userId));
    const snap = await getDocs(q);

    unlockedHeroIds.clear();
    snap.forEach(d => {
      unlockedHeroIds.add(d.data().heroId);
    });

    renderHeroesGrid();
    checkUrlUnlockParam();
  } catch (err) {
    console.error("Erro ao carregar coleção:", err);
  }
}

async function unlockHero(codeInput) {
  if (!auth.currentUser) return;
  const cleanCode = String(codeInput).trim().toUpperCase();

  const heroObj = heroesData.find(h => h.secretCode === cleanCode || h.id === cleanCode);

  if (!heroObj) {
    alert(`❌ Código "${cleanCode}" inválido! Certifique-se de escanear o QR Code oficial da arena.`);
    return;
  }

  if (unlockedHeroIds.has(heroObj.id)) {
    alert(`ℹ️ O card #${heroObj.id} (${heroObj.name} - ${heroObj.tag}) já está na sua coleção!`);
    return;
  }

  try {
    // 1. Grava o card desbloqueado
    await addDoc(collection(db, "user_heroes"), {
      userId: auth.currentUser.uid,
      heroId: heroObj.id,
      heroName: heroObj.name,
      variant: heroObj.tag,
      secretUsed: cleanCode,
      unlockedAt: serverTimestamp()
    });

    // 2. Grava +150 XP na conta do utilizador
    await addDoc(collection(db, "user_xp"), {
      userId: auth.currentUser.uid,
      amount: 150,
      reason: `DESBLOQUEIO_HEROI_${heroObj.id}_${heroObj.tag}`,
      createdAt: serverTimestamp()
    });

    unlockedHeroIds.add(heroObj.id);
    renderHeroesGrid();

    const targetCard = document.getElementById(`card-hero-${heroObj.id}`);
    if (targetCard) {
      targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    alert(`🎉 NOVO RECRUTA DESBLOQUEADO!\n\n${heroObj.name} (${heroObj.tag})\n⚡ +150 XP computados no seu crachá holográfico!`);
  } catch (e) {
    alert("Falha ao registrar desbloqueio: " + e.message);
  }
}

function checkUrlUnlockParam() {
  const params = new URLSearchParams(window.location.search);
  const unlockId = params.get('unlock');
  if (unlockId) {
    unlockHero(unlockId);
    window.history.replaceState({}, document.title, window.location.pathname);
  }
}

// ==========================================
// 7. SCANNER DE CÂMARA EM TEMPO REAL
// ==========================================
function startCameraScanner() {
  const modal = document.getElementById('nrScannerModal');
  const video = document.getElementById('scannerVideo');
  if (!modal || !video) return;

  modal.style.display = 'flex';
  scanningActive = true;

  const constraints = {
    video: {
      facingMode: { ideal: "environment" },
      width: { ideal: 640 },
      height: { ideal: 480 }
    },
    audio: false
  };

  navigator.mediaDevices.getUserMedia(constraints)
    .then(stream => {
      scannerStream = stream;
      video.srcObject = stream;
      video.onloadedmetadata = () => {
        video.play().then(() => {
          requestAnimationFrame(scanVideoFrame);
        }).catch(() => {
          video.muted = true;
          video.play();
          requestAnimationFrame(scanVideoFrame);
        });
      };
    })
    .catch(err => {
      console.warn("Câmera ideal falhou, tentando padrão:", err);
      navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        .then(stream => {
          scannerStream = stream;
          video.srcObject = stream;
          video.onloadedmetadata = () => {
            video.play();
            requestAnimationFrame(scanVideoFrame);
          };
        })
        .catch(error => {
          alert("Não foi possível acessar a câmera do dispositivo. Utilize o campo de ativação manual.");
          console.error("Erro câmera:", error);
        });
    });
}

function stopCameraScanner() {
  scanningActive = false;
  const modal = document.getElementById('nrScannerModal');
  const video = document.getElementById('scannerVideo');

  if (scannerStream) {
    scannerStream.getTracks().forEach(track => track.stop());
    scannerStream = null;
  }
  if (video) video.srcObject = null;
  if (modal) modal.style.display = 'none';
}

function scanVideoFrame() {
  if (!scanningActive) return;

  const video = document.getElementById('scannerVideo');
  const canvas = document.getElementById('scannerCanvas');

  if (video && video.readyState === video.HAVE_ENOUGH_DATA) {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    if (typeof jsQR !== "undefined") {
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: "dontInvert"
      });

      if (code && code.data) {
        stopCameraScanner();
        handleQrScannedPayload(code.data);
        return;
      }
    }
  }

  if (scanningActive) {
    requestAnimationFrame(scanVideoFrame);
  }
}

function handleQrScannedPayload(scannedText) {
  let targetCode = scannedText.trim();

  if (scannedText.includes('unlock=')) {
    try {
      const url = new URL(scannedText);
      targetCode = url.searchParams.get('unlock');
    } catch (e) {
      const match = scannedText.match(/unlock=([0-9a-zA-Z\-_]+)/);
      if (match) targetCode = match[1];
    }
  }

  if (targetCode) {
    unlockHero(targetCode);
  }
}

// ==========================================
// 8. AUTENTICAÇÃO SSO & INICIALIZAÇÃO
// ==========================================
onAuthStateChanged(auth, (user) => {
  const overlay = document.getElementById('nrAuthOverlay');
  const loggedPrompt = document.getElementById('nrLoggedPrompt');
  const loginForm = document.getElementById('nrLoginForm');
  const emailSpan = document.getElementById('nrLoggedEmail');

  const miniName = document.getElementById('nrMiniName');
  const miniAvatar = document.getElementById('nrMiniAvatarLetter');
  const miniFaction = document.getElementById('nrMiniFaction');

  if (user) {
    const displayName = user.displayName || user.email.split('@')[0];
    const initial = displayName.charAt(0).toUpperCase();

    if (emailSpan) emailSpan.textContent = user.email;
    if (loggedPrompt) loggedPrompt.style.display = 'block';
    if (loginForm) loginForm.style.display = 'none';

    if (miniName) miniName.textContent = displayName;
    if (miniAvatar) {
      if (user.photoURL) {
        miniAvatar.innerHTML = `<img src="${user.photoURL}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">`;
      } else {
        miniAvatar.textContent = initial;
      }
    }
    const savedGuild = localStorage.getItem(`nexus_guild_${user.uid}`);
    if (miniFaction && savedGuild) {
      miniFaction.textContent = savedGuild.toUpperCase();
    }

    loadUnlockedHeroes(user.uid);
  } else {
    if (loggedPrompt) loggedPrompt.style.display = 'none';
    if (loginForm) loginForm.style.display = 'block';
    if (overlay) overlay.style.display = 'flex';
  }
});

document.addEventListener('DOMContentLoaded', () => {
  renderHeroesGrid();

  const btnOpen = document.getElementById('btnOpenScanner');
  const btnClose = document.getElementById('btnCloseScanner');
  const btnManual = document.getElementById('btnManualUnlock');
  const manualInput = document.getElementById('manualHeroInput');
  const btnMiniLogout = document.getElementById('btnMiniLogout');

  if (btnOpen) btnOpen.addEventListener('click', startCameraScanner);
  if (btnClose) btnClose.addEventListener('click', stopCameraScanner);

  if (btnManual && manualInput) {
    btnManual.addEventListener('click', () => {
      const code = manualInput.value.trim();
      if (code) {
        stopCameraScanner();
        unlockHero(code);
        manualInput.value = '';
      }
    });

    manualInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        btnManual.click();
      }
    });
  }

  if (btnMiniLogout) {
    btnMiniLogout.addEventListener('click', () => {
      signOut(auth).then(() => {
        window.location.reload();
      });
    });
  }

  const btnProceed = document.getElementById('btnProceedCurrentAccount');
  const btnSwitch = document.getElementById('btnSwitchAccountPrompt');
  const loginForm = document.getElementById('nrLoginForm');

  if (btnProceed) {
    btnProceed.addEventListener('click', () => {
      document.getElementById('nrAuthOverlay').style.display = 'none';
      if (auth.currentUser) {
        loadUnlockedHeroes(auth.currentUser.uid);
      }
    });
  }

  if (btnSwitch) {
    btnSwitch.addEventListener('click', () => {
      document.getElementById('nrLoggedPrompt').style.display = 'none';
      document.getElementById('nrLoginForm').style.display = 'block';
    });
  }

  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('nrEmailInput').value.trim();
      const pass = document.getElementById('nrPassInput').value;

      try {
        const cred = await signInWithEmailAndPassword(auth, email, pass);
        document.getElementById('nrAuthOverlay').style.display = 'none';
        loadUnlockedHeroes(cred.user.uid);
      } catch (err) {
        alert("Falha de autenticação: " + err.message);
      }
    });
  }
});