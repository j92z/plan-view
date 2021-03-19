<template>
  <div class="app-container">
    <el-button type="primary" icon="el-icon-plus" @click="openDrawer">创建新计划</el-button>
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
        <span>我来啦!</span>
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
      drawer: false
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
