<script>
	/**
	* @component
	* SwiperWrapper
	* 
	* A wrapper component for Swiper.js that provides a carousel/slider with navigation and slide management.
	* Supports centered slides, mousewheel navigation, and automatic focus on the active slide.
	* 
	* @prop {Array} data - The array of data items to display as slides.
	* @prop {Number} activeIndex - The index of the currently active slide. This is a bindable property.
	* @prop {Object} currentSliderCard - The data object of the currently active slide. This is a bindable property.
	* @prop {Number} slidesPerView - The number of slides visible at once. Default is 3.
	* @prop {Boolean} navigation - Whether to show navigation buttons (prev/next). Default is true.
	* @prop {Number} starterSlide - The initial slide index to display on mount. Default is 0.
	* @prop {Number} slidesPadding - The spacing between slides in pixels. Default is 8.
	* @prop {Snippet} children - Render snippet for each slide item. Receives `{ item }` as parameter.
	* 
	* @event onSlideChange - Fired when the active slide changes via swipe or mousewheel.
	* @event onclick - Fired when a slide is clicked to navigate to it.
	* 
	* @example
	* // Example of how this component is embedded:
	* <SwiperWrapper data={swiperData} bind:activeIndex={currentIndex}>
	*   {#snippet children({ item })}
	*     <SwiperContent data={item} />
	*   {/snippet}
	* </SwiperWrapper>
	*/

	let {
		data, 
		activeIndex = $bindable(0),
        currentSliderCard = $bindable({}),
        slidesPerView = 3,
		navigation = true,
        starterSlide = 0,
        slidesPadding = 8,
        children
	} = $props();

	import {register} from 'swiper/element/bundle';

    let slideChanged = $state(false);
	let swiperElement = $state();
    let clickedIndex = $state(null);

	register();

	const onSlideChange = (e) => {
		const [swiper, progress] = e.detail;
		activeIndex = swiper.activeIndex;
        slideChanged = true;
        setTimeout(() => {
            slideChanged = false;
        }, 300);
	};

    $effect(() => {
        if (swiperElement?.swiper && data.length > 0) {
            setTimeout(() => {
                swiperElement.swiper.slideTo(starterSlide, 0);
            }, 0);
        }
    });

	$effect(() => {
		currentSliderCard = data[activeIndex]
	});

	$effect(() => {
		if (clickedIndex !== null) {
			swiperElement?.swiper?.slideTo(clickedIndex);
			setTimeout(() => {
				clickedIndex = null;
			}, 300);
			clickedIndex = null;
		}
	});

	const onTransitionEnd = (e) => {
		if (swiperElement?.swiper) {

			const currentIndex = swiperElement.swiper.activeIndex;
			swiperElement.swiper.slideTo(currentIndex, 300, true);
		}
	};

	$effect(() => {
		if (swiperElement?.swiper) {
			swiperElement.swiper.on('transitionEnd', onTransitionEnd);

			return () => {
				swiperElement.swiper.off('transitionEnd', onTransitionEnd);
			};
		}
	});

</script>

<swiper-container
		slides-per-view={ slidesPerView }
		data-initial-slide="1"
		grab-cursor="true"
		space-between={slidesPadding} 
		centeredSlides="true"
        mousewheel="true"
        onswiperslidechange={onSlideChange}
        bind:this={swiperElement}
        style:--hide-prev={activeIndex === 0 ? 'none' : 'flex'}
        style:--hide-next={activeIndex === data.length - 1 ? 'none' : 'flex'}
		navigation={navigation}
>
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    {#each data as item, i}
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <!-- svelte-ignore slot_element_deprecated -->
        <swiper-slide
            class:focused={activeIndex === i}
            style:padding-bottom={"3px"}
            onclick={() => {
                clickedIndex = i;
            }}
        >
            {@render children?.({ item })}
        </swiper-slide>
    {/each}
</swiper-container>

<style lang="scss">
  @use './../scss/config';

  :global .swiper-button-disabled {
	opacity: 0;
	cursor: default;
  }


  swiper-container {
	max-width: 100%;
	max-height: 100%;
	width: 100%;
    max-width: 1020px;
	--button-height: 18px;
	z-index: 3;
	overflow: visible;
	position: relative;

    @media (min-width: 720px) {
        width: 83.3333333333%;
    }

	&::before,
	&::after {
		content: '';
		position: absolute;
		top: 0;
		bottom: 0;
		width: 20px;
		z-index: 2;
		pointer-events: none;
	}

	&::before {
		left: 0;
		background: linear-gradient(to right, var(--int-background-color-default), transparent);
	}

	&::after {
		right: 0;
		background: linear-gradient(to left, var(--int-background-color-default), transparent);
	}
  }

  :global .swiper-button-disabled {
	opacity: 0 !important;
  }


  swiper-slide {
    display: flex;
    justify-content: center;
    align-items: flex-start;
	border-radius: 8px;
	box-sizing: border-box;
	opacity: 0.2;
	transition: all 0.2s ease-in-out;
    scroll-y: auto;
    filter: grayscale(1);

	&.focused {
	  opacity: 1;
      z-index: 4;
      filter: grayscale(0);
	}
  }

swiper-container::part(button-next) {
	right: 25px;	
	color: white;
	height: var(--button-height);
	width: var(--button-height);
	background-color: var(--int-button-background, #5C5C56);
	border-radius: 50%;
	border: 3px solid transparent;
	outline: 0.5px solid transparent;
	outline-offset: -1px;
	opacity: 0.9;
	content: '';
	padding: 5px;
	transform: scale(0.8);
    display: var(--hide-next, flex);
	z-index: 5;
  }

  swiper-container::part(button-prev) {
	left: 25px;	
	color: white;
	height: var(--button-height);
	width: var(--button-height);
	background-color: var(--int-button-background, #5C5C56);
	border-radius: 50%;
	border: 3px solid transparent;
	outline: 0.5px solid transparent;
	outline-offset: -1px;
	opacity: 0.9;
	content: '';
	padding: 5px;
	transform: scale(0.8);
    display: var(--hide-prev, flex);
	z-index: 5;
  }

</style>
