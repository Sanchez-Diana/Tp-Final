document.addEventListener('DOMContentLoaded', () => {
  const endpoint = '/usuario';  
  const form = document.forms['formRegistro'];

  // Define la función para mostrar mensajes
  function mostrarMensaje(mensaje) {
    const mensajeElement = document.querySelector('#mensaje');
    if (mensajeElement) {
      mensajeElement.innerHTML = mensaje; // Muestra el mensaje en el elemento con id "mensaje"
    } else {
      console.error('Elemento con id "mensaje" no encontrado');
    }
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    let nombre = form.nombre.value;
    let contraseña = form.contraseña.value;
    let id_tip_usu = 2;  // Aquí se establece el valor correcto

    let newDatos = { nombre, contraseña, id_tip_usu };

    console.log("Datos enviados al servidor:", newDatos);  

    if (!newDatos.nombre || !newDatos.contraseña || newDatos.id_tip_usu === undefined) {
      mostrarMensaje('*Complete todos los datos');
      return;
    } else {
      mostrarMensaje('Usuario creado');
    }

    let nuevosDatosJson = JSON.stringify(newDatos);

    const enviarusuarios = async () => {
      try {
        const enviarDatos = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: nuevosDatosJson,
        });

        if (!enviarDatos.ok) {
          throw new Error('Error en la respuesta del servidor');
        }

        const respuesta = await enviarDatos.json();
        console.log('Respuesta del servidor:', respuesta);

        setTimeout(() => {
          location.reload();
        }, 1000);
      } catch (error) {
        console.error('Error en la solicitud:', error);
      }
    };

    enviarusuarios();
  });
});
