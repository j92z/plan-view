<template>
  <div class="app-container">
    <el-button
      type="primary"
      icon="el-icon-plus"
      @click="openDrawer"
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
          {{ scope.row.name }}
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
      <el-table-column align="center" label="Sort" width="50">
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
              <el-input-number v-model="form.costTime" :precision="2" :step="0.1" controls-position="right" />
            </el-form-item>
            <template label="计划排序">
              <el-input-number v-model="form.sort" :step="1" step-strictly></el-input-number>
            </template>
            <el-form-item label="活动区域">
              <el-select v-model="form.region" placeholder="请选择活动区域">
                <el-option label="区域一" value="shanghai" />
                <el-option label="区域二" value="beijing" />
              </el-select>
            </el-form-item>
            <el-form-item label="活动时间">
              <el-col :span="11">
                <el-date-picker
                  v-model="form.date1"
                  type="date"
                  placeholder="选择日期"
                  style="width: 100%"
                />
              </el-col>
              <el-col class="line" :span="2">-</el-col>
              <el-col :span="11">
                <el-time-picker
                  v-model="form.date2"
                  placeholder="选择时间"
                  style="width: 100%"
                />
              </el-col>
            </el-form-item>
            <el-form-item label="即时配送">
              <el-switch v-model="form.delivery" />
            </el-form-item>
            <el-form-item label="活动性质">
              <el-checkbox-group v-model="form.type">
                <el-checkbox
                  label="美食/餐厅线上活动"
                  name="type"
                />
                <el-checkbox label="地推活动" name="type" />
                <el-checkbox label="线下主题活动" name="type" />
                <el-checkbox label="单纯品牌曝光" name="type" />
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="特殊资源">
              <el-radio-group v-model="form.resource">
                <el-radio label="线上品牌商赞助" />
                <el-radio label="线下场地免费" />
              </el-radio-group>
            </el-form-item>
            <el-form-item label="活动形式">
              <el-input v-model="form.desc" type="textarea" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary">立即创建</el-button>
              <el-button>取消</el-button>
            </el-form-item>
          </el-form>
        </template>
      </el-drawer>
    </template>
  </div>
</template>

<script>
import { getTree } from '@/api/plan'

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
      list: null,
      listLoading: true,
      drawer: false,
      form: {
        name: '',
        content: '',
        status: 0,
        costTime: 0,
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getTree().then((response) => {
        this.list = response.data
        this.listLoading = false
      })
    },
    openDrawer() {
      this.drawer = true
    }
  }
}
</script>
