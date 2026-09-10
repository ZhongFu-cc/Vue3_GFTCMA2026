<template>
  <section class="main-section">
    <el-card class="main-card">
      <div class="data-section" v-if="showOtherElement">
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

        <div class="checkin-table-box">
          <h1 v-if="showOtherElement">簽到退系統</h1>

          <div class="function-bar">
            <el-form-item label="" label-position="left">
              <el-input v-model="queryText" placeholder="搜尋參與者資料" @input="handleInput" />
            </el-form-item>
            <el-button class="site-on" link type="primary" @click="openDialog">+現場登記</el-button>
          </div>
          <p class="primary">{{ total }} 位參加者</p>
          <div class="scroll-box">
            <el-scrollbar ref="scrollRef" @scroll.native="handleScroll">
              <el-card v-for="item in showAttendeesList" class="checkin-data-card">
                <div class="member-info" @click="openDrawer(item)">
                  <p class="attendee-name">{{ item.member.chineseName }}</p>
                  <p>{{ memberEnums[item.member.category] }}</p>
                </div>
                <el-icon class="checkin-icon" :class="item.isCheckedIn ? 'checkin' : ''"
                  @click="handleClickCheckIcon(item)">
                  <CircleCheck />
                </el-icon>
              </el-card>
            </el-scrollbar>
          </div>
          <div class="scan-btn-box">
            <el-button class="scan-btn" @click="scanBarcode" circle>
              <el-icon>
                <ElIconCamera />
              </el-icon>
            </el-button>
          </div>
        </div>
      </div>

      <el-button v-if="!showOtherElement" class="close-btn" @click="handleStop">close</el-button>

      <div v-if="!showOtherElement" class="switch-btn">
        <el-button :class="checkActive === 'checkin' ? 'active' : ''" class="checkin-btn"
          @click="switchCheckBtn('checkin')">簽到</el-button>
        <el-button :class="checkActive === 'checkout' ? 'active' : ''" class="checkout-btn"
          @click="switchCheckBtn('checkout')">簽退</el-button>
      </div>

      <div id="barcode-reader" class="component-barcode-reader"></div>
    </el-card>

    <el-dialog class="option-dialog" v-model="isOptionDialogVisible" width="40%">
      <div class="btn-section">
        <el-button @click="checkOut">
          <div class="content">
            <div class="img-box">
              <img src="../../assets/icons/logout.svg" alt="">
            </div>
            <p>簽退</p>
          </div>
        </el-button>
        <el-button @click="handleDeleteLastCheckinRecord">
          <div class="content">
            <div class="img-box">
              <el-icon class="icon">
                <RefreshLeft />
              </el-icon>
            </div>
            <p>撤回</p>
          </div>
        </el-button>
      </div>
    </el-dialog>

    <el-dialog v-model="isDialogVisible" width="40%" :before-close="closeDialog">
      <h1>現場登記</h1>
      <el-form class="insert-form" :model="insertFormData" label-position="top" :rules="formRulesTW"
        ref="insertFormRef">
        <el-form-item label="會員姓名" prop="chineseName">
          <el-input v-model="insertFormData.chineseName" placeholder="請輸入會員姓名" />
        </el-form-item>

        <el-form-item label="會員信箱" prop="email">
          <el-input v-model="insertFormData.email" placeholder="請輸入會員信箱" />
        </el-form-item>
      </el-form>
      <div class="dialog-footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="insertAttendees(insertFormRef)">確 定</el-button>
      </div>
    </el-dialog>

    <el-drawer v-model="isDrawerVisible" title="會員資料" :size="'50%'" :before-close="closeDrawer">
      <div class="drawer-content">
        <el-form label-position="left">
          <el-form-item label="會員編號">
            <el-text>{{ attendee.sequenceNo }}</el-text>
          </el-form-item>
          <el-form-item label="會員姓名">
            <el-text>{{ attendee.member.chineseName }}</el-text>
          </el-form-item>
          <el-form-item label="會員類別">
            <el-text>{{ memberEnums[attendee.member.category] }}</el-text>
          </el-form-item>
          <el-form-item label="身分證號">
            <el-text>{{ attendee.member.idCard }}</el-text>
          </el-form-item>
          <el-form-item label="所屬單位">
            <el-text>{{ attendee.member.affiliation }}</el-text>
          </el-form-item>
          <el-form-item label="會員職稱">
            <el-text>{{ attendee.member.jobTitle }}</el-text>
          </el-form-item>
          <el-form-item label="證書證號">
            <el-text>{{ attendee.receiptNo }}</el-text>
          </el-form-item>
          <el-form-item label="會員電話">
            <el-text>{{ attendee.member.phone }}</el-text>
          </el-form-item>
          <el-form-item label="會員信箱">
            <el-text>{{ attendee.member.email }}</el-text>
          </el-form-item>
          <el-form-item label="飲食偏好">
            <el-text>{{ attendee.member.food }}</el-text>
          </el-form-item>
        </el-form>
      </div>
    </el-drawer>
  </section>
