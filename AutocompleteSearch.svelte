<script>
  /**
	 * @component
	 * AutocompleteSearch
	 *
	 * A searchable dropdown component with autocomplete functionality that filters items in real-time,
   * using a virtual list to render a large number of items efficiently.
	 * Supports keyboard navigation and custom styling.
	 *
	 * @prop {Array} items - The list of items to search through.
   * @prop {String} selectLabel - Optional label displayed above the input field. Default: ''
	 * @prop {Boolean} showSelectLabel - Show the label. Default: true
	 * @prop {String} key - The key in the item object used as the search/id field. If null, the item itself is used.
   * @prop {String} displayKey - The key in the item object used as the display label. If null, the item itself is used.
	 * @prop {String} placeholder - Placeholder text for the search input. Default: 'Suchen...'
	 * @prop {Object} selectedItem - The currently selected item. Bindable, updates when an item is selected.
	 * @prop {HTMLElement} textbox - The underlying search input element. Bindable.
	 * @prop {Boolean} showSearchIcon - Show the search icon when the input is empty. Default: true
	 * @prop {Boolean} showPaywall - Show a paywall notice instead of the suggestion list. Default: false
	 * @prop {Function} onselect - Callback fired with `{ selectedItem }` whenever the selection changes.
   * @prop {String} layout - The control layout. Choose between "hero" and "regular". Default: "regular"
	 * @prop {Boolean} disableAutocomplete - If true, disables native browser autocomplete/autocorrect/spellcheck on the input.
	 * @prop {Number} autocompleteBoxMaxHeight - Maximum height of the dropdown list in pixels. Default: 200
	 *
	 * />
	 */

  import { clickOutside } from '$actions/clickOutside';
  import { VirtualList } from 'svelte-virtuallists';

  let {
    showSelectLabel = true,
    selectLabel = '',
    items: _items = [],
    key = null,
    displayKey = null,
    placeholder = "Suchen...",
    selectedItem = $bindable(),
    textbox: textboxProp = $bindable(null),
    showSearchIcon = true,
    showPaywall = false,
    onselect = null,
    layout = "regular",
    disableAutocomplete = false,
    autocompleteBoxMaxHeight = 200
  } = $props();

  let textbox = $state(null);

  $effect(() => {
    textboxProp = textbox;
  });
  let container = $state(null);
  const currentURL = encodeURIComponent(window.location.href);

  let searchString = $state('');
  let searchInputHasFocus = $state(false);
  let autocompleteVisible = $state(false);
  let activeListIndex = $state(0);
  let showAbove = $state(false);

  let start = $state(0);
  let end = $state(0);
  let scrollToIndex = $state(0);

  let items = $derived(_items.map((d, i) => {
    return {
      item: {...d},
      searchString: key ? d[key] : d,
      label: displayKey ? d[displayKey] : d,
      index: i
    }
  }));

  let filteredList = $derived.by(() => {
    if (searchString && searchString.trim().length > 0) {
      const searchWords = searchString.toLowerCase().split(/\s+/);
      const filtered = items.filter(item => {
        const itemWords = item.searchString.toLowerCase().split(/\s+/);
        return searchWords.every(word => itemWords.some(itemWord => itemWord.includes(word)));
      });
      return filtered.sort((a, b) => {
        const asearchString = a.searchString.toLowerCase();
        const bsearchString = b.searchString.toLowerCase();
        const searchLower = searchString.toLowerCase();
        
        const aStartsWith = asearchString.startsWith(searchLower);
        const bStartsWith = bsearchString.startsWith(searchLower);
        
        if (aStartsWith && !bStartsWith) return -1;
        if (!aStartsWith && bStartsWith) return 1;
        
        return 0;
      });
    }
    return items;
  });

  let hasSuggestions = $derived(filteredList.length > 0);

  const handleKey = (e) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      e.stopPropagation();
      searchString = '';
      activeListIndex = 0;
      scrollToIndex = 0;
      e.target.blur();
      autocompleteVisible = false;
      selectedItem = null;
      if(!showPaywall) {
        onselect?.({ selectedItem });
      }
      return;
    }
    if(showPaywall) {
      e.stopPropagation();
      return;
    }

    if (e.key === 'ArrowDown') {
      activeListIndex = Math.min(activeListIndex + 1, filteredList.length - 1);
      if (activeListIndex >= end - 1) {
        scrollToIndex = Math.min(scrollToIndex + 1, filteredList.length - 1);
      }
    }
    else if (e.key === 'ArrowUp') {
      activeListIndex = Math.max(activeListIndex - 1, 0);
      if (activeListIndex < start) {
        scrollToIndex = Math.max(scrollToIndex - 1, 0);
      }
    }
    else if (e.key === 'Enter') {
      e.preventDefault();
      e.stopPropagation();
      selectedItem = filteredList[activeListIndex];
      activeListIndex = 0;
      scrollToIndex = 0;
      e.target.blur();
      onselect?.({ selectedItem });
      autocompleteVisible = false;
    }
    else {
      activeListIndex = 0;
      scrollToIndex = 0;
    }
  };

  const handleClear = (e) => {
    e.stopPropagation();
    e.preventDefault();
    selectedItem = null;
    searchString = '';
    activeListIndex = 0;
    scrollToIndex = 0;
    autocompleteVisible = true;
    textbox?.focus();
    onselect?.({ selectedItem });
  };

  const handleClick = (e) => {
    selectedItem = e;
    searchString = e.searchString;
    activeListIndex = 0;
    scrollToIndex = 0;
    onselect?.({ selectedItem });
    autocompleteVisible = false;
  };

  const handleListScroll = (e) => {
    start = e.start;
    end = e.end;
  };

  const getHighlightSegments = (label, query) => {
    if (!query || !query.trim()) return [{ text: label, match: false }];

    const words = query.toLowerCase().split(/\s+/).filter(Boolean);
    const lowerLabel = label.toLowerCase();

    const ranges = [];
    for (const word of words) {
      let fromIndex = 0;
      while (true) {
        const found = lowerLabel.indexOf(word, fromIndex);
        if (found === -1) break;
        ranges.push([found, found + word.length]);
        fromIndex = found + word.length;
      }
    }
    if (ranges.length === 0) return [{ text: label, match: false }];

    ranges.sort((a, b) => a[0] - b[0]);
    const merged = [ranges[0]];
    for (const range of ranges.slice(1)) {
      const last = merged[merged.length - 1];
      if (range[0] <= last[1]) {
        last[1] = Math.max(last[1], range[1]);
      } else {
        merged.push(range);
      }
    }

    const segments = [];
    let pos = 0;
    for (const [start, end] of merged) {
      if (start > pos) segments.push({ text: label.slice(pos, start), match: false });
      segments.push({ text: label.slice(start, end), match: true });
      pos = end;
    }
    if (pos < label.length) segments.push({ text: label.slice(pos), match: false });
    return segments;
  };

  const handleClickOutside = () => {
    autocompleteVisible = false;
    textbox.blur();
  };

  const triggerAboShop = (e) => {
    if(window.navigator.webBridge?.triggerOffer) {
      e.preventDefault();
      window.navigator.webBridge.triggerOffer({ product: 'Spplus', targetUrl: currentURL});
    }
  }

  const triggerLogin = (e) => {
    if(window.navigator.webBridge?.triggerLogin) {
      e.preventDefault();
      window.navigator.webBridge.triggerLogin();
    }
  }

  $effect(() => {
    if (selectedItem) {
      searchString = selectedItem.label;
    }
    else {
      searchString = '';
    }
  });

  $effect(() => {
    if (autocompleteVisible && container) {
      const rect = container.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      showAbove = spaceBelow < 220 && spaceAbove > spaceBelow;
    } else {
      showAbove = false;
    }
  });
