function toggleDescription(arrowElement) {
    const description = arrowElement.nextElementSibling;
    description.style.display = description.style.display === 'block' ? 'none' : 'block';
    arrowElement.classList.toggle('active'); // Rotate arrow
  }

  document.addEventListener("DOMContentLoaded", () => {
    function toggleDescription(arrowElement) {
      const description = arrowElement.nextElementSibling;
      description.style.display = description.style.display === 'block' ? 'none' : 'block';
      arrowElement.classList.toggle('active'); // Rotate arrow
    }
  
    // Attach toggleDescription function to each arrow dynamically
    const arrows = document.querySelectorAll('.arrow');
    arrows.forEach(arrow => {
      arrow.addEventListener('click', function() {
        toggleDescription(this);
      });
    });
  });
  