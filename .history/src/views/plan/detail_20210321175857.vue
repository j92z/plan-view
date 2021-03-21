<template>
  <div>{{ name }}</div>
</template>

<script>
import { addPlan, getOnePlan, updatePlan, removePlan } from '@/api/plan'

export default {
  data() {
    return {
      id: '',
      name: '',
      content: '',
      status: '',
      sort: '',
      parent: {},
    }
  },
  created() {
    this.id = this.$route.params.id
    this.getInfo()
  },
  methods: {
    getInfo() {
      getOnePlan(this.id).then((response) => {
        this.name = response.data.name
        this.content = response.data.content
        this.status = response.data.status
        this.sort = response.data.sort
        this.parent = response.data?.parent !== null ? response.data.parent.id : {}
      })
    }
  }
}
</script>
