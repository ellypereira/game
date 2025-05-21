document.addEventListener("DOMContentLoaded", () => {
  const playerName = localStorage.getItem("playerName") || "Você";
  let affinity = JSON.parse(localStorage.getItem("affinity")) || {
    Lucien: 0,
    Elias: 0,
    Klaus: 0,
    Jake: 0
  };

  const textBox = document.getElementById("text-box");
  const choicesDiv = document.getElementById("choices");
  const sceneImage = document.getElementById("scene-image");

  let awaitingClick = false; // controla se estamos esperando clique para continuar
  let storyIndex = 0; // índice do passo atual

  const story = [
    {
      text: () => `${playerName}: os primeiros raios da madrugada filtravam pelas frestas do quarto sombrio...`,
      image: null,
      choices: null
    },
    {
      text: () => "Você se sentia confusa, mas havia algo intrigante naquela atmosfera gótica e acolhedora.",
      image: null,
      choices: null
    },
    {
      text: () => { showImage("quarto.png"); return null; }, // exibe a imagem
      image: "quarto.png",
      choices: null
    },
    {
      text: () => "Lucien estava à sua porta, encostado com seu sorriso torto.",
      image: null,
      choices: null
    },
    {
      text: () => "— Dormiu bem, pequena mortal? — ele provocou, os olhos cravados em você.",
      image: null,
      choices: null
    },
    {
      text: () => "Elias logo aparece, oferecendo uma xícara quente de algo que parecia chocolate... ou sangue?",
      image: null,
      choices: null
    },
    {
      text: () => {
        showChoices([
          {
            text: "Aceitar a bebida e sorrir para Elias",
            action: () => { affinity.Elias++; next(); }
          },
          {
            text: "Olhar intensamente para Lucien e recusar",
            action: () => { affinity.Lucien++; next(); }
          },
          {
            text: "Pegar a bebida, mas continuar alerta",
            action: () => { next(); }
          }
        ]);
        return null;
      },
      image: null,
      choices: null
    },
    {
      text: () => "Enquanto você tomava o líquido quente, um terceiro homem apareceu na soleira da porta...",
      image: null,
      choices: null
    },
    {
      text: () => { showImage("assets/klaus.png"); return null; },
      image: "assets/klaus.png",
      choices: null
    },
    {
      text: () => "Ele tinha olhos prateados, uma aura fria, mas elegante. — Klaus. O anfitrião silencioso.",
      image: null,
      choices: null
    },
    {
      text: () => "— Então, você é a nova companhia. Espero que aprecie a estadia — disse ele, sem sorrir.",
      image: null,
      choices: null
    },
    {
      text: () => {
        hideImage();
        showChoices([
          {
            text: "Responder educadamente e tentar ser amigável",
            action: () => { affinity.Klaus++; next(); }
          },
          {
            text: "Desviar o olhar e manter a postura defensiva",
            action: () => { next(); }
          },
          {
            text: "Ficar intrigada e observar Klaus em silêncio",
            action: () => { affinity.Klaus++; next(); }
          }
        ]);
        return null;
      },
      image: null,
      choices: null
    },
    {
      text: () => "A tensão pairava no ar, mas também uma energia densa e sensual entre você e os três...",
      image: null,
      choices: null
    },
    {
      text: () => { showImage("assets/tensao.png"); return null; },
      image: "assets/tensao.png",
      choices: null
    },
    {
      text: () => "Lucien se aproxima e toca seu queixo. — Vai se acostumar, ou não vai sobreviver aqui.",
      image: null,
      choices: null
    },
    {
      text: () => {
        hideImage();
        showChoices([
          {
            text: "Responder com desafio: 'Posso ser mais forte do que pareço'",
            action: () => { affinity.Lucien++; next(); }
          },
          {
            text: "Desviar o rosto e encarar Elias em busca de segurança",
            action: () => { affinity.Elias++; next(); }
          },
          {
            text: "Olhar para Klaus, procurando alguma reação",
            action: () => { affinity.Klaus++; next(); }
          }
        ]);
        return null;
      },
      image: null,
      choices: null
    },
    {
      text: () => "Fim do Episódio 2. Clique para continuar...",
      image: null,
      choices: null
    }
  ];

  function showImage(src) {
    sceneImage.src = src;
    sceneImage.style.display = "block";
  }

  function hideImage() {
    sceneImage.style.display = "none";
  }

  function processStory() {
    if (storyIndex >= story.length) {
      // Finalizar episódio
      localStorage.setItem("affinity", JSON.stringify(affinity));
      window.location.href = "ep3.html";
      return;
    }

    const current = story[storyIndex];
    const result = current.text();

    if (result !== null) {
      // Exibe o texto normalmente
      textBox.textContent = result;
      choicesDiv.innerHTML = "";
      storyIndex++;
      // Aqui, se a próxima ação for uma imagem, ela será exibida e o fluxo ficará esperando o clique
    } else {
      // Caso seja uma ação de exibir imagem
      if (current.image) {
        showImage(current.image);
        // Depois que a imagem aparecer, esperar o clique na caixa de texto para continuar
        awaitingClick = true;
        // Incrementa o índice para a próxima rodada ao clicar
      } else {
        // Se não há texto nem imagem, avança imediatamente
        storyIndex++;
        processStory();
      }
    }
  }

  // Clique na caixa de texto para avançar ou continuar após mostrar uma imagem
  textBox.addEventListener("click", () => {
    if (choicesDiv.innerHTML.trim() !== "") {
      // Se há escolhas, não avança automaticamente
      return;
    }
    if (awaitingClick) {
      // Se estamos esperando o clique após uma imagem
      hideImage();
      awaitingClick = false;
      processStory();
    } else {
      // Caso normal
      processStory();
    }
  });

  // Mostrar escolhas
  function showChoices(options) {
    textBox.onclick = null; // impede avanço automático
    choicesDiv.innerHTML = "";
    options.forEach(opt => {
      const btn = document.createElement("button");
      btn.className = "choice-button";
      btn.textContent = opt.text;
      btn.onclick = () => {
        opt.action();
        // Após escolher, o fluxo geralmente avança na ação
        // então, não precisa fazer mais nada aqui
      };
      choicesDiv.appendChild(btn);
    });
  }

  // Iniciar a narrativa
  processStory();
});