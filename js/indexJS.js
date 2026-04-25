let objeto;

window.addEventListener("load", () => {
    const factory = new mascotaFactory();
  mostrarAdopciones();
    let selectRaza = document.getElementById("selectRaza");
    let detalleRaza = document.getElementById("detalleRaza");
    let cardRaza = document.getElementById("cardRaza");

    let filtrosBusqueda = document.getElementById("filtrosBusqueda");
    let filtro1 = document.getElementById("filtro1");
    let filtro2 = document.getElementById("filtro2");
    let labelFiltro1 = document.getElementById("labelFiltro1");
    let labelFiltro2 = document.getElementById("labelFiltro2");
    let btnBuscar = document.getElementById("btnBuscar");

    function manejarCambiosOpcionesTipo() {
        let mascotaSeleccionada = document.querySelector('input[name="MascotasOptions"]:checked');

        if (!mascotaSeleccionada) return;

        if (mascotaSeleccionada.value == "perro") {
            labelFiltro1.textContent = "Breed Group";
            labelFiltro2.textContent = "Temperament";
        } else {
            labelFiltro1.textContent = "Temperament";
            labelFiltro2.textContent = "Child Friendly (1-5)";
        }

        filtrosBusqueda.classList.remove("d-none");

        // ESTO FALTABA
        objeto = factory.crear(mascotaSeleccionada.value);
        objeto.configurarSelect();
    }

    selectRaza.addEventListener("change", () => {
        if (objeto && selectRaza.value) {
            let data = objeto.obtenerDatosRaza(selectRaza.value);
            if (data) objeto.mostrarDetalles(data);
        }
    });

    let botonesRadio = document.querySelectorAll('input[name="MascotasOptions"]');
    botonesRadio.forEach(radio => {
        radio.addEventListener('change', manejarCambiosOpcionesTipo);
    });

    btnBuscar.addEventListener("click", () => {
        if (!objeto || !objeto.razas) return;

        let valor1 = filtro1.value.toLowerCase();
        let valor2 = filtro2.value.toLowerCase();

        let resultados = objeto.filtrarRazas(valor1, valor2);

        selectRaza.innerHTML = '<option value="">Resultados encontrados</option>';

        resultados.forEach(raza => {
            let option = document.createElement("option");
            option.value = raza.id;
            option.textContent = raza.name;
            selectRaza.appendChild(option);
        });
    });

});

function mostrarAdopciones() {
    let lista = document.getElementById("listaAdopciones");
    lista.innerHTML = "";

    let adopciones = JSON.parse(localStorage.getItem("adopciones")) || [];

    adopciones.forEach(mascota => {
        let li = document.createElement("li");
        li.className = "list-group-item";

        li.textContent = `${mascota.name} (${mascota.tipo})`;

        lista.appendChild(li);
    });
}



class mascota {
    adoptar(raza, tipo) {
        let adopciones = JSON.parse(localStorage.getItem("adopciones")) || [];
        let cardRaza = document.getElementById("cardRaza");

        let mascota = adopciones.find(item => item.id === raza.id);

        if (mascota) {
            alert('ERROR: Ya Fue Adoptado');
        } else {
            raza['tipo'] = tipo;
            adopciones.push(raza);

            localStorage.setItem("adopciones", JSON.stringify(adopciones));

            alert('¡Adopción confirmada!');
            cardRaza.innerHTML = "";
        }
        mostrarAdopciones();
    }
}

class perro extends mascota {
    constructor() {
        super();
        this.razas = [];
        document.getElementById("selectRaza").innerHTML = '<option>Cargando...</option>';
    }

