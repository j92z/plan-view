<template>
  <div class="app-container">
    <el-button
      type="primary"
      icon="el-icon-plus"
      style="margin-bottom: 8px"
      @click="taggleDrawer(true)"
    >创建新计划</el-button>
    <template>
      <el-row :gutter="12">
        <el-col v-for="item in planList" :key="item.id" :span="8" style="margin-top: 20px;">
          <el-card shadow="hover">
            <el-container>
              <el-header height="30px">
                <el-row>
                  <el-col :span="16" style="white-space: nowrap;overflow: hidden;text-overflow: ellipsis;">
                    <span style="font-size: 30px;cursor: pointer" @click="goToDetail(item.id)">{{ item.name }}</span>
                  </el-col>
                  <el-col :span="2" :offset="6" style="font-size: 30px">
                    <i v-if="item.status===2" class="el-icon-finished" style="color: green;" title="已完成" />
                    <i v-else-if="item.status===-1" class="el-icon-close" style="color: red" title="失败" />
                    <i v-else class="el-icon-truck" title="进行中" />
                  </el-col>
                </el-row>
              </el-header>
              <el-main style="display: -webkit-box;-webkit-box-orient: vertical;-webkit-line-clamp: 3;overflow: hidden;">
                <span>{{ item.content }}</span>
              </el-main>
            </el-container>
          </el-card>
        </el-col>
      </el-row>
    </template>
    <template>
      <el-drawer
        title="创建新计划"
        direction="rtl"
        destroy-on-close
        :visible.sync="drawer"
      >
        <template>
          <el-form ref="form" :model="form" label-width="80px" style="padding: 20px">
            <el-form-item label="计划名称">
              <el-input v-model="form.name" />
            </el-form-item>
            <el-form-item label="计划内容">
              <el-input
                v-model="form.content"
                type="textarea"
                :autosize="{ minRows: 2}"
              />
            </el-form-item>
            <el-form-item label="计划状态">
              <el-radio-group v-model="form.status">
                <el-radio :label="0">未开始</el-radio>
                <el-radio :label="1">进行中</el-radio>
                <el-radio :label="2">完成</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="耗时/小时">
              <el-input-number v-model="form.costTime" :precision="2" :step="0.1" controls-position="right" :max="87600" />
            </el-form-item>
            <el-form-item label="计划排序">
              <el-input-number v-model="form.sort" :step="1" step-strictly :max="1000" />
            </el-form-item>
            <el-form-item label="父级计划">
              <el-cascader
                v-model="form.parent"
                :options="list"
                :props="{ checkStrictly: true, label: 'name', value: 'id' }"
                clearable
                :show-all-levels="false"
              />
            </el-form-item>
            <el-form-item>
              <el-button v-if="form.id.length === 0" :loading="formLoading" type="primary" @click="addPlan">立即创建</el-button>
              <el-button v-else :loading="formLoading" type="primary" @click="updatePlan">保存修改</el-button>
              <el-button @click="taggleDrawer(false)">取消</el-button>
            </el-form-item>
          </el-form>
        </template>
      </el-drawer>
    </template>
  </div>
</template>

<script>
import { getTree, addPlan, getOnePlan, updatePlan, removePlan, getListByParent } from '@/api/plan'

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      list: [],
      planList: [],
      listLoading: true,
      drawer: false,
      formLoading: false,
      form: {
        id: '',
        name: '',
        content: '',
        status: 0,
        costTime: 0,
        sort: 0,
        parent: []
      }
    }
  },
  created() {
    this.fetchPlanList()
    this.fetchListByParent()
  },
  methods: {
    fetchPlanList() {
      this.listLoading = true
      getTree().then((response) => {
        this.list = response.data
        this.listLoading = false
      })
    },
    fetchListByParent(id) {
      const param = id ? { id } : {}
      getListByParent(param).then((response) => {
        this.planList = response.data
      })
    },
    addPlan() {
      this.formLoading = true
      var info = this.form
      info.parent = this.form.parent.length > 0 ? this.form.parent[0] : []
      addPlan(info).then(() => {
        this.$message({
          message: '添加成功',
          type: 'success'
        })
        this.formLoading = false
        this.taggleDrawer(false)
        this.fetchListByParent()
      })
      this.formLoading = false
    },
    taggleDrawer(taggle) {
      this.drawer = taggle
    },
    openPlanDetail(id) {
      getOnePlan(id).then((response) => {
        this.form.id = response.data.id
        this.form.name = response.data.name
        this.form.content = response.data.content
        this.form.status = response.data.status
        this.form.costTime = response.data.costTime
        this.form.sort = response.data.sort
        this.form.parent = response.data?.parent !== null ? [response.data.parent.id] : []
        this.taggleDrawer(true)
      })
    },
    deletePlan(id) {
      removePlan(id).then(() => {
        this.$message({
          message: '删除成功',
          type: 'success'
        })
        this.fetchPlanList()
      }).catch(() => {})
    },
    goToDetail(id) {
      this.$router.push({ path: '/plan/detail/' + id })
    }
  }
}
</script>
