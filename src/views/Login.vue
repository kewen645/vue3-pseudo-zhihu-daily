<template>
	<Nav />
	<van-form ref="formBox" @submit="submit">
		<van-cell-group inset>
			<van-field
				v-model="phone"
				name="phone"
				center
				label="Phone"
				label-width="50px"
				:rules="[
					{ required: true, message: 'Phone# is necessary' },
					{ pattern: regPhone, message: 'Incorrect Format' },
				]"
			>
				<template #button>
					<van-button
						class="form-btn"
						size="small"
						:type="enabled ? 'primary' : ''"
						@click="sendCode"
						:disabled="!enabled"
					>
						{{ enabled ? 'Send Code' : time }}
					</van-button>
				</template>
			</van-field>
			<van-field
				v-model="code"
				label="Code"
				label-width="50px"
				:rules="[
					{ required: true, message: 'Code is necessary' },
					{ pattern: regCode, message: 'Incorrect Code, 6 digits' },
				]"
			/>
		</van-cell-group>

		<div style="margin: 20px 40px">
			<van-button round block type="primary" native-type="submit">
				Login / Register Now
			</van-button>
		</div>
	</van-form>
</template>

<script>
	import Nav from '@/components/Nav.vue';
	import { reactive, toRefs, ref } from 'vue'
	import { useRouter, useRoute } from 'vue-router'
	import { useStore } from 'vuex'
	import api from '@/api'
	import { Toast } from 'vant'

	export default {
		// eslint-disable-next-line vue/multi-word-component-names
		name: "Login",
		components: { Nav },
		setup() {
			const state = reactive({
				phone: '',
				code: '',
				enabled: true,
				time: '60s'
			})

			let formBox = ref(null)
			const store = useStore()
			const router = useRouter()
			const route = useRoute()

			// 发送验证码
			const sendCode = async () => {
				// 发送验证码前再做数据检验
				try {
					await formBox.value.validate('phone')
					// 发送请求
					let { code } = await api.getPhoneCode(state.phone)

					if (+code !== 0) {
						Toast('Network Busy, Try Again later')
						return
					}
					// 冷却发送验证码按钮
					state.enabled = false
					state.time = '60s'
					let n = 60
					let timer = setInterval(() => {
						n--
						if (!n) {
							clearInterval(timer)
							state.enabled = true
							return
						}
						state.time = `${n}s`
					}, 1000);

				} catch (error) {
					console.log(error);
				}
			}

			// 发送登录请求
			const submit = async () => {
				let { code, token } = await api.login(state.phone, state.code)
				if (+code !== 0) {
					Toast('Login Failure')
					formBox.value.resetValidation() // 不传入name会重置全部表单项
					state.code = ''
					return
				}

				// 保存token
				localStorage.setItem('token', token)
				// 更改vuex保存的状态: isLogin
				store.commit('changeIsLogin', true)
				// 异步修改成当前登录用户信息
				store.dispatch('changeInfoAsync')
				// 清空之前登录用户的收藏列表
				store.commit('changeFavourList', null)
				Toast('Login Success!')
				// 跳到指定的地址
				let from = route.query.from
				if (from) {
					router.push(`/${from}`)
					return
				}
				router.replace('/person')
			}

			return {
				...toRefs(state),
				regPhone: /^1\d{10}$/,
				regCode: /^\d{6}$/,
				formBox,
				sendCode,
				submit
			}
		}
	}
</script>

<style lang="less" scoped>
	.van-form {
		margin-top: 30px;

		.form-btn {
			width: 78px;
		}
	}
</style>
