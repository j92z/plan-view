<template>
  <el-calendar v-loading="loading">
    <template slot="dateCell" slot-scope="{ data }">
      <p :class="data.isSelected ? 'is-selected' : ''">
        {{ data.day.split("-").slice(1).join("-") }}
        {{ data.isSelected ? "✔️" : "" }}
      </p>
      <div v-if="calendarList.hasOwnProperty(data.day)">
        {{ calendarList[data.day] }}
      </div>
    </template>
  </el-calendar>
</template>

<script>
import { workCalendar } from '@/api/work'

export default {
  data() {
    return {
      calendarList: [],
      loading: false
    }
  },
  created() {
    this.getCalendarList()
  },
  methods: {
    getCalendarList() {
      this.loading = true
      workCalendar({}).then((response) => {
        this.calendarList = response.data
        console.log(this.calendarList)
        this.loading = false
      })
    }
  }
}
</script>

