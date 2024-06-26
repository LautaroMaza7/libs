"use strict";
console.log("app-access-roles.js");

document.addEventListener("DOMContentLoaded", (event) => {
  // Lista de IDs de los select que queremos verificar
  const selectIds = ["FilterEstado", "UserRole", "UserPlan"];

  selectIds.forEach((id) => {
    removeDuplicateOptions(id);
  });
});

function removeDuplicateOptions(selectId) {
  const select = document.getElementById(selectId);
  if (!select) return;

  const seenOptions = new Set();
  const options = Array.from(select.options);

  options.forEach((option) => {
    if (seenOptions.has(option.value)) {
      option.remove();
    } else {
      seenOptions.add(option.value);
    }
  });
}

var dt_user;

$(function () {
  var dtUserTable = $(".datatables-users"),
    statusObj = {
      1: { title: "Sin contactar", class: "bg-label-warning" },
      2: { title: "Abordado", class: "bg-label-success" },
      3: { title: "No esta interesado", class: "bg-label-secondary" },
      4: { title: "Cancelo entrevista", class: "bg-label-secondary" },
      5: { title: "Tuvo entrevista", class: "bg-label-secondary" },
      6: { title: "Cerro venta", class: "bg-label-secondary" },
    };

  if (dtUserTable.length) {
    dt_user = dtUserTable.DataTable({
      ajax: "https://www.somoslux.es/master/prod/main/seguimiento/clientes-desde-vendedor.php",
      columns: [
        { data: "" },
        { data: "id" },
        { data: "full_name" },
        { data: "estado_id" },
        { data: "ingreso" },
        { data: null },
      ],
      columnDefs: [
        {
          // For Responsive
          className: "control",
          orderable: false,
          searchable: false,
          responsivePriority: 4,
          targets: 0,
          render: function (data, type, full, meta) {
            return "";
          },
        },
        {
          // Invoice ID
          targets: 1,
          responsivePriority: 1,
          render: function (data, type, full, meta) {
            var $invoice_id = full["id"];
            // Creates full output for row
            var $row_output =
              '<span class="fw-medium">#' + $invoice_id + "</span>";
            return $row_output;
          },
        },
        {
          targets: 2,
          responsivePriority: 4,
          render: function (data, type, full, meta) {
            var $name = full["full_name"],
              $direccion = full["full_address"],
              $image = full["avatar"];
            if ($image) {
              var $output =
                '<img src="https://cdn-icons-png.flaticon.com/512/6596/6596121.png" alt="Avatar" class="rounded-circle">';
            } else {
              var stateNum = Math.floor(Math.random() * 6) + 1;
              var states = [
                "success",
                "danger",
                "warning",
                "info",
                "dark",
                "primary",
                "secondary",
              ];
              var $state = states[stateNum],
                $initials = $name.match(/\b\w/g) || [];
              $initials = (
                ($initials.shift() || "") + ($initials.pop() || "")
              ).toUpperCase();
              $output =
                '<span class="avatar-initial rounded-circle bg-label-' +
                $state +
                '">' +
                $initials +
                "</span>";
            }
            var $row_output =
              '<div class="d-flex justify-content-left align-items-center">' +
              '<div class="avatar-wrapper">' +
              '<div class="avatar avatar-sm me-3">' +
              $output +
              "</div>" +
              "</div>" +
              '<div class="d-flex flex-column">' +
              '<a style="cursor:pointer;" class="text-body text-truncate"><span class="fw-medium">' +
              $name +
              "</span></a>" +
              '<small class="text-muted">' +
              $direccion +
              "</small>" +
              "</div>" +
              "</div>";
            return $row_output;
          },
        },
        {
          targets: 3,
          responsivePriority: 2,
          render: function (data, type, full, meta) {
            var $status = full["estado_id"];
            return (
              '<span class="badge ' +
              statusObj[$status].class +
              '">' +
              statusObj[$status].title +
              "</span>"
            );
          },
        },
        {
          targets: 4,
          render: function (data, type, full, meta) {
            var $ingreso = full["ingreso"];
            return '<span class="fw-medium">' + $ingreso + "</span>";
          },
        },
        {
          targets: -1,
          title: "View",
          searchable: false,
          orderable: false,
          render: function (data, type, full, meta) {
            return (
              '<button class="btn btn-sm btn-icon editarEvento-btn" data-bs-toggle="modal" data-bs-target="#modalCenter" data-id="' +
              full["id"] +
              '"><i class="bx bx-edit"></i></button>'
            );
          },
        },
      ],
      order: [[1, "desc"]],
      dom:
        '<"d-flex justify-content-between align-items-center row py-3 gap-3 gap-md-0"' +
        '<"col-md-4 user_plan">' +
        '<"col-md-4 user_status">' +
        ">" +
        '<"row mx-2"' +
        '<"col-md-2"<"me-3"l>>' +
        '<"col-md-10"<"dt-action-buttons text-xl-end text-lg-start text-md-end text-start d-flex align-items-center justify-content-end flex-md-row flex-column mb-3 mb-md-0"fB>>' +
        ">t" +
        '<"row mx-2"' +
        '<"col-sm-12 col-md-6"i>' +
        '<"col-sm-12 col-md-6"p>' +
        ">",
      language: {
        sLengthMenu: "_MENU_",
        search: "",
        searchPlaceholder: "Buscar..",
      },
      // Buttons with Dropdown
      buttons: [
        {
          extend: "collection",
          className: "btn btn-label-secondary dropdown-toggle mx-3",
          text: '<i class="bx bx-export me-1"></i>Export',
          buttons: [
            {
              extend: "print",
              text: '<i class="bx bx-printer me-2" ></i>Print',
              className: "dropdown-item",
              exportOptions: {
                columns: [1, 2, 3, 4, 5],
                // prevent avatar to be print
                format: {
                  body: function (inner, coldex, rowdex) {
                    if (inner.length <= 0) return inner;
                    var el = $.parseHTML(inner);
                    var result = "";
                    $.each(el, function (index, item) {
                      if (
                        item.classList !== undefined &&
                        item.classList.contains("user-name")
                      ) {
                        result = result + item.lastChild.firstChild.textContent;
                      } else if (item.innerText === undefined) {
                        result = result + item.textContent;
                      } else result = result + item.innerText;
                    });
                    return result;
                  },
                },
              },
              customize: function (win) {
                //customize print view for dark
                $(win.document.body)
                  .css("color", headingColor)
                  .css("border-color", borderColor)
                  .css("background-color", bodyBg);
                $(win.document.body)
                  .find("table")
                  .addClass("compact")
                  .css("color", "inherit")
                  .css("border-color", "inherit")
                  .css("background-color", "inherit");
              },
            },
            {
              extend: "csv",
              text: '<i class="bx bx-file me-2" ></i>Csv',
              className: "dropdown-item",
              exportOptions: {
                columns: [1, 2, 3, 4, 5],
                // prevent avatar to be display
                format: {
                  body: function (inner, coldex, rowdex) {
                    if (inner.length <= 0) return inner;
                    var el = $.parseHTML(inner);
                    var result = "";
                    $.each(el, function (index, item) {
                      if (
                        item.classList !== undefined &&
                        item.classList.contains("user-name")
                      ) {
                        result = result + item.lastChild.firstChild.textContent;
                      } else if (item.innerText === undefined) {
                        result = result + item.textContent;
                      } else result = result + item.innerText;
                    });
                    return result;
                  },
                },
              },
            },
            {
              extend: "excel",
              text: '<i class="bx bxs-file-export me-2"></i>Excel',
              className: "dropdown-item",
              exportOptions: {
                columns: [1, 2, 3, 4, 5],
                // prevent avatar to be display
                format: {
                  body: function (inner, coldex, rowdex) {
                    if (inner.length <= 0) return inner;
                    var el = $.parseHTML(inner);
                    var result = "";
                    $.each(el, function (index, item) {
                      if (
                        item.classList !== undefined &&
                        item.classList.contains("user-name")
                      ) {
                        result = result + item.lastChild.firstChild.textContent;
                      } else if (item.innerText === undefined) {
                        result = result + item.textContent;
                      } else result = result + item.innerText;
                    });
                    return result;
                  },
                },
              },
            },
            {
              extend: "pdf",
              text: '<i class="bx bxs-file-pdf me-2"></i>Pdf',
              className: "dropdown-item",
              exportOptions: {
                columns: [1, 2, 3, 4, 5],
                // prevent avatar to be display
                format: {
                  body: function (inner, coldex, rowdex) {
                    if (inner.length <= 0) return inner;
                    var el = $.parseHTML(inner);
                    var result = "";
                    $.each(el, function (index, item) {
                      if (
                        item.classList !== undefined &&
                        item.classList.contains("user-name")
                      ) {
                        result = result + item.lastChild.firstChild.textContent;
                      } else if (item.innerText === undefined) {
                        result = result + item.textContent;
                      } else result = result + item.innerText;
                    });
                    return result;
                  },
                },
              },
            },
            {
              extend: "copy",
              text: '<i class="bx bx-copy me-2" ></i>Copy',
              className: "dropdown-item",
              exportOptions: {
                columns: [1, 2, 3, 4, 5],
                // prevent avatar to be display
                format: {
                  body: function (inner, coldex, rowdex) {
                    if (inner.length <= 0) return inner;
                    var el = $.parseHTML(inner);
                    var result = "";
                    $.each(el, function (index, item) {
                      if (
                        item.classList !== undefined &&
                        item.classList.contains("user-name")
                      ) {
                        result = result + item.lastChild.firstChild.textContent;
                      } else if (item.innerText === undefined) {
                        result = result + item.textContent;
                      } else result = result + item.innerText;
                    });
                    return result;
                  },
                },
              },
            },
          ],
        },
        {
          text: '<i class="bx bx-plus me-0 me-sm-1"></i><span class="d-none d-sm-inline-block">Añadir Nuevo Cliente</span>',
          className: "add-new btn btn-primary",
          attr: {
            "data-bs-toggle": "offcanvas",
            "data-bs-target": "#offcanvasAddUser",
          },
        },
      ],
      responsive: {
        details: {
          display: $.fn.dataTable.Responsive.display.modal({
            header: function (row) {
              return "Ver Detalle";
            },
          }),
          type: "column",
          // target: -1 ,
          renderer: function (api, rowIdx, columns) {
            var data = $.map(columns, function (col, i) {
              return col.title !== ""
                ? '<tr data-dt-row="' +
                    col.rowIndex +
                    '" data-dt-column="' +
                    col.columnIndex +
                    '">' +
                    "<td>" +
                    col.title +
                    ":" +
                    "</td> " +
                    "<td>" +
                    col.data +
                    "</td>" +
                    "</tr>"
                : "";
            }).join("");

            return data
              ? $('<table class="table"/><tbody />').append(data)
              : false;
          },
        },
      },
      initComplete: function () {
        var api = this.api();

        // Estado filter
        var estadoColumn = api.column(3);
        var estadoSelect = $(
          '<select id="FilterEstado" class="form-select text-capitalize"><option value="">Estado</option></select>'
        )
          .appendTo(".user_status")
          .on("change", function () {
            var val = $.fn.dataTable.util.escapeRegex($(this).val());
            estadoColumn.search(val ? "^" + val + "$" : "", true, false).draw();
          });

        $.each(statusObj, function (key, value) {
          estadoSelect.append(
            '<option value="' + value.title + '">' + value.title + "</option>"
          );
        });

        // Ingreso filter
        var ingresoColumn = api.column(4);
        var ingresoSelect = $(
          '<select id="UserPlan" class="form-select text-capitalize"><option value="">Ingreso</option></select>'
        )
          .appendTo(".user_plan")
          .on("change", function () {
            var val = $.fn.dataTable.util.escapeRegex($(this).val());
            ingresoColumn
              .search(val ? "^" + val + "$" : "", true, false)
              .draw();
          });

        ingresoColumn
          .data()
          .unique()
          .sort()
          .each(function (d, j) {
            ingresoSelect.append(
              '<option value="' + d + '">' + d + "</option>"
            );
          });
      },
    });
  }

  setTimeout(() => {
    $(".dataTables_filter .form-control").removeClass("form-control-sm");
    $(".dataTables_length .form-select").removeClass("form-select-sm");
  }, 300);
});

