window.addEventListener("load", () => {
    const factory = new mascotaFactory();
    let objeto;
    let selectRaza = document.getElementById("selectRaza");
    let detalleRaza = document.getElementById("detalleRaza");
    let razaNombre = document.getElementById("razaNombre");
    let razaDescripcion = document.getElementById("razaDescripcion");
    let razaAltura = document.getElementById("razaAltura");
    let razaPeso = document.getElementById("razaPeso");
    let razaTemperamento = document.getElementById("razaTemperamento");
    let razaAmistoso = document.getElementById("razaAmistoso");
    let razaImagen = document.getElementById("razaImagen");

    function manejarCambiosOpcionesTipo() {
        let mascotaSeleccionada = document.querySelector('input[name="MascotasOptions"]:checked');
        if (mascotaSeleccionada) {
            selectRaza.innerHTML = '<option value="">Cargando...</option>';
            objeto = factory.crear(mascotaSeleccionada.value);
            objeto.configurarSelect();
        }
    }

    selectRaza.addEventListener("change", () => {
        if (objeto && selectRaza.value) {
            let data = objeto.obtenerDatosRaza(selectRaza.value);
            if (data) objeto.mostrarDetalles(data);
        }
    });

    manejarCambiosOpcionesTipo();

    let botonesRadio = document.querySelectorAll('input[name="MascotasOptions"]');
    botonesRadio.forEach(radio => {
        radio.addEventListener('change', manejarCambiosOpcionesTipo);
    });
});

class mascota {
    tipo() {
        console.log("Se escogió una Mascota");
    }
    configurarSelect() {
        console.log("SELECT BOTH");
    }
}

class perro extends mascota {
    constructor() {
        super();
        console.log("Seleccionó Perro");
        this.razas = [];
        let selectRaza = document.getElementById("selectRaza");
        selectRaza.innerHTML = '<option value="">Cargando razas...</option>';
    }
    async configurarSelect() {
        let selectedRaza;
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
        }
        catch (error) {
            console.log(error);
        }
    }
    obtenerDatosRaza(id) {
        return this.razas.find(r => r.id == id);
    }
    mostrarDetalles(raza) {
        let cardRaza = document.getElementById("cardRaza");
        cardRaza.innerHTML = `
            <h2 id="razaNombre" class="card-title text-primary"></h2>
                <p>
                    <strong>Descripción:</strong>
                    <span id="razaDescripcion"></span>
                </p>
                <p>
                    <strong>Tamaño:</strong>
                    <span id="razaAltura"></span>
                    cm
                </p>
                <p>
                    <strong>Peso:</strong>
                    <span id="razaPeso"></span>
                    kg
                </p>
                <p>
                    <strong>Temperamento:</strong>
                    <span id="razaTemperamento"></span>
                </p>
                <img id="razaImagen" class="img-fluid rounded" alt="Imagen de la raza">
                <br>
                <br>
                 <button class="btn btn-outline-success" data-bs-toggle="modal" data-bs-target="#modalAdopcion"
                 onclick="document.getElementById('mensajeModal').innerText = '¿Estás seguro de que quieres adoptar un ${raza.name}?'">
                 ADOPTAR
                 </button>
                 `;
        razaNombre.textContent = raza.name;
        razaDescripcion.textContent = raza.description || "No disponible";
        razaAltura.textContent = raza.height.metric;
        razaPeso.textContent = raza.weight.metric;
        razaTemperamento.textContent = raza.temperament;

        razaImagen.src = raza.image?.url || "";
        detalleRaza.classList.remove("d-none");
    }
}

// Agrega esta función auxiliar antes de la clase gato
function generarEstrellas(valor) {
    const maxEstrellas = 5;
    let estrellasHTML = '';

    // Validar que valor sea un número válido (1-5)
    let puntuacion = parseInt(valor);
    if (isNaN(puntuacion) || puntuacion < 0) {
        puntuacion = 0;
    }
    if (puntuacion > 5) {
        puntuacion = 5;
    }

    for (let i = 1; i <= maxEstrellas; i++) {
        if (i <= puntuacion) {
            // Estrella llena (dorada)
            estrellasHTML += '<span style="color: #FFD700; font-size: 1.2rem;">★</span>';
        } else {
            // Estrella vacía (gris)
            estrellasHTML += '<span style="color: #D3D3D3; font-size: 1.2rem;">☆</span>';
        }
    }

    return estrellasHTML;
}

class gato extends mascota {
    constructor() {
        super();
        console.log("Seleccionó Gato");
        let razas = [];
        let selectRaza = document.getElementById("selectRaza");
        selectRaza.innerHTML = '<option value="">Cargando razas...</option>';
    }
    async configurarSelect() {
        try {
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
        catch (error) {
            console.log(error);
        }
    }
    obtenerDatosRaza(id) {
        return this.razas.find(r => r.id == id);
    }
    mostrarDetalles(raza) {

        // Generar estrellas para child_friendly
        let estrellasHTML = generarEstrellas(raza.child_friendly);

        let cardRaza = document.getElementById("cardRaza");
        cardRaza.innerHTML = `
        <h2 id="razaNombre" class="card-title text-primary text-center mb-3">${raza.name}</h2>
        
        <div class="text-start">
            <p><strong>Descripción:</strong> <span id="razaDescripcion">${raza.description || "No disponible"}</span></p>
            <p><strong>Peso:</strong> <span id="razaPeso">${raza.weight.metric}</span> kg</p>
            <p><strong>Temperamento:</strong> <span id="razaTemperamento">${raza.temperament || "No disponible"}</span></p>
            <p>
                <strong>Child Friendly:</strong> 
                <span id="razaAmistoso">${estrellasHTML}</span>
                <span class="text-muted ms-2">(${raza.child_friendly || 0}/5)</span>
            </p>
        </div>
        
        <img id="razaImagen" class="img-fluid rounded mt-3" alt="Imagen de la raza" style="max-height: 300px;">
        <br><br>
        <div class="text-center">
            <button class="btn btn-outline-success" data-bs-toggle="modal" data-bs-target="#modalAdopcion"
                    onclick="document.getElementById('mensajeModal').innerText = '¿Estás seguro de que quieres adoptar un ${raza.name}?'">
                ADOPTAR
            </button>
        </div>
    `;

        // Asignar valores a los spans
        document.getElementById("razaDescripcion").textContent = raza.description || "No disponible";
        document.getElementById("razaPeso").textContent = raza.weight.metric;
        document.getElementById("razaTemperamento").textContent = raza.temperament || "No disponible";
        document.getElementById("razaImagen").src = `https://cdn2.thecatapi.com/images/${raza.reference_image_id}.jpg`;

        detalleRaza.classList.remove("d-none");
    }
}

function generarEstrellas(valor) {
    const maxEstrellas = 5;
    let puntuacion = parseInt(valor);
    if (isNaN(puntuacion) || puntuacion < 0) puntuacion = 0;
    if (puntuacion > 5) puntuacion = 5;

    let estrellasHTML = '';
    for (let i = 1; i <= maxEstrellas; i++) {
        if (i <= puntuacion) {
            estrellasHTML += '<i class="bi bi-star-fill" style="color: #FFD700;"></i>';
        } else {
            estrellasHTML += '<i class="bi bi-star" style="color: #D3D3D3;"></i>';
        }
    }

    return estrellasHTML;
}

class mascotaFactory {
    crear(tipo) {
        switch (tipo) {
            case "perro":
                return new perro();
                break;

            case "gato":
                return new gato();
                break;
        }
    }
}
