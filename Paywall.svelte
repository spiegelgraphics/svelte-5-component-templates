<script>
  /**
   * @component
   * @name Paywall
   * @description
   * A paywall wrapper component that overlays its children with a paywall UI
   * and visually blurs the underlying content.
   *
   * @example
   * <Paywall enabled={!subscriptionCookie.isOpen}>
   *   <Content />
   * </Paywall>
   *
   * @prop {Snippet} children
   *   The content that should be wrapped by the paywall. This content is visually blurred
   *   and blocked from interaction while the paywall overlay is shown.
   *
   * @prop {boolean} [enabled=false]
   * Controls whether the paywall overlay is active.
   * When enabled, the wrapped content is visually blurred and blocked from interaction,
   * and the paywall UI is displayed on top.
   *
   * In a typical setup, this value is derived from the user's subscription or login state,
   * for example:
   *
   * enabled={!subscriptionCookie.isOpen} // to be copied from here: https://github.com/spiegelgraphics/svelte-5-utilities/blob/main/subscriptionCookie.js
   */

    let {children, enabled = false} = $props();

    const currentURL = encodeURIComponent(window.location.href);

    const triggerAboShop = (e) => {
        if (window.navigator.webBridge?.triggerOffer) {
            e.preventDefault();
            window.navigator.webBridge.triggerOffer({product: 'Spplus', targetUrl: currentURL});
        }
    }

    const triggerLogin = (e) => {
        if (window.navigator.webBridge?.triggerLogin) {
            e.preventDefault();
            window.navigator.webBridge.triggerLogin();
        }
    }
</script>

<div class="paywall-wrapper">
    <div class="paywall-content" class:blurred={enabled}>
        {@render children?.()}
    </div>

    {#if enabled}
        <div class="paywall">
            <div class="paywall-alert">
                <div style="position: relative;">
                    <svg width="36" height="36" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="16" height="16" rx="1.5" fill="var(--int-font-color-link)"/>
                        <path d="M7 4H9V7.00001H12V9.00001H9V12H7V9.00001H4V7.00001H7V4Z" fill="white"/>
                    </svg>
                    <br/>
                    <strong>Exklusiver Inhalt</strong><br/>
                    für Abonnenten
                    <div class="splus-links">
                        <button class="splus-aboshop" onclick={triggerAboShop}>Abonnieren</button>
                        oder
                        <a onclick={triggerLogin}
                           href="https://gruppenkonto.spiegel.de/anmelden.html?requestAccessToken=true&targetUrl={currentURL}">einloggen</a>
                    </div>
                </div>
            </div>
        </div>
    {/if}

</div>

<style lang="scss">

  .paywall-wrapper {
    position: relative;
  }

  .paywall-content.blurred {
    filter: blur(2px);
    pointer-events: none;
  }

  .paywall {
    position: absolute;
    inset: 0;
    z-index: 100;
    background: linear-gradient(to top, var(--int-background-color-default) 10%, transparent 90%);

    .paywall-alert {
      position: absolute;
      top: 40%;
      left: 50%;
      transform: translate(-50%, -50%);
      text-align: center;
      padding: 16px;
      background: var(--int-background-color-default-rgba-halftransparent);
      backdrop-filter: brightness(96%) blur(20px);
      -webkit-backdrop-filter: brightness(96%) blur(20px);
      color: var(--int-text-color-default);
      font-size: 1rem;
      box-shadow: 0px 1px 13px 0px rgba(0, 0, 0, 0.15);
      border-radius: .5rem;

      svg {
        position: absolute;
        top: -40%;
        left: 50%;
        transform: translate(-50%, 0);

        rect {
          fill: var(--int-font-color-link);
        }

        path {
          fill: #FFF;
        }
      }

      .splus-links {
        margin-top: .25rem;
        font-size: .875rem;

        button, a {
          background: transparent;
          border: 0;
          text-decoration: underline;
          cursor: pointer;
        }
      }
    }
  }
</style>