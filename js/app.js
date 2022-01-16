//Campos del Formulario
const mascotaInput = document.querySelector(`#mascota`);
const propietarioInput = document.querySelector(`#propietario`);
const telefonoInput = document.querySelector(`#telefono`);
const fechaInput = document.querySelector(`#fecha`);
const horaInput = document.querySelector(`#hora`);
const sintomasInput = document.querySelector(`#sintomas`);

//UI
const formulario = document.querySelector(`#nueva-cita`);

const contenedorCitas = document.querySelector(`#citas`);

let editando = false;

//Clases
class Citas {
    constructor(){
        this.citas = [];
    };

    agregarCita(cita) {
        this.citas = [...this.citas, cita];
    };

    eliminarCita(id) {
        this.citas = this.citas.filter(cita => cita.id !== id);
    };

    editarCita(citaActualizada){
        this.citas = this.citas.map(cita => cita.id === citaActualizada.id ? citaActualizada : cita)
    };
};

class UI {

    imprimirAlerta(mensaje, tipo) {
        
        //Crear el Div.
        const divMensaje = document.createElement(`div`);
        divMensaje.classList.add(`text-center`, `alert`, `d-block`, `col-12`);

        //Agregar clase en base al tipo de error.
        if(tipo === `error`) {
            divMensaje.classList.add(`alert-danger`);
        } else {
            divMensaje.classList.add(`alert-success`);
        };

        //Mensaje de error.
        divMensaje.textContent = mensaje;

        //Agregar al HTML.
        document.querySelector(`#contenido`).insertBefore(divMensaje, document.querySelector(`.agregar-cita`));

        //Quitar la alerta.
        setTimeout(() => {
            divMensaje.remove(); 
        }, 5000);
    };

    imprimirCitas({citas}) {

        this.limpiarHtml();

        citas.forEach( cita => {
            const { mascota, propietario, telefono, fecha, hora, sintomas, id } = cita;

            const divCita = document.createElement(`div`);
            divCita.classList.add(`cita`, `p-3`);
            divCita.dataset.id = id;

            //Scripting de los elementos de la cita.
            const mascotaParrafo = document.createElement(`h2`);
            mascotaParrafo.classList.add(`card-title`, `font-weigth-bolder`);
            mascotaParrafo.textContent = `${mascota}`;

            const propietarioParrafo = document.createElement(`p`);
            propietarioParrafo.innerHTML = `
            <span class"font-weigth-bolder">Propietario: </span> ${propietario}
            `;

            const telefonoParrafo = document.createElement(`p`);
            telefonoParrafo.innerHTML = `
            <span class"font-weigth-bolder">Telefono: </span> ${telefono}
            `;

            const fechaParrafo = document.createElement(`p`);
            fechaParrafo.innerHTML = `
            <span class"font-weigth-bolder">Fecha: </span> ${fecha}
            `;

            const horaParrafo = document.createElement(`p`);
            horaParrafo.innerHTML = `
            <span class"font-weigth-bolder">Hora: </span> ${hora}
            `;

            const sintomasParrafo = document.createElement(`p`);
            sintomasParrafo.innerHTML = `
            <span class"font-weigth-bolder">Sintomas: </span> ${sintomas}
            `;

            //Boton para elimiar citas.
            const btnEliminar = document.createElement(`button`);
            btnEliminar.classList.add(`btn`, `btn-danger`, `mr-2`);
            btnEliminar.innerHTML = `Eliminar <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>`;
            btnEliminar.onclick = () => eliminarCita(id);

            //Boton para editar citas.
            const btnEditar = document.createElement(`button`);
            btnEditar.classList.add(`btn`, `btn-info`);
            btnEditar.innerHTML = `Editar <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"></path></svg>`;
            btnEditar.onclick = () => cargarEdicion(cita);

            //Agregar los parrafos al divCita.
            divCita.appendChild(mascotaParrafo);
            divCita.appendChild(propietarioParrafo);
            divCita.appendChild(telefonoParrafo);
            divCita.appendChild(fechaParrafo);
            divCita.appendChild(horaParrafo);
            divCita.appendChild(sintomasParrafo);
            divCita.appendChild(btnEliminar);
            divCita.appendChild(btnEditar);

            //Agregar citas al HTML.
            contenedorCitas.appendChild(divCita);
        })
    };

