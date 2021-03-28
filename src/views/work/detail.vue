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
              <span>任务详情</span>
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
                style="cursor: no-drop; color: gray"
                title="完成"
              /><i
                v-else
                class="el-icon-check"
                style="cursor: pointer"
                title="完成"
                @click="workDone"
              /></span>
              <el-divider direction="vertical" />
              <span><i
                v-if="status === -1"
                class="el-icon-close"
                style="cursor: no-drop; color: gray"
                title="失败"
              /><i
                v-else
                class="el-icon-close"
                style="cursor: pointer"
                title="失败"
                @click="workFail"
              /></span>
              <el-divider direction="vertical" />
              <span><i
                class="el-icon-delete"
                style="cursor: pointer"
                title="删除"
                @click="deleteWork"
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
              <div v-else> {{ content }} </div>
            </el-form-item>
            <el-form-item v-if="!editorStatus" label="状态">
              <!-- <div v-if="editorStatus">
                <el-radio-group v-model="status">
                  <el-radio :label="-1">失败</el-radio>
                  <el-radio :label="0">进行中</el-radio>
                  <el-radio :label="1">完成</el-radio>
                </el-radio-group>
              </div> -->
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
            <el-form-item label="重复类型">
              <div v-if="editorStatus">
                <el-radio-group v-model="repeatType">
                  <el-radio :label="1">天</el-radio>
                  <el-radio :label="2">周</el-radio>
                  <el-radio :label="3">月</el-radio>
                  <el-radio :label="4">年</el-radio>
                </el-radio-group>
              </div>
              <div v-else>
                <span v-if="repeatType === 1">天</span>
                <span v-else-if="repeatType === 2">周</span>
                <span v-else-if="repeatType === 3">月</span>
                <span v-else>年</span>
              </div>
            </el-form-item>
            <el-form-item label="重复步进">
              <div v-if="editorStatus">
                <el-input-number
                  v-model="repeatStep"
                  :step="1"
                  step-strictly
                  :min="1"
                  :disabled="!editorStatus"
                />
              </div>
              <div v-else> {{ repeatStep }} </div>
            </el-form-item>
            <el-form-item v-if="repeatType !== 1" label="设置某天">
              <div v-if="editorStatus">
                <el-input-number
                  v-if="repeatType === 2"
                  v-model="whichDay"
                  :step="1"
                  step-strictly
                  :min="1"
                  :max="7"
                />
                <el-input-number
                  v-else-if="repeatType === 3"
                  v-model="whichDay"
                  :step="1"
                  step-strictly
                  :min="1"
                  :max="28"
                />
                <el-input-number
                  v-else
                  v-model="whichDay"
                  :step="1"
                  step-strictly
                  :min="1"
                  :max="365"
                />
              </div>
              <div v-else> {{ whichDay }} </div>
            </el-form-item>
            <el-form-item
              label="始末时间"
            >
              <el-time-picker
                v-model="timeRange"
                is-range
                range-separator="至"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                placeholder="选择时间范围"
                :disabled="!editorStatus"
              />
            </el-form-item>
            <el-form-item
              label="始末日期"
            >
              <el-date-picker
                v-model="dateRange"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :disabled="!editorStatus"
              />
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
            <el-form-item label="计划">
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
                <div v-if="plan.hasOwnProperty('name')">
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
                                  @click="goToDetail(plan.id)"
                                >{{ plan.name }}</span>
                              </el-col>
                              <el-col :span="2" style="font-size: 30px">
                                <i
                                  v-if="plan.status === 1"
                                  class="el-icon-finished"
                                  style="color: green"
                                  title="已完成"
                                />
                                <i
                                  v-else-if="plan.status === -1"
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
                            <span>{{ plan.content }}</span>
                          </el-main>
                        </el-container>
                      </el-card>
                    </el-col>
                  </el-row>
                </div>
                <div v-else>无</div>
              </div>
            </el-form-item>
            <el-form-item v-if="!editorStatus" label="时间分布">
              <div style="padding-left: 10px">
                <el-row :gutter="20">
                  <el-col
                    v-for="item in workItems"
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
                                  style="font-size: 30px; cursor: pointer"
                                >
                                  {{ item.date }}
                                </span>
                              </el-col>
                            </el-row>
                          </el-header>
                          <el-main
                            style="height: 130px;"
                          >
                            <span v-if="item.status === 1" style="font-size: 30px">
                              已完成 <i
                                class="el-icon-finished"
                                style="color: green"
                                title="已完成"
                              />
                            </span>
                            <span v-else-if="item.status === -1" style="font-size: 30px">
                              失败 <i
                                class="el-icon-close"
                                style="color: red"
                                title="失败"
                              />
                            </span>
                            <span v-else style="font-size: 30px">
                              进行中 <i
                                class="el-icon-truck"
                                title="进行中"
                              />
                            </span>
                          </el-main>
                        </el-container>
                        <el-aside width="40px" style="width: 50px;border-left: 0.5px solid #eee;padding-left: 10px;font-size: 30px">
                          <span><i
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
                          <el-divider style="margin: 60px 0px" />
                          <span><i
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
                        </el-aside>
                      </el-container>
                    </el-card>
                  </el-col>
                </el-row>
              </div>
            </el-form-item>
            <el-form-item v-if="editorStatus">
              <el-button
                :loading="editorLoading"
                type="primary"
                @click="updateWork"
              >保存修改</el-button>
              <el-button @click="taggleEditor(false)">取消</el-button>
            </el-form-item>
          </el-form>
        </el-main>
      </el-container>
    </el-card>
  </div>