</template>
<script lang="ts" setup>
import {
  getAttendeeListByTagAndPaginationApi,
  insertAttendeeOnSiteApi,
} from "@/api/attendee";
import { checkinApi, deleteLastCheckinRecordApi, getCheckDataApi } from "@/api/checkin";
import { useHtml5Code } from "@/utils/qrcodeScanner";
import { ElNotification, ElMessage, FormInstance } from "element-plus";

import { memberEnums } from "@/enums/MemberEnum";
import { formRulesTW } from "@/utils/checkSum";

import { useAppStore } from "@/store";

const closeSidebar = () => {
  const appStore = useAppStore();
  appStore.closeSideBar();
};

/**---------------checkin || checkout----------------- */


const member = reactive<any>({});
// 簽到退提交資料
const submitCheckData = reactive<any>({
  attendeesId: "",
  location: "",
  actionType: null,
});


const clickRecord = reactive<any>({});
const isOptionDialogVisible = ref(false);

// 處理點擊簽到 Icon
const handleClickCheckIcon = async (row: any) => {
  handleSaveLastScrollData(); // 先儲存目前的滾動位置
  if (row.isCheckedIn) {
    isOptionDialogVisible.value = true;
    Object.assign(clickRecord, row);
  } else {
    submitCheckData.attendeesId = row.attendeesId;
    submitCheckData.actionType = 1;
    checkin();
  }
};

const handleDeleteLastCheckinRecord = async () => {
  try {
    await deleteLastCheckinRecordApi(clickRecord.attendeesId);
    ElMessage({
      message: "已撤回簽到紀錄",
      type: "success",
    });
    isOptionDialogVisible.value = false;
    handleUpdateList();
    getCheckData();
  } catch (error) {
    console.log(error);
  }
};

const checkOut = async () => {
  try {
    submitCheckData.attendeesId = clickRecord.attendeesId;
    submitCheckData.actionType = 2;
    let res = await checkinApi(submitCheckData);
    Object.assign(member, res.data);
    console.log("res", res);
    ElNotification.success({
      message: `會員${res.data.attendeesVO.member.chineseName ? res.data.attendeesVO.member.chineseName : res.data.attendeesVO.member.firstName + res.data.attendeesVO.member.lastName}:簽退成功`,
      duration: 5000,
    });
    isOptionDialogVisible.value = false;
    handleUpdateList();
    getCheckData();
  } catch (error) {
    console.log(error);
  }
};

const checkin = async () => {
  try {
    console.log(submitCheckData);
    let res = await checkinApi(submitCheckData);
    Object.assign(member, res.data);
    console.log("res", res);
    let category = "";
    switch (res.data.attendeesVO.member.category) {
      case 1:
        category = "一般會員";
        break;
    }

    console.log(res.data.attendeesVO.isLastYearAttendee);
    // if (submitCheckData.actionType == 2) return;
    const type = submitCheckData.actionType == 1 ? "簽到成功" : "簽退成功";
    ElNotification({
      title: `會員編號:${res.data.attendeesVO.sequenceNo}`,
      dangerouslyUseHTMLString: true,
      message: `<p style="color:green;font-weight:bold;">${type}</p>
                會員: ${res.data.attendeesVO.member.chineseName ? res.data.attendeesVO.member.chineseName : res.data.attendeesVO.member.firstName + res.data.attendeesVO.member.lastName}<br/>
                會員類別: ${category}<br/>
                ${res.data.attendeesVO.member.remark ? `備註: ${res.data.attendeesVO.member.remark}` : ''}<br/>
                ${res.data.attendeesVO.receiptNo ? `證書編號: ${res.data.attendeesVO.receiptNo}` : ''}
                `,
      duration: 10000,
      type: "success",
    });

    handleUpdateList();
    getCheckData();

  } catch (error) {
    // console.log(error);
    // ElMessage({
    //   dangerouslyUseHTMLString: true,
    //   message: `<p class='error-msg'>${error}</p>`,
    //   type: "error",
    // });
  }
};
/**--------------------------------------------------- */