</script>

<!-- <svelte:options customElement="autocomplete-select" /> -->

<div class="autocomplete-select" class:show-above={showAbove} class:hero={layout === 'hero'} class:no-suggestions={!hasSuggestions} class:open={autocompleteVisible} use:clickOutside onclick_outside={handleClickOutside} bind:this={container}>
  {#if showSelectLabel && selectLabel}
    <div class="label">{selectLabel}</div>
  {/if}
  <div class="autocomplete-input"
    onclick={() => textbox.focus()}
    onkeydown={(e) => e.key === 'Enter' && textbox.focus()}
    role="none" tabindex="-1">
    {#if selectedItem && !searchInputHasFocus}
      <div class="selected-item">
        <span>{selectedItem.label}</span>
        <!-- <button class="clear" onclick={handleClear} aria-label="Auswahl löschen">
          <svg xmlns="http://www.w3.org/2000/svg" class="icon black" width="15" height="16" viewBox="0 0 15 16" fill="none">
            <path d="M12.7441 13.7222L2.25295 3.23096M12.7441 3.23096L2.25295 13.7222" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
      </button> -->
      </div>
    {/if}
    <input type="text" placeholder={selectedItem ? '' : placeholder}
      bind:value={searchString}
      onfocus={() => {searchInputHasFocus = true; autocompleteVisible = true; searchString = '';}}
      onblur={() => {
        searchInputHasFocus = false;
        searchString = selectedItem?.label ?? '';
        setTimeout(() => { autocompleteVisible = false; }, 150);
      }}
      bind:this={textbox}
      onkeydown={handleKey}
      autocomplete={disableAutocomplete ? 'off' : 'on'}
      autocorrect={disableAutocomplete ? 'off' : 'on'}
      autocapitalize={disableAutocomplete ? 'off' : 'on'}
      spellcheck={disableAutocomplete ? 'false' : 'true'} />
    {#if selectedItem || searchString}
      <button class="clear" onmousedown={e => e.preventDefault()} onclick={handleClear} aria-label="Auswahl löschen">
          <svg xmlns="http://www.w3.org/2000/svg" class="icon black" width="15" height="16" viewBox="0 0 15 16" fill="none">
            <path d="M12.7441 13.7222L2.25295 3.23096M12.7441 3.23096L2.25295 13.7222" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
      </button>
    {/if}
    {#if showSearchIcon && !(selectedItem || searchString)}
      <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="6" cy="6" r="5.35" stroke-width="1.3"/>
        <path d="M10 10L14.5 14.5" stroke-width="1.3" stroke-linecap="round"/>
      </svg>
    {/if}
  </div>

  {#if showPaywall}
    <div class="autocomplete-box paywall" class:open={autocompleteVisible} class:above={showAbove}>
      <div class="splus-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="19" height="14" viewBox="0 0 19 14" fill="none">
          <path d="M8.4 12.5906V5.54362H2.81046V2.34899H5.6V4.32215H8.4V1.50336C8.4 0.601335 7.56314 0 6.72 0H1.49891C0.655776 0 0 0.657719 0 1.50336V7.89262H5.586V11.745H2.71677V9.11409H0V12.4966C0 13.3423 0.655776 14 1.49891 14H6.804C7.66615 14 8.4 13.4362 8.4 12.5906Z" fill="white"/>
          <path d="M13.7002 3H15.7002V6H18.7002V8H15.7002V11H13.7002V8H10.7002V6H13.7002V3Z" fill="white"/>
        </svg>
      </div>
      <div class="splus-abotext">
        <button onclick={triggerAboShop} aria-label="Dieser Inhalt ist ein exklusiver Plus-Inhalt. Zum Abo-Shop.">
          Dieser Inhalt ist nur für Plus-Abonnenten verfügbar.<br />
          <span class="splus-shoplink">
            Jetzt abonnieren
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M4.3335 2.66666L7.66683 5.99999L4.3335 9.33332" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
          </span>
        </button>
        <a class="splus-loginlink" onclick={triggerLogin} href="https://gruppenkonto.spiegel.de/anmelden.html?requestAccessToken=true&targetUrl={currentURL}">
          Zum Login für Abonnenten
        </a>
      </div>
    </div>
  {:else}
    <div class="autocomplete-box" role="listbox" class:open={autocompleteVisible} class:above={showAbove}>
      <VirtualList 
        items={filteredList}
        {scrollToIndex}
        style="max-height: {autocompleteBoxMaxHeight}px;"
        onVisibleRangeUpdate={handleListScroll}
        scrollToAlignment="start"
        scrollToBehaviour="smooth">
        {#snippet vl_slot({index, item})}
          <div class="list-item"
            role="option"
            tabindex="0"
            onmousedown={() => handleClick(item)}
            class:active={index == activeListIndex}
            aria-selected={index == activeListIndex}>
            {#if layout === 'hero'}
              {#each getHighlightSegments(item.label, searchString) as segment, i (i)}
                {#if segment.match}<strong>{segment.text}</strong>{:else}{segment.text}{/if}
              {/each}
            {:else}
              {item.label}
            {/if}
          </div>
        {/snippet}
      </VirtualList>
    </div>
  {/if}
</div>

<style lang="scss">
  @use "../../scss/config" as config;

  $borderWidth: 2px;

  $selectionDefault: #DDDBD9;
  $selectionDark: #32312E;

  $paywallBorder: #BF3C32;
  $paywallBorderDark: #D15945;
  $paywallForeground: #FFF;

  .autocomplete-select {
    @include config.fontFamily(config.$spSans);

    font-size: 1rem;
    position: relative;
    width: 100%;


    .label {
      font-weight: bold;
      margin-bottom: 0.25rem;
    }
  }

  .autocomplete-input {
    border-radius: 1.5px;
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: .25rem .75rem;
    gap: .75rem;
    width: 100%;
    cursor: text;
    border: var(--borderWidth, 1px) solid var(--int-border-color-default);
    background: var(--int-background-color-default);
  }
  .autocomplete-input:has(input[type=text]:focus) {
    border: var(--borderWidth, 1px) solid var(--int-font-color-default);
    border-bottom: 1px solid transparent;
  }
  .show-above .autocomplete-input:has(input[type=text]:focus) {
    border: var(--borderWidth, 1px) solid var(--int-font-color-default);
    border-top: 1px solid transparent;
    border-bottom: var(--borderWidth, 1px) solid var(--int-font-color-default);
  }
  .autocomplete-input input[type=text] {
    flex: 1;
    min-width: 0;
    border: 0;
    outline: 0;
    padding: .55rem 0;
    background: transparent;
  }
  .autocomplete-input:has(.selected-item) input[type=text] {
    flex: 0;
    width: 0;
    padding-left: 0;
    padding-right: 0;
  }

  .autocomplete-input input[type=text]::placeholder {
    color: var(--int-border-color-default);
  }
  .autocomplete-input .selected-item {
    display: flex;
    flex-direction: row;
    gap: 0.325rem;
    align-items: center;
    // background: $selectionDefault;
    border-radius: 0.125rem;
    // padding: 0.25rem 0.5rem;
    padding: .25rem 0;
    flex: 1 1 0;
    min-width: 0;

    span {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  .autocomplete-input svg,
  .autocomplete-input button.clear {
    flex-shrink: 0;
    flex-grow: 0;
  }

  .autocomplete-input svg.icon circle,
  .autocomplete-input svg.icon path {
    stroke: var(--int-border-color-default);
  }

  .autocomplete-input svg.icon.black path {
    stroke: var(--int-font-color-default);
  }

  .autocomplete-box {
    border: 1px solid var(--int-font-color-default);
    border-top: none;
    border-radius: 0 0 1.5px 1.5px;
    background: var(--int-background-color-default);
    width: 100%;
    position: absolute;
    left: 0;
    top: 100%;
    display: none;
    pointer-events: all;
    z-index: 100;

    &.above {
      top: auto;
      bottom: 100%;
      border-top: 1px solid var(--int-font-color-default);
      border-bottom: none;
      border-radius: 1.5px 1.5px 0 0;
    }

    &.paywall.open {
      display: flex;
      flex-direction: row;
      align-items: flex-start;
      gap: 0.5rem;
      padding: 0.5rem;
      background: var(--int-font-color-link);
      border: 1px solid $paywallBorder;
      color: $paywallForeground;

      .splus-abotext {
        display: flex;
        flex-direction: column;
        gap: .825rem;
        cursor: pointer;

        button {
          display: block;
          background: transparent;
          border: 0;
          text-align: left;
        }

        .splus-shoplink {
          font-weight: 600;
          text-decoration: underline;
        }

        .splus-loginlink {
          font-size: .825rem;
          text-decoration: underline;
        }
      }
    }

    @media (prefers-color-scheme: dark) {
      &.paywall {
        background: var(--int-font-color-link);
        border: 1px solid $paywallBorderDark;
      }
    }
  }
  .autocomplete-box.open {
    display: block;
  }
  .list-item {
    padding: 0.5rem;
    cursor: pointer;
  }
  .list-item:hover, .list-item.active {
    background-color: $selectionDefault;
  }
  @media (prefers-color-scheme: dark) {
    .list-item:hover, .list-item.active {
      background-color: $selectionDark;
    }
  }

  $heroText: rgba(0, 0, 0, 255);
  $heroTextDark: rgba(241, 239, 237, 1);
  $heroTextPlaceholder: rgba(128, 126, 124, 1);
  $heroTextPlaceholderDark: rgba(152, 150, 148, 1);
  $heroBg: #F1EFED;
  $heroBgDark: #4C4C4C;
  $heroSelected: #E64415;
  $heroSelectedDark: #D63F11;
  $heroRadius: 1.5rem;

  .autocomplete-select.hero {
    .autocomplete-input {
      border-radius: $heroRadius;
      background: $heroBg;
      border-color: transparent;
      font-weight: bold;
      color: $heroText;

      input[type=text] {
        font-weight: bold;
        color: $heroText;
      }
      input[type=text]::placeholder {
        color: $heroTextPlaceholder;
        opacity: 0.7;
      }
      svg.icon circle,
      svg.icon path {
        stroke: $heroText;
      }
    }

    &.open {
      .autocomplete-input {
        border-color: transparent;
        border-bottom: 1px solid transparent;
        border-radius: $heroRadius $heroRadius 0 0;
      }
      &.show-above .autocomplete-input {
        border-color: transparent;
        border-top: 1px solid transparent;
        border-bottom: 1px solid transparent;
        border-radius: 0 0 $heroRadius $heroRadius;
      }
    }

    &.no-suggestions.open {
      .autocomplete-input {
        border-bottom: 1px solid transparent;
        border-radius: $heroRadius;
      }
      &.show-above .autocomplete-input {
        border-top: 1px solid transparent;
        border-radius: $heroRadius;
      }
      .autocomplete-box.open:not(.paywall) {
        display: none;
      }
    }

    .autocomplete-box {
      background: $heroBg;
      border: none;
      border-radius: 0 0 $heroRadius $heroRadius;
      overflow: hidden;

      .list-item {
        font-weight: normal;
        color: $heroText;

        strong {
          font-weight: bold;
        }
      }
      .list-item:hover, .list-item.active {
        background-color: darken($heroBg, 5%);
      }

      &.above {
        border-radius: $heroRadius $heroRadius 0 0;
      }
    }

    &:has(.selected-item) {
      .autocomplete-input {
        background: $heroSelected;
        border-color: transparent;

        input[type=text] { color: #fff; }
        svg.icon circle, svg.icon path { stroke: #fff; }
        svg.icon.black path { stroke: #fff; }
      }
      .selected-item span { color: #fff; font-weight: bold; }
    }

    @media (prefers-color-scheme: dark) {
      .autocomplete-input {
        background: $heroBgDark;
        color: $heroTextDark;
        input[type=text] { color: $heroTextDark; }
        input[type=text]::placeholder { color: $heroTextPlaceholderDark; }
        svg.icon circle, svg.icon path { stroke: $heroTextDark; }
      }
      .autocomplete-box {
        background: $heroBgDark;
        .list-item { color: $heroTextDark; }
        .list-item:hover, .list-item.active { background-color: lighten($heroBgDark, 8%); }
      }
      &:has(.selected-item) {
        .autocomplete-input {
          background: $heroSelectedDark;
        }
      }
    }
  }
</style>