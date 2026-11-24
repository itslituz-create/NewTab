
//--------------------hora----------------------------
const checkboxSegundos = document.getElementById('Segundos');
const relojElemento = document.getElementById('reloj');

function actualizarReloj() {
    const ahora = new Date();
    const horas = String(ahora.getHours()).padStart(2, '0');
    const minutos = String(ahora.getMinutes()).padStart(2, '0');
    const segundos = String(ahora.getSeconds()+1).padStart(2,'0');

    relojElemento.textContent = `${horas}:${minutos}:${segundos}`;
}
actualizarReloj();
setInterval(actualizarReloj, 1000);
//--------------------fecha----------------------------
const DiaMesElemento = document.getElementById('fecha')
function DiaMes() {
    const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado']
    const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']

    const hoy = new Date();
    const dia = String(hoy.getDate()).padStart(2,'0');
    const semana = diasSemana[hoy.getDay()];
    const mes = meses[hoy.getMonth()];

    DiaMesElemento.textContent = `${semana}, ${dia} de ${mes}`;
}

DiaMes();

//--------------------panel----------------------------
const boton = document.getElementById('B_confi');
const menu = document.getElementById('menu');
const btnCerrar = document.getElementById('cerrar-menu');
boton.addEventListener('click', (e) => {
    e.stopPropagation();
    menu.classList.add('activo');
});

// Cerrar con la "X"
btnCerrar.addEventListener('click', () => {
    menu.classList.remove('activo');
});

// Cerrar si haces clic fuera del panel
document.addEventListener('click', (e) => {
    if (!menu.contains(e.target) && e.target !== boton) {
        menu.classList.remove('activo');
    }
});

//--------------------notas----------------------------
const cajaNotas = document.getElementById('notas');

if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
    chrome.storage.local.get(['misNotas'], (resultado) => {
        if (resultado.misNotas) {
            cajaNotas.value = resultado.misNotas;
        }
    });
} else {
    const textoGuardado = localStorage.getItem('misNotas');
    if (textoGuardado !== null) {
        cajaNotas.value = textoGuardado;
    }
}

// 2. Guardar automáticamente al escribir
cajaNotas.addEventListener('input', () => {
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
        chrome.storage.local.set({ misNotas: cajaNotas.value });
    } else {
        localStorage.setItem('misNotas', cajaNotas.value);
    }
});


//--------------------pomodoro----------------------------
const pomoTiempo = document.getElementById('pomo-tiempo');
const pomoModo = document.getElementById('pomo-modo');
const btnPomoIniciar = document.getElementById('pomo-iniciar');
const btnPomoReiniciar = document.getElementById('pomo-reiniciar');
const btnPomoCambiar = document.getElementById('pomo-cambiar');

let esEnfoque = true;
let segundosRestantes = 25 * 60;
let intervaloPomo = null;

function actualizarVistaPomo() {
    const min = String(Math.floor(segundosRestantes / 60)).padStart(2, '0');
    const seg = String(segundosRestantes % 60).padStart(2, '0');
    pomoTiempo.textContent = `${min}:${seg}`;
    pomoModo.textContent = esEnfoque ? 'Enfoque' : 'Descanso';
}

function sonarAlerta() {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const oscilador = audioCtx.createOscillator();
    oscilador.type = 'sine';
    oscilador.frequency.setValueAtTime(520, audioCtx.currentTime);
    oscilador.connect(audioCtx.destination);
    oscilador.start();
    oscilador.stop(audioCtx.currentTime + 0.4);
}

function cambiarModoPomo() {
    clearInterval(intervaloPomo);
    intervaloPomo = null;
    btnPomoIniciar.textContent = 'Iniciar';
    esEnfoque = !esEnfoque;
    segundosRestantes = (esEnfoque ? 25 : 5) * 60;
    actualizarVistaPomo();
}

btnPomoIniciar.addEventListener('click', () => {
    if (intervaloPomo) {
        clearInterval(intervaloPomo);
        intervaloPomo = null;
        btnPomoIniciar.textContent = 'Iniciar';
    } else {
        btnPomoIniciar.textContent = 'Pausar';
        intervaloPomo = setInterval(() => {
            segundosRestantes--;
            actualizarVistaPomo();

            if (segundosRestantes <= 0) {
                sonarAlerta();
                cambiarModoPomo();
            }
        }, 1000);
    }
});

btnPomoReiniciar.addEventListener('click', () => {
    clearInterval(intervaloPomo);
    intervaloPomo = null;
    btnPomoIniciar.textContent = 'Iniciar';
    segundosRestantes = (esEnfoque ? 25 : 5) * 60;
    actualizarVistaPomo();
});

btnPomoCambiar.addEventListener('click', cambiarModoPomo);

//-----------------------todo--------------------------------
//--------------------panel----------------------------
const agregar = document.getElementById('mas');
const todoform = document.getElementById('todoform');
agregar.addEventListener('click', (e) => {
    e.stopPropagation();
    todoform.classList.add('activo');
});

// Cerrar si haces clic fuera del panel
document.addEventListener('click', (e) => {
    if (!todoform.contains(e.target) && e.target !== agregar) {
        todoform.classList.remove('activo');
    }
});


//---------------------todo---------------------

let tareas = JSON.parse(localStorage.getItem('mistareas')) || [];
const tareaAgregar = document.getElementById('agregar');

tareaAgregar.addEventListener('click', () => {
    const dia = parseInt(document.getElementById('dia').value, 10);
    const mes = parseInt(document.getElementById('mes').value, 10)-1;
    const titulo = document.getElementById('titulo').value;

    const anioActual = new Date().getFullYear();
    const fecha = new Date(anioActual, mes, dia);

    if (fecha.getDate() !== dia || fecha.getMonth() !== mes) {
        alert('Esa fecha no existe');
        return;
    };

    if (!titulo.trim()) {
    alert('Escribe un título para la tarea');
    return;
    };
    const nuevaTarea = {
        id: Date.now(),
        titulo: titulo,
        dia: dia,
        mes: mes,
        fechaTexto: `${String(dia).padStart(2, '0')}/${String(mes + 1).padStart(2, '0')}`,
        completada: false
    };
    tareas.push(nuevaTarea);
    localStorage.setItem('mistareas', JSON.stringify(tareas));

    document.getElementById('titulo').value = '';
    document.getElementById('dia').value = '';
    document.getElementById('mes').value = '';
    mostrarTareas();
})

function mostrarTareas() {
    const listaHoy = document.getElementById('listahoy');
    const listaManana = document.getElementById('listamanana');
    const listaDespues = document.getElementById('listadespues');

    listaHoy.innerHTML = '';
    listaManana.innerHTML = '';
    listaDespues.innerHTML = '';

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const manana = new Date(hoy);
    manana.setDate(hoy.getDate() + 1);

    const anioActual = hoy.getFullYear();

    tareas.forEach((tarea) => {
        // Usamos directamente tarea.mes y tarea.dia sin hacer .split()
        const fechaTarea = new Date(anioActual, tarea.mes, tarea.dia);
        fechaTarea.setHours(0, 0, 0, 0);

        const li = document.createElement('li');
        li.textContent = `${tarea.fechaTexto} - ${tarea.titulo}`;

        if (fechaTarea.getTime() === hoy.getTime()) {
            listaHoy.appendChild(li);
        } else if (fechaTarea.getTime() === manana.getTime()) {
            listaManana.appendChild(li);
        } else if (fechaTarea.getTime() > manana.getTime()) {
            listaDespues.appendChild(li);
        }
    });
}

mostrarTareas();
