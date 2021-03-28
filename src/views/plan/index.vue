<template>
  <div class="app-container">
    <el-button
      type="primary"
      icon="el-icon-plus"
      @click="taggleDrawer(true)"
    >创建新计划</el-button>
    <template>
      <el-row v-loading="loading" :gutter="12">
        <el-col
          v-for="item in planList"
          :key="item.id"
          :xl="6"
          :lg="8"
          :md="12"
          :xs="24"
          style="margin-top: 20px;"
        >
          <el-card shadow="hover" style="height: 210px">
            <el-container>
              <el-header height="30px">
                <el-row>
                  <el-col :span="16" style="white-space: nowrap;overflow: hidden;text-overflow: ellipsis;">
                    <span style="font-size: 30px;cursor: pointer" @click="goToDetail(item.id)">{{ item.name }}</span>
                  </el-col>
                  <el-col :span="2" :offset="6" style="font-size: 30px">
                    <i v-if="item.status===1" class="el-icon-finished" style="color: green;" title="已完成" />
                    <i v-else-if="item.status===-1" class="el-icon-close" style="color: red" title="失败" />
                    <i v-else class="el-icon-truck" title="进行中" />
                  </el-col>
                </el-row>
              </el-header>
              <el-main
                style="
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 6;
                overflow: hidden;
                height: 130px;
                white-space:pre-wrap;"
              >
                <span>{{ item.content }}</span>
              </el-main>
            </el-container>
          </el-card>
        </el-col>
      </el-row>
    </template>
    <template>
      <el-drawer
        direction="rtl"
        destroy-on-close
        :visible.sync="drawer"
        :with-header="false"
      >
        <template>
          <el-form ref="form" :model="form" label-width="80px" style="padding:50px 20px 20px 20px;">
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
            <!-- <el-form-item label="计划状态">
              <el-radio-group v-model="form.status">
                <el-radio :label="-1" disabled>失败</el-radio>
                <el-radio :label="0">进行中</el-radio>
                <el-radio :label="1">完成</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="耗时/小时">
              <el-input-number v-model="form.costTime" :precision="2" :step="0.1" controls-position="right" :max="87600" />
            </el-form-item> -->
            <el-form-item label="计划排序">
              <el-input-number v-model="form.sort" :step="1" step-strictly :max="1000" />
            </el-form-item>
            <el-form-item label="父级计划">
              <el-cascader
                v-model="form.planCascaderPath"
                :options="list"
                :props="{ checkStrictly: true, label: 'name', value: 'id' }"
                clearable
                :show-all-levels="false"
              />
            </el-form-item>
            <el-form-item>
              <el-button :loading="formLoading" type="primary" @click="addPlan">立即创建</el-button>
              <el-button @click="taggleDrawer(false)">取消</el-button>
            </el-form-item>
          </el-form>
        </template>
      </el-drawer>
    </template>
  </div>
</template>

<script>
import { getTree, addPlan, removePlan, getListByParent } from '@/api/plan'

export default {
  data() {
    return {
      list: [],
      planList: [],
      loading: false,
      drawer: false,
      formLoading: false,
      form: {
        name: '',
        content: '',
        sort: 0,
        planCascaderPath: []
      }
    }
  },
  created() {
    this.fetchListByParent()
  },
  methods: {
    fetchPlanList() {
      getTree().then((response) => {
        this.list = response.data
      })
    },
    fetchListByParent(id) {
      if (!id) {
        this.loading = true
      }
      const param = id ? { id } : {}
      getListByParent(param).then((response) => {
        this.planList = response.data
        if (!id) {
          this.loading = false
        }
      })
    },
    addPlan() {
      this.formLoading = true
      var info = {
        name: this.form.name,
        content: this.form.content,
        sort: this.form.sort,
        planCascaderPath: this.form.planCascaderPath.join(','),
        parent: this.form.planCascaderPath.length > 0 ? this.form.planCascaderPath[this.form.planCascaderPath.length - 1] : ''
      }
      addPlan(info).then(() => {
        this.$message({
          message: '添加成功',
          type: 'success'
        })
        this.formLoading = false
        this.taggleDrawer(false)
        this.fetchListByParent()
        this.form = {
          name: '',
          content: '',
          sort: 0,
          planCascaderPath: []
        }
      })
      this.formLoading = false
    },
    taggleDrawer(taggle) {
      if (this.list.length === 0) {
        this.fetchPlanList()
      }
      this.drawer = taggle
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
