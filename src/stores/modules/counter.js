import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useCounterStore = defineStore(
  'counter',
  () => {
    const count = ref(0)
    function add(n) {
      count.value += n
    }
    return { count, add }
  },
  {
    persist: {
      persist: true,
    },
  },
)