const stats = reactive<any>({
  totalCheckedIn: 0,
  totalLeft: 0,
  totalNotArrived: 0,
  totalOnSite: 0,
  totalShouldAttend: 0,
});

const percentage = ref(0);


const getCheckData = async () => {
  try {
    let res = await getCheckDataApi();
    console.log("res", res);
    percentage.value = Math.round(
      (res.data.totalCheckedIn / res.data.totalShouldAttend) * 100
    );
    Object.assign(stats, res.data);
  } catch (error) {
    console.log(error);
  }
};

/**-------------------------------------------------- */

const showAttendeesList = reactive<any>([]);


const total = ref(0);
const currentPage = ref(1);
const queryText = ref("");

const isLoading = ref(false);
const hasMoreData = ref(true);

const scrollRef = ref();
const lastScrollData = reactive<any>({
  position: 0,
  page: 1,
});
const handleScroll = async (e: any) => {
  let scrollContainer = scrollRef.value;
  // 獲取滾動容器的高度資訊
  const el = scrollContainer.$el || scrollContainer;
  let wrap = el.querySelector(".el-scrollbar__wrap");
  let scrollMoveY = (wrap.scrollTop * 100) / wrap.scrollHeight;
  let poor = (wrap.scrollHeight - wrap.clientHeight);
  if (
    (poor == parseInt(wrap.scrollTop) ||
      poor == Math.ceil(wrap.scrollTop) ||
      poor == Math.floor(wrap.scrollTop)) &&
    !isLoading.value &&
    hasMoreData.value
  ) {
    getAttendeeList();
  }

  if ((poor == parseInt(wrap.scrollTop) || poor == Math.ceil(wrap.scrollTop) || poor == Math.floor(wrap.scrollTop)) && !hasMoreData.value) {
    ElMessage({
      message: "沒有更多資料了",
      type: "warning",
    });
  }

};

const handleSaveLastScrollData = () => {
  const scrollContainer = scrollRef.value;
  // 獲取滾動容器的高度資訊
  const el = scrollContainer.$el || scrollContainer;
  let wrap = el.querySelector(".el-scrollbar__wrap");
  lastScrollData.page = currentPage.value;
  lastScrollData.position = wrap.scrollTop;
};

/**-------------------------------------------------- */
const isDialogVisible = ref(false);
const openDialog = () => {
  isDialogVisible.value = true;
  handleSaveLastScrollData();
};

const closeDialog = () => {
  isDialogVisible.value = false;
};

const insertFormRef = ref<FormInstance>();

const insertFormData = reactive<any>({
  chineseName: "",
  email: "",
  category: "1",
});

const insertAttendees = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate(async (valid) => {
    if (valid) {
      try {
        let res = await insertAttendeeOnSiteApi(insertFormData);
        console.log("res", res);
        ElMessage({
          message: "新增成功",
          type: "success",
        });
        isDialogVisible.value = false;

        handleUpdateList();
        getCheckData();
        formEl.resetFields();
      } catch (error) {
        console.log(error);
      }
    } else {
      console.log("error submit!!");
    }
  });
};

/**-------------------------------------------------- */
const isDrawerVisible = ref(false);
const attendee = reactive<any>({});
const openDrawer = (row: any) => {
  Object.assign(attendee, row);
  console.log("openDrawer", row);
  isDrawerVisible.value = true;
};
const closeDrawer = () => {
  isDrawerVisible.value = false;
};
/**-------------------------------------------------- */
const getAttendeeListForPage = async (page: number) => {
  try {
    let res = await getAttendeeListByTagAndPaginationApi(
      page,
      10,
      queryText.value
    );
    console.log("getAttendeeListForPage", res);
    total.value = res.data.total;
    return res.data || [];
  } catch (error) {
    console.error("Error fetching attendee list:", error);
    return [];
  }
};

