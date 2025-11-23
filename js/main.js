(function($) {
	"use strict"

	// Mobile Nav toggle
	$('.menu-toggle > a').on('click', function (e) {
		e.preventDefault();
		$('#responsive-nav').toggleClass('active');
	})

	// Fix cart dropdown from closing
	$('.cart-dropdown').on('click', function (e) {
		e.stopPropagation();
	});

	/////////////////////////////////////////

	// Products Slick
	$('.products-slick').each(function() {
		var $this = $(this),
				$nav = $this.attr('data-nav');

		$this.slick({
			slidesToShow: 4,
			slidesToScroll: 1,
			autoplay: true,
			infinite: true,
			speed: 300,
			dots: false,
			arrows: true,
			appendArrows: $nav ? $nav : false,
			responsive: [{
	        breakpoint: 991,
	        settings: {
	          slidesToShow: 2,
	          slidesToScroll: 1,
	        }
	      },
	      {
	        breakpoint: 480,
	        settings: {
	          slidesToShow: 1,
	          slidesToScroll: 1,
	        }
	      },
	    ]
		});
	});

	// Products Widget Slick
	$('.products-widget-slick').each(function() {
		var $this = $(this),
				$nav = $this.attr('data-nav');

		$this.slick({
			infinite: true,
			autoplay: true,
			speed: 300,
			dots: false,
			arrows: true,
			appendArrows: $nav ? $nav : false,
		});
	});

	/////////////////////////////////////////

	// Product Main img Slick
	$('#product-main-img').slick({
    infinite: true,
    speed: 300,
    dots: false,
    arrows: true,
    fade: true,
    asNavFor: '#product-imgs',
  });

	// Product imgs Slick
  $('#product-imgs').slick({
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: true,
    centerMode: true,
    focusOnSelect: true,
		centerPadding: 0,
		vertical: true,
    asNavFor: '#product-main-img',
		responsive: [{
        breakpoint: 991,
        settings: {
					vertical: false,
					arrows: false,
					dots: true,
        }
      },
    ]
  });

	// Product img zoom
	var zoomMainProduct = document.getElementById('product-main-img');
	if (zoomMainProduct) {
		$('#product-main-img .product-preview').zoom();
	}

	/////////////////////////////////////////

	// Input number
	$('.input-number').each(function() {
		var $this = $(this),
		$input = $this.find('input[type="number"]'),
		up = $this.find('.qty-up'),
		down = $this.find('.qty-down');

		down.on('click', function () {
			var value = parseInt($input.val()) - 1;
			value = value < 1 ? 1 : value;
			$input.val(value);
			$input.change();
			updatePriceSlider($this , value)
		})

		up.on('click', function () {
			var value = parseInt($input.val()) + 1;
			$input.val(value);
			$input.change();
			updatePriceSlider($this , value)
		})
	});

	var priceInputMax = document.getElementById('price-max'),
			priceInputMin = document.getElementById('price-min');

	priceInputMax.addEventListener('change', function(){
		updatePriceSlider($(this).parent() , this.value)
	});

	priceInputMin.addEventListener('change', function(){
		updatePriceSlider($(this).parent() , this.value)
	});

	function updatePriceSlider(elem , value) {
		if ( elem.hasClass('price-min') ) {
			console.log('min')
			priceSlider.noUiSlider.set([value, null]);
		} else if ( elem.hasClass('price-max')) {
			console.log('max')
			priceSlider.noUiSlider.set([null, value]);
		}
	}

	// Price Slider
	var priceSlider = document.getElementById('price-slider');
	if (priceSlider) {
		noUiSlider.create(priceSlider, {
			start: [1, 999],
			connect: true,
			step: 1,
			range: {
				'min': 1,
				'max': 999
			}
		});

		priceSlider.noUiSlider.on('update', function( values, handle ) {
			var value = values[handle];
			handle ? priceInputMax.value = value : priceInputMin.value = value
		});
	}

	/////////////////////////////////////////

	// Search functionality
	$('.header-search form').on('submit', function(e) {
		e.preventDefault();
		var searchTerm = $(this).find('input.input').val().toLowerCase();
		var categoryValue = $(this).find('select.input-select').val();
		var categoryText = $(this).find('select.input-select option:selected').text().toLowerCase();
		
		if (searchTerm.trim() === '') {
			alert('Please enter a search term');
			return;
		}
		
		// Category mapping
		var categoryMap = {
			'0': 'all',
			'1': 'laptops',
			'2': 'graphic cards',
			'3': 'processors',
			'4': 'ram',
			'5': 'monitors',
			'6': 'gaming desktops',
			'7': 'accessories',
			'8': 'desktops',
			'hp': 'hp',
			'dell': 'dell',
			'lenovo': 'lenovo',
			'acer': 'acer',
			'asus': 'asus'
		};
		
		var selectedCategory = categoryMap[categoryValue] || 'all';
		
		// Check if it's a brand filter (hp, dell, lenovo, acer, asus)
		var isBrandFilter = ['hp', 'dell', 'lenovo', 'acer', 'asus'].includes(selectedCategory);
		
		// Filter products based on search term and category
		var visibleCount = 0;
		$('.product').each(function() {
			var productName = $(this).find('.product-name').text().toLowerCase();
			var productCategory = $(this).find('.product-category').text().toLowerCase();
			var productBrand = $(this).data('brand') || '';
			
			var matchesSearch = productName.includes(searchTerm) || productCategory.includes(searchTerm);
			
			var matchesCategory = false;
			if (isBrandFilter) {
				// If brand filter is selected, match by brand
				matchesCategory = productCategory.includes('desktops') && productBrand === selectedCategory;
			} else {
				// Regular category matching
				matchesCategory = selectedCategory === 'all' || productCategory.includes(selectedCategory);
			}
			
			if (matchesSearch && matchesCategory) {
				$(this).show();
				visibleCount++;
			} else {
				$(this).hide();
			}
		});
		
		// Show message if no products found
		$('.alert-info').remove();
		if (visibleCount === 0) {
			var message = 'No products found';
			if (selectedCategory !== 'all') {
				message += ' in ' + categoryText;
			}
			message += ' matching "' + searchTerm + '"';
			$('.section').first().prepend('<div class="alert alert-info" style="margin: 15px;">' + message + '</div>');
		}
	});

	// Clear search on input change
	$('.header-search input.input').on('input', function() {
		if ($(this).val().trim() === '') {
			$('.product').show();
			$('.alert-info').remove();
		}
	});

	/////////////////////////////////////////

	// Brand filter functionality for Desktops
	$('.brand-filter-btn').on('click', function() {
		var selectedBrand = $(this).data('brand');
		
		// Update active button
		$(this).siblings('.brand-filter-btn').removeClass('active');
		$(this).addClass('active');
		
		// Get the parent tab container
		var $tabContainer = $(this).closest('.tab-pane');
		
		// Filter products within this tab
		$tabContainer.find('.product').each(function() {
			var productBrand = $(this).data('brand');
			
			if (selectedBrand === 'all' || productBrand === selectedBrand) {
				$(this).show();
			} else {
				$(this).hide();
			}
		});
	});

})(jQuery);
