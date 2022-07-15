<template>
	<van-skeleton title :row="10" v-if="newsInfo === null" />
	<div v-else class="detail" v-html="newsInfo.body"></div>
	<div class="nav-box">
		<van-icon name="arrow-left" @click="backHandler" />
		<van-icon name="comment-o" :badge="comments" />
		<van-icon name="good-job-o" :badge="popularity" />
		<van-icon
			name="star-o"
			:color="isFavour ? '#1989fa' : '#000'"
			@click="favourHandler"
		/>
		<van-icon name="share-o" color="#ccc" />
	</div>
</template>

<script>
	import { reactive, toRefs, onBeforeMount, onBeforeUnmount, onUpdated, computed } from 'vue'
	import { useRouter, useRoute } from 'vue-router'
	import api from '@/api'
	import { Toast } from 'vant'
	import { useStore } from 'vuex'

	export default {
		// eslint-disable-next-line vue/multi-word-component-names
		name: 'Detail',
		setup() {
			const store = useStore()
			const router = useRouter()
			const route = useRoute()
			const backHandler = () => {
				router.back()
			}

			let state = reactive({
				comments: 0,
				popularity: 0,
				newsInfo: null
			})

			// 该新闻是否已经被收藏
			let isFavour = computed(() => {
				let { isLogin, favourList } = store.state
				if (isLogin) {
					// favourList有可能是null
					if (!Array.isArray(favourList)) favourList = []
					// some 不会对空数组进行检测
					return favourList.some(item => {
						return +item.news.id === +route.params.id
					})
				}
				return false
			})

			// 统一处理派发vuex中的数据
			onBeforeMount(async () => {
				if (store.state.isLogin === null) await store.dispatch('changeLoginAsync')

				// 只有在登录态下，才去派发info和favourList
				if (store.state.isLogin) {
					if (store.state.info === null) await store.dispatch('changeInfoAsync')
					if (store.state.favourList === null) await store.dispatch('changeFavourListAsync')
				}
			})

			// 点击收藏按钮收藏
			const favourHandler = async () => {
				// 点击收藏按钮发现尚未登录，跳转登录页面
				if (!store.state.isLogin) {
					Toast("Please log in.")
					router.push({
						path: '/login',
						query: { from: `detail/${route.params.id}` }
					})
					return
				}

				// 该新闻未被收藏时才进行收藏
				if (isFavour.value) return

				let { code } = await api.addFavour(route.params.id)

				// 收藏失败
				if (+code !== 0) {
					Toast('Add Favour failed')
					return
				}
				// 收藏成功, 更新vuex派发, 重新获取收藏列表
				Toast('Add Favour success')
				store.dispatch('changeFavourListAsync')
			}

			// 处理新闻信息数据
			onBeforeMount(async () => {
				// 新闻详情
				let id = route.params.id
				let res = await api.queryNewsInfo(id)
				state.newsInfo = res

				// 动态创建css
				let link = document.createElement('link')
				link.id = 'link'
				link.rel = "stylesheet"
				link.href = state.newsInfo.css[0]
				document.head.appendChild(link)

				// 新闻点赞和评论数
				let { popularity, comments } = await api.queryStoryExtra(id)
				state.popularity = popularity
				state.comments = comments
			})

			// 加载后，添加详情图片和标题
			onUpdated(() => {
				let imgPlaceHolder = document.querySelector('.img-place-holder')
				if (imgPlaceHolder && imgPlaceHolder.innerHTML === "") {
					imgPlaceHolder.innerHTML += `
						<img src=${state.newsInfo.image} alt="" />
						<h3>${state.newsInfo.title}</h3>
					`
				}
			})

			// 清除样式
			onBeforeUnmount(() => {
				let link = document.getElementById('link')
				if (!link) return
				document.head.removeChild(link)
			})

			return {
				backHandler,
				...toRefs(state),
				isFavour,
				favourHandler
			}
		}
	}
</script>

<style lang="less" scoped>
	.van-skeleton {
		padding: 30px 15px;
	}

	.detail {
		background: #fff;
		padding-bottom: 50px;
		margin-top: 0;

		:deep(.img-place-holder) {
			position: relative;
			height: 375px;
			overflow: hidden;
			img {
				width: 100%;
				min-height: 100%;
				display: block;
				margin: 0;
			}
			h3 {
				position: absolute;
				box-sizing: border-box;
				padding: 0px 20px;
				width: 100%;
				max-height: 125px;
				z-index: 2;
				left: 0px;
				top: 290px;
				font-size: 20px;
				line-height: 25px;
				overflow: hidden;
				color: #fff;
				background: linear-gradient(to top, rgba(0, 0, 0, 0.85), transparent);
			}
		}
	}
	.nav-box {
		background: #f4f4f4;
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: 50px;
		padding: 0 15px;
		position: fixed;
		left: 0;
		bottom: 0;
		width: 100%;
		box-sizing: border-box;

		.van-icon:nth-child(1) {
			position: relative;
			&::after {
				position: absolute;
				content: '';
				top: -10%;
				right: -15px;
				width: 1px;
				height: 120%;
				background: #d5d5d5;
			}
		}

		:deep(.van-badge) {
			background: transparent;
			border: none;
			color: #000;
			right: -2px;
		}
	}
</style>
