let objeto;
window.addEventListener("load", () => {
    const factory = new mascotaFactory();
    let selectRaza = document.getElementById("selectRaza");
    let detalleRaza = document.getElementById("detalleRaza");
    let razaNombre = document.getElementById("razaNombre");
    let razaDescripcion = document.getElementById("razaDescripcion");
    let razaAltura = document.getElementById("razaAltura");
    let razaPeso = document.getElementById("razaPeso");
    let razaTemperamento = document.getElementById("razaTemperamento");
    let razaAmistoso = document.getElementById("razaAmistoso");
    let razaImagen = document.getElementById("razaImagen");
    let cardRaza = document.getElementById("cardRaza");
    let filtrosBusqueda = document.getElementById("filtrosBusqueda");
    let filtro1 = document.getElementById("filtro1");
    let filtro2 = document.getElementById("filtro2");
    let labelFiltro1 = document.getElementById("labelFiltro1");
    let labelFiltro2 = document.getElementById("labelFiltro2");
    let btnBuscar = document.getElementById("btnBuscar");

    function manejarCambiosOpcionesTipo() {
        let mascotaSeleccionada = document.querySelector('input[name="MascotasOptions"]:checked');
        if(mascotaSeleccionada.value=="perro"){
               labelFiltro1.textContent="Breed Group";
               labelFiltro2.textContent="Temperament";
          }
                else{
                      labelFiltro1.textContent="Temperament";
                      labelFiltro2.textContent="Child Friendly (1-5)";
                    }

                filtrosBusqueda.classList.remove("d-none");
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

    btnBuscar.addEventListener("click", ()=>{

    if(!objeto || !objeto.razas) return;

    let valor1 = filtro1.value.toLowerCase();
    let valor2 = filtro2.value.toLowerCase();

    let resultados = objeto.filtrarRazas(valor1, valor2);

    selectRaza.innerHTML='<option value="">Resultados encontrados</option>';

    resultados.forEach(raza=>{
        let option=document.createElement("option");
        option.value=raza.id;
        option.textContent=raza.name;
        selectRaza.appendChild(option);
    });

});
    
});

class mascota {
    tipo() {
        console.log("Se escogió una Mascota");
    }
    configurarSelect() {
        console.log("SELECT BOTH");
    }
    adoptar(raza, tipo) {
        let adopciones = JSON.parse(localStorage.getItem("adopciones")) || [];
        let cardRaza = document.getElementById("cardRaza");
        let mascota = adopciones.find(item => item.id === raza.id);

        if (mascota) {
            alert('ERROR: Ya Fue Adoptado');
        }
        else {
            raza['tipo'] = tipo;
            adopciones.push(raza);

            localStorage.setItem("adopciones", JSON.stringify(adopciones));

            alert('¡Adopción confirmada!')
            cardRaza.innerHTML = "";
        }
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
        let mascotaSeleccionada = document.querySelector('input[name="MascotasOptions"]:checked');
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
        document.getElementById("confirmarAdopcion").onclick = function () {
            let tipo = mascotaSeleccionada.value;
            try {
                objeto.adoptar(raza, tipo);
            }
            catch (error) {
                alert('Error: ' + error);
            }
        };
        razaNombre.textContent = raza.name;
        razaDescripcion.textContent = raza.description || "No disponible";
        razaAltura.textContent = raza.height.metric;
        razaPeso.textContent = raza.weight.metric;
        razaTemperamento.textContent = raza.temperament;

        razaImagen.src = raza.image?.url || "";
        detalleRaza.classList.remove("d-none");
    }

    filtrarRazas(grupo, temperamento){

return this.razas.filter(raza=>{

let cumpleGrupo =
 !grupo ||
 (raza.breed_group &&
 raza.breed_group.toLowerCase().includes(grupo));

let cumpleTemperamento=
 !temperamento ||
 (raza.temperament &&
 raza.temperament.toLowerCase().includes(temperamento));

return cumpleGrupo && cumpleTemperamento;

});

}
    
}

function generarEstrellas(valor) {
    const maxEstrellas = 5;
    let estrellasHTML = '';

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
        let mascotaSeleccionada = document.querySelector('input[name="MascotasOptions"]:checked');
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

        document.getElementById("confirmarAdopcion").onclick = function () {
            let tipo = mascotaSeleccionada.value;
            try {
                objeto.adoptar(raza, tipo);
            }
            catch (error) {
                alert('Error: ' + error);
            }
        };

        // Asignar valores a los spans
        document.getElementById("razaDescripcion").textContent = raza.description || "No disponible";
        document.getElementById("razaPeso").textContent = raza.weight.metric;
        document.getElementById("razaTemperamento").textContent = raza.temperament || "No disponible";
        document.getElementById("razaImagen").src = `https://cdn2.thecatapi.com/images/${raza.reference_image_id}.jpg`;

        detalleRaza.classList.remove("d-none");
    }

    filtrarRazas(temperamento, childFriendly){

return this.razas.filter(raza=>{

let cumpleTemperamento =
!temperamento ||
(raza.temperament &&
raza.temperament.toLowerCase().includes(temperamento));

let cumpleChild=
!childFriendly ||
String(raza.child_friendly)===childFriendly;

return cumpleTemperamento && cumpleChild;

});

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
