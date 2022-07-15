<template>
	<Nav title="My Favourite" />
	<van-empty description="Empty" v-if="!favourList.length" />
	<div v-else>
		<van-swipe-cell v-for="item in favourList" :key="item.id">
			<div class="con">
				<Item :data="{ ...item.news, images: [item.news.image], hint: '' }" />
			</div>
			<template #right>
				<van-button
					square
					type="danger"
					text="Delete"
					@click="removeItem(item.id)"
				/>
			</template>
		</van-swipe-cell>
	</div>
</template>

<script>
	import Nav from '@/components/Nav.vue'
	import Item from '@/components/Item.vue'
	import { useStore } from 'vuex'
	import { computed, onBeforeMount } from 'vue'
	import api from '@/api'
	import { Toast } from 'vant'

	export default {
		// eslint-disable-next-line vue/multi-word-component-names
		name: 'Favourite',
		components: { Nav, Item },
		setup() {
			const store = useStore()
			let favourList = computed(() => {
				return store.state.favourList || []
			})

			onBeforeMount(() => {
				if (store.state.favourList === null) {
					store.dispatch('changeFavourListAsync')
				}
			})

			// 接受的参数是收藏列表的id，并不是新闻自身的id！！
			const removeItem = async (id) => {
				// 删除本身存储的收藏列表项
				let { code } = await api.removeFavour(id)

				if (+code !== 0) {
					Toast("Remove failure")
					return
				}
				// 还需要删除vuex中登录用户的收藏列表项
				Toast('item removed..')
				store.commit('removeFavourItem', id)
			}

			return {
				favourList,
				removeItem
			}
		}
	}
</script>

<style lang="less" scoped>
	.van-swipe-cell {
		.con {
			padding: 0 20px;
		}

		:deep(.van-swipe-cell__right) {
			.van-button {
				position: relative;
				margin-left: 1px;
				top: 50%;
				transform: translateY(-50%);
			}
		}
	}
</style>
