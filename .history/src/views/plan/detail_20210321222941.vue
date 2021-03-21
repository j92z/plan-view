<template>
  <div>
    <el-card>
      <el-container>
        <el-header style="font-size: 30px">
          <el-row>
            <el-col :span="8">
              <i class="el-icon-back" title="返回" style="cursor: pointer" @click="goBack"></i>
              <span style="margin: 0px 10px"><el-divider direction="vertical"></el-divider></span>
              <span >计划详情</span>
            </el-col>
            <el-col :span="2" :offset="14">
              <el-dropdown>
                <span class="el-dropdown-link">
                  <i class="el-icon-s-tools"></i>操作
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item>黄金糕</el-dropdown-item>
                  <el-dropdown-item>狮子头</el-dropdown-item>
                  <el-dropdown-item>螺蛳粉</el-dropdown-item>
                  <el-dropdown-item disabled>双皮奶</el-dropdown-item>
                  <el-dropdown-item divided>蚵仔煎</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </el-col>
          </el-row>
        </el-header>
        <el-main>
          <el-form label-position="left" label-width="80px" style="white-space: pre-wrap;">
            <el-form-item label="名称">
              <div v-if="editorStatus">
                <el-input v-model="name" />
              </div>
              <div v-else>{{name}}<i class="el-icon-edit" @click="taggleEditor(true)" /></div>
            </el-form-item>
            <el-form-item label="详情">
              <div v-if="editorStatus">
                <el-input v-model="content" />
              </div>
              <div v-else>{{content}}</div>
            </el-form-item>
            <el-form-item label="状态">
              <div v-if="editorStatus">
                <el-radio-group v-model="status">
                  <el-radio :label="0">未开始</el-radio>
                  <el-radio :label="1">进行中</el-radio>
                  <el-radio :label="2">完成</el-radio>
                </el-radio-group>
              </div>
              <span v-else style="font-size: 20px">
                <i v-if="status===2" class="el-icon-finished" style="color: green;"><span style="font-size: 14px">(已完成)</span></i>
                <i v-else-if="status===-1" class="el-icon-close" style="color: red"><span style="font-size: 14px">(失败)</span></i>
                <i v-else class="el-icon-truck"><span style="font-size: 14px">(进行中)</span></i>
              </span>
            </el-form-item>
            <el-form-item label="耗时/小时">
              <div v-if="editorStatus">
                <el-input-number v-model="costTime" :precision="2" :step="0.1" controls-position="right" :max="87600" />
              </div>
              <div v-else>{{costTime}}</div>
            </el-form-item>
            <el-form-item label="排序">
              <div v-if="editorStatus">
                <el-input-number v-model="sort" :step="1" step-strictly :max="1000" />
              </div>
              <div v-else>{{sort}}</div>
            </el-form-item>
            <el-form-item label="父计划">
              <div v-if="editorStatus">
                <el-cascader
                  v-model="editorParent"
                  :options="treeList"
                  :props="{ checkStrictly: true, label: 'name', value: 'id' }"
                  clearable
                  :show-all-levels="false"
                />
              </div>
              <div v-else>
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
              </div>
            </el-form-item>
            <el-form-item v-if="!editorStatus" label="子计划">
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
            <el-form-item v-if="editorStatus">
              <el-button :loading="formLoading" type="primary" @click="updateInfo">保存修改</el-button>
              <el-button @click="taggleEditor(false)">取消</el-button>
            </el-form-item>
          </el-form>
        </el-main>
      </el-container>
    </el-card>
  </div>

</template>

<script>
import { addPlan, getOnePlan, updatePlan, removePlan, getTree } from '@/api/plan'

export default {
  data() {
    return {
      id: '',
      name: '',
      content: '',
      status: 0,
      sort: 0,
      costTime: 0,
      parent: {},
      children: [],
      editorParent: [],
      editorStatus: false,
      treeList: [],
      formLoading: false
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
        this.costTime = response.data.costTime
        if (response.data?.parent !== null) {
          this.parent = response.data.parent
          this.editorParent = [this.parent.name]
        }
        this.children = response.data?.children?.length > 0 ? response.data.children : []
      })
    },
    goToDetail(id) {
      this.$router.push({ path: '/plan/detail/' + id })
    },
    fetchPlanList() {
      getTree().then((response) => {
        this.treeList = response.data
      })
    },
    taggleEditor(openStatus) {
      if (this.treeList.length === 0) {
        this.fetchPlanList()
      }
      this.editorStatus = openStatus
    },
    updateInfo() {
      this.formLoading = true
      var info = {
        name: this.name,
        content: this.content,
        status: this.status,
        sort: this.sort,
        costTime: this.costTime,
        parent: this.editorParent.length > 0 ? this.editorParent[0] : ''
      }
      updatePlan(this.id, info).then(() => {
        this.$message({
          message: '修改成功',
          type: 'success'
        })
        this.formLoading = false
        // this.getInfo()
        this.taggleEditor(false)
      })
      this.formLoading = false
    },
    deletePlan(id) {
      removePlan(id).then(() => {
        this.$message({
          message: '删除成功',
          type: 'success'
        })
        this.getInfo()
      }).catch(() => {})
    },
  }
}
</script>
