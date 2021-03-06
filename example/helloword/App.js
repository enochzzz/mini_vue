import {
  h
} from '../../lib/mini_vue.esm.js';

import Foo from './Foo.js';
// component
window.self = null
export const App = {
  render() {
    window.self = this
    return h('div', {
      id: 'main',
      class: ['blue'],
      onClick() {
        console.log('click')
      }
    }, [
      h('span', {
        id: 'text',
        class: ['yellow']
      }, this.msg),
      h('span', {
        id: 'text',
        class: ['red']
      }, '我是span!'),
      h(Foo, {
        count: 1
      })
    ]);
  },
  setup() {
    return {
      msg: 'Hello World!'
    };
  }
}