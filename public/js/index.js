

function fetchTodosLosPokemon(){

  fetch("http://localhost:3000/pokemones")
.then((res) => {
  if (!res.ok) {
    throw new Error(`HTTP error! Status: ${res.status}`);
  }
  return res.json();
})
.then((pokemones) => {
  const html = pokemones
    .map((pokemon) => {
      return `
        <article class="${pokemon.type[0]} bg-${pokemon.type[0]}" data-id="${pokemon.id}">
            <h1 class="article-title pokemon-text">${pokemon.name.english}</h1>         
             <img class="imagen-article" src="http://localhost:3000/images/pokedex/hires/${pokemon.id}.png" alt="${pokemon.name.english}">                  
        </article>
      `;
    })
    .join("");
  document.querySelector("main").innerHTML = html;
})
.catch((error) => console.error("Error fetching pokemones:", error));

}

fetchTodosLosPokemon()

// boton buscar

const botonBuscar = document.getElementById("btn-buscar");

botonBuscar.addEventListener("click", () => {
  const search = document.querySelector("#search").value.trim(); 
  
  if (search) {
    console.log(search);
    fetch(`http://localhost:3000/pokemones?name=${search}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then((pokemones) => {
        const html = pokemones
          .map((pokemon) => {
            return `
              <article class="${pokemon.type[0]} bg-${pokemon.type[0]}" data-id="${pokemon.id}">
                  <h1 class="article-title pokemon-text">${pokemon.name.english}</h1>               
                  <img class="imagen-article" src="http://localhost:3000/images/pokedex/hires/${pokemon.id}.png" alt="${pokemon.name.english}">                  
              </article>
            `;
          })
          .join("");
        document.querySelector("main").innerHTML = html;
      })
      .catch((error) => console.error("Error fetching filtered pokemons:", error));
  }
});



// filtro botones de clase

document.querySelector(".nav-list").querySelectorAll(".btn.btn-header").forEach(button => {
  button.addEventListener("click", (event) => { 
    const button = event.target.closest("button").id;
    //const category = event.target.id;
    if (button == 'ver-todos'){
      fetchTodosLosPokemon();
      return;
    }
    if (button) {
      console.log(button);
      fetch(`http://localhost:3000/pokemones?type=${button}`)
        .then((res) => {
          if (!res.ok) {
            throw new Error(`HTTP error! Status: ${res.status}`);
          }
          return res.json();
        })
        .then((pokemones) => {
          const html = pokemones
            .map((pokemon) => {
              return `
                <article class="${pokemon.type[0]} bg-${pokemon.type[0]}" data-id="${pokemon.id}">
                    <h1 class="article-title pokemon-text">${pokemon.name.english}</h1>               
                    <img class="imagen-article" src="http://localhost:3000/images/pokedex/hires/${pokemon.id}.png" alt="${pokemon.name.english}">                  
                </article>
              `;
            })
            .join("");
          document.querySelector("main").innerHTML = html;
        })
        .catch((error) => console.error("Error fetching filtered pokemons:", error));
    }
  })
});




document.addEventListener("click", (event) => {
  const article = event.target.closest("article");

  if (!article || !article.dataset.id) return; // Evita errores si no hay ID

  const id = article.dataset.id;
  console.log(id);

  fetch(`http://localhost:3000/pokemones/${id}`)
    .then((res) => {
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
      return res.json();
    })
    .then((pokemon) => {
      // Reproducir sonido del Pokémon
      const audio = new Audio(`http://localhost:3000/sound/cries/${pokemon.id}.wav`);
      audio.volume = 0.5; // Ajusta el volumen
      audio.play().catch(error => console.error("Error al reproducir el audio:", error));

      // Referencias a elementos del modal
      let ModalContent = document.getElementById("modal-content"); 
      let ModalInfo = document.getElementById("modal-info"); 
      let seccionTipos = document.getElementById("modal-type-img");

      // Resetear clases antes de agregar nuevas
      ModalContent.className = "modal-content"; 
      ModalInfo.className = "modal-info";
      seccionTipos.className = "seccion-tipos";

      if (pokemon.type?.length) {
        ModalContent.classList.add(pokemon.type[0], `bg-${pokemon.type[0]}`);
        ModalInfo.classList.add(pokemon.type[0]);
        seccionTipos.classList.add(pokemon.type[0]);
      }

      // Actualizar información del modal
      document.getElementById("modal-title").innerText = pokemon.name.english;
      document.getElementById("modal-id").innerText = `#${pokemon.id}`;  
      document.getElementById("modal-img").src = `http://localhost:3000/images/pokedex/hires/${pokemon.id}.png`;

      // Mostrar tipos del Pokémon
      document.querySelector("#modal-type-img").innerHTML = pokemon.type?.map(type => `
          <div class="tipos">              
              <img class="type-img" src="http://localhost:3000/images/symbolTypes/types3/${type}.png" alt="${type}"/>
              <p><strong>${type}</strong></p>
          </div>
      `).join("") || "<p>Tipo desconocido</p>";

      // Mostrar estadísticas con operador `?.` y valores por defecto
      document.getElementById("modal-hp").innerText = `HP: ${pokemon.base?.HP ?? "??"}`;
      document.getElementById("modal-attack").innerText = `Ataque: ${pokemon.base?.Attack ?? "??"}`;
      document.getElementById("modal-defense").innerText = `Defensa: ${pokemon.base?.Defense ?? "??"}`;
      document.getElementById("modal-speed").innerText = `Velocidad: ${pokemon.base?.Speed ?? "??"}`;

      // Mostrar el modal
      document.getElementById("pokemonModal").style.display = "block";
    })
    .catch((error) => console.error("Error fetching Pokémon:", error));
});



  // Cerrar el modal cuando se haga clic en la "X"
document.querySelector(".close").addEventListener("click", () => {
  document.getElementById("pokemonModal").style.display = "none";

  let ModalContent = document.getElementById("modal-content"); 
  let ModalInfo = document.getElementById("modal-info"); 

  ModalContent.classList.remove(all);
  ModalInfo.classList.remove(all);
  seccionTipos.classList.remove(all);
});

// Cerrar el modal cuando se haga clic fuera del contenido
window.addEventListener("click", (event) => {
  if (event.target == document.getElementById("pokemonModal")) {
      document.getElementById("pokemonModal").style.display = "none";

      let ModalContent = document.getElementById("modal-content"); 
      let ModalInfo = document.getElementById("modal-info"); 

      ModalContent.classList.remove(all);
      ModalInfo.classList.remove(all);
      seccionTipos.classList.remove(all);
  }
});