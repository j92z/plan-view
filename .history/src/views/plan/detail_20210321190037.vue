<template>
  <div>
    <el-card>
      <el-container>
        <el-header style="font-size: 30px">
          <i class="el-icon-back" title="返回" style="cursor: pointer" @click="goBack"></i>
          <span style="margin: 0px 10px"><el-divider direction="vertical"></el-divider></span>
          <span >计划详情</span>
        </el-header>
        <el-main>
          <el-form label-position="left" label-width="80px" style="white-space: pre-wrap;">
            <el-form-item label="名称">{{name}}</el-form-item>
            <el-form-item label="详情">{{content}}</el-form-item>
            <el-form-item label="状态">
              <span style="font-size: 20px">
                <i v-if="status===2" class="el-icon-finished" style="color: green;"><span style="font-size: 14px">(已完成)</span></i>
                <i v-else-if="status===-1" class="el-icon-close" style="color: red"><span style="font-size: 14px">(失败)</span></i>
                <i v-else class="el-icon-truck"><span style="font-size: 14px">(进行中)</span></i>
              </span>
            </el-form-item>
            <el-form-item label="排序">{{sort}}</el-form-item>
            <el-form-item label="父级计划">{{parent.name ? parent.name : '无'}}</el-form-item>
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
