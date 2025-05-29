document.addEventListener('DOMContentLoaded', () => {
  let currentDate = new Date();
  let selectedDateTime = null;

  // Éléments DOM
  const step1Element = document.getElementById('step1');
  const step2Element = document.getElementById('step2');
  const daysContainer = document.getElementById('calendarDays');
  const currentMonthElement = document.getElementById('currentMonth');
  const prevMonthButton = document.getElementById('prevMonth');
  const nextMonthButton = document.getElementById('nextMonth');
  const timeSlotsContainer = document.getElementById('timeSlots');
  const nextStepButton = document.getElementById('nextStep');
  const backToCalendarButton = document.getElementById('backToCalendar');
  const selectedDateTimeElement = document.querySelector('.selected-datetime');

  // Créneaux horaires disponibles
  const defaultTimeSlots = [
    '09:00', '10:00', '11:00',
    '14:00', '15:00', '16:00',
    '17:00', '18:00'
  ];

  // Format de la date en français
  const monthFormatter = new Intl.DateTimeFormat('fr', { month: 'long', year: 'numeric' });
  const dateFormatter = new Intl.DateTimeFormat('fr', { dateStyle: 'full' });

  // Mettre à jour l'affichage du mois
  const updateMonthDisplay = () => {
    currentMonthElement.textContent = monthFormatter.format(currentDate);
  };

  // Obtenir le premier jour du mois (lundi = 1, dimanche = 7)
  const getFirstDayOfMonth = (date) => {
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    return firstDay === 0 ? 7 : firstDay;
  };

  // Obtenir le nombre de jours dans le mois
  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  // Vérifier si une date est dans le passé
  const isPastDate = (year, month, day) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const date = new Date(year, month, day);
    return date < today;
  };

  // Générer le calendrier
  const generateCalendar = () => {
    daysContainer.innerHTML = '';
    const firstDay = getFirstDayOfMonth(currentDate);
    const daysInMonth = getDaysInMonth(currentDate);
    
    // Ajouter les cellules vides pour les jours avant le premier du mois
    for (let i = 1; i < firstDay; i++) {
      const emptyDay = document.createElement('div');
      daysContainer.appendChild(emptyDay);
    }

    // Ajouter les jours du mois
    for (let day = 1; day <= daysInMonth; day++) {
      const dayElement = document.createElement('button');
      dayElement.textContent = day;
      dayElement.className = 'w-full aspect-square rounded-lg text-center';

      const isPast = isPastDate(currentDate.getFullYear(), currentDate.getMonth(), day);
      if (isPast) {
        dayElement.className = 'w-full aspect-square rounded-lg text-center bg-gray-900 text-white cursor-not-allowed';
        dayElement.disabled = true;
      } else {
        dayElement.className = 'w-full aspect-square rounded-lg text-center text-gray-900 border border-gray-300 hover:border-gray-900 transition-all';
        dayElement.onclick = () => selectDate(day);
      }

      daysContainer.appendChild(dayElement);
    }
  };

  // Sélectionner une date
  const selectDate = (day) => {
    // Réinitialiser la sélection précédente
    const previouslySelected = daysContainer.querySelector('.selected');
    if (previouslySelected) {
      previouslySelected.classList.remove('selected');
      previouslySelected.classList.add('text-gray-900', 'border', 'border-gray-300');
    }

    // Sélectionner le nouveau jour
    const selectedButton = daysContainer.children[getFirstDayOfMonth(currentDate) - 1 + day - 1];
    if (selectedButton) {
      selectedButton.classList.remove('text-gray-900', 'border', 'border-gray-300');
      selectedButton.classList.add('selected', 'bg-gray-900', 'text-white', 'border-gray-900');
    }

    // Mettre à jour la date sélectionnée
    selectedDateTime = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    selectedDateTime.setHours(0, 0, 0, 0);
    
    // Mettre à jour l'affichage de la date sélectionnée
    if (selectedDateTimeElement) {
      selectedDateTimeElement.textContent = `Date sélectionnée : ${dateFormatter.format(selectedDateTime)}`;
    }

    // Afficher les créneaux horaires
    showTimeSlots();
    // Cacher le bouton suivant
    nextStepButton.classList.add('hidden');
  };

  // Afficher les créneaux horaires
  const showTimeSlots = () => {
    timeSlotsContainer.innerHTML = '';
    defaultTimeSlots.forEach(time => {
      const timeButton = document.createElement('button');
      timeButton.textContent = time;
      timeButton.className = 'px-4 py-2 rounded-lg border border-gray-300 text-gray-900 hover:border-gray-900 transition-all duration-200';
      timeButton.onclick = () => selectTimeSlot(time);
      timeSlotsContainer.appendChild(timeButton);
    });
    timeSlotsContainer.classList.remove('hidden');
    selectedDateTimeElement.classList.remove('hidden');
  };

  // Sélectionner un créneau horaire
  const selectTimeSlot = (time) => {
    // Réinitialiser la sélection précédente
    const previouslySelected = timeSlotsContainer.querySelector('.selected');
    if (previouslySelected) {
      previouslySelected.classList.remove('selected', 'bg-gray-900', 'text-white', 'border-gray-900');
      previouslySelected.classList.add('text-gray-900', 'border-gray-300');
    }

    // Sélectionner le nouveau créneau
    const timeButton = Array.from(timeSlotsContainer.children).find(button => button.textContent === time);
    if (timeButton) {
      timeButton.classList.remove('text-gray-900', 'border-gray-300');
      timeButton.classList.add('selected', 'bg-gray-900', 'text-white', 'border-gray-900');
    }

    // Mettre à jour la date et l'heure
    selectedDateTime.setHours(parseInt(time.split(':')[0]), parseInt(time.split(':')[1]));
    selectedDateTimeElement.textContent = `${dateFormatter.format(selectedDateTime)} à ${time}`;

    // Passer automatiquement à l'étape 2
    step1Element.classList.add('hidden');
    step2Element.classList.remove('hidden');
    nextStepButton.classList.remove('hidden');
  };

  // Navigation entre les mois
  prevMonthButton.onclick = () => {
    currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1);
    updateMonthDisplay();
    generateCalendar();
  };

  nextMonthButton.onclick = () => {
    currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1);
    updateMonthDisplay();
    generateCalendar();
  };

  // Passage à l'étape 2
  nextStepButton.onclick = () => {
    const selectedDate = daysContainer.querySelector('.selected');
    const selectedTime = timeSlotsContainer.querySelector('.selected');

    if (!selectedDate || !selectedTime) {
      alert('Veuillez sélectionner une date et un horaire');
      return;
    }

    // Mettre à jour l'affichage de la date et l'heure sélectionnées
    const formattedDate = dateFormatter.format(selectedDateTime);
    selectedDateTimeElement.textContent = `Date sélectionnée : ${formattedDate} à ${selectedTime.textContent}`;

    // Passer à l'étape 2
    step1Element.classList.add('hidden');
    step2Element.classList.remove('hidden');
  };

  // Retour au calendrier
  backToCalendarButton.onclick = () => {
    step2Element.classList.add('hidden');
    step1Element.classList.remove('hidden');
  };

  // Gestion du formulaire
  const appointmentForm = document.getElementById('appointmentForm');
  appointmentForm.onsubmit = async (e) => {
    e.preventDefault();

    // Désactiver le bouton de soumission
    const submitButton = appointmentForm.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.textContent;
    submitButton.disabled = true;
    submitButton.textContent = 'Envoi en cours...';

    // Vérifier la sélection de date et heure
    if (!selectedDateTime) {
      alert('Veuillez sélectionner une date et un horaire');
      submitButton.disabled = false;
      submitButton.textContent = originalButtonText;
      return;
    }

    try {
      // Récupérer les données du formulaire
      const formData = new FormData(e.target);
      
      // Vérifier les champs requis
      const firstName = formData.get('firstName');
      const lastName = formData.get('lastName');
      const email = formData.get('email');
      const phone = formData.get('phone');
      const service = formData.get('projectType'); // Le champ s'appelle projectType dans le formulaire
      
      if (!firstName || firstName.trim() === '') {
        throw new Error('Le prénom est requis');
      }
      if (!lastName || lastName.trim() === '') {
        throw new Error('Le nom est requis');
      }
      if (!email || email.trim() === '') {
        throw new Error('L\'email est requis');
      }
      if (!phone || phone.trim() === '') {
        throw new Error('Le numéro de téléphone est requis');
      }
      if (!service || service === '') {
        throw new Error('Veuillez sélectionner un service');
      }

      const appointmentData = {
        name: `${firstName.trim()} ${lastName.trim()}`,
        email: email.trim(),
        phone: phone.trim(),
        service: service,
        message: formData.get('message')?.trim() || '',
        date: selectedDateTime.toISOString().split('T')[0],
        time: selectedDateTime.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
      };

      // Log des données envoyées
      console.log('Données envoyées:', appointmentData);

      // Envoyer les données à l'API
      const response = await fetch('/.netlify/functions/submit-appointment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(appointmentData)
      });

      // Log de la réponse brute
      console.log('Réponse brute:', response);

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || `Une erreur est survenue (${response.status})`);
      }

      // Afficher le message de succès
      const successMessage = document.createElement('div');
      successMessage.className = 'success-message p-4 mb-4 text-sm text-green-700 bg-green-100 rounded-lg';
      successMessage.textContent = result.message || 'Votre rendez-vous a été programmé avec succès';
      appointmentForm.insertBefore(successMessage, appointmentForm.firstChild);

      // Réinitialiser le formulaire et l'interface
      appointmentForm.reset();
      
      // Réinitialiser le calendrier
      const selectedDateElement = daysContainer.querySelector('.selected');
      const selectedTimeElement = timeSlotsContainer.querySelector('.selected');
      
      if (selectedDateElement) {
        selectedDateElement.classList.remove('selected', 'bg-primary', 'hover:bg-primary/90');
        selectedDateElement.classList.add('bg-primary/20', 'hover:bg-primary/40');
      }
      if (selectedTimeElement) {
        selectedTimeElement.classList.remove('selected', 'bg-primary');
        selectedTimeElement.classList.add('bg-primary/20');
      }
      
      // Retourner à l'étape 1
      step2Element.classList.add('hidden');
      step1Element.classList.remove('hidden');
      selectedDateTime = null;
      
      // Régénérer le calendrier
      generateCalendar();

      // Retirer le message après 5 secondes
      setTimeout(() => {
        successMessage.remove();
      }, 5000);

    } catch (error) {
      console.error('Erreur lors de l\'envoi du formulaire:', error);
      
      // Afficher un message d'erreur
      const errorMessage = document.createElement('div');
      errorMessage.className = 'error-message p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg';
      errorMessage.textContent = error.message || 'Une erreur est survenue. Veuillez réessayer.';
      appointmentForm.insertBefore(errorMessage, appointmentForm.firstChild);

      // Retirer le message après 5 secondes
      setTimeout(() => {
        errorMessage.remove();
      }, 5000);
    } finally {
      // Réactiver le bouton de soumission
      submitButton.disabled = false;
      submitButton.textContent = originalButtonText;
    }
  };

  // Initialisation
  updateMonthDisplay();
  generateCalendar();
});
