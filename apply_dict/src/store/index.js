/**
 * @file main store
 * @author wheel-w
 */

import Vue from 'vue'
import Vuex from 'vuex'

import example from './modules/example'
import user from './modules/user'
import { unifyObjectStyle } from '@/common/util'

Vue.use(Vuex)

const store = new Vuex.Store({
    // 模块
    modules: {
        example,
        user
    },
    // 公共 store
    state: {
        mainContentLoading: false,
        viewInfo: '', // 页面信息，用于显示在页头蓝色横线上的文字信息
        hasApplyViewSwitcher: true, // 标识当前页面是否是申请页面,由于首页有值，故
        isApplyViewSwitcherOn: false // 若当前页面是是申请页面，标识当前是批量申请还是单个申请
    },
    // 公共 getters
    getters: {
        mainContentLoading: state => state.mainContentLoading
    },
    // 公共 mutations
    mutations: {
        /**
         * 设置内容区的 loading 是否显示
         *
         * @param {Object} state store state
         * @param {boolean} loading 是否显示 loading
         */
        setMainContentLoading (state, loading) {
            state.mainContentLoading = loading
        },

        updateViewInfo (state, context = {}) {
            state.viewInfo = context.viewInfo
            state.hasApplyViewSwitcher = context.hasApplyViewSwitcher
            state.isApplyViewSwitcherOn = context.isApplyViewSwitcherOn
        }
    },
    actions: {
    }
})

/**
 * hack vuex dispatch, add third parameter `config` to the dispatch method
 *
 * @param {Object|string} _type vuex type
 * @param {Object} _payload vuex payload
 * @param {Object} config config 参数，主要指 http 的参数，详见 src/api/index initConfig
 *
 * @return {Promise} 执行请求的 promise
 */
store.dispatch = function (_type, _payload, config = {}) {
    const { type, payload } = unifyObjectStyle(_type, _payload)

    const action = { type, payload, config }
    const entry = store._actions[type]
    if (!entry) {
        if (NODE_ENV !== 'production') {
            console.error(`[vuex] unknown action type: ${type}`)
        }
        return
    }

    store._actionSubscribers.forEach(sub => {
        return sub(action, store.state)
    })

    return entry.length > 1
        ? Promise.all(entry.map(handler => handler(payload, config)))
        : entry[0](payload, config)
}

export default store
