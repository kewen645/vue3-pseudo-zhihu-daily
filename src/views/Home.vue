<template>
	<!-- 头部 -->
	<Head :time="today" />
	<!-- 轮播图 -->
	<section class="banner-box">
		<van-swipe v-if="bannerList.length > 0" :autoplay="3000" lazy-render>
			<van-swipe-item v-for="item in bannerList" :key="item.id">
				<router-link :to="`/detail/${item.id}`" class="content">
					<img :src="item.image" alt="" />
					<div class="mark">
						<h3 class="title">{{ item.title }}</h3>
						<span class="author">{{ item.hint }}</span>
					</div>
				</router-link>
			</van-swipe-item>
		</van-swipe>
	</section>
	<!-- 新闻列表 -->
	<van-skeleton title :row="10" v-if="!newsList.length" />
	<div v-else>
		<section class="news-box" v-for="(item, index) in newsList" :key="index">
			<van-divider content-position="left" v-if="index !== 0">
				{{ formatTime(item.date, '{1} {2}') }}
			</van-divider>
			<div class="content">
				<Item v-for="item2 in item.stories" :key="item2.id" :data="item2" />
			</div>
		</section>
	</div>
	<div ref="loadMore" class="lazy-more" v-show="newsList.length !== 0">
		<van-loading size="12px">加载中...</van-loading>
	</div>
</template>

<script>
	import Head from '@/components/Head.vue'
	import Item from '@/components/Item.vue'
	import api from '@/api'
	import { formatTime } from '@/assets/utils'
	import { reactive, toRefs, onBeforeMount, ref, onMounted } from 'vue'
	export default {
		// eslint-disable-next-line vue/multi-word-component-names
		name: 'Home',
		components: { Head, Item },
		setup() {
			let state = reactive({
				today: "",
				newsList: [],
				bannerList: []
			})

			let loadMore = ref(null)

			// 第一次加载获取数据
			onBeforeMount(async () => {
				const { date, stories, top_stories } = await api.queryNewsLatest()
				state.today = date
				state.newsList.push(
					Object.freeze({
						date,
						stories
					})
				)
				state.bannerList = Object.freeze(top_stories)
			})

			// 第一次渲染完，加载更多数据
			onMounted(() => {
				let obs = new IntersectionObserver(async (changes) => {
					let item = changes[0]
					if (item.isIntersecting) {
						// 传递当天日期即获取前一天的新闻
						let res = await api.queryNewsBefore(state.newsList[state.newsList.length - 1]["date"])
						state.newsList.push(Object.freeze(res))
					}
				})
				obs.observe(loadMore.value)
			})

			return {
				...toRefs(state),
				formatTime,
				loadMore
			}
		}
	}
</script>

<style lang="less" scoped>
	.banner-box {
		box-sizing: border-box;
		height: 375px;
		background: #f4f4f4;

		.van-swipe {
			height: 100%;
			background: #fff;

			.content {
				position: relative;
				display: block;
				height: 100%;
				color: #fff;

				img {
					display: block;
					width: 100%;
					height: 100%;
				}
				.mark {
					position: absolute;
					left: 0;
					bottom: 0;
					box-sizing: border-box;
					padding: 10px 20px;
					width: 100%;
					height: 110px;
					background: rgba(0, 0, 0, 0.3);
					background: -webkit-linear-gradient(
						top,
						rgba(0, 0, 0, 0),
						rgba(0, 0, 0, 0.5)
					);

					.title {
						padding-top: 10px;
						max-height: 50px;
						font-size: 20px;
						line-height: 25px;
						overflow: hidden;
					}
					.author {
						font-size: 12px;
						line-height: 20px;
					}
				}
			}

			:deep(.van-swipe__indicators) {
				left: auto;
				right: 15px;
				transform: none;

				.van-swipe__indicator--active {
					width: 15px;
					border-radius: 3px;
					background: #fff;
				}
			}
		}
	}

	.news-box {
		padding: 0 15px;

		.van-divider {
			margin: 5px 0;
			font-size: 12px;
			&::before {
				display: none;
			}
		}
	}

	.van-skeleton {
		padding: 30px 15px;
	}

	.lazy-more {
		display: flex;
		justify-content: center;
		padding: 10px;
		background: #f4f4f4;
	}
</style>
