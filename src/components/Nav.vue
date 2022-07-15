<template>
	<!-- 收藏列表favourite组件会通过props传title过来，直接使用即可 -->
	<van-nav-bar
		:title="title"
		left-text="返回"
		left-arrow
		@click-left="backHandler"
	/>
</template>

<script>
	import { useRouter } from 'vue-router'
	export default {
		// eslint-disable-next-line vue/multi-word-component-names
		name: 'Nav',
		props: {
			title: {
				type: String,
				default: ''
			}
		},
		setup() {
			const router = useRouter()

			let backHandler = () => {
				router.back()
			}

			return {
				backHandler
			}
		}
	}
</script>

<style lang="less" scoped>
	:deep(.van-icon),
	:deep(.van-nav-bar__text) {
		color: #000;
	}
</style>
