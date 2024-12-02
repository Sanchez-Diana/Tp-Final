document.addEventListener('DOMContentLoaded', function() {
  mostrarNavbar();
});

const mostrarMensaje = (mensaje, esError = false) => {
  const mensajeBack = document.querySelector('#mensajeBack');
  if (mensajeBack) {
      mensajeBack.className = esError ? "bg-danger" : "bg-warning";
      mensajeBack.innerHTML = mensaje;
  } else {
      console.error('El elemento #mensajeBack no existe en el DOM.');
  }
};

const formlogin = document.forms['formlogin'];
if (formlogin) {
  formlogin.addEventListener('submit', (event) => {
      event.preventDefault();

      const nombre = formlogin.nombre.value;
      const contraseña = formlogin.contraseña.value;

      if (!nombre || !contraseña) {
          mostrarMensaje('*Complete todos los datos', true);
          return;
      }

      const datosLogin = { nombre, contraseña };

      const login = async () => {
          try {
              const response = await fetch('/login', {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(datosLogin),
              });

              if (!response.ok) {
                  mostrarMensaje('Error al verificar usuario', true);
                  return;
              }

              const data = await response.json();
              console.log('Datos del usuario:', data);

              loginUsuario(data);

              if (data.id_tip_usu == 1) {
                  window.location.href = '/admin.html';
              } else {
                  window.location.href = '/index.html';
              }
          } catch (error) {
              console.error('Error de login:', error);
              mostrarMensaje('Error al intentar iniciar sesión', true);
          }
      };

      login();
  });
} else {
  console.error('El formulario no existe.');
}

function loginUsuario(usuario) {
  localStorage.setItem('usuarioLogueado', JSON.stringify(usuario));
  mostrarNavbar();
}

function logOut() {
  localStorage.removeItem('usuarioLogueado');
  mostrarNavbar();
}

function mostrarNavbar() {
  const usuarioLogueado = JSON.parse(localStorage.getItem('usuarioLogueado'));

  if (usuarioLogueado) {
      document.getElementById('salir').style.display = 'block';
      document.getElementById('botonIngresar').style.display = 'none';
      document.getElementById('usuarioDropdown').querySelector('.nav-link').innerText = `Hola, ${usuarioLogueado.nombre}`;
  } else {
      document.getElementById('salir').style.display = 'none';
      document.getElementById('botonIngresar').style.display = 'block';
  }
}
