<template>
  <el-container v-loading="loading">
    <el-container>
      <el-header
        style="
          height: 60px;
          padding: 10px 20px;
          line-height: 40px;
          border-bottom: 1px solid #ebeef5;
        "
      >
        <el-row :gutter="20">
          <el-col :xs="8" :span="4" style="">
            {{ date.getFullYear() + " 年 " + (date.getMonth() + 1) + " 月" }}
          </el-col>
          <el-col :xs="16" :span="20" style="text-align: end">
            <el-button-group>
              <el-button
                size="mini"
                plain
                icon="el-icon-arrow-left"
                @click="slideCalendar('prev')"
              >上一月</el-button>
              <el-button
                size="mini"
                plain
                @click="slideCalendar('now')"
              >今天</el-button>
              <el-button
                size="mini"
                plain
                @click="slideCalendar('next')"
              >下一月<i
                class="el-icon-arrow-right el-icon--right"
              /></el-button>
            </el-button-group>
          </el-col>
        </el-row>
      </el-header>
      <el-main>
        <el-container>
          <el-header style="height: 30px; line-height: 20px; padding-top: 10px">
            <template>
              <div
                v-for="(day, index) in weekList"
                :key="index + 'day'"
                class="week-item"
              >
                <div>{{ day }}</div>
              </div>
            </template>
          </el-header>
          <el-main style="padding-top: 10px">
            <template>
              <div
                style="
                  border-right: 1px solid #ebeef5;
                  border-bottom: 1px solid #ebeef5;
                "
              >
                <div
                  v-for="(calendar, index) in dateList"
                  :key="index + 'calendar'"
                  :class="{
                    'calendar-item': true,
                    'calendar-select': selectDate === calendar.fullTime,
                    'calendar-outrange': date.getMonth() !== calendar.month,
                  }"
                >
                  <div
                    :style="{ height: height + 'px' }"
                    @click="slideCalendar(calendar.fullTime)"
                  >
                    <el-container>
                      <el-header class="calendar-item-header">
                        <div>{{ calendar.date }}</div>
                      </el-header>
                      <el-main style="padding: 10px 20px">
                        <div
                          v-if="calendarList.hasOwnProperty(calendar.fullTime)"
                        >
                          <div>
                            <div
                              v-for="(item, cIndex) in calendarList[
                                calendar.fullTime
                              ]"
                              :key="cIndex + 'calendar-list'"
                            >
                              <i
                                v-if="item.status === 1"
                                class="el-icon-check"
                                style="color: green"
                              />
                              <i
                                v-if="item.status === 0"
                                class="el-icon-s-promotion"
                              />
                              <i
                                v-else-if="item.status === -1"
                                class="el-icon-close"
                                style="color: red"
                              />
                              {{ item.name }} ({{
                                formatWorkItemTime(item.dayWorkStartTime) +
                                  "~" +
                                  formatWorkItemTime(item.dayWorkEndTime)
                              }})
                            </div>
                          </div>
                        </div>
                      </el-main>
                    </el-container>
                  </div>
                </div>
              </div>
            </template>
          </el-main>
        </el-container>
      </el-main>
    </el-container>
    <el-aside v-if="asideShow" width="30%" class="aside-table">
      <template>
        <el-button type="plain" icon="el-icon-plus" @click="taggleWorkDrawer(true)">添加任务</el-button>
        <el-table :data="asideData" style="width: 100%">
          <el-table-column label="名称">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column label="时间" width="180">
            <template slot-scope="scope">
              <i class="el-icon-time" />
              {{
                formatWorkItemTime(scope.row.dayWorkStartTime) +
                  "~" +
                  formatWorkItemTime(scope.row.dayWorkEndTime)
              }}
            </template>
          </el-table-column>
          <el-table-column label="状态" width="80">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.status === 1" type="success">完成</el-tag>
              <el-tag
                v-else-if="scope.row.status === 0"
                type="info"
              >未完成</el-tag>
              <el-tag
                v-else-if="scope.row.status === -1"
                type="danger"
              >失败</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="60">
            <template slot-scope="scope">
              <!-- <el-button
                size="mini"
                :disabled="scope.row.status === 1"
                @click="workItemDone(scope.row.id)"
              >完成</el-button> -->
              <span style="font-size: 30px">
                <i
                  v-if="scope.row.status !== 1"
                  class="el-icon-check"
                  style="color: green; cursor: pointer"
                  @click="workItemDone(scope.row.id)"
                />
                <i
                  v-else
                  class="el-icon-check"
                  style="color: gray; cursor: no-drop"
                />
              </span>
              <!-- <el-button
                size="mini"
                type="danger"
                :disabled="scope.row.status === -1"
                @click="workItemFail(scope.row.id)"
              >失败</el-button> -->
            </template>
          </el-table-column>
        </el-table>
      </template>
    </el-aside>
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
            <el-form-item
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
                :show-all-levels="false"
              />
            </el-form-item>
            <el-form-item>
              <el-button
                :loading="addLoading"
                type="primary"
                @click="addOneWork"
              >立即创建</el-button>
              <el-button @click="taggleWorkDrawer(false)">取消</el-button>
            </el-form-item>
          </el-form>
        </template>
      </el-drawer>
    </template>
  </el-container>
</template>

<script>
import { workCalendar, doneWorkItem, failWorkItem, createOneWork } from '@/api/work'
// import calendarItem from './components/calendarItem'
import { getDateList } from '@/utils/date/calendar'
import { parseTime } from '@/utils/index'
import { getTree } from '@/api/plan'

