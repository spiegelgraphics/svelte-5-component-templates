<script>
	/**
	 * @component
	 * Header component to display article title with optional topline, paywall icon, and intro text as well as custom style for overlay.
	 * Automatically reads article metadata from a script tag with type 'application/settings+json' in the document.
	 *
	 * @prop {boolean} hideTopline - Indicates if the topline should be hidden. Default is false.
	 * @prop {boolean} hideIntro - Indicates if the intro/teaser text should be hidden. Default is false.
	 * @prop {string} intro - The intro/teaser text to display below the headline.
	 * @prop {boolean} isOverlay - Indicates if the header should be styled as an overlay (with text shadow and white color). Default is false.
	 */

	const { hideTopline = false, hideIntro = false, intro, isOverlay = false} = $props();

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

	const { info: { headline: headline_raw = '' } = {} } = editorial;

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
							viewBox="0 0 20 20"
							xmlns="http://www.w3.org/2000/svg"
							role="img"
							aria-hidden="true"
						>
							<g>
								<rect
									width="20"
									height="20"
									rx="1.5"
								></rect>
								<path
									fill-rule="evenodd"
									clip-rule="evenodd"
									d="M4 10.684V6.295C4 5.575 4.36 5 5.295 5h3.669c.648 0 1.08.432 1.08 1.151v1.943H8.172v-1.44H5.799v2.303h4.244v4.82c0 .791-.431 1.223-1.295 1.223H5.223C4.36 15 4 14.496 4 13.849v-2.302h1.87v1.798h2.375v-2.662H4z"
								></path>
								<path
									d="M13.825 7.8h1.35v2.025H17.2v1.35h-2.025V13.2h-1.35v-2.025H11.8v-1.35h2.025V7.8z"
								></path>
							</g>
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
