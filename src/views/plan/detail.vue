<template>
  <div>
    <el-card>
      <el-container v-loading="loading">
        <el-header style="font-size: 30px">
          <el-row :gutter="20">
            <el-col :span="16" :xs="24">
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
              :span="8"
              :xs="0"
              style="font-size: 30px;text-align: end;"
            >
              <span><i
                class="el-icon-edit"
                style="cursor: pointer"
                title="编辑"
                @click="taggleEditor(true)"
              /></span>
              <el-divider direction="vertical" />
              <span><i
                v-if="status === 1"
                class="el-icon-check"
                style="cursor: no-drop;color: gray"
                title="完成"
              /><i
                v-else
                class="el-icon-check"
                style="cursor: pointer"
                title="完成"
                @click="planDone"
              /></span>
              <el-divider direction="vertical" />
              <span><i
                v-if="status === -1"
                class="el-icon-close"
                style="cursor: no-drop;color: gray"
                title="失败"
              /><i
                v-else
                class="el-icon-close"
                style="cursor: pointer"
                title="失败"
                @click="planFail"
              /></span>
              <el-divider direction="vertical" />
              <span><i
                class="el-icon-delete"
                style="cursor: pointer"
                title="删除"
                @click="deletePlan(id)"
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
                <el-input
                  v-model="content"
                  type="textarea"
                  :autosize="{ minRows: 2 }"
                />
              </div>
              <div v-else>{{ content }}</div>
            </el-form-item>
            <el-form-item v-if="!editorStatus" label="状态">
              <span style="font-size: 20px">
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
            <!-- <el-form-item v-if="!editorStatus" label="耗时/小时">
              <div>{{ costTime }}</div>
            </el-form-item> -->
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
                    <el-col :xl="6" :lg="8" :md="12" :xs="24">
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
                    :xl="6"
                    :lg="8"
                    :md="12"
                    :xs="24"
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
                  <el-col :xl="6" :lg="8" :md="12" :xs="24" style="margin-bottom: 20px">
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
              <div v-loading="workListLoading" style="padding-left: 10px">
                <el-row :gutter="20">
                  <el-col
                    v-for="item in works"
                    :key="item.id"
                    :xl="6"
                    :lg="8"
                    :md="12"
                    :xs="24"
                    style="margin-bottom: 20px"
                  >
                    <el-card shadow="always" style="height: 210px">
                      <el-container>
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
                                  style="font-size: 30px;"
                                >
                                  {{ item.name }} <i v-if="item.work" class="el-icon-collection work-collection-icon" @click="goToWorkDetail(item.work.id)" />
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
                        <el-aside width="40px" style="width: 50px;border-left: 0.5px solid #eee;padding-left: 10px;font-size: 30px">
                          <span class="work-aside-action"><i
                            v-if="item.status === 1"
                            class="el-icon-check"
                            style="cursor: no-drop; color: gray"
                            title="完成"
                          /><i
                            v-else
                            class="el-icon-check"
                            style="cursor: pointer"
                            title="完成"
                            @click="workItemDone(item.id)"
                          /></span>
                          <span class="work-aside-action"><i
                            v-if="item.status === -1"
                            class="el-icon-close"
                            style="cursor: no-drop; color: gray"
                            title="失败"
                          /><i
                            v-else
                            class="el-icon-close"
                            style="cursor: pointer"
                            title="失败"
                            @click="workItemFail(item.id)"
                          /></span>
                          <span>
                            <i
                              class="el-icon-delete"
                              title="删除"
                              @click="workItemRemove(item.id)"
                            />
                          </span>
                        </el-aside>
                      </el-container>
                    </el-card>
                  </el-col>
                  <el-col :xl="6" :lg="8" :md="12" :xs="24" style="margin-bottom: 20px">
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
          <div style="padding: 20px;text-align: center; border-bottom: 1px solid #ebeef5">
            <el-switch
              v-model="workAddType"
              active-text="工作集合"
              inactive-text="单独工作"
            />
          </div>
          <el-form
            ref="workForm"
            :model="workForm"
            label-width="80px"
            style="padding: 20px"
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
            <el-form-item v-if="workAddType" label="重复类型">
              <el-radio-group v-model="workForm.repeatType">
                <el-radio :label="1">天</el-radio>
                <el-radio :label="2">周</el-radio>
                <el-radio :label="3">月</el-radio>
                <el-radio :label="4">年</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item v-if="workAddType" label="重复步进">
              <el-input-number
                v-model="workForm.repeatStep"
                :step="1"
                step-strictly
                :min="1"
              />
            </el-form-item>
            <el-form-item v-if="workForm.repeatType !== 1 && workAddType" label="设置某天">
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
              v-if="workAddType"
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
            <el-form-item
              v-else
              label="工作日期"
              :rules="[{ required: true, message: '工作日期不可为空' }]"
            >
              <el-date-picker
                v-model="workForm.date"
                type="date"
                placeholder="选择日期"
              />
            </el-form-item>
            <el-form-item
              label="工作时间"
              :rules="[{ required: true, message: '工作时间不可为空' }]"
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
                @click="workAddType ? addWorkCollection() : addOneWork()"
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
  getTree,
  donePlan,
  failPlan
} from '@/api/plan'
import { createWorkCollection, createOneWork, getWorkItemList, doneWorkItem, failWorkItem, removeWorkItem } from '@/api/work'
import { sortArrayObject } from '@/utils/sort/array'

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
      workListLoading: false,
      workAddType: false,
      addLoading: false,
      drawer: false,
      workDrawer: false,
      form: {
        name: '',
        content: '',
        // status: 0,
        // costTime: 0,
        sort: 0,
        planCascaderPath: []
      },
      workForm: {
        name: '',
        content: '',
        // status: 0,
        repeatType: 1,
        repeatStep: 1,
        whichDay: 1,
        timeRange: '',
        date: '',
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
          this.children = sortArrayObject(response.data?.children?.length > 0 ? response.data.children : [], (a, b) => {
            return a.sort < b.sort ? 1 : (a.sort === b.sort ? 0 : -1)
          })
          // this.works = sortArrayObject(response.data?.works?.length > 0 ? response.data.works : [], (a, b) => {
          //   return a.sort < b.sort ? 1 : (a.sort === b.sort ? 0 : -1)
          // })
          planCascaderPathData.push(this.id)
          this.form.planCascaderPath = planCascaderPathData
          this.workForm.planCascaderPath = planCascaderPathData
          this.loading = false
          this.fetchWorkList()
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
    fetchWorkList() {
      this.workListLoading = true
      getWorkItemList(this.id).then((response) => {
        this.works = response.data
        this.workListLoading = false
      })
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
        // status: this.status,
        sort: this.sort,
        // costTime: this.costTime,
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
        sort: this.form.sort,
        planCascaderPath: this.form.planCascaderPath.join(','),
        parent: this.form.planCascaderPath.length > 0 ? this.form.planCascaderPath[this.form.planCascaderPath.length - 1] : ''
      }
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
          // status: 0,
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
    addWorkCollection() {
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
          // dayWorkStartTime.setMinutes(
          //   dayWorkStartTime.getMinutes() - dayWorkStartTime.getTimezoneOffset()
          // )
          // dayWorkEndTime.setMinutes(
          //   dayWorkEndTime.getMinutes() - dayWorkEndTime.getTimezoneOffset()
          // )
          var info = {
            name: this.workForm.name,
            content: this.workForm.content,
            // status: this.workForm.status,
            repeatType: this.workForm.repeatType,
            repeatStep: this.workForm.repeatStep,
            whichDay: this.workForm.whichDay,
            startDate: startDate.toJSON().substr(0, 10),
            endDate: endDate.toJSON().substr(0, 10),
            dayWorkStartTime:
              (dayWorkStartTime.getTime()) % 86400000,
            dayWorkEndTime:
              (dayWorkEndTime.getTime()) % 86400000,
            sort: this.workForm.sort,
            planId: this.id
          }
          createWorkCollection(info).then(() => {
            this.$message({
              message: '添加成功',
              type: 'success'
            })
            var planCascaderPath = this.planCascaderPath
            planCascaderPath.push(this.id)
            this.workForm = {
              name: '',
              content: '',
              // status: 0,
              repeatType: 1,
              repeatStep: 1,
              whichDay: 1,
              timeRange: '',
              date: '',
              dateRange: '',
              sort: 0,
              planCascaderPath: planCascaderPath
            }
            this.$refs['workForm'].resetFields()
            this.addLoading = false
            this.taggleWorkDrawer(false)
            this.getInfo()
          })
          this.addLoading = false
        }
      })
    },
    addOneWork() {
      this.$refs['workForm'].validate((valid) => {
        if (valid) {
          this.addLoading = true
          const workDate = this.workForm.date
          workDate.setMinutes(
            workDate.getMinutes() - workDate.getTimezoneOffset()
          )
          const dayWorkStartTime = this.workForm.timeRange[0]
          const dayWorkEndTime = this.workForm.timeRange[1]
          var info = {
            name: this.workForm.name,
            content: this.workForm.content,
            date: workDate.toJSON().substr(0, 10),
            dayWorkStartTime:
              (dayWorkStartTime.getTime()) % 86400000,
            dayWorkEndTime:
              (dayWorkEndTime.getTime()) % 86400000,
            sort: this.workForm.sort,
            planId: this.id
          }
          createOneWork(info).then(() => {
            this.$message({
              message: '添加成功',
              type: 'success'
            })
            var planCascaderPath = this.planCascaderPath
            planCascaderPath.push(this.id)
            this.workForm = {
              name: '',
              content: '',
              // status: 0,
              repeatType: 1,
              repeatStep: 1,
              whichDay: 1,
              timeRange: '',
              date: '',
              dateRange: '',
              sort: 0,
              planCascaderPath: planCascaderPath
            }
            this.$refs['workForm'].resetFields()
            this.addLoading = false
            this.taggleWorkDrawer(false)
            this.getInfo()
          })
          this.addLoading = false
        }
      })
    },
    planDone() {
      donePlan(this.id).then(() => {
        this.$message({
          message: '操作成功',
          type: 'success'
        })
        this.getInfo()
      })
    },
    planFail() {
      failPlan(this.id).then(() => {
        this.$message({
          message: '操作成功',
          type: 'success'
        })
        this.getInfo()
      })
    },
    workItemDone(id) {
      doneWorkItem(id).then(() => {
        this.$message({
          message: '操作成功',
          type: 'success'
        })
        this.getInfo()
      })
    },
    workItemFail(id) {
      failWorkItem(id).then(() => {
        this.$message({
          message: '操作成功',
          type: 'success'
        })
        this.getInfo()
      })
    },
    workItemRemove(id) {
      removeWorkItem(id).then(() => {
        this.$message({
          message: '操作成功',
          type: 'success'
        })
        this.getInfo()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.work-collection-icon {
  cursor: pointer;
  :hover {
    color: #409EFF;
  }
}
.work-aside-action {
  border-bottom: 1px solid #6b6d72;
}
</style>
