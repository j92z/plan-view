<template>
  <div>
    <div v-for="(item,index) in workItem" :key="index">
      <div>{{ item.work.name }}</div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'CalendarItem',
  props: {
    workItem: {
      type: Array,
      default: () => {
        return []
      }
    },
    reload: {
      type: Function,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {}
  },
  created() {

  }
}
</script>
