// ===== CART FUNCTIONALITY =====

class Cart {
  constructor() {
    this.cartIcon = document.querySelector('[data-cart-icon]');
    this.cartCount = document.querySelector('[data-cart-count]');
    this.updateCartCount();
  }

  addToCart(productId, quantity = 1) {
    const data = {
      id: productId,
      quantity: quantity
    };

    fetch('/cart/add.js', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
      this.updateCartCount();
      this.showNotification('Product added to cart!');
    })
    .catch(error => console.error('Error:', error));
  }

  updateCartCount() {
    fetch('/cart.js')
      .then(response => response.json())
      .then(data => {
        if (this.cartCount) {
          this.cartCount.textContent = data.item_count;
          this.cartCount.style.display = data.item_count > 0 ? 'flex' : 'none';
        }
      });
  }

  showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification notification-success';
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.classList.add('show');
    }, 10);

    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }
}

// ===== VARIANT SELECTOR =====

class VariantSelector {
  constructor() {
    this.variantSelects = document.querySelectorAll('[data-variant-select]');
    this.priceDisplay = document.querySelector('[data-price]');
    this.addToCartBtn = document.querySelector('[data-add-to-cart]');
    
    this.variantSelects.forEach(select => {
      select.addEventListener('change', () => this.handleVariantChange());
    });
  }

  handleVariantChange() {
    const selectedVariant = this.getSelectedVariant();
    if (selectedVariant) {
      this.updatePrice(selectedVariant.price);
      this.updateAddToCartButton(selectedVariant.id);
    }
  }

  getSelectedVariant() {
    // This would typically fetch from product data
    return null;
  }

  updatePrice(price) {
    if (this.priceDisplay) {
      this.priceDisplay.textContent = '$' + (price / 100).toFixed(2);
    }
  }

  updateAddToCartButton(variantId) {
    if (this.addToCartBtn) {
      this.addToCartBtn.dataset.productVariantId = variantId;
    }
  }
}

// ===== MOBILE MENU TOGGLE =====

class MobileMenu {
  constructor() {
    this.menuToggle = document.querySelector('[data-menu-toggle]');
    this.menu = document.querySelector('[data-mobile-menu]');
    this.menuLinks = document.querySelectorAll('[data-mobile-menu] a');

    if (this.menuToggle && this.menu) {
      this.menuToggle.addEventListener('click', () => this.toggle());
      this.menuLinks.forEach(link => {
        link.addEventListener('click', () => this.close());
      });
    }
  }

  toggle() {
    this.menu.classList.toggle('active');
    this.menuToggle.classList.toggle('active');
  }

  close() {
    this.menu.classList.remove('active');
    this.menuToggle.classList.remove('active');
  }
}

// ===== SEARCH FUNCTIONALITY =====

class SearchBox {
  constructor() {
    this.searchInput = document.querySelector('[data-search-input]');
    this.searchResults = document.querySelector('[data-search-results]');

    if (this.searchInput) {
      this.searchInput.addEventListener('input', (e) => this.handleSearch(e));
    }
  }

  handleSearch(event) {
    const query = event.target.value.trim();

    if (query.length < 2) {
      if (this.searchResults) {
        this.searchResults.innerHTML = '';
      }
      return;
    }

    fetch(`/search?q=${encodeURIComponent(query)}&type=product`)
      .then(response => response.text())
      .then(html => {
        if (this.searchResults) {
          this.searchResults.innerHTML = html;
        }
      })
      .catch(error => console.error('Search error:', error));
  }
}

// ===== ACCORDION TOGGLE =====

class Accordion {
  constructor() {
    this.items = document.querySelectorAll('[data-accordion-item]');
    
    this.items.forEach(item => {
      const trigger = item.querySelector('[data-accordion-trigger]');
      if (trigger) {
        trigger.addEventListener('click', () => this.toggle(item));
      }
    });
  }

  toggle(item) {
    const isActive = item.classList.contains('active');
    
    // Close all other items
    this.items.forEach(i => {
      if (i !== item) {
        i.classList.remove('active');
      }
    });

    // Toggle current item
    if (!isActive) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  }
}

// ===== LAZY LOADING IMAGES =====

class LazyLoad {
  constructor() {
    this.images = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
      this.initIntersectionObserver();
    } else {
      this.loadAllImages();
    }
  }

  initIntersectionObserver() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.loadImage(entry.target);
          observer.unobserve(entry.target);
        }
      });
    });

    this.images.forEach(img => observer.observe(img));
  }

  loadImage(img) {
    img.src = img.dataset.src;
    img.removeAttribute('data-src');
  }

  loadAllImages() {
    this.images.forEach(img => this.loadImage(img));
  }
}

// ===== SMOOTH SCROLL =====

class SmoothScroll {
  constructor() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  }
}

// ===== QUANTITY SELECTOR =====

class QuantitySelector {
  constructor() {
    this.decreaseButtons = document.querySelectorAll('[data-quantity-decrease]');
    this.increaseButtons = document.querySelectorAll('[data-quantity-increase]');
    this.quantityInputs = document.querySelectorAll('[data-quantity-input]');

    this.decreaseButtons.forEach(btn => {
      btn.addEventListener('click', (e) => this.decrease(e.target));
    });

    this.increaseButtons.forEach(btn => {
      btn.addEventListener('click', (e) => this.increase(e.target));
    });
  }

  decrease(button) {
    const input = button.parentElement.querySelector('[data-quantity-input]');
    if (input && parseInt(input.value) > 1) {
      input.value = parseInt(input.value) - 1;
    }
  }

  increase(button) {
    const input = button.parentElement.querySelector('[data-quantity-input]');
    if (input) {
      input.value = parseInt(input.value) + 1;
    }
  }
}

// ===== PRODUCT IMAGE GALLERY =====

class ImageGallery {
  constructor() {
    this.thumbnails = document.querySelectorAll('[data-thumbnail]');
    this.mainImage = document.querySelector('[data-main-image]');

    this.thumbnails.forEach(thumb => {
      thumb.addEventListener('click', (e) => this.setMainImage(e.target));
    });
  }

  setMainImage(thumbnail) {
    const src
