<template>
  <div>
    <el-card>
      <el-container>
        <el-header style="font-size: 30px">
          <i class="el-icon-back"></i>
          <el-divider direction="vertical" style="margin: 0 10px"></el-divider>
          <span >{{ name }}</span>
        </el-header>
      </el-container>
    </el-card>
  </div>

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
    goBack() {
      this.$router.go(-1)
    },
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
