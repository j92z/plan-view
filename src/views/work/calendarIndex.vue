<template>
  <div>
    <el-calendar v-loading="loading">
      <template slot="dateCell" slot-scope="{ data }">
        <p :class="data.isSelected ? 'is-selected' : ''">
          {{ data.day.split("-").slice(1).join("-") }}
          {{ data.isSelected ? "✔️" : "" }}
        </p>
        <div v-if="calendarList.hasOwnProperty(data.day)">
          <calendarItem
            :work-item="calendarList[data.day]"
            :reload="getCalendarList"
          />
        </div>
      </template>
    </el-calendar>
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
          <el-col :span="16" style="">
            {{ date.getFullYear() + " 年 " + date.getMonth() + " 月" }}
          </el-col>
          <el-col :span="8" style="text-align: end">
            <el-button-group>
              <el-button
                size="mini"
                plain
                icon="el-icon-arrow-left"
              >上一月</el-button>
              <el-button size="mini" plain>今天</el-button>
              <el-button
                size="mini"
                plain
              >下一月<i
                class="el-icon-arrow-right el-icon--right"
              /></el-button>
            </el-button-group>
          </el-col>
        </el-row>
      </el-header>
      <el-main>
        <template>
          <div
            v-for="(day, index) in weekList"
            :key="index + 'day'"
            style="width: 14.28%; display: inline-block; text-align: center"
          >
            <div>{{ day }}</div>
          </div>
        </template>
        <template>
          <div style="border-right: 1px solid #ebeef5;border-bottom: 1px solid #ebeef5;">
            <div
              v-for="(calendar, index) in dateList"
              :key="index + 'calendar'"
              style="
                width: 14.28%;
                display: inline-block;
                border-top: 1px solid #ebeef5;
                border-left: 1px solid #ebeef5;
              "
            >
              <div :style="{height: height + 'px'}" class="calendar-item">
                <el-container>
                  <el-header>{{ calendar.headerTime }}</el-header>
                  <el-main>
                    <div v-if="calendarList.hasOwnProperty(calendar.fullTime)">
                      <div>
                        <div v-for="(item, index) in calendarList[calendar.fullTime]" :key="index + 'calendar-list'">
                          {{ item.work.name}}
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
  </div>
</template>

<script>
import { workCalendar } from '@/api/work'
import calendarItem from './components/calendarItem'
import { getDateList } from '@/utils/date/calendar'
export default {
  components: {
    calendarItem
  },
  data() {
    return {
      calendarList: [],
      loading: false,
      date: new Date(),
      month: 1,
      weekStart: 0,
      weekList: [], // ['日', '月', '火', '水', '木', '金', '土']
      dateList: [],
      height: 200
    }
  },
  created() {
    this.month = this.date.getMonth()
    this.formatWeek(this.weekStart)
    this.formatDate(this.date)
    this.getCalendarList()
  },
  methods: {
    getCalendarList() {
      this.loading = true
      workCalendar({}).then((response) => {
        this.calendarList = response.data
        this.loading = false
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
    formatDate(date = new Date()) {
      this.dateList = getDateList(date)
    }
  }
}
</script>

<style lang="scss" scoped>
.calendar-item {
  padding: 8px;
}
</style>

