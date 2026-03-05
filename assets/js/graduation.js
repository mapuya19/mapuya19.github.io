(function() {
  const GALLERY_GRID = document.getElementById('gallery-grid');
  const MODAL = document.getElementById('xp-modal');
  const MODAL_IMAGE = document.getElementById('modal-image');
  const MODAL_CLOSE = document.getElementById('modal-close');
  const MODAL_PREV = document.getElementById('modal-prev');
  const MODAL_NEXT = document.getElementById('modal-next');
  const PHOTO_COUNT = document.getElementById('photo-count');

  let images = [];
  let currentIndex = 0;
  
  MODAL_IMAGE.onload = function() {
    checkImageSize();
  };
  
  function loadImages() {
    const imageList = [
      { thumb: '/assets/images/graduation/thumb_01.jpg', full: '/assets/images/graduation/photo_01.jpg' },
      { thumb: '/assets/images/graduation/thumb_02.jpg', full: '/assets/images/graduation/photo_02.jpg' },
      { thumb: '/assets/images/graduation/thumb_03.jpg', full: '/assets/images/graduation/photo_03.jpg' },
      { thumb: '/assets/images/graduation/thumb_04.jpg', full: '/assets/images/graduation/photo_04.jpg' },
      { thumb: '/assets/images/graduation/thumb_05.jpg', full: '/assets/images/graduation/photo_05.jpg' },
      { thumb: '/assets/images/graduation/thumb_06.jpg', full: '/assets/images/graduation/photo_06.jpg' },
      { thumb: '/assets/images/graduation/thumb_07.jpg', full: '/assets/images/graduation/photo_07.jpg' },
      { thumb: '/assets/images/graduation/thumb_08.jpg', full: '/assets/images/graduation/photo_08.jpg' },
      { thumb: '/assets/images/graduation/thumb_09.jpg', full: '/assets/images/graduation/photo_09.jpg' },
      { thumb: '/assets/images/graduation/thumb_10.jpg', full: '/assets/images/graduation/photo_10.jpg' }
    ];

    images = imageList;

    renderGallery();
    updatePhotoCount();
  }

  function renderGallery() {
    if (images.length === 0) {
      GALLERY_GRID.innerHTML = '<p style="padding: 20px; color: #666;">No images found. Add your photos to the /assets/images/graduation/ directory.</p>';
      return;
    }

    GALLERY_GRID.innerHTML = images.map((image, index) => `
      <div class="gallery-item" data-index="${index}" role="button" tabindex="0">
        <img src="${image.thumb}" alt="Graduation photo ${index + 1}" loading="lazy">
      </div>
    `).join('');

    const items = GALLERY_GRID.querySelectorAll('.gallery-item');
    items.forEach(item => {
      item.addEventListener('click', () => openModal(parseInt(item.dataset.index)));
      item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openModal(parseInt(item.dataset.index));
        }
      });
    });
  }

  function updatePhotoCount() {
    PHOTO_COUNT.textContent = `${images.length} item${images.length !== 1 ? 's' : ''}`;
  }

  function openModal(index) {
    if (images.length === 0) return;
    
    currentIndex = index;
    MODAL_IMAGE.src = images[currentIndex].full;
    MODAL.style.display = 'flex';
    MODAL.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    updateNavigationButtons();
  }
  
  function checkImageSize() {
    const container = MODAL_IMAGE.closest('.modal-content');
    const containerWidth = container ? container.clientWidth : window.innerWidth * 0.9;
    const imageWidth = MODAL_IMAGE.naturalWidth;
    const imageHeight = MODAL_IMAGE.naturalHeight;
    const aspectRatio = imageWidth / imageHeight;
    
    if (imageWidth > 2000 || imageHeight > 2000 || aspectRatio > 2.0 || aspectRatio < 0.5) {
      MODAL_PREV.style.display = 'none';
      MODAL_NEXT.style.display = 'none';
    } else {
      MODAL_PREV.style.display = '';
      MODAL_NEXT.style.display = '';
    }
  }

  function closeModal() {
    MODAL.style.display = 'none';
    MODAL.classList.remove('active');
    document.body.style.overflow = '';
  }

  function showPrevious() {
    if (currentIndex > 0) {
      currentIndex--;
    } else {
      currentIndex = images.length - 1;
    }
    MODAL_IMAGE.src = images[currentIndex].full;
    updateNavigationButtons();
  }

  function showNext() {
    if (currentIndex < images.length - 1) {
      currentIndex++;
    } else {
      currentIndex = 0;
    }
    MODAL_IMAGE.src = images[currentIndex].full;
    updateNavigationButtons();
  }

  function updateNavigationButtons() {
    MODAL_PREV.disabled = images.length <= 1;
    MODAL_NEXT.disabled = images.length <= 1;
  }

  MODAL_CLOSE.addEventListener('click', closeModal);
  MODAL_PREV.addEventListener('click', showPrevious);
  MODAL_NEXT.addEventListener('click', showNext);

  MODAL.addEventListener('click', (e) => {
    if (e.target === MODAL) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (!MODAL.classList.contains('active')) return;

    switch(e.key) {
      case 'Escape':
        closeModal();
        break;
      case 'ArrowLeft':
        showPrevious();
        break;
      case 'ArrowRight':
        showNext();
        break;
    }
  });

  let touchStartX = 0;
  let touchEndX = 0;

  MODAL.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  MODAL.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, { passive: true });

  function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        showNext();
      } else {
        showPrevious();
      }
    }
  }

  loadImages();
})();
