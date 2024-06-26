$(document).ready(function () {
  // Indicador para evitar la duplicación del script
  var scriptInitialized = false;

  function initializeScript() {
    if (scriptInitialized) return;
    scriptInitialized = true;

    // Obtener la URL actual y agregar la clase "active" al enlace correspondiente
    var urlActual = window.location.href;

    $(".menuLink1 .menu-link").each(function () {
      var enlace = $(this).attr("href");

      // Verificar si la URL actual coincide exactamente con el enlace
      if (urlActual === enlace) {
        $(this).addClass("active");
      }
    });

    // Cargar el contenido de la página al hacer clic en un enlace
    $(".menuLink1 .menu-link").on("click", function (event) {
      event.preventDefault();
      var url = $(this).attr("href");

      // Verificar si el enlace ya tiene la clase "active" antes de llamar a cargarContenido
      $("#contenido").load(url, function () {
        $.ajax({
          url: url,
          type: "GET",
          dataType: "html",
          success: function (response) {
            $("#contenido").empty();
            $("#contenido").html(response);

            // Eliminar duplicados en los selectores
            removeDuplicateOptions();

            setTimeout(function () {
              $("#contenido").removeClass("mostrar");
              $(".menuLink1 .menu-link").removeClass("active");
              $(".menuLink1 .menu-link[href='" + url + "']").addClass("active");
            }, 200);
          },
          error: function (xhr, status, error) {
            console.log("Error: " + xhr.status + " - " + xhr.statusText);
          },
        });
      });
    });
  }

  // Función para eliminar opciones duplicadas en los selectores
  function removeDuplicateOptions() {
    const selectIds = ['FilterEstado', 'UserRole', 'UserPlan'];

    selectIds.forEach(id => {
      const select = document.getElementById(id);
      if (!select) return;

      const seenOptions = new Set();
      const options = Array.from(select.options);

      options.forEach(option => {
        if (seenOptions.has(option.value)) {
          option.remove();
        } else {
          seenOptions.add(option.value);
        }
      });
    });
  }

  // Manipular el DOM inicialmente para prevenir duplicaciones
  function preventInitialDuplication() {
    // Eliminar cualquier instancia duplicada de scripts
    $('script[src]').each(function () {
      var src = $(this).attr('src');
      $('script[src="' + src + '"]:gt(0)').remove();
    });

    // Eliminar elementos duplicados por ID
    var ids = {};
    $('[id]').each(function () {
      if (ids[this.id]) {
        $(this).remove();
      } else {
        ids[this.id] = true;
      }
    });

    // Llamar a la función para eliminar duplicados en selectores
    removeDuplicateOptions();
  }

  // Ejecutar la función para prevenir duplicaciones iniciales
  preventInitialDuplication();

  // Inicializar el script
  initializeScript();
});


$(document).ready(function(){
  $('#calendar-link').click(function(e){
      e.preventDefault(); // Prevenir la acción por defecto del enlace

      var url = $(this).attr('href') + '?calendar=1'; // Agregar el parámetro

      $.ajax({
          url: url,
          type: 'GET',
          success: function(response) {
              // Manejar la respuesta del servidor si es necesario
              window.location.href = url; // Redirigir a la nueva URL
          },
          error: function() {
              // Manejar errores si ocurren
              console.error('Error al realizar la petición AJAX');
          }
      });
  });
});