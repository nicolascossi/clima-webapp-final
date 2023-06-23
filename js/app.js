const container = document.querySelector('.container')
const resultado = document.querySelector('#resultado')
const formulario = document.querySelector('#formulario')

window.addEventListener('load', () => {
    formulario.addEventListener('submit', buscarClima)
})

function buscarClima (e) {
    e.preventDefault()

    // Validar
    const ciudad = document.querySelector('#ciudad').value
    const pais = document.querySelector('#pais').value

    if ( ciudad === '' || pais === '') {
        //Hubo un error
        mostrarError('Ambos campos son obligatorios')
    
        return
    }
    // Consultar la API

    consultarAPI(ciudad, pais)
}

function mostrarError(mensaje) {

    const alerta = document.querySelector('.bg-red-100')

    if(!alerta){

        const alerta = document.createElement('div')

        alerta.classList.add('bg-red-100', 'border-red-400', 'text-red-700', 'px-4', 'py-3', 'rounded', 'max-w-md', 'mx-auto', 'mt-6','text-center' )
    
        alerta.innerHTML = `
            <strong class="font-bold">Error!</strong>
            <span class="block">${mensaje}</span>
            ` 
    
        container.appendChild(alerta)

        setTimeout(() => {
            alerta.remove()
        }, 5000);
    }

}


function consultarAPI(ciudad, pais) {

    const appId = '40edbeab252b2a08aa8b88446217fa0a'

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad},${pais}&appid=${appId}`


    fetch(url)
    .then( respuesta => respuesta.json())
    .then( datos => {
        console.log(datos)
        limpiarHTML()
        if(datos.cod === "404"){
            mostrarError('Ciudad no encontrada')
            return
        } 

        mostrarClima(datos)
    })
}

function mostrarClima(datos) {
    const { name, main: {temp, temp_max, temp_min, humidity, feels_like}, weather } = datos;
    const { id, main, descripcion, icon } = weather[0];

    
    const nombre = name;
    const centigrados = kelvinACentrigrados(temp);
    const min = kelvinACentrigrados(temp_min);
    const max = kelvinACentrigrados(temp_max);
    const hum = humidity;
    const feels = feels_like;
    const icono = icon

    const imgURL = `https://openweathermap.org/img/wn/${icono}@2x.png`;


    const img = document.createElement('img');
    img.src = imgURL;
    img.alt = 'Imagen del estado del Clima';
    img.style.display = 'block';
    img.style.margin = '0 auto';

    const sensacion = document.createElement('p');
    sensacion.innerHTML = `Sensación térmica: ${feels}&#8451;`;
    sensacion.classList.add('text-xl');

    const ciudadNombre = document.createElement('p');
    ciudadNombre.innerHTML = `${nombre}`;
    ciudadNombre.classList.add('font-bold', 'text-3xl');

    const actual = document.createElement('p');
    actual.innerHTML = `${centigrados} &#8451;`;
    actual.classList.add('font-bold', 'text-6xl');

    const tempMaxima = document.createElement('p');
    tempMaxima.innerHTML = `Máxima ${max} &#8451;`;
    tempMaxima.classList.add('text-xl');

    const tempMinima = document.createElement('p');
    tempMinima.innerHTML = `Mínima ${min} &#8451;`;
    tempMinima.classList.add('text-xl');

    const humedad = document.createElement('p');
    humedad.innerHTML = `Humedad: ${hum}%`;
    humedad.classList.add('text-xl');

    const resultadoDiv = document.createElement('div');
    resultadoDiv.classList.add('text-center', 'text-white');
    resultadoDiv.appendChild(img);
    resultadoDiv.appendChild(ciudadNombre);
    resultadoDiv.appendChild(actual);
    resultadoDiv.appendChild(sensacion);
    resultadoDiv.appendChild(tempMaxima);
    resultadoDiv.appendChild(tempMinima);
    resultadoDiv.appendChild(humedad);
    
    resultado.appendChild(resultadoDiv);
}


const kelvinACentrigrados = grados => parseInt(grados - 273.15)


function limpiarHTML() {
    while(resultado.firstChild){
        resultado.removeChild(resultado.firstChild)
    }
}

