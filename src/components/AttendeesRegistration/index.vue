<template>
  <div class="stats-data-box">
    <el-card class="total-stats-card">
      <div class="stats-data-box">
        <p><span class="primary">實到 </span>/ 總人數</p>
        <el-progress class="progress" type="circle" :percentage="percentage" />
        <div class="total-stats-data-card-box">
          <el-card class="total-stats-card-item">
            <h3>應到人數</h3>
            <p>{{ stats.totalShouldAttend }}</p>
          </el-card>
          <el-card class="total-stats-card-item">
            <h3>實到人數</h3>
            <p>{{ stats.totalCheckedIn }}</p>
          </el-card>
          <el-card class="total-stats-card-item">
            <h3>缺席人數</h3>
            <p>{{ stats.totalNotArrived }}</p>
          </el-card>
        </div>
      </div>
    </el-card>

    <el-card class="site-stats-card">
      <div class="site-stats-data-card-box">
        <el-card class="site-stats-card-item success">
          <h3>現場人數</h3>
          <p>{{ stats.totalOnSite }}</p>
        </el-card>
        <el-card class="site-stats-card-item danger">
          <h3>已離開人數</h3>
          <p>{{ stats.totalLeft }}</p>
        </el-card>
      </div>
    </el-card>
  </div>
</template>
<script setup lang='ts'>
import { getCheckDataApi } from '@/api/checkin'
import { tryCatch } from '@/utils/tryCatch'
import { ElNotification } from 'element-plus'

const stats = reactive({
  totalShouldAttend: 0,
  totalCheckedIn: 0,
  totalNotArrived: 0,
  totalOnSite: 0,
  totalLeft: 0
})

const percentage = computed(() => {
  if (stats.totalShouldAttend === 0) return 0
  return Math.round((stats.totalCheckedIn / stats.totalShouldAttend) * 100)
})

const getRegistrationData = async () => {
  const { res, error }: any = await tryCatch(getCheckDataApi());

  if (error || res.code !== 200) {
    ElNotification.error({
      title: '錯誤',
      message: '獲取統計數據失敗'
    })
  }

  Object.assign(stats, res.data);
}

defineExpose({
  getRegistrationData
})

onMounted(() => {
  getRegistrationData()
})
</script>

<style lang="scss" scoped>
.stats-data-box {
  width: 40%;
  padding-left: 1rem;
  margin-top: 1rem;

  @media screen and (max-width: 1024px) {
    width: 45%;
  }

  @media screen and (max-width: 768px) {
    flex: 1;
  }

  @media screen and (max-width: 425px) {
    width: 90%;
  }
}

.total-stats-card {
  width: 100%;
  margin-left: auto;

  @media screen and (max-width: 1024px) {
    width: 100%;
  }

  :deep(.el-card__body) {
    width: 100%;
    justify-content: space-between;
  }

  .stats-data-box {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    gap: 3rem;

    .total-stats-data-card-box {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;

      // gap: 1rem;
      .el-card {
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        text-align: center;
      }
    }
  }
}

.site-stats-card {
  width: 100%;
  margin-top: 2rem;
  margin-left: auto;

  @media screen and (max-width: 1024px) {
    width: 100%;
  }

  :deep(.el-card__body) {
    width: 100%;
  }

  .site-stats-data-card-box {
    width: 100%;
    display: flex;

    .el-card {
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      text-align: center;
    }
  }
}

.primary {
  color: #409eff;
}

.success {
  color: green;
}

.danger {
  color: red;
}

.site-on {
  font-size: 1.2rem;
}

.error-msg {
  font-size: 1.2rem;
}
</style>