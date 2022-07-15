<template>
	<Nav />
	<div class="form-box">
		<van-cell-group inset>
			<van-field v-model="name" label="User" label-width="60px" />

			<van-field label="Avatar" label-width="60px">
				<template #input>
					<van-uploader v-model="pic" max-count="1" />
				</template>
			</van-field>
		</van-cell-group>

		<div style="margin: 20px 40px">
			<van-button
				:loading="loading"
				loading-text="Processing"
				round
				block
				type="primary"
				@click="submit"
			>
				Edit Info
			</van-button>
		</div>
	</div>
</template>

<script>
	import { Toast } from 'vant'
	import Nav from "@/components/Nav.vue";
	import { reactive, toRefs } from 'vue'
	import { useStore } from 'vuex'
	import { useRouter } from 'vue-router'
	import api from '@/api'

	export default {
		components: { Nav },
		name: "UpdatePerson",
		setup() {
			const router = useRouter()
			const store = useStore()
			const { name } = store.state.info

			let state = reactive({
				name,
				pic: [],
				loading: false
			})

			const submit = async () => {
				if (state.loading) return
				state.loading = true
				let { name, pic } = state
				// 格式校验
				let reg = /^[\w\u4e00-\u9fa5]+$/
				if (!reg.test(name)) {
					Toast('Incorrect name format')
					return
				}
				if (!pic.length) {
					Toast('Must upload a pic')
					return
				}

				// 提交数据给服务器
				let { code, data } = await api.updateUser(name, pic[0].file)
				if (+code !== 0) {
					Toast('User update failed, try again later')
					return
				}
				// 修改成功的话，更新用户登录数据并且跳转到个人页面
				Toast('User info updated.')
				store.commit('changeInfo', data)
				state.loading = false
				router.replace('/person')
			}

			return {
				...toRefs(state),
				submit
			}
		}
	}
</script>

<style lang="less" scoped>
	.form-box {
		margin-top: 30px;
	}
</style>