<script>
  /**
     * @component
     * Sources component to display sources.
     *
     * @prop {String} sources - A string specifying the sources to be displayed.
     */

	const { sources } = $props();
</script>

{#if sources && !/^\s+$/.test(sources)}
	<div>
		<span>
			<svg
				width="13"
				height="12"
				viewBox="0 0 13 12"
				fill="none"
			>
				<g transform="translate(0.5, 0.5)">
					<path
						class="s"
						d="M1.15 10.705C0.51 10.705 0 10.205 0 9.55503V7.18503H2.06V8.96503H4.3V6.12503H0.01V1.43503C0.01 0.785034 0.52 0.285034 1.16 0.285034H5.2C5.84 0.285034 6.35 0.785034 6.35 1.43503V3.36503H4.29V2.02503H2.07V4.42503H6.36V9.56503C6.36 10.205 5.86 10.715 5.21 10.715H1.15V10.705Z"
					/>
				</g>
				<g transform="translate(10, 4.95)">
					<rect
						class="s"
						width="3.2"
						height="3.2"
					></rect>
				</g>
			</svg>
		</span>
		{sources}
	</div>
{/if}

<style lang="scss">
	@use './../scss/config';

	div {
		margin: 0;
		color: var(--int-font-color-default);
		font-size: config.$font-size-s;
		line-height: config.$lineHeightDefault;
	}

	.s {
		fill: var(--int-font-color-default);
	}

	span {
		margin-right: 1px;
		position: relative;
		top: 1px;
	}
</style>