function eliminarEspaciosEnBlanco(texto) {
  if (typeof texto === "string") {
    return texto.trim();
  }
  return texto;
}

function esCampoValido(valor) {
  return valor.length > 0;
}

$(document).ready(function () {
  console.log("HOLAAAAAAAA");

  $("#agregar-cliente-btn").click(function (e) {
    e.preventDefault(); // Prevenir el comportamiento predeterminado del formulario

    var nombre = eliminarEspaciosEnBlanco($("#nombre").val());
    var apellido = eliminarEspaciosEnBlanco($("#apellido").val());
    var direccion = eliminarEspaciosEnBlanco($("#direccion").val());
    var localidad = eliminarEspaciosEnBlanco($("#localidad").val());
    var provincia = eliminarEspaciosEnBlanco($("#provincia").val());
    var pais = eliminarEspaciosEnBlanco($("#pais").val());
    var celular = eliminarEspaciosEnBlanco($("#celular").val());
    var perfil = $("#perfil").val();
    var ingreso = $("#ingreso").val();

    var formData = {
      nombre: nombre,
      apellido: apellido,
      direccion: direccion,
      localidad: localidad,
      provincia: provincia,
      pais: pais,
      celular: celular,
      perfil: perfil,
      ingreso: ingreso,
    };
    var campos = [
      nombre,
      apellido,
      direccion,
      localidad,
      provincia,
      pais,
      celular,
      perfil,
      ingreso,
    ];

    if (campos.every(esCampoValido)) {
      $(this).prop("disabled", true);
      var formData = {
        nombre: nombre,
        apellido: apellido,
        direccion: direccion,
        localidad: localidad,
        provincia: provincia,
        pais: pais,
        celular: celular,
        perfil: perfil,
        ingreso: ingreso,
      };

      $.ajax({
        url: $("#agregar-cliente-form").attr("action"),
        type: $("#agregar-cliente-form").attr("method"),
        data: formData,
        success: function (response) {
          console.log(response);
          document.querySelector('button[data-bs-dismiss="offcanvas"]').click();
          limpiarFormularioEvento();
          Swal.fire("Cliente agregado correctamente", "", "success");
          var id = response.id;
          dt_user.ajax.reload();
        },
        error: function (error) {
          alert("Ocurrió un error al agregar el Cliente");
        },
        complete: function () {
          $("#agregar-cliente-form").prop("disabled", false);
        },
      });
    } else {
      Swal.fire({
        title: "Error",
        text: "Por favor, complete todos los campos antes de enviar.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  });

  function limpiarFormularioEvento() {
    $("#nombre").val("");
    $("#apellido").val("");
    $("#direccion").val("");
    $("#localidad").val("");
    $("#provincia").val("");
    $("#pais").val("");
    $("#celular").val("");
    $("#perfil").val("");
    $("#ingreso").val("");
  }

  $(document).on("click", ".editarEvento-btn", function () {
    var id = $(this).data("id");
    $("#editar-id").val(id);
    console.log(id);
  });


  $(".btn-enviar").click(function () {
    $("#editar-asignado-form").submit();
  });

  // Manejar el envío del formulario de edición
  $("#editar-asignado-form").submit(function (e) {
    e.preventDefault();

    $.ajax({
      url: $(this).attr("action"),
      type: $(this).attr("method"),
      data: $(this).serialize(),
      success: function (response) {
        console.log(response);
        document.querySelector('button[data-bs-dismiss="modal"]').click();
        Swal.fire("Cliente actualizado correctamente", "", "success");
        // Recargar la tabla de datos
        dt_user.ajax.reload();
      },
      error: function (error) {
        alert("Ocurrió un error al actualizar el Cliente");
      },
    });
  });
});