export default {
  // components: {
  //   calendarItem
  // },
  data() {
    return {
      calendarList: [],
      loading: false,
      date: new Date(),
      selectDate: Object,
      month: 1,
      weekStart: 1,
      weekList: [], // ['日', '月', '火', '水', '木', '金', '土']
      dateList: [],
      height: 200,
      asideData: [],
      asideShow: false,
      treeList: [],
      workDrawer: false,
      addLoading: false,
      workForm: {
        name: '',
        content: '',
        timeRange: '',
        date: '',
        sort: 0,
        planCascaderPath: []
      }
    }
  },
  created() {
    this.month = this.date.getMonth()
    this.formatWeek(this.weekStart)
    this.formatDate(this.date, this.weekStart)
    this.getCalendarList()
    this.setSelcetDate(this.date, true)
  },
  methods: {
    getCalendarList(setAside = false) {
      this.loading = true
      workCalendar({}).then((response) => {
        this.calendarList = response.data
        this.loading = false
        if (setAside) {
          this.asideData = this.calendarList[this.selectDate]
        }
      })
    },
    fetchPlanList() {
      getTree().then((response) => {
        this.treeList = response.data
      })
    },
    formatWeek(start = 0) {
      if (start > 6) start = 6
      if (start < 0) start = 0
      const list = ['日', '一', '二', '三', '四', '五', '六']
      const newWeekList = []
      for (var i = 0; i < 7; i++) {
        const index = i + start > 6 ? start + i - 7 : start + i
        newWeekList.push(list[index])
      }
      this.weekList = newWeekList
    },
    formatDate(date = new Date(), start = 0) {
      this.dateList = getDateList(date, start)
    },
    slideCalendar(command = 'now') {
      var year = this.date.getFullYear()
      var month = this.date.getMonth()
      switch (command) {
        case 'prev':
          var prevMonth = month - 1
          var prevYear = year
          if (month === 0) {
            prevMonth = 12
            prevYear = year - 1
          }
          this.date = new Date(prevYear, prevMonth)
          this.formatDate(this.date, this.weekStart)
          this.setSelcetDate(this.date)
          this.taggleAside(false)
          break
        case 'now':
          var newDate = new Date()
          if (
            newDate.getMonth() !== this.date.getMonth() ||
            newDate.getFullYear() !== this.date.getFullYear()
          ) {
            this.date = newDate
            this.formatDate(this.date, this.weekStart)
          }
          this.setSelcetDate(this.date)
          this.taggleAside(false)
          break
        case 'next':
          var nextMonth = month + 1
          var nextYear = year
          if (month === 11) {
            nextMonth = 0
            nextYear = year + 1
          }
          this.date = new Date(nextYear, nextMonth)
          this.formatDate(this.date, this.weekStart)
          this.setSelcetDate(this.date)
          this.taggleAside(false)
          break
        default:
          var clickDate = new Date(command.replace(/-/g, '/'))
          if (!(clickDate instanceof Date)) {
            throw new Error('传入时间格式有误')
          }
          if (
            clickDate.getMonth() !== this.date.getMonth() ||
            clickDate.getFullYear() !== this.date.getFullYear()
          ) {
            this.date = clickDate
            this.formatDate(this.date, this.weekStart)
          }
          this.setSelcetDate(clickDate)
          break
      }
    },
    setSelcetDate(date = new Date(), init = false) {
      const newSelectDate =
        date.getFullYear().toString() +
        '-' +
        (date.getMonth() < 10 ? '0' : '') +
        (date.getMonth() + 1).toString() +
        '-' +
        (date.getDate() < 10 ? '0' : '') +
        date.getDate().toString()
      init ||
        this.taggleAside(
          newSelectDate !== this.selectDate ||
            (newSelectDate === this.selectDate && this.asideShow === false),
          newSelectDate
        )
      this.selectDate = newSelectDate
    },
    taggleAside(taggle = true, newSelectDate = null) {
      if (taggle && newSelectDate) {
        this.asideData =
          this.calendarList[newSelectDate] !== undefined
            ? this.calendarList[newSelectDate]
            : []
      }
      this.asideShow = taggle
    },
    formatWorkItemTime(time, format = '{h}:{i}:{s}') {
      return parseTime(time, format)
    },
    workItemDone(id) {
      doneWorkItem(id).then(() => {
        this.$message({
          message: '操作成功',
          type: 'success'
        })
        this.getCalendarList(true)
      })
    },
    workItemFail(id) {
      failWorkItem(id).then(() => {
        this.$message({
          message: '操作成功',
          type: 'success'
        })
        this.getCalendarList(true)
      })
    },
    taggleWorkDrawer(taggle) {
      if (taggle) {
        if (this.treeList.length === 0) {
          this.fetchPlanList()
        }
        this.workForm.date = new Date(this.selectDate.replace(/-/g, '/'))
      } else {
        this.$refs['workForm'].resetFields()
      }
      this.workDrawer = taggle
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
            this.workForm = {
              name: '',
              content: '',
              timeRange: '',
              date: '',
              sort: 0,
              planCascaderPath: []
            }
            this.$refs['workForm'].resetFields()
            this.addLoading = false
            this.taggleWorkDrawer(false)
            this.getCalendarList(true)
          })
          this.addLoading = false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.calendar-item {
  width: 14.28%;
  display: inline-block;
  border-top: 1px solid #ebeef5;
  border-left: 1px solid #ebeef5;
  :hover {
    background-color: #f2f8fe;
  }
  .calendar-item-header {
    height: 30px !important;
    line-height: 20px;
    padding-top: 10px;
  }
}
.calendar-select {
  background-color: #f2f8fe;
  color: #1989fa;
  // .calendar-item-header{

  // }
}
.calendar-outrange {
  color: #c0c4cc;
}
.week-item {
  width: 14.28%;
  display: inline-block;
  text-align: center;
}
.aside-table {
  border-left: 1px solid #ebeef5;
  padding: 20px;
}
</style>

