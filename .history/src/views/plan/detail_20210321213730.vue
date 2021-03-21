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
            <el-form-item label="父计划">
              <div v-if="parent.hasOwnProperty('name')">
                <el-row :gutter="20">
                  <el-col :span="8">
                    <el-card shadow="always">
                      <el-container>
                        <el-header height="30px">
                          <el-row>
                            <el-col :span="16">
                              <span style="font-size: 30px;cursor: pointer" @click="goToDetail(parent.id)">{{ parent.name }}</span>
                            </el-col>
                            <el-col :span="2" :offset="6" style="font-size: 30px">
                              <i v-if="parent.status===2" class="el-icon-finished" style="color: green;" title="已完成" />
                              <i v-else-if="parent.status===-1" class="el-icon-close" style="color: red" title="失败" />
                              <i v-else class="el-icon-truck" title="进行中" />
                            </el-col>
                          </el-row>
                        </el-header>
                        <el-main>
                          <span>{{ parent.content }}</span>
                        </el-main>
                      </el-container>
                    </el-card>
                  </el-col>
                </el-row>
              </div>
              <div v-else>无</div>
            </el-form-item>
            <el-form-item label="子计划">
              <div v-if="children.length === 0">无</div>
              <div v-else>
                <el-row :gutter="20">
                  <el-col v-for="item in children" :key="item.id" :span="8">
                    <el-card shadow="always">
                      <el-container>
                        <el-header height="30px">
                          <el-row>
                            <el-col :span="16">
                              <span style="font-size: 30px;cursor: pointer;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;" @click="goToDetail(item.id)">{{ item.name }}</span>
                            </el-col>
                            <el-col :span="2" :offset="6" style="font-size: 30px">
                              <i v-if="item.status===2" class="el-icon-finished" style="color: green;" title="已完成" />
                              <i v-else-if="item.status===-1" class="el-icon-close" style="color: red" title="失败" />
                              <i v-else class="el-icon-truck" title="进行中" />
                            </el-col>
                          </el-row>
                        </el-header>
                        <el-main>
                          <span>{{ item.content }}</span>
                        </el-main>
                      </el-container>
                    </el-card>
                  </el-col>
                </el-row>
              </div>
            </el-form-item>
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
      children: [],
      editorParent: []
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
        this.parent = response.data?.parent !== null ? response.data.parent : {}
        this.children = response.data?.children?.length > 0 ? response.data.children : []
      })
    },
    goToDetail(id) {
      this.$router.push({ path: '/plan/detail/' + id })
    }
  }
}
</script>
