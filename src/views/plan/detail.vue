<template>
  <div>
    <el-card>
      <el-container v-loading="loading">
        <el-header style="font-size: 30px">
          <el-row :gutter="20">
            <el-col :span="8">
              <i
                class="el-icon-back"
                title="返回"
                style="cursor: pointer"
                @click="goBack"
              />
              <span
                style="margin: 0px 10px"
              ><el-divider
                direction="vertical"
              /></span>
              <span>计划详情</span>
            </el-col>
            <el-col
              v-if="!editorStatus"
              :span="1"
              :offset="14"
              style="font-size: 30px"
            >
              <span><i
                class="el-icon-edit"
                title="编辑"
                @click="taggleEditor(true)"
              /></span>
            </el-col>
            <el-col v-if="!editorStatus" :span="1" style="font-size: 30px">
              <span
                v-if="children.length === 0 && works.length === 0"
              ><i
                class="el-icon-delete"
                title="删除"
                @click="deletePlan(id)"
              /></span>
              <span
                v-else
                style="color: gray"
              ><i
                class="el-icon-delete"
                title="删除"
              /></span>
            </el-col>
          </el-row>
        </el-header>
        <el-main>
          <el-form
            label-position="left"
            label-width="80px"
            style="white-space: pre-wrap"
          >
            <el-form-item label="名称">
              <div v-if="editorStatus">
                <el-input v-model="name" />
              </div>
              <div v-else>{{ name }}</div>
            </el-form-item>
            <el-form-item label="详情">
              <div v-if="editorStatus">
                <el-input v-model="content" />
              </div>
              <div v-else>{{ content }}</div>
            </el-form-item>
            <el-form-item label="状态">
              <div v-if="editorStatus">
                <el-radio-group v-model="status">
                  <el-radio :label="-1">失败</el-radio>
                  <el-radio :label="0">进行中</el-radio>
                  <el-radio :label="1">完成</el-radio>
                </el-radio-group>
              </div>
              <span v-else style="font-size: 20px">
                <i
                  v-if="status === 1"
                  class="el-icon-finished"
                  style="color: green"
                ><span style="font-size: 14px">(已完成)</span></i>
                <i
                  v-else-if="status === -1"
                  class="el-icon-close"
                  style="color: red"
                ><span style="font-size: 14px">(失败)</span></i>
                <i
                  v-else
                  class="el-icon-truck"
                ><span style="font-size: 14px">(进行中)</span></i>
              </span>
            </el-form-item>
            <el-form-item label="耗时/小时">
              <div v-if="editorStatus">
                <el-input-number
                  v-model="costTime"
                  :precision="2"
                  :step="0.1"
                  controls-position="right"
                  :max="87600"
                />
              </div>
              <div v-else>{{ costTime }}</div>
            </el-form-item>
            <el-form-item label="排序">
              <div v-if="editorStatus">
                <el-input-number
                  v-model="sort"
                  :step="1"
                  step-strictly
                  :max="1000"
                />
              </div>
              <div v-else>{{ sort }}</div>
            </el-form-item>
            <el-form-item label="父计划">
              <div v-if="editorStatus">
                <el-cascader
                  v-model="planCascaderPath"
                  :options="treeList"
                  :props="{ checkStrictly: true, label: 'name', value: 'id' }"
                  clearable
                  :show-all-levels="false"
                />
              </div>
              <div v-else style="padding-left: 10px">
                <div v-if="parent.hasOwnProperty('name')">
                  <el-row :gutter="20">
                    <el-col :span="8">
                      <el-card shadow="always">
                        <el-container>
                          <el-header height="30px">
                            <el-row>
                              <el-col
                                :span="22"
                                style="
                                  white-space: nowrap;
                                  overflow: hidden;
                                  text-overflow: ellipsis;
                                "
                              >
                                <span
                                  style="font-size: 30px; cursor: pointer"
                                  @click="goToDetail(parent.id)"
                                >{{ parent.name }}</span>
                              </el-col>
                              <el-col :span="2" style="font-size: 30px">
                                <i
                                  v-if="parent.status === 1"
                                  class="el-icon-finished"
                                  style="color: green"
                                  title="已完成"
                                />
                                <i
                                  v-else-if="parent.status === -1"
                                  class="el-icon-close"
                                  style="color: red"
                                  title="失败"
                                />
                                <i
                                  v-else
                                  class="el-icon-truck"
                                  title="进行中"
                                />
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
              <div style="padding-left: 10px">
                <el-row :gutter="20">
                  <el-col
                    v-for="item in children"
                    :key="item.id"
                    :span="8"
                    style="margin-bottom: 20px"
                  >
                    <el-card shadow="always" style="height: 210px">
                      <el-container>
                        <el-header height="30px">
                          <el-row>
                            <el-col
                              :span="22"
                              style="
                                white-space: nowrap;
                                overflow: hidden;
                                text-overflow: ellipsis;
                              "
                            >
                              <span
                                style="font-size: 30px; cursor: pointer"
                                @click="goToDetail(item.id)"
                              >
                                {{ item.name }}
                              </span>
                            </el-col>
                            <el-col :span="2" style="font-size: 30px">
                              <span style="font-size: 30px">
                                <i
                                  v-if="item.status === 1"
                                  class="el-icon-finished"
                                  style="color: green"
                                  title="已完成"
                                />
                                <i
                                  v-else-if="item.status === -1"
                                  class="el-icon-close"
                                  style="color: red"
                                  title="失败"
                                />
                                <i
                                  v-else
                                  class="el-icon-truck"
                                  title="进行中"
                                />
                              </span>
                            </el-col>
                          </el-row>
                        </el-header>
                        <el-main
                          style="
                            display: -webkit-box;
                            -webkit-box-orient: vertical;
                            -webkit-line-clamp: 3;
                            overflow: hidden;
                            height: 130px;
                          "
                        >
                          <span>{{ item.content }}</span>
                        </el-main>
                      </el-container>
                    </el-card>
                  </el-col>
                  <el-col :span="8" style="margin-bottom: 20px">
                    <el-card
                      shadow="hover"
                      style="height: 210px; cursor: pointer"
                    >
                      <div
                        style="
                          text-align: center;
                          padding: 60px 0px;
                          border: 2px dashed gray;
                        "
                        @click="taggleDrawer(true)"
                      >
                        <i class="el-icon-plus">添加子计划</i>
                      </div>
                    </el-card>
                  </el-col>
                </el-row>
              </div>
            </el-form-item>
            <el-form-item v-if="!editorStatus" label="任务">
              <div style="padding-left: 10px">
                <el-row :gutter="20">
                  <el-col
                    v-for="item in works"
                    :key="item.id"
                    :span="8"
                    style="margin-bottom: 20px"
                  >
                    <el-card shadow="always" style="height: 210px">
                      <el-container>
                        <el-header height="30px">
                          <el-row>
                            <el-col
                              :span="22"
                              style="
                                white-space: nowrap;
                                overflow: hidden;
                                text-overflow: ellipsis;
                              "
                            >
                              <span
                                style="font-size: 30px; cursor: pointer"
                                @click="goToWorkDetail(item.id)"
                              >
                                {{ item.name }}
                              </span>
                            </el-col>
                            <el-col :span="2" style="font-size: 30px">
                              <span style="font-size: 30px">
                                <i
                                  v-if="item.status === 1"
                                  class="el-icon-finished"
                                  style="color: green"
                                  title="已完成"
                                />
                                <i
                                  v-else-if="item.status === -1"
                                  class="el-icon-close"
                                  style="color: red"
                                  title="失败"
                                />
                                <i
                                  v-else
                                  class="el-icon-truck"
                                  title="进行中"
                                />
                              </span>
                            </el-col>
                          </el-row>
                        </el-header>
                        <el-main
                          style="
                            display: -webkit-box;
                            -webkit-box-orient: vertical;
                            -webkit-line-clamp: 3;
                            overflow: hidden;
                            height: 130px;
                          "
                        >
                          <span>{{ item.content }}</span>
                        </el-main>
                      </el-container>
                    </el-card>
                  </el-col>
                  <el-col :span="8" style="margin-bottom: 20px">
                    <el-card
                      shadow="hover"
                      style="height: 210px; cursor: pointer"
                    >
                      <div
                        style="
                          text-align: center;
                          padding: 60px 0px;
                          border: 2px dashed gray;
                        "
                        @click="taggleWorkDrawer(true)"
                      >
                        <i class="el-icon-plus">添加任务</i>
                      </div>
                    </el-card>
                  </el-col>
                </el-row>
              </div>
            </el-form-item>
            <el-form-item v-if="editorStatus">
              <el-button
                :loading="editorLoading"
                type="primary"
                @click="updateInfo"
              >保存修改</el-button>
              <el-button @click="taggleEditor(false)">取消</el-button>
            </el-form-item>
          </el-form>
        </el-main>
      </el-container>
    </el-card>
    <template>
      <el-drawer
        direction="rtl"
        destroy-on-close
        :visible.sync="drawer"
        :with-header="false"
      >
        <template>
          <el-form
            ref="form"
            :model="form"
            label-width="80px"
            style="padding: 50px 20px 20px 20px"
          >
            <el-form-item label="计划名称">
              <el-input v-model="form.name" />
            </el-form-item>
            <el-form-item label="计划内容">
              <el-input
                v-model="form.content"
                type="textarea"
                :autosize="{ minRows: 2 }"
              />
            </el-form-item>
            <el-form-item label="计划状态">
              <el-radio-group v-model="form.status">
                <el-radio :label="-1" disabled>失败</el-radio>
                <el-radio :label="0">进行中</el-radio>
                <el-radio :label="1">完成</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="耗时/小时">
              <el-input-number
                v-model="form.costTime"
                :precision="2"
                :step="0.1"
                controls-position="right"
                :max="87600"
              />
            </el-form-item>
            <el-form-item label="计划排序">
              <el-input-number
                v-model="form.sort"
                :step="1"
                step-strictly
                :max="1000"
              />
            </el-form-item>
            <el-form-item label="父级计划">
              <el-cascader
                v-model="form.planCascaderPath"
                :options="treeList"
                :props="{ checkStrictly: true, label: 'name', value: 'id' }"
                clearable
                disabled
                :show-all-levels="false"
              />
            </el-form-item>
            <el-form-item>
              <el-button
                :loading="addLoading"
                type="primary"
                @click="addPlan"
              >立即创建</el-button>
              <el-button @click="taggleDrawer(false)">取消</el-button>
            </el-form-item>
          </el-form>
        </template>
      </el-drawer>
    </template>
    <template>
      <el-drawer
        direction="rtl"
        destroy-on-close
        :visible.sync="workDrawer"
        :with-header="false"
      >
        <template>
          <el-form
            ref="workForm"
            :model="workForm"
            label-width="80px"
            style="padding: 50px 20px 20px 20px"
          >
            <el-form-item
              label="任务名称"
              :rules="[{ required: true, message: '任务名称不可为空' }]"
              prop="name"
            >
              <el-input v-model="workForm.name" />
            </el-form-item>
            <el-form-item
              label="任务内容"
              :rules="[{ required: true, message: '任务名称不可为空' }]"
              prop="content"
            >
              <el-input
                v-model="workForm.content"
                type="textarea"
                :autosize="{ minRows: 2 }"
              />
            </el-form-item>
            <el-form-item label="任务状态">
              <el-radio-group v-model="workForm.status">
                <el-radio :label="-1" disabled>失败</el-radio>
                <el-radio :label="0">进行中</el-radio>
                <el-radio :label="1">完成</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="重复类型">
              <el-radio-group v-model="workForm.repeatType">
                <el-radio :label="1">天</el-radio>
                <el-radio :label="2">周</el-radio>
                <el-radio :label="3">月</el-radio>
                <el-radio :label="4">年</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="重复步进">
              <el-input-number
                v-model="workForm.repeatStep"
                :step="1"
                step-strictly
                :min="1"
              />
            </el-form-item>
            <el-form-item v-if="workForm.repeatType !== 1" label="设置某天">
              <el-input-number
                v-if="workForm.repeatType === 2"
                v-model="workForm.whichDay"
                :step="1"
                step-strictly
                :min="1"
                :max="7"
              />
              <el-input-number
                v-else-if="workForm.repeatType === 3"
                v-model="workForm.whichDay"
                :step="1"
                step-strictly
                :min="1"
                :max="28"
              />
              <el-input-number
                v-else
                v-model="workForm.whichDay"
                :step="1"
                step-strictly
                :min="1"
                :max="365"
              />
            </el-form-item>
            <el-form-item
              label="始末时间"
              :rules="[{ required: true, message: '始末时间不可为空' }]"
              prop="timeRange"
            >
              <template>
                <el-time-picker
                  v-model="workForm.timeRange"
                  is-range
                  range-separator="至"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间"
                  placeholder="选择时间范围"
                />
              </template>
            </el-form-item>
            <el-form-item
              label="始末日期"
              :rules="[{ required: true, message: '始末日期不可为空' }]"
              prop="dateRange"
            >
              <template>
                <el-date-picker
                  v-model="workForm.dateRange"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                />
              </template>
            </el-form-item>
            <el-form-item label="任务排序">
              <el-input-number
                v-model="workForm.sort"
                :step="1"
                step-strictly
                :max="1000"
              />
            </el-form-item>
            <el-form-item label="归属计划">
              <el-cascader
                v-model="workForm.planCascaderPath"
                :options="treeList"
                :props="{ checkStrictly: true, label: 'name', value: 'id' }"
                clearable
                disabled
                :show-all-levels="false"
              />
            </el-form-item>
            <el-form-item>
              <el-button
                :loading="addLoading"
                type="primary"
                @click="addWork"
              >立即创建</el-button>
              <el-button @click="taggleWorkDrawer(false)">取消</el-button>
            </el-form-item>
          </el-form>
        </template>
      </el-drawer>
    </template>
  </div>
