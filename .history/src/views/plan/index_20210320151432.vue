<template>
  <div class="app-container">
    <el-button
      type="primary"
      icon="el-icon-plus"
      style="margin-bottom: 8px"
      @click="taggleDrawer(true)"
    >创建新计划</el-button>
    <el-table
      v-loading="listLoading"
      row-key="id"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
    >
      <el-table-column align="center" label="ID">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column label="Name">
        <template slot-scope="scope">
          {{ scope.row.name }}<i class="el-icon-edit" @click="openPlanDetail(scope.row.id)" />
        </template>
      </el-table-column>
      <el-table-column label="Content">
        <template slot-scope="scope">
          {{ scope.row.content }}
        </template>
      </el-table-column>
      <el-table-column
        class-name="status-col"
        label="Status"
        width="110"
        align="center"
      >
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusFilter">{{
            scope.row.status
          }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="CostTime">
        <template slot-scope="scope"> {{ scope.row.costTime }} Hour </template>
      </el-table-column>
      <el-table-column label="StartTime">
        <template slot-scope="scope">
          {{
            scope.row.startTime == 0
              ? "未开始"
              : new Date(scope.row.createDate)
                .toJson()
                .substr(0, 19)
                .replaceAll("T", " ")
          }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Sort" width="80">
        <template slot-scope="scope">
          {{ scope.row.sort }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="createDate" width="200">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{
            scope.row.createDate.substr(0, 19).replaceAll("T", " ")
          }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="action" width="100">
        <template slot-scope="scope">
          <el-button type="danger" icon="el-icon-delete" @click="deletePlan(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
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
              <el-button v-else :loading="formLoading" type="primary" @click="addPlan">保存修改</el-button>
              <el-button @click="taggleDrawer(false)">取消</el-button>
            </el-form-item>
          </el-form>
        </template>
      </el-drawer>
    </template>
  </div>
</template>

<script>
import { getTree, addPlan, getOnePlan, updatePlan, removePlan } from '@/api/plan'

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
  },
  methods: {
    fetchPlanList() {
      this.listLoading = true
      getTree().then((response) => {
        this.list = response.data
        this.listLoading = false
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
        });
        this.formLoading = false
        this.taggleDrawer(false)
        this.fetchPlanList()
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
    updatePlan() {
      this.formLoading = true
      var info = this.form
      info.parent = this.form.parent.length > 0 ? this.form.parent[0] : []
      delete info.id
      updatePlan(this.form.id, info).then(() => {
        this.$message({
          message: '修改成功',
          type: 'success'
        });
        this.formLoading = false
        this.taggleDrawer(false)
        this.fetchPlanList()
      })
      this.formLoading = false
    },
    deletePlan(id) {
      removePlan(id).then(() => {
        this.$message({
          message: '删除成功',
          type: 'success'
        });
        this.fetchPlanList()
      })
    }
  }
}
</script>
