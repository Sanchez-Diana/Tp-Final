mostrarMensaje = (mensaje) => {
    document.querySelector('#mensajeLog').innerHTML = mensaje;
  }
  mostrarMensaje=(mensaje)=>{
    console.log(mensaje)
    console.log(document.querySelector('#mensajeBack'))
    document.querySelector('#mensajeBack').className += " bg-warning";
    document.querySelector('#mensajeBack').innerHTML = mensaje
  }
  
  document.getElementById('eliminar').addEventListener('submit', async (event)=> {
    event.preventDefault();
  
    const contraseña = document.getElementById('contraseña').value;
  
    if(!contraseña){
      console.log('faltan datos')
      document.querySelector('#mensajeLog').innerHTML = '*Complete todos los datos'
      return
    }
  
      try {
        const enviarDatos = await fetch('/eliminar', {
          method: 'post',
          headers: {
            'content-type': 'application/json'
          },
          body: JSON.stringify({
           contraseña
          })
        })
       const respuesta= await enviarDatos.json()
      console.log(respuesta)
      mostrarMensaje(respuesta.mensaje)
        if (response.ok) {
          localStorage.removeItem('usuarioLogueado');
          setTimeout(() => {
              window.location.href = '/login.html';
          }, 2000); 
      
        }
      }catch (error) {
          console.log(error)
        }
  });