import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import { DataTables, DataTablesServer } from '@/index'
import { mount } from '@vue/test-utils'

Vue.use(ElementUI)
Vue.use(DataTables)
Vue.use(DataTablesServer)

let id = 0

const createElm = function () {
    const elm = document.createElement('div')

    elm.id = 'app' + ++id
    document.body.appendChild(elm)

    return elm
}

/**
 * 回收 vm
 * @param  {Object} vm
 */
exports.destroyVM = function (vm) {
    vm.$destroy && vm.$destroy()
    vm.$el &&
        vm.$el.parentNode &&
        vm.$el.parentNode.removeChild(vm.$el)
}

/**
 * 创建一个 Vue 的实例对象
 * @param  {Object|String}  Compo   组件配置，可直接传 template
 * @param  {Boolean=false} mounted 是否添加到 DOM 上
 * @return {Object} vm
 */
exports.createVue = function (Compo) {

    return mount(Compo)
}

/**
 * 创建一个测试组件实例
 * @link http://vuejs.org/guide/unit-testing.html#Writing-Testable-Components
 * @param  {Object}  Compo          - 组件对象
 * @param  {Object}  propsData      - props 数据
 * @param  {Boolean=false} mounted  - 是否添加到 DOM 上
 * @return {Object} vm
 */
exports.createTest = function (Compo, propsData = {}, mounted = false) {
    if (propsData === true || propsData === false) {
        mounted = propsData
        propsData = {}
    }
    const elm = createElm()
    const Ctor = Vue.extend(Compo)
    return new Ctor({ propsData }).$mount(mounted === false ? null : elm)
}

/**
 * 触发一个事件
 * mouseenter, mouseleave, mouseover, keyup, change, click 等
 * @param  {Element} elm
 * @param  {String} name
 * @param  {*} opts
 */
exports.triggerEvent = function (elm, name, ...opts) {
    let eventName

    if (/^mouse|click/.test(name)) {
        eventName = 'MouseEvents'
    } else if (/^key/.test(name)) {
        eventName = 'KeyboardEvent'
    } else {
        eventName = 'HTMLEvents'
    }
    const evt = document.createEvent(eventName)

    evt.initEvent(name, ...opts)
    elm.dispatchEvent
        ? elm.dispatchEvent(evt)
        : elm.fireEvent('on' + name, evt)

    return elm
}

/**
 * 触发 “mouseup” 和 “mousedown” 事件
 * @param {Element} elm
 * @param {*} opts
 */
// exports.triggerClick = function (elm, ...opts) {
//     exports.triggerEvent(elm, 'mousedown', ...opts)
//     exports.triggerEvent(elm, 'mouseup', ...opts)

//     return elm
// }

exports.sleep = function (time = 200) {
    return new Promise(function (resolve) {
        setTimeout(function () {
            resolve()
        }, time)
    })
}

exports.waitForVMready = function (vm) {
    return new Promise(function (resolve) {
        vm.$nextTick(_ => {
            resolve()
        })
    })
}

let getTable = function (el) {
    return el.find('.el-table')
}

let getHead = function (el) {
    return el.find('thead')
}

let getBody = function (el) {
    return el.find('tbody')
}

let getRows = function (el) {
    return el.findAll('tr')
}

exports.getTableItems = function (el) {
    let table = getTable(el);
    let head = getHead(table);
    let body = getBody(table);
    let rows = getRows(body);

    return { table, head, body, rows }
}

exports = Object.assign(exports, {
    getTable,
    getHead,
    getRows,
    getBody
})