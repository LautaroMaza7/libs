/**
 * App Calendar Events
 */

'use strict';

async function fetchEvents() {
  try {
    let response = await fetch('getCalendario.php');
    if (!response.ok) {
      throw new Error('Network response was not ok ' + response.statusText);
    }
    let data = await response.json();
    return data.data.map(event => {
      return {
        id: event.id,
        url: event.url,
        title: event.titulo,
        start: new Date(event.comienzo),
        end: new Date(event.fin),
        allDay: event.todo_el_dia == 1,
        extendedProps: {
          calendar: event.calendario // Ensure this property is present in data
        }
      };
    });
    
  } catch (error) {
    console.error('Error fetching events:', error);
    return [];
  }
}

(async () => {
  window.events = await fetchEvents();
  
  // Dispatch a custom event to notify that events are loaded
  document.dispatchEvent(new Event('eventsLoaded'));
})();