const getAttendeeList = async (resetList: boolean = false) => {
  if (isLoading.value && !resetList) return;
  if (!hasMoreData.value && !resetList) return;

  isLoading.value = true; // 開始加載

  try {
    if (resetList) {
      showAttendeesList.length = 0;
      currentPage.value = 1;
      hasMoreData.value = true;
    }
    console.log("currentPage", currentPage.value);
    let res = await getAttendeeListForPage(currentPage.value);
    showAttendeesList.push(...res.records);

    if (res.records.length < 10) {
      hasMoreData.value = false;
    } else {
      hasMoreData.value = true;
    }

    currentPage.value += 1; // 更新當前頁碼
  } catch (error) {
    console.log(error);
  } finally {
    isLoading.value = false; // 結束加載
  }
};

const handleInput = () => {
  getAttendeeList(true);
}


const handleUpdateList = async () => {
  await getAttendeeList(true); // 重置

  if (lastScrollData.page > 1) {
    const pageToLoad = []; // 儲存要加載的頁碼

    for (let i = 2; i <= lastScrollData.page; i++) {
      pageToLoad.push(getAttendeeListForPage(i)); // 加載頁碼 Promise
    }

    const allNewPagesData = await Promise.all(pageToLoad); // 等待所有頁碼的 Promise 完成
    allNewPagesData.forEach((pageData) => {
      showAttendeesList.push(...pageData.records); // 將新頁碼的數據添加到列表中
    });
    currentPage.value = lastScrollData.page + 1; // 更新當前頁碼

    const lastPageData = allNewPagesData[allNewPagesData.length - 1]; // 獲取最後一頁的數據
    if (lastPageData && lastPageData.length < 10) { // 如果最後一頁的數據少於 10，則表示沒有更多數據
      hasMoreData.value = false;
    } else {
      hasMoreData.value = true;// 如果還有數據，則設置為 true
    }

    await nextTick(); // 等待 DOM 更新
    if (scrollRef.value) {
      scrollRef.value.scrollTo({
        top: lastScrollData.position, // 滾動到最後一次記錄的位置
      });
    } else {
      console.log("scrollRef.value不存在");
    }
  } else {
    if (scrollRef.value) {
      scrollRef.value.scrollTo({
        top: 0,
        behavior: "smooth", // 平滑滾動到頂部
      });
    } else {
      console.log("scrollRef.value不存在");
    }
  }
}

const updateEveryMinute = () => {
  setInterval(() => {
    console.log("每分鐘更新");
    getCheckData();
    handleSaveLastScrollData();
    handleUpdateList();
  }, 60000);
};
/**-------------------------------------------------- */
let html5Qrcode: any;

const showOtherElement = ref(true);

const decodeCheckData = ref("");

onMounted(() => {
  html5Qrcode = useHtml5Code("barcode-reader");
  getCheckData();
  // getAttendeesList();
  closeSidebar();
  getAttendeeList();
  updateEveryMinute();
});

const isScannable = ref(true);
const qrCodeSuccessCallback = async (decodedText: any, decodedResult: any) => {
  if (!isScannable.value) return;
  isScannable.value = false;

  // ElMessage({
  //   message: `掃描成功QR Code scanned: ${decodedText}`,
  //   type: "success",
  // });
  console.log(`QR Code scanned: ${decodedText}`);
  console.log(decodedResult);

  submitCheckData.attendeesId = atob(decodedText);
  // ElMessage({
  //   message: `掃描成功QR Code scanned: ${decodeCheckData.value}`,
  //   type: "success",
  // });

  await checkin();

  setTimeout(() => {
    isScannable.value = true;
  }, 3000);
};

const scanBarcode = () => {
  handleSaveLastScrollData();
  html5Qrcode.start(qrCodeSuccessCallback);
  showOtherElement.value = false;
};

const handleStop = () => {
  html5Qrcode.handleStop();
  showOtherElement.value = true;
  handleUpdateList();
  getCheckData();
  checkActive.value = "checkin";
};

const checkActive = ref("checkin");

const switchCheckBtn = (type: string) => {
  checkActive.value = type;
  if (type == "checkin") {
    submitCheckData.actionType = 1;
  } else {
    submitCheckData.actionType = 2;
  }
};

watch(
  checkActive,
  (newVal) => {
    if (newVal == "checkin") {
      submitCheckData.actionType = 1;
    } else {
      submitCheckData.actionType = 2;
    }
  },
  { immediate: true }
);
</script>
<style lang="scss" scoped>
.main-section {
  width: 100%;
  min-height: 100vh;
  margin: 0 auto;
  position: relative;

  .main-card {
    min-height: 100vh;
    padding-bottom: 2%;
  }

  h1 {
    text-align: center;
    font-size: 2rem;
    margin: 1% 0;
  }
}

