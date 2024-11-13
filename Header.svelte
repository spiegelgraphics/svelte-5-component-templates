<script>
	/**
	 * @component Header
	 *
	 * This Svelte component renders a header with a headline, topline, intro and a paywall icon.
	 * It fetches settings from a script tag with type "application/settings+json".
   * 
	 */

	const script = document.querySelector('script[type="application/settings+json"]');

	const data = JSON.parse(script?.innerHTML || '{}');

	const { headline: headlineCombined, intro } = data?.editorial?.info || {};
	const { type: payWallType } = data?.paywall?.category || {};

	const splittedCombinedHeadline = headlineCombined?.split(':') || [];

	const topline = splittedCombinedHeadline[0] || 'Topline';
	const headline = splittedCombinedHeadline.slice(1).join(':') || 'Headline';

	const hasPaywall = payWallType && payWallType !== 'free';
</script>

<div class="title">
	<h2>
		{#if topline}
			<span class="line">{topline}</span>
		{/if}
		<span class="headline">
			{#if hasPaywall}
				<span class="icon">
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
			{/if}
			<span>{headline}</span>
		</span>
	</h2>
	{#if intro}
		<div class="intro">
			{intro}
		</div>
	{/if}
</div>

<style lang="scss">
	@use './../scss/config';

	.title {
		--title-padding-bottom: 0;
		--title-h-padding: 1rem;
		--title-color: var(--int-font-color-default);
		--font-size-h2: 1.5rem;
		--font-size-line: 1rem;
		--font-size-headline: 2rem;
		--font-size-intro: 1.125rem;

		display: flex;
		flex-direction: column;
		align-items: center;
		width: 100%;
		max-width: 520px;
		text-align: center;
		@include config.fontFamily(config.$spSans);
		line-height: 1.26;
		color: var(--title-color);
		margin: 0 auto;
		padding: 0 var(--title-h-padding) var(--title-padding-bottom);

		@media (min-width: 720px) {
			--font-size-line: 1.125rem;
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
	}

	h2 {
		display: flex;
		flex-direction: column;
		align-items: center;
		font-weight: 700;
		font-size: var(--font-size-h2);
	}

	.line {
		margin-bottom: 0.5rem;
		font-size: 1rem;
	}

	.headline {
		@include config.fontFamily(config.$spSlab);
		font-size: var(--font-size-headline);
		line-height: 1.08;
		margin-bottom: 0.5rem;
		box-sizing: border-box;
	}

	.icon {
		position: relative;
		top: -0.125rem;
		display: inline-flex;
		padding-right: 0.25rem;
		line-height: 0;
		vertical-align: middle;
		box-sizing: border-box;

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

	.intro {
		font-size: var(--font-size-intro);
		line-height: 1.38;
	}
</style>