/**
 * App Calendar
 */

/**
 * ! If both start and end dates are same Full calendar will nullify the end date value.
 * ! Full calendar will end the event on a day before at 12:00:00AM thus, event won't extend to the end date.
 * ! We are getting events from a separate file named app-calendar-events.js. You can add or remove events from there.
 *
 **/

"use strict";

let direction = "ltr";

if (isRtl) {
  direction = "rtl";
}

document.addEventListener("DOMContentLoaded", function () {
  (function () {
    const calendarEl = document.getElementById("calendar"),
      appCalendarSidebar = document.querySelector(".app-calendar-sidebar"),
      addEventSidebar = document.getElementById("addEventSidebar"),
      appOverlay = document.querySelector(".app-overlay"),
      calendarsColor = {
        Entrevistas: "primary",
      },
      offcanvasTitle = document.querySelector(".offcanvas-title"),
      btnToggleSidebar = document.querySelector(".btn-toggle-sidebar"),
      btnSubmit = document.querySelector('button[type="submit"]'),
      btnDeleteEvent = document.querySelector(".btn-delete-event"),
      btnCancel = document.querySelector(".btn-cancel"),
      eventTitle = document.querySelector("#eventTitle"),
      eventStartDate = document.querySelector("#eventStartDate"),
      eventEndDate = document.querySelector("#eventEndDate"),
      eventUrl = document.querySelector("#eventURL"),
      eventLabel = $("#eventLabel"), // ! Using jquery vars due to select2 jQuery dependency
      eventGuests = $("#eventGuests"), // ! Using jquery vars due to select2 jQuery dependency
      eventLocation = document.querySelector("#eventLocation"),
      eventDescription = document.querySelector("#eventDescription"),
      allDaySwitch = document.querySelector(".allDay-switch"),
      selectAll = document.querySelector(".select-all"),
      filterInput = [].slice.call(document.querySelectorAll(".input-filter")),
      inlineCalendar = document.querySelector(".inline-calendar");

    let eventToUpdate,
      currentEvents = window.events, // Assign app-calendar-events.js file events (assume events from API) to currentEvents (browser store/object) to manage and update calender events
      isFormValid = false,
      inlineCalInstance;

    // Init event Offcanvas
    const bsAddEventSidebar = new bootstrap.Offcanvas(addEventSidebar);

    //! TODO: Update Event label and guest code to JS once select removes jQuery dependency
    // Event Label (select2)
    if (eventLabel.length) {
      function renderBadges(option) {
        if (!option.id) {
          return option.text;
        }
        var $badge =
          "<span class='badge badge-dot bg-" +
          $(option.element).data("label") +
          " me-2'> " +
          "</span>" +
          option.text;

        return $badge;
      }
      eventLabel.wrap('<div class="position-relative"></div>').select2({
        placeholder: "Select value",
        dropdownParent: eventLabel.parent(),
        templateResult: renderBadges,
        templateSelection: renderBadges,
        minimumResultsForSearch: -1,
        escapeMarkup: function (es) {
          return es;
        },
      });
    }

    // Event Guests (select2)
    if (eventGuests.length) {
      function renderGuestAvatar(option) {
        if (!option.id) {
          return option.text;
        }
        var $avatar =
          "<div class='d-flex flex-wrap align-items-center'>" +
          "<div class='avatar avatar-xs me-2'>" +
          "<img src='" +
          "https://static-00.iconduck.com/assets.00/profile-default-icon-512x511-v4sw4m29.png" +
          "' alt='avatar' class='rounded-circle' />" +
          "</div>" +
          option.text +
          "</div>";

        return $avatar;
      }
      eventGuests.wrap('<div class="position-relative"></div>').select2({
        placeholder: "Select value",
        dropdownParent: eventGuests.parent(),
        closeOnSelect: false,
        templateResult: renderGuestAvatar,
        templateSelection: renderGuestAvatar,
        escapeMarkup: function (es) {
          return es;
        },
      });
    }

    // Event start (flatpicker)
    if (eventStartDate) {
      var start = eventStartDate.flatpickr({
        enableTime: true,
        altFormat: "Y-m-dTH:i:S",
        onReady: function (selectedDates, dateStr, instance) {
          if (instance.isMobile) {
            instance.mobileInput.setAttribute("step", null);
          }
        },
      });
    }

    // Event end (flatpicker)
    if (eventEndDate) {
      var end = eventEndDate.flatpickr({
        enableTime: true,
        altFormat: "Y-m-dTH:i:S",
        onReady: function (selectedDates, dateStr, instance) {
          if (instance.isMobile) {
            instance.mobileInput.setAttribute("step", null);
          }
        },
      });
    }

    // Inline sidebar calendar (flatpicker)
    if (inlineCalendar) {
      inlineCalInstance = inlineCalendar.flatpickr({
        monthSelectorType: "static",
        inline: true,
      });
    }

    // Event click function
    function eventClick(info) {
      eventToUpdate = info.event;
      // console.log(eventToUpdate);
      if (eventToUpdate.url) {
        info.jsEvent.preventDefault();
        window.open(eventToUpdate.url, "_blank");
      }
      console.log(eventToUpdate.url);
      document.getElementById("eventURL").value = eventToUpdate.url || "";
      // document.getElementById("eventGuests").value = eventToUpdate.extendedProps.guests;
      bsAddEventSidebar.show();
      // For update event set offcanvas title text: Update Event
      if (offcanvasTitle) {
        offcanvasTitle.innerHTML = "Actualizar Evento";
      }
      btnSubmit.innerHTML = "Actualizar";
      btnSubmit.classList.add("btn-update-event");
      btnSubmit.classList.remove("btn-add-event");
      btnDeleteEvent.classList.remove("d-none");

      eventTitle.value = eventToUpdate.title;
      start.setDate(eventToUpdate.start, true, "Y-m-d");
      eventToUpdate.allDay === true
        ? (allDaySwitch.checked = true)
        : (allDaySwitch.checked = false);
      eventToUpdate.end !== null
        ? end.setDate(eventToUpdate.end, true, "Y-m-d")
        : end.setDate(eventToUpdate.start, true, "Y-m-d");
      eventLabel.val(eventToUpdate.extendedProps.calendar).trigger("change");
      console.log(eventToUpdate.extendedProps.calendar);
      eventToUpdate.extendedProps.location !== undefined
        ? (eventLocation.value = eventToUpdate.extendedProps.location)
        : null;
      // Manejar los invitados

      console.log(eventToUpdate.extendedProps.guests);

      const eventGuests = document.getElementById("eventGuests");
      const invitadosArray = eventToUpdate.extendedProps.guests
        ? eventToUpdate.extendedProps.guests.split(",")
        : [];
      if (invitadosArray && Array.isArray(invitadosArray)) {
        // Resetear los valores actuales
        $(eventGuests).val(null).trigger("change");

        // Seleccionar los nuevos valores
        $(eventGuests).val(invitadosArray).trigger("change");
      }

      console.log(eventToUpdate.extendedProps.guests);

      eventToUpdate.extendedProps.description !== undefined
        ? (eventDescription.value = eventToUpdate.extendedProps.description)
        : null;

      // // Call removeEvent function
      // btnDeleteEvent.addEventListener('click', e => {
      //   removeEvent(parseInt(eventToUpdate.id));
      //   // eventToUpdate.remove();
      //   bsAddEventSidebar.hide();
      // });
    }

    // Modify sidebar toggler
    function modifyToggler() {
      const fcSidebarToggleButton = document.querySelector(
        ".fc-sidebarToggle-button"
      );
      fcSidebarToggleButton.classList.remove("fc-button-primary");
      fcSidebarToggleButton.classList.add(
        "d-lg-none",
        "d-inline-block",
        "ps-0"
      );
      while (fcSidebarToggleButton.firstChild) {
        fcSidebarToggleButton.firstChild.remove();
      }
      fcSidebarToggleButton.setAttribute("data-bs-toggle", "sidebar");
      fcSidebarToggleButton.setAttribute("data-overlay", "");
      fcSidebarToggleButton.setAttribute(
        "data-target",
        "#app-calendar-sidebar"
      );
      fcSidebarToggleButton.insertAdjacentHTML(
        "beforeend",
        '<i class="bx bx-menu bx-sm text-heading"></i>'
      );
    }

    // Filter events by calender
    // function selectedCalendars() {
    //   let selected = [],
    //     filterInputChecked = [].slice.call(
    //       document.querySelectorAll(".input-filter:checked")
    //     );

    //   filterInputChecked.forEach((item) => {
    //     selected.push(item.getAttribute("data-value"));
    //   });

    //   return selected;
    // }

    // --------------------------------------------------------------------------------------------------
    // AXIOS: fetchEvents
    // * This will be called by fullCalendar to fetch events. Also this can be used to refetch events.

    async function fetchEventsData() {
      let response = await fetch("getCalendario.php");
      let data = await response.json();
      return data.data.map((event) => ({
        id: event.id,
        url: event.url,
        title: event.titulo,
        start: new Date(event.comienzo),
        end: new Date(event.fin),
        allDay: event.todo_el_dia == 1,
        extendedProps: {
          calendar: event.calendario, // Ensure this property is present in data
          guests: event.invitado,
          location: event.direccion,
          description: event.descripcion,
        },
      }));
    }

    // Init FullCalendar
    // ------------------------------------------------
    let calendar = new Calendar(calendarEl, {
      initialView: "dayGridMonth",
      events: fetchEvents,
      plugins: [dayGridPlugin, interactionPlugin, listPlugin, timegridPlugin],
      editable: true,
      locale: "es",
      dragScroll: true,
      dayMaxEvents: 2,
      eventResizableFromStart: true,
      customButtons: {
        sidebarToggle: {
          text: "Sidebar",
        },
      },
      headerToolbar: {
        start: "sidebarToggle, prev,next, title",
        end: "dayGridMonth,timeGridWeek,timeGridDay,listMonth",
      },
      direction: direction,
      initialDate: new Date(),
      navLinks: true, // can click day/week names to navigate views
      eventClassNames: function ({ event: calendarEvent }) {
        const colorName =
          calendarsColor[calendarEvent._def.extendedProps.calendar];
        return ["fc-event-" + colorName];
      },
      dateClick: function (info) {
        let date = moment(info.date).format("YYYY-MM-DD");
        console.log("Selected date: " + date);
        console.log(info.calendar);
        resetValues();
        bsAddEventSidebar.show();
        if (offcanvasTitle) {
          offcanvasTitle.innerHTML = "Añadir";
        }
        btnSubmit.innerHTML = "Add";
        btnSubmit.classList.remove("btn-update-event");
        btnSubmit.classList.add("btn-add-event");
        btnDeleteEvent.classList.add("d-none");
        eventStartDate.value = date;
        eventEndDate.value = date;
      },
      eventClick: function (info) {
        // Handle event click logic here
        eventClick(info);
        // Additional code to capture event type (e.g., info.calendar)
      },
      datesSet: function () {
        modifyToggler();
      },
      viewDidMount: function () {
        modifyToggler();
      },
    });

    // Function to handle filter changes
    function handleFilterChange() {
      const selectedCalendars = Array.from(
        document.querySelectorAll(".calendar-filter:checked")
      ).map((checkbox) => checkbox.value);

      if (selectedCalendars.length === 0) {
        updateCalendar([]);
      } else {
        const filteredEvents = events.filter((event) =>
          selectedCalendars.includes(event.extendedProps.calendar)
        );
        updateCalendar(filteredEvents);
      }
    }

    // Function to handle "View All" checkbox change
    function handleViewAllChange() {
      const viewAllCheckbox = document.getElementById("selectAll");
      const checkboxes = document.querySelectorAll(".calendar-filter");

      if (viewAllCheckbox.checked) {
        checkboxes.forEach((checkbox) => {
          checkbox.checked = true;
        });
        updateCalendar(events); // Mostrar todos los eventos
      } else {
        checkboxes.forEach((checkbox) => {
          checkbox.checked = false;
        });
        updateCalendar([]); // Ocultar todos los eventos
      }
    }

    // Sample updateCalendar function to render filtered events
    function updateCalendar(filteredEvents) {
      calendar.removeAllEvents();
      filteredEvents.forEach((event) => {
        calendar.addEvent(event);
      });
    }

    // Create the filter controls dynamically
    function createFilterControls(uniqueCalendarTypes) {
      const filterControlsContainer = document.getElementById("filterControls");

      uniqueCalendarTypes.forEach((calendarType) => {
        let formCheckElement = document.createElement("div");
        formCheckElement.classList.add("form-check");
        formCheckElement.classList.add("m2");

        let filterElement = document.createElement("input");
        filterElement.type = "checkbox";
        filterElement.classList.add("calendar-filter");
        filterElement.classList.add("form-check-input");
        filterElement.classList.add("input-filter");
        filterElement.value = calendarType;
        filterElement.id = `filter-${calendarType}`;
        filterElement.addEventListener("change", handleFilterChange);
        formCheckElement.appendChild(filterElement);

        let label = document.createElement("label");
        label.classList.add("form-check-label");
        label.htmlFor = `filter-${calendarType}`;
        label.textContent = calendarType;
        formCheckElement.appendChild(label);
        filterControlsContainer.appendChild(formCheckElement);
      });
    }

    // Fetch events and update the calendar
    fetchEventsData().then((eventsData) => {
      events = eventsData; // Save fetched events globally
      calendar.setOption("events", eventsData);
      // Collect unique calendars
      let uniqueCalendars = new Set();
      calendar.getEvents().forEach((event) => {
        uniqueCalendars.add(event.extendedProps.calendar);
      });
      // Convert Set to array and log unique calendar types
      let uniqueCalendarTypes = Array.from(uniqueCalendars);
      console.log("Unique Calendar Types: ", uniqueCalendarTypes);

      // Create filter checkboxes
      createFilterControls(uniqueCalendarTypes);

      // Add event listener for "View All" checkbox
      document
        .getElementById("selectAll")
        .addEventListener("change", handleViewAllChange);
    });

    // Render calendar
    calendar.render();

    const eventForm = document.getElementById("eventForm");
    const fv = FormValidation.formValidation(eventForm, {
      fields: {
        eventTitle: {
          validators: {
            notEmpty: {
              message: "Please enter event title ",
            },
          },
        },
        eventStartDate: {
          validators: {
            notEmpty: {
              message: "Please enter start date ",
            },
          },
        },
        eventEndDate: {
          validators: {
            notEmpty: {
              message: "Please enter end date ",
            },
          },
        },
      },
      plugins: {
        trigger: new FormValidation.plugins.Trigger(),
        bootstrap5: new FormValidation.plugins.Bootstrap5({
          // Use this for enabling/changing valid/invalid class
          eleValidClass: "",
          rowSelector: function (field, ele) {
            // field is the field name & ele is the field element
            return ".mb-3";
          },
        }),
        submitButton: new FormValidation.plugins.SubmitButton(),
        // Submit the form when all fields are valid
        // defaultSubmit: new FormValidation.plugins.DefaultSubmit(),
        autoFocus: new FormValidation.plugins.AutoFocus(),
      },
    })
      .on("core.form.valid", function () {
        // Jump to the next step when all fields in the current step are valid
        isFormValid = true;
      })
      .on("core.form.invalid", function () {
        // if fields are invalid
        isFormValid = false;
      });

    // Sidebar Toggle Btn
    if (btnToggleSidebar) {
      btnToggleSidebar.addEventListener("click", (e) => {
        btnCancel.classList.remove("d-none");
      });
    }

    // Añadir
    // ------------------------------------------------
    // ------------------------------------------------
    function addEvent(eventData) {
      $.ajax({
        url: "addCalendario.php",
        type: "POST",
        data: eventData,
        success: function (response) {
          console.log(response);
          let res = JSON.parse(response);
          if (res.id) {
            Swal.fire("Event added successfully", "", "success");
            eventData.id = res.id; // Set the new ID to the eventData object
            // Añadir evento al calendario
            calendar.addEvent(eventData);
            // Refetch events from the server
            calendar.refetchEvents();
          } else {
            Swal.fire("Error adding event", "", "error");
          }
        },
        error: function (error) {
          alert("An error occurred while adding the event");
        },
      });
    }

    // Update Event
    // ------------------------------------------------
    function updateEvent(eventData) {
      // ? Update existing event data to current events object and refetch it to display on calender
      // ? You can write below code to AJAX call success response
      eventData.id = parseInt(eventData.id);
      currentEvents[currentEvents.findIndex((el) => el.id === eventData.id)] =
        eventData; // Update event by id
      calendar.refetchEvents();

      // ? To update event directly to calender (won't update currentEvents object)
      // let propsToUpdate = ['id', 'title', 'url'];
      // let extendedPropsToUpdate = ['calendar', 'guests', 'location', 'description'];

      // updateEventInCalendar(eventData, propsToUpdate, extendedPropsToUpdate);
    }

    // Remove Event
    // ------------------------------------------------

    function removeEvent(eventId) {
      // ? Delete existing event data to current events object and refetch it to display on calender
      // ? You can write below code to AJAX call success response
      currentEvents = currentEvents.filter(function (event) {
        return event.id != eventId;
      });
      calendar.refetchEvents();

      // ? To delete event directly to calender (won't update currentEvents object)
      // removeEventInCalendar(eventId);
    }

    // (Update Event In Calendar (UI Only)
    // ------------------------------------------------
    const updateEventInCalendar = (
      updatedEventData,
      propsToUpdate,
      extendedPropsToUpdate
    ) => {
      const existingEvent = calendar.getEventById(updatedEventData.id);

      // --- Set event properties except date related ----- //
      // ? Docs: https://fullcalendar.io/docs/Event-setProp
      // dateRelatedProps => ['start', 'end', 'allDay']
      // eslint-disable-next-line no-plusplus
      for (var index = 0; index < propsToUpdate.length; index++) {
        var propName = propsToUpdate[index];
        existingEvent.setProp(propName, updatedEventData[propName]);
      }

      // --- Set date related props ----- //
      // ? Docs: https://fullcalendar.io/docs/Event-setDates
      existingEvent.setDates(updatedEventData.start, updatedEventData.end, {
        allDay: updatedEventData.allDay,
      });

      // --- Set event's extendedProps ----- //
      // ? Docs: https://fullcalendar.io/docs/Event-setExtendedProp
      // eslint-disable-next-line no-plusplus
      for (var index = 0; index < extendedPropsToUpdate.length; index++) {
        var propName = extendedPropsToUpdate[index];
        existingEvent.setExtendedProp(
          propName,
          updatedEventData.extendedProps[propName]
        );
      }
    };

    // Remove Event In Calendar (UI Only)
    // ------------------------------------------------
    // function removeEventInCalendar(eventId) {
    //   calendar.getEventById(eventId).remove();
    // }

    if (btnToggleSidebar) {
      btnToggleSidebar.addEventListener("click", (e) => {
        btnCancel.classList.remove("d-none");
      });
    }

    // Add new event
    // ------------------------------------------------
    btnSubmit.addEventListener("click", (e) => {
      if (btnSubmit.classList.contains("btn-add-event")) {
        if (isFormValid) {
          let newEvent = {
            title: eventTitle.value,
            start: eventStartDate.value,
            end: eventEndDate.value,
            url: eventUrl.value,
            location: eventLocation.value,
            guests: eventGuests.val(),
            calendar: eventLabel.val(),
            description: eventDescription.value,
            all_day: allDaySwitch.checked ? 1 : 0,
          };
          addEvent(newEvent);
          bsAddEventSidebar.hide();
        }
      } else {
        if (isFormValid) {
          let eventData = {
            id: eventToUpdate.id,
            title: eventTitle.value,
            start: eventStartDate.value,
            end: eventEndDate.value,
            url: eventUrl.value,
            extendedProps: {
              location: eventLocation.value,
              guests: eventGuests.val(),
              calendar: eventLabel.val(),
              description: eventDescription.value,
            },
            display: "block",
            allDay: allDaySwitch.checked ? true : false,
          };
          updateEvent(eventData);
          bsAddEventSidebar.hide();
        }
      }
    });

    // Call removeEvent function
    btnDeleteEvent.addEventListener("click", (e) => {
      removeEvent(parseInt(eventToUpdate.id));
      // eventToUpdate.remove();
      bsAddEventSidebar.hide();
    });

    // Reset event form inputs values
    // ------------------------------------------------
    function resetValues() {
      eventEndDate.value = "";
      eventUrl.value = "";
      eventStartDate.value = "";
      eventTitle.value = "";
      eventLocation.value = "";
      allDaySwitch.checked = false;
      eventGuests.val("").trigger("change");
      eventDescription.value = "";
    }

    // When modal hides reset input values
    addEventSidebar.addEventListener("hidden.bs.offcanvas", function () {
      resetValues();
    });

    // Hide left sidebar if the right sidebar is open
    btnToggleSidebar.addEventListener("click", (e) => {
      if (offcanvasTitle) {
        offcanvasTitle.innerHTML = "Añadir";
      }
      btnSubmit.innerHTML = "Add";
      btnSubmit.classList.remove("btn-update-event");
      btnSubmit.classList.add("btn-add-event");
      btnDeleteEvent.classList.add("d-none");
      appCalendarSidebar.classList.remove("show");
      appOverlay.classList.remove("show");
    });

    // Calender filter functionality
    // ------------------------------------------------
    if (selectAll) {
      selectAll.addEventListener("click", (e) => {
        if (e.currentTarget.checked) {
          document
            .querySelectorAll(".input-filter")
            .forEach((c) => (c.checked = 1));
        } else {
          document
            .querySelectorAll(".input-filter")
            .forEach((c) => (c.checked = 0));
        }
        calendar.refetchEvents();
      });
    }

    if (filterInput) {
      filterInput.forEach((item) => {
        item.addEventListener("click", () => {
          document.querySelectorAll(".input-filter:checked").length <
          document.querySelectorAll(".input-filter").length
            ? (selectAll.checked = false)
            : (selectAll.checked = true);
          calendar.refetchEvents();
        });
      });
    }

    // Jump to date on sidebar(inline) calendar change
    inlineCalInstance.config.onChange.push(function (date) {
      calendar.changeView(
        calendar.view.type,
        moment(date[0]).format("YYYY-MM-DD")
      );
      modifyToggler();
      appCalendarSidebar.classList.remove("show");
      appOverlay.classList.remove("show");
    });
  })();
});