:deep(.el-notification) {
  z-index: 9999;
  position: fixed;
  background-color: black;
  top: 20px;
  right: 20px;
}

:deep(.el-form-item__content) {
  .el-select {
    width: 50%;
  }
}

:deep(.el-card__body) {
  padding: 0;
}

.close-btn {
  position: absolute;
  top: 3rem;
  left: 3rem;
  z-index: 99;
}

.switch-btn {
  position: absolute;
  top: 3rem;
  right: 45%;
  z-index: 99;
  display: flex;
  justify-content: center;
  gap: 0;

  .checkin-btn {
    font-size: 1.2rem;
    border-radius: 5px 0 0 5px;
  }

  .checkout-btn {
    font-size: 1.2rem;
    border-radius: 0 5px 5px 0;
    margin: 0;
  }

  .active {
    background-color: #409eff;
    color: white;
  }
}



.component-barcode-reader {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 10;

  /* 如果掃描視窗內部還有其他容器，可能需要進一步調整 */
  video {
    /* 針對 video 元素 */
    width: 100%;
    height: 100%;
    object-fit: cover;
    /* 讓 video 內容填充整個容器，可能會裁剪 */
  }

  canvas {
    /* 針對 canvas 元素 */
    width: 100% !important;
    /* 使用 !important 覆蓋內聯樣式 */
    height: 100% !important;
  }
}

.data-section {
  display: flex;
  justify-content: center;
  gap: 1rem;
  // max-height: 80vh;

  @media screen and (max-width: 425px) {
    flex-direction: column;
    align-items: center;
  }
}

.function-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-align: center;
  margin-bottom: 1rem;

  .el-form-item {
    margin: 0;
  }

  .el-input {
    font-size: 1.2rem;
    margin-right: 1rem;
  }
}

.checkin-table-box {
  margin-top: 1rem;
  padding: 1rem;
  border: 1px solid #e4e7ed;
  // max-height: 60%;
  width: 35%;
  position: relative;

  @media screen and (max-width: 1024px) {
    width: 45%;
  }

  @media screen and (max-width: 768px) {
    flex: 1;
  }

  @media screen and (max-width: 425px) {
    width: 90%;
  }

  .scroll-box {
    height: 60vh;
  }

  .scan-btn-box {
    display: flex;
    justify-content: center;
  }

  .checkin-data-card {
    padding: 0.1rem 0.5rem;

    :deep(.el-card__body) {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .member-info {
        flex: 2;
        padding: 0.1rem 1rem;
      }

      .checkin-icon {
        font-size: 2.5rem;
        color: gray;
      }

      .checkin {
        color: green !important;
      }
    }
  }

  .scan-btn {
    width: 5rem;
    height: 5rem;
    aspect-ratio: 1/1;
    // position: absolute;
    // bottom: 1rem;
    // right: 43%;
    background-color: #409eff;
    color: white;
  }
}

.stats-data-box {
  width: 35%;
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
  width: 70%;
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
  width: 70%;
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

.option-dialog {
  .btn-section {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 1rem;

    .el-button {
      margin: 0;
      padding: 5rem;

      .content {
        display: flex;
        flex-direction: column;
      }



      .img-box {
        width: 5rem;
        height: 5rem;
        display: flex;
        justify-content: center;
        align-items: center;

        img {
          width: 1.5rem;
          height: 1.5rem;
        }

        .icon {
          font-size: 1.5rem;
        }
      }
    }
  }
}

.attendee-name {
  font-size: 1.2rem;
  font-weight: bold;
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

.insert-form {
  width: 100%;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;

  :deep(.el-form-item__label) {
    font-size: 1.2rem;
  }

  .el-form-item {
    width: 100%;
    margin-bottom: 0.5rem;
    text-align: left;

    .el-input {
      width: 100%;
    }
  }
}

.dialog-footer {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;

  .el-button {
    // width: 10rem;
    // height: 3rem;
    font-size: 1.2rem;
    border-radius: 5px;
    padding: 1.5rem;
    text-align: center;

    &:first-child {
      background-color: #f56c6c;
      color: white;
    }
  }
}
</style>
