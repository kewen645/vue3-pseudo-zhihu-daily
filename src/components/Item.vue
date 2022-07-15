<template>
	<div class="news-item">
		<router-link :to="`/detail/${data.id}`">
			<div class="img-box">
				<img
					v-if="data.images && data.images.length > 0"
					v-lazy="data.images[0]"
					alt=""
				/>
			</div>
			<h4 class="title">{{ data.title }}</h4>
			<p class="desc">{{ data.hint }}</p>
		</router-link>
	</div>
</template>

<script>
	export default {
		// eslint-disable-next-line vue/multi-word-component-names
		name: 'Item',
		props: {
			data: {
				type: Object,
				required: true
			}
		}
	}
</script>

<style lang="less" scoped>
	.news-item {
		box-sizing: border-box;
		position: relative;
		padding: 15px 0;
		height: 95px;
		overflow: hidden;

		a {
			display: block;
		}

		.img-box {
			width: 65px;
			height: 65px;
			position: absolute;
			right: 0;
			top: 15px;
			background: #f4f4f4;

			img {
				display: block;
				width: 100%;
				height: 100%;
			}
		}

		.title {
			margin-right: 75px;
			max-height: 50px;
			line-height: 25px;
			overflow: hidden;
			font-size: 16px;
			color: #000;
		}

		.desc {
			margin-right: 75px;
			max-height: 15px;
			line-height: 15px;
			font-size: 12px;
			color: #999;
		}
	}
</style>