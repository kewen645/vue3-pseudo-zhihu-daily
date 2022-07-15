<template>
	<Nav />
	<div class="base-info" v-if="info">
		<img :src="info.pic" alt="" @click="$router.push('/updateperson')" />
		<p>{{ info.name }}</p>
	</div>
	<van-cell-group>
		<van-cell title="My Favourite" is-link url="#/favourite" />
		<van-cell title="Logout" @click="logout" />
	</van-cell-group>
</template>

<script>
	import { Toast } from 'vant'
	import Nav from "@/components/Nav.vue"
	import { useRouter } from 'vue-router'
	import { useStore } from 'vuex'
	import { computed, onBeforeMount } from 'vue'

	export default {
		components: { Nav },
		// eslint-disable-next-line vue/multi-word-component-names
		name: "Person",
		setup() {
			const router = useRouter()
			const store = useStore()

			// 貌似computed属性的数据不能使用toRefs解构？
			let info = computed(() => {
				let { isLogin, info } = store.state
				if (isLogin && info) return info
				return null
			})

			// 其实这步可以忽略，写在这只是为了严谨起见
			// 因为能进入个人页面的话，已经是登录状态(即isLogin和info已被更新)
			// 更新发生在/login页面和路由前置守卫
			onBeforeMount(() => {
				let { isLogin, info } = store.state
				if (isLogin === null) store.dispatch('changeLoginAsync')
				if (info === null) store.dispatch('changeInfoAsync')
			})

			// 退出登录，清空本地token, 删除vuex中存储的数据，并返回登录页
			const logout = () => {
				Toast('Logout success!')
				localStorage.removeItem('token')
				store.commit('changeIsLogin', null)
				store.commit('changeInfo', null)
				store.commit('changeFavourList', null)
				router.replace('/login')
			}

			return {
				logout,
				info
			}
		}
	}
</script>

<style lang="less" scoped>
	.base-info {
		box-sizing: border-box;
		margin: 20px 0;

		img {
			display: block;
			margin: 0 auto;
			width: 86px;
			height: 86px;
			border-radius: 50%;
		}

		p {
			line-height: 50px;
			font-size: 18px;
			text-align: center;
		}
	}
</style>
