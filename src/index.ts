import vueVirtualChart from "./components/vue-virtual-chart/index.vue";
export { vueVirtualChart }; // 按需引入
import { App } from "vue";
const components = [vueVirtualChart]; // 将来有其他组件，都可以写到这里
const installComponent = (app: App) => {
  components.forEach((component) => {
    app.component(component.name, component);
  });
};
export default installComponent;