</template>

<script>
import { getOneWork, updateWork, deleteWork, doneWorkItem, failWorkItem, doneWork, failWork } from '@/api/work'
import { getTree } from '@/api/plan'
import { sortArrayObject } from '@/utils/sort/array'

export default {
  data() {
    return {
      id: '',
      name: '',
      content: '',
      status: 0,
      repeatType: 1,
      repeatStep: 1,
      whichDay: 1,
      timeRange: [],
      dateRange: [],
      sort: 0,
      plan: {},
      workItems: [],
      loading: false,
      editorStatus: false,
      treeList: [],
      editorLoading: false,
      planCascaderPath: []
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
      getOneWork(this.id)
        .then((response) => {
          if (!response.data || !response.data?.id) {
            this.$message.warning('找不到当前任务!')
            this.goBack()
            return
          }
          var thisDay0ClockTimestamp = new Date(new Date().toLocaleDateString()).getTime()
          this.timeRange = [
            new Date(thisDay0ClockTimestamp + response.data.dayWorkStartTime * 1000),
            new Date(thisDay0ClockTimestamp + response.data.dayWorkEndTime * 1000)
          ]
          this.dateRange = [
            new Date(response.data.startDate),
            new Date(response.data.endDate)
          ]
          this.name = response.data.name
          this.content = response.data.content
          this.status = response.data.status
          this.repeatType = response.data.repeatType
          this.repeatStep = response.data.repeatStep
          this.whichDay = response.data.whichDay
          this.sort = response.data.sort
          this.workItems = sortArrayObject(response.data.workItems, (a, b) => {
            var aValue = new Date(a.date).getTime()
            var bValue = new Date(b.date).getTime()
            return aValue > bValue ? 1 : (aValue === bValue ? 0 : -1)
          })
          this.planCascaderPath = response.data?.planCascaderPath ? response.data.planCascaderPath.split(',') : []
          this.plan = response.data?.plan ? response.data.plan : {}
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
    fetchPlanList() {
      getTree().then((response) => {
        this.treeList = response.data
      })
    },
    taggleEditor(taggle) {
      if (this.treeList.length === 0) {
        this.fetchPlanList()
      }
      this.editorStatus = taggle
    },
    updateWork() {
      this.editorLoading = true
      const startDate = this.dateRange[0]
      const endDate = this.dateRange[1]
      startDate.setMinutes(
        startDate.getMinutes() - startDate.getTimezoneOffset()
      )
      endDate.setMinutes(
        endDate.getMinutes() - endDate.getTimezoneOffset()
      )
      const dayWorkStartTime = this.timeRange[0]
      const dayWorkEndTime = this.timeRange[1]
      dayWorkStartTime.setMinutes(
        dayWorkStartTime.getMinutes() - dayWorkStartTime.getTimezoneOffset()
      )
      dayWorkEndTime.setMinutes(
        dayWorkEndTime.getMinutes() - dayWorkEndTime.getTimezoneOffset()
      )
      var info = {
        name: this.name,
        content: this.content,
        // status: this.status,
        repeatType: this.repeatType,
        repeatStep: this.repeatStep,
        whichDay: this.whichDay,
        startDate: startDate.toJSON().substr(0, 10),
        endDate: endDate.toJSON().substr(0, 10),
        dayWorkStartTime: (dayWorkStartTime.getTime() / 1000) % 86400,
        dayWorkEndTime: (dayWorkEndTime.getTime() / 1000) % 86400,
        sort: this.sort,
        planCascaderPath: this.planCascaderPath.join(','),
        planId: this.planCascaderPath.length > 0 ? this.planCascaderPath[this.planCascaderPath.length - 1] : ''
      }
      updateWork(this.id, info).then(() => {
        this.$message({
          message: '修改成功',
          type: 'success'
        })
        this.editorLoading = false
        this.taggleEditor(false)
        this.getInfo()
      })
      this.editorLoading = false
    },
    deleteWork() {
      deleteWork(this.id).then(() => {
        this.$message({
          message: '删除成功',
          type: 'success'
        })
        this.goBack()
      }).catch(() => {})
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
    workDone() {
      doneWork(this.id).then(() => {
        this.$message({
          message: '操作成功',
          type: 'success'
        })
        this.getInfo()
      })
    },
    workFail() {
      failWork(this.id).then(() => {
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
