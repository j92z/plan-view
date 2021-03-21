<template>
  <div>
    <el-card>
      <el-container>
        <el-header style="font-size: 30px">
          <i class="el-icon-back" title="返回" style="cursor: pointer" @click="goToList"></i>
          <span style="margin: 0px 10px"><el-divider direction="vertical"></el-divider></span>
          <span >{{ name }}</span>
        </el-header>
        <el-main>
          <el-form label-position="top">
            <el-form-item label="名称"></el-form-item>
            <el-form-item label="详情"></el-form-item>
            <el-form-item label="状态"></el-form-item>
          </el-form>
        </el-main>
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
    goToList() {
      this.$router.push('/plan/list')
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