    async configurarSelect() {
        try {
            let key_api = "live_qBzFtPWAjpXymxen924IM53CXfVEofyxJwSp0PhigWJCsW9gYzzBLeTEzKXGzch8"
            const response = await fetch(`https://api.thedogapi.com/v1/breeds?api_key=${key_api}`);
            this.razas = await response.json();

            let selectRaza = document.getElementById("selectRaza");
            selectRaza.innerHTML = '<option value="">Selecciona una raza</option>';

            this.razas.forEach(raza => {
                let option = document.createElement("option");
                option.value = raza.id;
                option.textContent = raza.name;
                selectRaza.appendChild(option);
            });
        } catch (error) {
            console.log(error);
        }
    }

    obtenerDatosRaza(id) {
        return this.razas.find(r => r.id == id);
    }

    mostrarDetalles(raza) {
        let mascotaSeleccionada = document.querySelector('input[name="MascotasOptions"]:checked');

        let cardRaza = document.getElementById("cardRaza");
        cardRaza.innerHTML = `
            <h2 id="razaNombre"></h2>
            <p><span id="razaDescripcion"></span></p>
            <p><span id="razaAltura"></span></p>
            <p><span id="razaPeso"></span></p>
            <p><span id="razaTemperamento"></span></p>
            <img id="razaImagen">
            <button data-bs-toggle="modal" data-bs-target="#modalAdopcion">ADOPTAR</button>
        `;

        document.getElementById("confirmarAdopcion").onclick = function () {
            objeto.adoptar(raza, mascotaSeleccionada.value);
        };

        document.getElementById("razaNombre").textContent = raza.name;
        document.getElementById("razaDescripcion").textContent = raza.description || "No disponible";
        document.getElementById("razaAltura").textContent = raza.height.metric;
        document.getElementById("razaPeso").textContent = raza.weight.metric;
        document.getElementById("razaTemperamento").textContent = raza.temperament;
        document.getElementById("razaImagen").src = raza.image?.url || "";

        document.getElementById("detalleRaza").classList.remove("d-none");
    }

    filtrarRazas(grupo, temperamento) {
        return this.razas.filter(raza => {
            let g = !grupo || (raza.breed_group && raza.breed_group.toLowerCase().includes(grupo));
            let t = !temperamento || (raza.temperament && raza.temperament.toLowerCase().includes(temperamento));
            return g && t;
        });
    }
}

class gato extends mascota {
    constructor() {
        super();
        this.razas = []; // corregido
        document.getElementById("selectRaza").innerHTML = '<option>Cargando...</option>';
    }

    async configurarSelect() {
        const response = await fetch(`https://api.thecatapi.com/v1/breeds`);
        this.razas = await response.json();

        let selectRaza = document.getElementById("selectRaza");
        selectRaza.innerHTML = '<option value="">Selecciona una raza</option>';

        this.razas.forEach(raza => {
            let option = document.createElement("option");
            option.value = raza.id;
            option.textContent = raza.name;
            selectRaza.appendChild(option);
        });
    }

    obtenerDatosRaza(id) {
        return this.razas.find(r => r.id == id);
    }

    mostrarDetalles(raza) {
        let mascotaSeleccionada = document.querySelector('input[name="MascotasOptions"]:checked');

        let cardRaza = document.getElementById("cardRaza");
        cardRaza.innerHTML = `
            <h2>${raza.name}</h2>
            <p>${raza.description}</p>
            <button data-bs-toggle="modal" data-bs-target="#modalAdopcion">ADOPTAR</button>
        `;

        document.getElementById("confirmarAdopcion").onclick = function () {
            objeto.adoptar(raza, mascotaSeleccionada.value);
        };

        document.getElementById("detalleRaza").classList.remove("d-none");
    }

    filtrarRazas(t, c) {
        return this.razas.filter(r =>
            (!t || r.temperament?.toLowerCase().includes(t)) &&
            (!c || r.child_friendly == c)
        );
    }
}

function generarEstrellas(valor) {
    let html = '';
    for (let i = 1; i <= 5; i++) {
        html += i <= valor ? '★' : '☆';
    }
    return html;
}

class mascotaFactory {
    crear(tipo) {
        if (tipo == "perro") return new perro();
        if (tipo == "gato") return new gato();
    }
}