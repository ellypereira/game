// Elementos da tela
const nameScreen   = document.getElementById("name-screen");
const nameInput    = document.getElementById("name-input");
const startBtn     = document.getElementById("start-btn");
const gameContainer= document.getElementById("game-container");

const textBox      = document.getElementById("text-box");
const choicesDiv   = document.getElementById("choices");
const fadeScreen   = document.getElementById("fade-screen");

// Afinidades iniciais
let affinity = JSON.parse(localStorage.getItem("affinity")) || {
  Lucien: 0,
  Elias: 0,
  Klaus: 0,
  Jake: 0
};

// Variáveis de estado
let playerName = "";
let index = 0;

// Quando clicar em Começar, salva nome e inicia o episódio
startBtn.onclick = () => {
  const name = nameInput.value.trim();
  if (!name) {
    return alert("Por favor, digite seu nome.");
  }
  playerName = name;
  localStorage.setItem("playerName", name);
  nameScreen.style.display = "none";
  gameContainer.style.display = "block";
  nextText();  // Inicia a história
};

// Função para mostrar texto e tratar fade + escolhas
function nextText() {
  // Nosso array de cenas
  const story = [
    () => `${playerName}: (uma inquieta noite cobria a cidade com uma neblina densa...)`,
    () => "(Você decidiu caminhar para clarear a mente, mas logo se viu cercada por árvores desconhecidas...)",
    () => "(O som de corvos ecoava. Você estava perdida, tremendo de medo.)",
    () => "(De repente, duas silhuetas surgiram entre as árvores. Um com olhos como fogo, outro com expressão angelical.)",
    () => "— Hum... humana perdida? — disse o de olhos ardentes.",
    () => "— Ela está assustada. Devemos ajudá-la — murmurou o outro.",
    // FADE: cena de desmaio
    () => "(Você corre, desesperada, mas tropeça e tudo escurece...)",
    // Cena após fade
    () => "(Você acorda em uma cama luxuosa. Um quarto escuro, velas acesas, aroma adocicado no ar.)",
    () => "Elias entra calmamente. — Você desmaiou, mas está segura agora.",
    () => "Lucien aparece logo depois, encostado na parede. — Ela é Frágil... mas intrigante."
  ];

  // Se ainda temos cenas...
  if (index < story.length) {
    // Cena 6: FADE
    if (index === 6) {
      // Mostra o texto antes do fade
      textBox.textContent = story[index++]();
      choicesDiv.innerHTML = "";

      // Dispara fade
      fadeScreen.style.opacity = 1;
      // Abaixa a música, se presente
      const music = document.getElementById("bg-music");
      if (music) music.volume = 0.2;

      setTimeout(() => {
        // Remove fade e mostra próxima cena
        fadeScreen.style.opacity = 0;
        if (music) music.volume = 1;
        textBox.textContent = story[index++]();
      }, 2000);

    // Cena 5: mostrar escolhas
    } else if (index === 8) {
      textBox.textContent = story[index++]();
      showChoices([
        { text: "Olhar para Lucien com curiosidade", action: () => { affinity.Lucien++; nextText(); } },
        { text: "Confiar mais em Elias",             action: () => { affinity.Elias++;  nextText(); } },
        { text: "Evitar ambos e tentar entender",    action: () => nextText() }
      ]);

    // Demais cenas normais
    } else {
      textBox.textContent = story[index++]();
      choicesDiv.innerHTML = "";
    }

  // Quando acabar as cenas...
  } else {
    // Salva afinidades e finaliza
    localStorage.setItem("affinity", JSON.stringify(affinity));
    textBox.textContent = "Fim do Episódio 1. Clique para continuar...";
    textBox.onclick = () => window.location.href = "ep2.html";
  }
}

// Renderiza botões de escolha
function showChoices(options) {
  textBox.onclick = null;
  choicesDiv.innerHTML = "";
  options.forEach(opt => {
    const btn = document.createElement("button");
    btn.className = "choice-button";
    btn.textContent = opt.text;
    btn.onclick = () => {
      textBox.onclick = nextText;
      opt.action();
    };
    choicesDiv.appendChild(btn);
  });
}