    limpiarHtml(){
        while(contenedorCitas.firstChild) {
            contenedorCitas.removeChild(contenedorCitas.firstChild);
        };
    };
};

const ui = new UI();
const administrarCitas = new Citas();

//Registrar Eventos
eventListeners();

function eventListeners(){
    mascotaInput.addEventListener(`change`, datosCita);
    propietarioInput.addEventListener(`change`, datosCita);
    telefonoInput.addEventListener(`change`, datosCita);
    fechaInput.addEventListener(`change`, datosCita);
    horaInput.addEventListener(`change`, datosCita);
    sintomasInput.addEventListener(`change`, datosCita);

    formulario.addEventListener(`submit`, nuevaCita);
};

//Objeto con la información de la cita.
const citaObj = {
    mascota: ``,
    propietario: ``,
    telefono: ``,
    fecha: ``,
    hora: ``,
    sintomas: ``
};

//Agregar datos al objeto de la cita.
function datosCita(e){
    citaObj[e.target.name] = e.target.value;
};

//Valida y agrega una nueva cita a la clase de citas.
function nuevaCita(e){
    e.preventDefault();

    //Extraer la información del objeto de cita.
    const { mascota, propietario, telefono, fecha, hora, sintomas } = citaObj;

    //Validación
    if(mascota === `` || propietario === `` || telefono === `` || fecha === `` || hora === `` || sintomas === ``) {
        ui.imprimirAlerta(`Todos los campos son obligatorios`, `error`);

        return;
    }

    if(editando){
        ui.imprimirAlerta(`Editado correctamente`);

        //Pasar el objeto de la cita a edición.
        administrarCitas.editarCita({...citaObj});

        //Regresar el texto del botón a su estado original.
        formulario.querySelector(`button[type="submit"]`).textContent = `Crear cita`;

        //Quitar "modo edición".
        editando = false;

    } else {

        //Generar ID único.
        citaObj.id = Date.now();

        //Crear una nueva cita.
        administrarCitas.agregarCita({...citaObj});

        //Mensaje de agregado correcto.
        ui.imprimirAlerta(`Se agregó correctamente`);

    };

    //Mostrar las citas en el HTML.
    ui.imprimirCitas(administrarCitas);

    //Reiniciar el objeto para su validación.
    reiniciarObjeto();

    //Reiniciar el formulario.
    formulario.reset();
};

function reiniciarObjeto() {
    citaObj.mascota = ``;
    citaObj.propietario = ``;
    citaObj.telefono = ``;
    citaObj.fecha = ``;
    citaObj.hora = ``;
    citaObj.sintomas = ``;
};

function eliminarCita(id) {
    //Eliminar la cita.
    administrarCitas.eliminarCita(id);

    //Refrescar las citas.
    ui.imprimirCitas(administrarCitas);

    //Mostrar un mensaje.
    ui.imprimirAlerta(`La cita se eliminó correctamente`);
};

//Cargar los datos y el modo edicion.
function cargarEdicion(cita){
    const { mascota, propietario, telefono, fecha, hora, sintomas, id } = cita;

    //Reiniciar el objeto.
    citaObj.mascota = mascota;
    citaObj.propietario = propietario;
    citaObj.telefono = telefono;
    citaObj.fecha = fecha;
    citaObj.hora = hora;
    citaObj.sintomas = sintomas;
    citaObj.id = id;
    
    //Llenar los inputs.
    mascotaInput.value = mascota;
    propietarioInput.value = propietario;
    telefonoInput.value = telefono;
    fechaInput.value = fecha;
    horaInput.value = hora;
    sintomasInput.value = sintomas;

    //Cambiar el texto del boton.
    formulario.querySelector(`button[type="submit"]`).textContent = `Guardar cambios`;

    editando = true;   //Habilita el "modo edición".
};