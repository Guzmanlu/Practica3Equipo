window.addEventListener("load", () => {
    const factory = new mascotaFactory();
    let objeto;

    function manejarCambiosOpcionesTipo() {
        let mascotaSeleccionada = document.querySelector('input[name="MascotasOptions"]:checked');
        if (mascotaSeleccionada) {
            objeto = factory.crear(mascotaSeleccionada.value);
            objeto.configurarSelect();
        }
    }

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
    }
    configurarSelect() {
        let datos = traerDatosPerros();

        async function traerDatosPerros() {
            try {
                let key_api = "live_qBzFtPWAjpXymxen924IM53CXfVEofyxJwSp0PhigWJCsW9gYzzBLeTEzKXGzch8"
                const response = await fetch(`https://api.thedogapi.com/v1/breeds?api_key=${key_api}`);
                const razas = await response.json();

                return razas;
            }
            catch (error) {
                console.log(error);
            }
        }
    }
}

class gato extends mascota {
    constructor() {
        super();
        console.log("Seleccionó Gato");
    }
    configurarSelect() {
        let datos = traerDatosGatos();
        async function traerDatosGatos() {
            try {
                const response = await fetch(`https://api.thecatapi.com/v1/breeds`);
                const razas = await response.json();

                return razas;
            }
            catch (error) {
                console.log(error);
            }
        }
    }
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