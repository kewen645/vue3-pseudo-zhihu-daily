<template>
	<header class="header-box">
		<div class="left">
			<div class="time">
				<span>{{ timeNow.day }}</span>
				<span>{{ timeNow.month }}</span>
			</div>
			<h1 class="title">ZhiHu Daily</h1>
		</div>
		<router-link class="link-btn" to="/person">
			<img :src="pic" alt="" />
		</router-link>
	</header>
</template>

<script>
	import { computed, onBeforeMount } from 'vue'
	import timg from '../assets/images/timg.jpg'
	import { formatTime } from '@/assets/utils'
	import { useStore } from 'vuex'

	export default {
		// eslint-disable-next-line vue/multi-word-component-names
		name: 'Head',
		props: {
			time: {
				type: String,
				default: ""
			}
		},
		setup(props) {
			const store = useStore()
			// const state = reactive({
			// 	// pic: require('../assets/images/timg.jpg')   // commonJS规范
			// 	pic: timg
			// })
			let pic = computed(() => {
				let { isLogin, info } = store.state
				if (isLogin && info) return info.pic || timg
				return timg
			})

			let timeNow = computed(() => {
				let time = props.time || null
				let [month, day] = formatTime(time, '{1}-{2}').split('-')  // [month, day]
				let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
				return {
					month: months[month - 1],
					day
				}
			})

			// Head组件挂载之前检查用户是否已经登录，并且是否有用户信息
			onBeforeMount(() => {
				let { isLogin, info } = store.state
				if (isLogin === null) store.dispatch('changeLoginAsync')
				if (info === null) store.dispatch('changeInfoAsync')

			})

			return {
				pic,
				timeNow
			}
		}
	}
</script>

<style lang="less" scoped>
	.header-box {
		display: flex;
		padding: 10px 15px;
		justify-content: space-between;
		align-items: center;

		.left {
			display: flex;
			justify-content: flex-start;
			align-items: center;
		}

		.time {
			padding-right: 15px;
			border-right: 1px solid #ddd;
			span {
				display: block;
				height: 20px;
				line-height: 20px;
				font-size: 20px;
				text-align: center;

				&:nth-child(2) {
					height: 16px;
					line-height: 16px;
					font-size: 16px;
					text-align: center;
				}
			}
		}
		.title {
			display: inline-block;
			padding-top: 15px;
			padding-left: 10px;
			font-size: 18px;
		}

		.link-btn {
			box-sizing: border-box;
			width: 30px;
			height: 30px;

			img {
				display: block;
				width: 100%;
				height: 100%;
				border-radius: 50%;
			}
		}
	}
</style>