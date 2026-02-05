<script>
	/**
	 * @component
	 * Header component to display article title with optional topline, paywall icon, and intro text as well as custom style for overlay.
	 * Automatically reads article metadata from a script tag with type 'application/settings+json' in the document.
	 *
	 * @prop {boolean} hideTopline - Indicates if the topline should be hidden. Default is false.
	 * @prop {boolean} hideIntro - Indicates if the intro/teaser text should be hidden. Default is false.
	 * @prop {boolean} isOverlay - Indicates if the header should be styled as an overlay (with text shadow and white color). Default is false.
	 */

	const { hideTopline = false, hideIntro = false, isOverlay = false} = $props();

	const splitHeadline = (headline_raw) => {
		const rxSplitHeadline = /^(?:(.+?):\s)?(.+)$/g;
		const match = rxSplitHeadline.exec(headline_raw);
		const [, topline = '', headline = ''] = match || [];
		return [topline || 'Topline', headline || 'Headline'];
	};

	const scriptTag = document.querySelector("script[type='application/settings+json']");

	const allSettings = JSON.parse(scriptTag?.textContent || '{}') || {};

	const { editorial = {}, paywall: { category: { type: payWallType = '' } = {} } = {} } =
		allSettings;

	const { info: { headline: headline_raw = '', intro = '' } = {} } = editorial;

	const [topLine = '', headline = ''] = splitHeadline(headline_raw);
	
	const hasPaywall = payWallType && payWallType !== 'free';
</script>

<div class="duv-title {isOverlay ? 'duv-title--overlay' : ''}">
	<h2>
		{#if !hideTopline && topLine}
			<span class="duv-line">{topLine}</span>
		{/if}
		<span class="duv-headline">
			{#if hasPaywall}
				<span class="duv-icon">
					<span>
						<svg
							width="20"
							height="20"
							viewBox="0 0 16 16"
							xmlns="http://www.w3.org/2000/svg"
							role="img"
							aria-hidden="true"
						>
							<rect width="16" height="16" rx="1.5" fill="#E64415"/>
							<path d="M7 4H9V7.00001H12V9.00001H9V12H7V9.00001H4V7.00001H7V4Z" fill="white"/>
						</svg>
					</span>
				</span>
			{/if}
			<span>{headline}</span>
		</span>
	</h2>

	{#if !hideIntro && intro}
		<div class="duv-intro">
			{intro}
		</div>
	{/if}
</div>

<style lang="scss">
	@use '../scss/config';

	.duv-title {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		@include config.fontFamily(config.$spSans);
		line-height: 1.26;
		color: var(--title-color);
		margin: 0 auto;
		padding: var(--title-padding-top) var(--title-h-padding) var(--title-padding-bottom);

		width: 100%;
		max-width: 520px;
		--title-padding-top: 2rem;
		--title-padding-bottom: 0;
		--title-h-padding: 1rem;
		--title-color: var(--int-font-color-default);
		--font-size-h2: 1.5rem;
		--font-size-line: 1rem;
		--font-size-headline: 2rem;
		--font-size-intro: 1.125rem;

		@media (min-width: 720px) {
			--font-size-line: 1.125rem;
			--title-padding-top: 2.5rem;
			--title-padding-bottom: 0;
			--title-h-padding: 1.5rem;
			--font-size-intro: 1.25rem;
			width: 83.33333333333334%;
		}
		@media (min-width: 720px) and (max-width: 1019px) {
			--font-size-headline: 2.25rem;
			max-width: 920px;
		}
		@media (min-width: 1020px) {
			--font-size-headline: 3rem;
			max-width: 1020px;
		}

		&--overlay {
			text-shadow: 1px 1px 1px rgba(0, 0, 0, .75);
			color: white;
		}
	}

	h2 {
		display: flex;
		flex-direction: column;
		align-items: center;
		font-weight: 700;
		font-size: var(--font-size-h2);
	}

	.duv-line {
		margin-bottom: 0.5rem;
		font-size: 1rem;
	}

	.duv-headline {
		@include config.fontFamily(config.$spSlab);
		font-size: var(--font-size-headline);
		line-height: 1.08;
		margin-bottom: 0.5rem;
	}

	.duv-icon {
		display: inline-flex;
		padding-right: 0.25rem;
		line-height: 0;
		vertical-align: middle;
		margin-bottom: 5px;

		span {
			display: inline-block;
		}

		path {
			fill: #fff;
		}

		rect {
			fill: #e64415;
			@media screen and (prefers-color-scheme: dark) {
				fill: #d03d12;
			}
		}
	}

	.duv-intro {
		font-size: var(--font-size-intro);
		line-height: 1.38;
	}
</style>