</template>

<script>
import {
  addPlan,
  getOnePlan,
  updatePlan,
  removePlan,
  getTree
} from '@/api/plan'
import { addWork } from '@/api/work'

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
      works: [],
      planCascaderPath: [],
      editorStatus: false,
      treeList: [],
      editorLoading: false,
      loading: false,
      addLoading: false,
      drawer: false,
      workDrawer: false,
      form: {
        name: '',
        content: '',
        status: 0,
        costTime: 0,
        sort: 0,
        planCascaderPath: []
      },
      workForm: {
        name: '',
        content: '',
        status: 0,
        repeatType: 1,
        repeatStep: 1,
        whichDay: 1,
        timeRange: '',
        dateRange: '',
        sort: 0,
        planCascaderPath: []
      }
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
      this.loading = true
      getOnePlan(this.id)
        .then((response) => {
          if (!response.data || !response.data?.id) {
            this.$message.warning('找不到当前计划!')
            this.goBack()
            return
          }
          const planCascaderPathData = response.data?.planCascaderPath ? response.data.planCascaderPath.split(',') : []
          this.name = response.data.name
          this.content = response.data.content
          this.status = response.data.status
          this.sort = response.data.sort
          this.costTime = response.data.costTime
          this.form.parent = this.id
          this.workForm.plan = this.id
          this.planCascaderPath = planCascaderPathData.join(',').split(',')
          this.parent = response.data?.parent ? response.data.parent : {}
          this.children = response.data?.children?.length > 0 ? response.data.children : []
          this.works = response.data?.works?.length > 0 ? response.data.works : []
          planCascaderPathData.push(this.id)
          this.form.planCascaderPath = planCascaderPathData
          this.workForm.planCascaderPath = planCascaderPathData
          this.loading = false
        })
        .catch((err) => {
          this.$message.error('发生错误:' + err)
          this.goBack()
        })
    },
    goToDetail(id) {
      this.$router.push({ path: '/plan/detail/' + id })
    },
    goToWorkDetail(id) {
      this.$router.push({ path: '/work/detail/' + id })
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
        parent: this.planCascaderPath.length > 0 ? this.planCascaderPath[this.planCascaderPath.length - 1] : '',
        planCascaderPath: this.planCascaderPath.join(',')
      }
      updatePlan(this.id, info).then(() => {
        this.$message({
          message: '修改成功',
          type: 'success'
        })
        this.formLoading = false
        this.taggleEditor(false)
      })
      this.formLoading = false
    },
    deletePlan(id) {
      removePlan(id)
        .then(() => {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.goBack()
        })
        .catch(() => {})
    },
    taggleDrawer(taggle) {
      if (this.treeList.length === 0) {
        this.fetchPlanList()
      }
      this.drawer = taggle
    },
    taggleWorkDrawer(taggle) {
      if (this.treeList.length === 0) {
        this.fetchPlanList()
      }
      this.workDrawer = taggle
    },
    addPlan() {
      this.addLoading = true
      var info = {
        name: this.form.name,
        content: this.form.content,
        status: this.form.status,
        costTime: this.form.costTime,
        sort: this.form.sort,
        planCascaderPath: this.form.planCascaderPath.join(','),
        parent: this.form.planCascaderPath.length > 0 ? this.form.planCascaderPath[this.form.planCascaderPath.length - 1] : ''
      }
      console.log(info)
      addPlan(info).then(() => {
        this.$message({
          message: '添加成功',
          type: 'success'
        })
        var planCascaderPathData = this.planCascaderPath.join(',').split(',')
        planCascaderPathData.push(this.id)
        this.form = {
          name: '',
          content: '',
          status: 0,
          costTime: 0,
          sort: 0,
          planCascaderPath: planCascaderPathData
        }
        this.addLoading = false
        this.taggleDrawer(false)
        this.getInfo()
      })
      this.addLoading = false
    },
    addWork() {
      this.$refs['workForm'].validate((valid) => {
        if (valid) {
          this.addLoading = true
          const startDate = this.workForm.dateRange[0]
          const endDate = this.workForm.dateRange[1]
          startDate.setMinutes(
            startDate.getMinutes() - startDate.getTimezoneOffset()
          )
          endDate.setMinutes(
            endDate.getMinutes() - endDate.getTimezoneOffset()
          )
          const dayWorkStartTime = this.workForm.timeRange[0]
          const dayWorkEndTime = this.workForm.timeRange[1]
          dayWorkStartTime.setMinutes(
            dayWorkStartTime.getMinutes() - dayWorkStartTime.getTimezoneOffset()
          )
          dayWorkEndTime.setMinutes(
            dayWorkEndTime.getMinutes() - dayWorkEndTime.getTimezoneOffset()
          )
          var info = {
            name: this.workForm.name,
            content: this.workForm.content,
            status: this.workForm.status,
            repeatType: this.workForm.repeatType,
            repeatStep: this.workForm.repeatStep,
            whichDay: this.workForm.whichDay,
            startDate: startDate.toJSON().substr(0, 10),
            endDate: endDate.toJSON().substr(0, 10),
            dayWorkStartTime:
              (dayWorkStartTime.getTime() / 1000) % 86400,
            dayWorkEndTime:
              (dayWorkEndTime.getTime() / 1000) % 86400,
            sort: this.workForm.sort,
            plan: this.id
          }
          addWork(info).then(() => {
            this.$message({
              message: '添加成功',
              type: 'success'
            })
            var planCascaderPath = this.planCascaderPath
            planCascaderPath.push(this.id)
            this.workForm = {
              name: '',
              content: '',
              status: 0,
              repeatType: 1,
              repeatStep: 1,
              whichDay: 1,
              timeRange: '',
              dateRange: '',
              sort: 0,
              planCascaderPath: planCascaderPath
            }
            this.addLoading = false
            this.taggleWorkDrawer(false)
            this.getInfo()
          })
          this.addLoading = false
        }
      })
    }
  }
}
</script>
