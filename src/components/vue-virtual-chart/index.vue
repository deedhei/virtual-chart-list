<template>
  <div class="container" ref="container" @scroll="scrollHandle">
    <div class="list" :style="scrollDistance">
      <div class="item" :key="chart.id" v-for="chart in showdata">
        <div
          :ref="setChartItemRef(chart.options, chart.id)"
          class="chart"
          :style="{
            width: itemSizeWidth + 'px',
            height: itemSizeHeight + 'px',
          }"
        ></div>
      </div>
    </div>
    <div class="bar" :style="totalSize"></div>
  </div>
</template>

<script lang="ts">
import {
  ref,
  computed,
  defineComponent,
  onMounted,
  onBeforeUnmount,
  PropType,
  toRefs,
} from "vue";
import * as echarts from "echarts";
type HorizontalType = "horizontal" | "vertical";
const HORIZONTAL = "horizontal",
  VERTICAL = "vertical";
export default defineComponent({
  name: "vueVirtualChart",
  props: {
    chartData: {
      type: Object,
      required: true,
    },
    itemSizeWidth: {
      type: Number,
      default: 400,
    },
    itemSizeHeight: {
      type: Number,
      default: 400,
    },
    bufferSize: {
      type: Number,
      default: 10,
    },
    horizontald: {
      type: String as PropType<HorizontalType>,
      default: "vertical",
      validator: (value: any): value is HorizontalType =>
        ["horizontal", "vertical"].includes(value),
    },
    isWrap: {
      type: Boolean,
      default: () => false,
    },
  },
  setup(props) {
    let {
      chartData,
      itemSizeWidth,
      itemSizeHeight,
      bufferSize,
      horizontald,
      isWrap,
    } = toRefs(props);
    let start = ref(0),
      end = ref(0),
      rafId = ref(),
      container = ref();
    let totalSize = computed(() => {
      if (horizontald.value == HORIZONTAL) {
        return {
          width: chartData?.value?.length * itemSizeWidth.value + "px",
        };
      }
      if (horizontald.value == VERTICAL) {
        return {
          height: chartData?.value?.length * itemSizeWidth.value + "px",
        };
      }
    });
    // 监听滑动
    const scrollHandle = () => {
      let scrollDistance = 0;
      if (horizontald.value == HORIZONTAL) {
        scrollDistance = container.value?.scrollLeft || 0;
      }
      if (horizontald.value == VERTICAL) {
        scrollDistance = container.value?.scrollTop || 0;
      }
      start.value = Math.floor(scrollDistance / itemSizeWidth.value);
      end.value = start.value + bufferSize.value;
    };
    // 展示的数据
    let showdata = computed(() => {
      return chartData?.value?.slice(start.value, end.value);
    });
    // 滑动的距离
    let scrollDistance = computed(() => {
      if (horizontald.value == HORIZONTAL) {
        return {
          left: start.value * itemSizeWidth.value + "px",
          display: "flex",
        };
      }
      if (horizontald.value == VERTICAL) {
        return {
          top: start.value * itemSizeHeight.value + "px",
          display: "flex",
          "flex-direction": "column",
        };
      }
    });
    // 加载图表
    const setChartItemRef =
      (options: any, id: any) => async (el: HTMLElement) => {
        if (el && echarts && !echarts?.getInstanceByDom(el)) {
          rafId.value = requestAnimationFrame(() => {
            const chartInstance = echarts.init(el);
            chartInstance.setOption(options);
          });
        }
      };
    onMounted(() => {
      scrollHandle();
    });
    // 卸载update
    onBeforeUnmount(() => {
      window.cancelAnimationFrame(rafId.value); // 在组件卸载时取消 update
    });
    return {
      scrollHandle,
      container,
      totalSize,
      itemSizeWidth,
      itemSizeHeight,
      showdata,
      scrollDistance,
      setChartItemRef,
    };
  },
});
</script>

<style scoped>
.container {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  overflow: auto;
  position: relative;
}
::-webkit-scrollbar {
  height: 5px;
  width: 5px;
  background-color: #ccc;
}
::-webkit-scrollbar-thumb {
  background-color: #000;
}
.list {
  position: absolute;
  top: 0;
  width: 100%;
}
.item {
  flex-shrink: 0;
  margin: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
