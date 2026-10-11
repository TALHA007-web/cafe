/* ============================================================
   THE ÉVADÈ Café - Interactive JavaScript Engine
   Handles: 7-Visit Stamp Card, Dynamic Price Sorting, Filter Tabs
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initStampCard();
  initBakeryFilter();
  initCoffeeSortAndFilter();
  initModalListeners();
});

/* ----------------- 1. Mobile Menu Toggle ----------------- */
function initMobileMenu() {
  const menuBtn = document.getElementById('mobileMenuBtn');
  const navLinks = document.getElementById('navLinks');
  if (menuBtn && navLinks) {
    menuBtn.addEventListener('click', () => {
      navLinks.classList.toggle('show');
      const isExpanded = navLinks.classList.contains('show');
      menuBtn.innerHTML = isExpanded ? '✕' : '☰';
    });
  }
}

/* ----------------- 2. VIP 7-Circle Loyalty Card ----------------- */
let currentStamps = 3; // Starts with 3 demo stamps so the Director sees progress immediately!
const TOTAL_STAMPS = 7;

function initStampCard() {
  const stampSlots = document.querySelectorAll('.circle-slot');
  const addStampBtn = document.getElementById('addStampBtn');
  const resetCardBtn = document.getElementById('resetCardBtn');

  if (stampSlots.length === 0) return;

  // Restore or initialize stamps
  renderStamps();

  // Button to simulate customer visit
  if (addStampBtn) {
    addStampBtn.addEventListener('click', () => {
      if (currentStamps < TOTAL_STAMPS) {
        currentStamps++;
        renderStamps();
        showToast(`☕ Visit #${currentStamps} recorded! Stamp added to card.`);

        // If completed all 7 stamps
        if (currentStamps === TOTAL_STAMPS) {
          setTimeout(() => {
            openRewardModal();
          }, 400);
        }
      } else {
        openRewardModal();
      }
    });
  }

  // Reset demo button so user can present to Sir repeatedly
  if (resetCardBtn) {
    resetCardBtn.addEventListener('click', () => {
      currentStamps = 0;
      renderStamps();
      showToast('Card refreshed for a new presentation demo.');
    });
  }

  // Allow clicking directly on individual circles
  stampSlots.forEach((slot) => {
    slot.addEventListener('click', () => {
      const stampNum = parseInt(slot.getAttribute('data-stamp-index'), 10);
      if (currentStamps < stampNum) {
        currentStamps = stampNum;
      } else if (currentStamps === stampNum) {
        currentStamps = stampNum - 1;
      }
      renderStamps();

      if (currentStamps === TOTAL_STAMPS) {
        setTimeout(() => {
          openRewardModal();
        }, 400);
      }
    });
  });
}

function renderStamps() {
  const stampSlots = document.querySelectorAll('.circle-slot');
  const countLabel = document.getElementById('stampsCountLabel');
  const progressFill = document.getElementById('progressFill');

  stampSlots.forEach((slot, index) => {
    const slotNumber = index + 1;
    if (slotNumber <= currentStamps) {
      slot.classList.add('stamped');
    } else {
      slot.classList.remove('stamped');
    }
  });

  if (countLabel) {
    countLabel.textContent = `${currentStamps} of ${TOTAL_STAMPS} Visits Completed`;
  }

  if (progressFill) {
    const percent = Math.round((currentStamps / TOTAL_STAMPS) * 100);
    progressFill.style.width = `${percent}%`;
  }
}

/* ----------------- 3. Reward Modal ----------------- */
function openRewardModal() {
  const modal = document.getElementById('rewardModal');
  if (modal) {
    modal.classList.add('active');
  }
}

function closeRewardModal() {
  const modal = document.getElementById('rewardModal');
  if (modal) {
    modal.classList.remove('active');
  }
}

function initModalListeners() {
  const closeModalBtn = document.getElementById('closeModalBtn');
  const claimRewardBtn = document.getElementById('claimRewardBtn');
  const modal = document.getElementById('rewardModal');

  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', closeRewardModal);
  }

  if (claimRewardBtn) {
    claimRewardBtn.addEventListener('click', () => {
      closeRewardModal();
      showToast('🎉 Rs. 2,000 Free Voucher Activated! Present this at counter.');
    });
  }

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeRewardModal();
      }
    });
  }
}

/* ----------------- 4. Bakery Filtering ----------------- */
function initBakeryFilter() {
  const filterBtns = document.querySelectorAll('.bakery-filter-btn');
  const cards = document.querySelectorAll('.bakery-card');

  if (filterBtns.length === 0 || cards.length === 0) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      cards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ----------------- 5. Coffee Sorting (Low to High & High to Low) ----------------- */
function initCoffeeSortAndFilter() {
  const sortSelect = document.getElementById('coffeeSortSelect');
  const coffeeGrid = document.getElementById('coffeeGrid');
  const filterBtns = document.querySelectorAll('.coffee-filter-btn');

  if (!coffeeGrid) return;

  // Function to sort cards
  function sortCards(order) {
    const cards = Array.from(coffeeGrid.querySelectorAll('.coffee-item-card'));
    
    cards.sort((a, b) => {
      const priceA = parseInt(a.getAttribute('data-price'), 10);
      const priceB = parseInt(b.getAttribute('data-price'), 10);

      if (order === 'low-to-high') {
        return priceA - priceB;
      } else if (order === 'high-to-low') {
        return priceB - priceA;
      }
      return 0; // Default
    });

    // Re-append in sorted order
    cards.forEach(card => coffeeGrid.appendChild(card));
  }

  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      sortCards(e.target.value);
      showToast(`Sorted by: ${e.target.options[e.target.selectedIndex].text}`);
    });
    // Trigger initial sort if desired (default low-to-high)
    if (sortSelect.value === 'low-to-high') {
      sortCards('low-to-high');
    }
  }

  // Coffee Category Filters
  if (filterBtns.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');
        const cards = coffeeGrid.querySelectorAll('.coffee-item-card');

        cards.forEach(card => {
          const category = card.getAttribute('data-category');
          if (filter === 'all' || category === filter) {
            card.style.display = 'flex';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }
}

/* ----------------- 6. Toast Notification Helper ----------------- */
function showToast(message) {
  let toast = document.getElementById('toastNotice');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toastNotice';
    toast.className = 'toast-notice';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `<span>✨</span> <div>${message}</div>`;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}
