document.addEventListener('DOMContentLoaded', () => {
  const faqToggles = document.querySelectorAll('.faq-toggle');

  faqToggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      const content = toggle.nextElementSibling;
      const icon = toggle.querySelector('svg');
      
      // Fermer toutes les autres questions
      faqToggles.forEach(otherToggle => {
        if (otherToggle !== toggle) {
          const otherContent = otherToggle.nextElementSibling;
          const otherIcon = otherToggle.querySelector('svg');
          otherContent.classList.add('hidden');
          otherIcon.classList.remove('rotate-180');
        }
      });

      // Basculer la question actuelle
      content.classList.toggle('hidden');
      icon.classList.toggle('rotate-180');
    });
  });
});
