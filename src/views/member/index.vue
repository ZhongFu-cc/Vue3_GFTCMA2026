<!--  -->
<template>
  <div class="content">

    <BasicComponent title="會員管理" :totalCount="memberRes.total + '人'">
      <template v-slot:search-box>
        <div class="search-box">
          <el-input v-model="fetchConditions.input" placeholder="輸入內容,Enter查詢"
            @input="fetchMemberListWithPaginationAndStatus" />

          <el-select v-model="fetchConditions.filterStatus" class="filter-status" placeholder="請選擇">
            <el-option v-for="status in statusList" :label="status.label" :value="status.value" />
          </el-select>
        </div>
      </template>

      <template v-slot:option-box>
        <div class="btn-box">
          <el-button class="btn-insert" type="primary" @click="insertMemberDialogState.openDialog">
            新增<el-icon>
              <Plus />
            </el-icon>
          </el-button>

          <el-button type="danger" @click="batchDeleteMember" :disabled="deleteButtonIsDisabled">
            刪除<el-icon class="el-icon--right">
              <Delete />
            </el-icon>
          </el-button>

          <el-button type="success" @click="downloadExcel">下載Excel</el-button>

          <el-button type="success" @click="importExcelDialogState.openDialog">匯入會員名單</el-button>
        </div>
      </template>

      <template v-slot:data-table>
        <MemberTable :member-data="memberRes.records" view-page="index" @open-tag-dialog="tagDialogState.openDialog"
          @open-edit-dialog="updateMemberDrawerState.openDrawer" @delete-member="deleteMember"
          @mutli-delete-members="handleSelectionChange" />
      </template>

      <template v-slot:pagination-box>
        <el-pagination layout="prev, pager, next" @current-change="handlePageChange"
          :page-count="Number(memberRes.pages)" :default-page-size="Number(memberRes.size)"
          :hide-on-single-page="false" />
      </template>
    </BasicComponent>

    <el-dialog v-model="tagDialogState.isOpen" title="編輯標籤" :width="tagDialogState.width"
      :before-close="tagDialogState.closeDialog">
      <h1>{{ assignMember.name }}</h1>
      <div class="transfer-box">
        <el-transfer ref="transferPanelRef" v-model="assignMember.tagList" :data="transferDataList"
          :titles="['未擁有', '已擁有']">
          <template #default="{ option }">
            <el-popover v-if="option.isOverParentElementWidth" class="box-item" placement="top" :width="option.width">
              <template #reference>
                <el-tag :color="option.color" size="large" round>{{ option.label }}</el-tag>
              </template>
              <template #default>
                <el-tag :color="option.color" size="large" round>{{ option.label }}</el-tag>
              </template>
            </el-popover>
            <el-tag v-else :color="option.color" size="large" round>{{ option.label }}</el-tag>
          </template>
          <template #left-empty>
            <el-empty :image-size="60" description="No data" />
          </template>
          <template #right-empty>
            <el-empty :image-size="60" description="No data" />
          </template>
        </el-transfer>
      </div>
      <template #footer>
        <el-button @click="tagDialogState.closeDialog">取消</el-button>
        <el-button type="primary" @click="submitTagsList">保存</el-button>
      </template>
    </el-dialog>



    <!-- 修改時的Drawer -->
    <el-drawer v-model="updateMemberDrawerState.isOpen" title="更改資料" :size="updateMemberDrawerState.width"
      :before-close="updateMemberDrawerState.closeDrawer">
      <UpdateMemberForm :member-data="updateMemberForm" @update-member="handleUpdateSubmit" />
    </el-drawer>


    <el-dialog v-model="insertMemberDialogState.isOpen" title="新增會員" :width="insertMemberDialogState.width">
      <InsertMemberForm @close="insertMemberDialogState.closeDialog" />
    </el-dialog>

    <!-- 匯入會員名單對話框 -->
    <el-dialog v-model="importExcelDialogState.isOpen" title="匯入會員名單" :width="importExcelDialogState.width">
      <div class="template-tips-content">
        <el-button type="warning" @click="downloadImportTemplate">下載匯入模板</el-button>
      </div>
      <div class="upload-excel-content">
        <el-upload ref="uploadRef" drag class="upload-demo" :limit="1" :on-change="handleUpload"
          :auto-upload="false" :on-remove="handleRemove">
          <el-icon class="el-icon--upload"><upload-filled /></el-icon>
          <div class="el-upload__text">
            Drop file here or <em>click to upload</em>
          </div>
        </el-upload>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="danger" plain @click="importExcelDialogState.closeDialog()">取消</el-button>
          <el-button type="success" plain @click="handleImportExcel">確定</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 匯入結果對話框 -->
    <el-dialog v-model="importExcelResultDialogState.isOpen" title="匯入結果" width="50%">
      <div v-if="importExcelResultDialogState.resultData">
        <p>總共 {{ importExcelResultDialogState.resultData.totalCount }} 筆資料</p>
        <p>成功匯入 {{ importExcelResultDialogState.resultData.importedCount }} 筆</p>
        <p>跳過 {{ importExcelResultDialogState.resultData.skippedCount }} 筆</p>
        <p>Email重複(仍已匯入) {{ importExcelResultDialogState.resultData.duplicateEmailCount }} 筆</p>

        <div v-if="importExcelResultDialogState.resultData.skippedRows.length > 0">
          <h3>跳過的資料</h3>
          <el-table :data="importExcelResultDialogState.resultData.skippedRows" size="small" max-height="240">
            <el-table-column prop="rowNumber" label="列號" width="80" />
            <el-table-column prop="email" label="Email" />
            <el-table-column prop="chineseName" label="中文姓名" width="120" />
            <el-table-column prop="reason" label="原因" />
          </el-table>
        </div>

        <div v-if="importExcelResultDialogState.resultData.duplicateEmailRows.length > 0">
          <h3>Email重複的資料(已匯入)</h3>
          <el-table :data="importExcelResultDialogState.resultData.duplicateEmailRows" size="small" max-height="240">
            <el-table-column prop="rowNumber" label="列號" width="80" />
            <el-table-column prop="email" label="Email" />
            <el-table-column prop="chineseName" label="中文姓名" width="120" />
            <el-table-column prop="reason" label="原因" />
          </el-table>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" plain @click="importExcelResultDialogState.closeDialog()">確定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang='ts'>
import BasicComponent from '@/layout/components/Basic/index.vue'

import { ref, reactive } from 'vue'
import { Delete, Plus, UploadFilled } from '@element-plus/icons-vue'
import type { UploadProps } from 'element-plus'
import { fetchMembersWithPaginationAndStatusApi, updateMemberApi, deleteMemberApi, batchDeleteMemberApi, downloadMemberExcelApi, downloadMemberImportExcelTemplateApi, importMemberExcelApi, assignTagsToMember } from '@/api/member'
import { getAllTagsApi } from '@/api/tag'


import { Member, PutMemberForAdminInterface, MemberImportResultVO } from '@/api/member/type'
import { tryCatch } from '@/utils/tryCatch'
import InsertMemberForm from './components/InsertMemberForm.vue'
import UpdateMemberForm from './components/UpdateMemberForm.vue'
import MemberTable from './components/MemberTable.vue'
import { useAppStore } from '@/store'




const downloadExcel = async () => {
  let res = await downloadMemberExcelApi()
  const url = window.URL.createObjectURL(new Blob([res.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', '會員列表.xlsx');
  document.body.appendChild(link);
  link.click();
}

/**------------------- 匯入會員名單 ----------------------- */

const downloadImportTemplate = async () => {
  try {
    let res = await downloadMemberImportExcelTemplateApi()
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', '會員名單匯入模板.xlsx');
    document.body.appendChild(link);
    link.click();
  } catch (error) {
    ElMessage.error("下載失敗" + error)
  }
}

const importExcelDialogState = ref<DialogState>({
  isOpen: false,
  width: computed(() => (useAppStore().device === 'mobile') ? '90%' : '45%'),
  openDialog: () => {
    importExcelDialogState.value.isOpen = true
  },
  closeDialog: () => {
    importExcelDialogState.value.isOpen = false
    uploadRef.value?.clearFiles()
    uploadFileList.value = []
  }
})

const importExcelResultDialogState = ref({
  isOpen: false,
  resultData: null as MemberImportResultVO | null,
  openDialog: (data: MemberImportResultVO) => {
    importExcelResultDialogState.value.resultData = data
    importExcelResultDialogState.value.isOpen = true
  },
  closeDialog: () => {
    importExcelResultDialogState.value.isOpen = false
    importExcelResultDialogState.value.resultData = null
    fetchMemberListWithPaginationAndStatus()
    importExcelDialogState.value.closeDialog()
  }
})

const uploadRef = ref()
const uploadFileList = ref<any>([])

const handleUpload: UploadProps['onChange'] = (file, uploadFiles) => {
  if (file.size == 0) {
    ElMessage.error('File is empty')
    return false
  }
  if (file.status === 'ready' && file.size) {
    if (file.name.split('.').pop() !== 'xlsx' && file.name.split('.').pop() !== 'xls') {
      ElMessage.error('File must be xlsx')
      uploadFiles.pop()
      return
    }
    uploadFileList.value.push(file)
  }
}

const handleRemove: UploadProps['onRemove'] = (file, fileList) => {
  uploadFileList.value = fileList
}

const handleImportExcel = async () => {
  if (uploadFileList.value.length === 0) {
    ElMessage.error('請先選擇檔案')
    return
  }
  try {
    const data = new FormData()
    uploadFileList.value.forEach((file: any) => data.append('file', file.raw))
    let res = await importMemberExcelApi(data)
    ElMessage.success("上傳成功")
    importExcelResultDialogState.value.openDialog(res.data)
    uploadRef.value?.clearFiles()
    uploadFileList.value = []
  } catch (error) {
    ElMessage.error("上傳失敗" + error)
  }
}


/**---------------------------
 * @description 管理獲取資料 
 *
 * @returns fetchConditions, memberRes, fetchMemberListWithPaginationAndStatus, handlePageChange
 * 
*/
const useFetchDataManagement = () => {

  // 會員列表返回的數據結構
  interface MemberResInterface {
    current: number;
    pages: number;
    records: Array<Member>;
    size: number;
    total: number;
  }

  // 分頁及篩選條件
  const fetchConditions = ref({
    currentPage: 1,
    input: '',
    filterStatus: ''
  })

  // 會員列表數據
  const memberRes = ref<MemberResInterface>({
    current: 1,
    pages: 1,
    records: [],
    size: 10,
    total: 0
  })

  // 根據分頁及篩選條件獲取會員列表
  const fetchMemberListWithPaginationAndStatus = async () => {
    const { res, error }: any = await tryCatch(fetchMembersWithPaginationAndStatusApi(fetchConditions.value.currentPage, 10, fetchConditions.value.filterStatus, fetchConditions.value.input));
    if (error || res.code !== 200) {
      ElMessage.error(error || res.msg || '獲取會員列表失敗');
    }
    memberRes.value = res.data;
  }

  // 頁碼改變時的處理函數
  const handlePageChange = (page: number) => {
    fetchConditions.value.currentPage = page;
    fetchMemberListWithPaginationAndStatus();
  }

  // 監聽輸入框變化，重置頁碼並重新獲取會員列表
  watch(() => fetchConditions.value.filterStatus, (newVal, oldVal) => {
    fetchConditions.value.currentPage = 1;
    fetchMemberListWithPaginationAndStatus();
  })

  return {
    fetchConditions,
    memberRes,
    fetchMemberListWithPaginationAndStatus,
    handlePageChange
  }
}

const { fetchConditions, memberRes, fetchMemberListWithPaginationAndStatus, handlePageChange } = useFetchDataManagement();



/** --------- 刪除相關variable及function -------------- */
const useDeleteMemberManagement = () => {

  const selectedDeleteMemberList = ref<Member[]>([])

  const deleteMember = async (memberId: string) => {
    ElMessageBox.confirm(`確定要刪除此資料嗎？`, '確認刪除', {
      confirmButtonText: '確定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(async () => {
      // 用户選擇確認，繼續操作
      console.log('Deleting member with ID:', memberId);
      const { res, error }: any = await tryCatch(deleteMemberApi(memberId));
      if (error || res.code !== 200) {
        ElMessage.error(error || res.msg || '刪除會員失敗');
        return;
      }
      fetchMemberListWithPaginationAndStatus();
      ElMessage.success('刪除成功');
    }).catch((err) => {
    });
  }

  const handleSelectionChange = (val: Member[]) => {
    selectedDeleteMemberList.value = val;
  }

  const batchDeleteMember = async () => {
    if (selectedDeleteMemberList.value.length < 1) {
      ElMessage.error("請至少勾選一筆資料進行刪除");
      return;
    }
    ElMessageBox.confirm(`確定要刪除這${selectedDeleteMemberList.value.length}個會員資料嗎？`, '確認刪除', {
      confirmButtonText: '確定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(async () => {
      //確定刪除後使用父組件傳來的function
      //提取idList
      let deleteIdList = selectedDeleteMemberList.value.map(item => item.memberId);
      const { res, error }: any = await tryCatch(batchDeleteMemberApi(deleteIdList));
      if (error || res.code !== 200) {
        ElMessage.error(error || res.msg || '批量刪除會員失敗');
        return;
      }
      fetchMemberListWithPaginationAndStatus();
      ElMessage.success('刪除成功');
    }).catch((err) => {
    });
  }

  return {
    selectedDeleteMemberList,
    deleteMember,
    handleSelectionChange,
    batchDeleteMember
  }
}

const { selectedDeleteMemberList, deleteMember, handleSelectionChange, batchDeleteMember } = useDeleteMemberManagement();



/**-------------表單相關variable及function------------------------- */

const insertMemberDialogState = ref<DialogState>({
  isOpen: false,
  width: computed(() => (useAppStore().device === 'mobile') ? '90%' : '45%'),
  openDialog: () => {
    insertMemberDialogState.value.isOpen = true
  },
  closeDialog: () => {
    insertMemberDialogState.value.isOpen = false
    fetchMemberListWithPaginationAndStatus()
  }
})




/**------------編輯內容相關操作---------------------- */
const updateMemberDrawerState = ref<DrawerState>({
  isOpen: false,
  width: computed(() => (useAppStore().device === 'mobile') ? '90%' : '45%'),
  openDrawer: (member: Member) => {
    updateMemberDrawerState.value.isOpen = true
    Object.assign(updateMemberForm, member)
  },
  closeDrawer: () => {
    updateMemberDrawerState.value.isOpen = false
  }
})

//編輯的表單元素本身

let updateMemberForm = reactive<Member>({
  memberId: "",
  email: "",
  chineseName: "",
  firstName: "",
  lastName: "",
  country: "",
  remitAccountLast5: "",
  affiliation: "",
  jobTitle: "",
  phone: "",
  status: 0,
  food: "",
  foodTaboo: "",
  receipt: "",
  idCard: "",
  category: 1,
  amount: 0,
  title: "",
  tagList: [],
  countryCode: "",
})


// 更新資料
const handleUpdateSubmit = async (updateData: PutMemberForAdminInterface) => {
  const { res, error }: any = await tryCatch(updateMemberApi(updateData));

  if (error || res.code !== 200) {
    ElMessage.error(error || res.msg || "修改會員資料失敗");
    return;
  }
  ElMessage.success("修改完成");
  fetchMemberListWithPaginationAndStatus();
  updateMemberDrawerState.value.closeDrawer();
}





/**-------------------標籤-------------------- */
// let tagsDialogIsOpen = ref(false);
let assignMember = reactive<any>({});

let tagsList = reactive<any>([]);

let transferDataList = reactive<any>([]);



const getTagsList = async () => {
  let res = await getAllTagsApi()
  Object.assign(tagsList, res.data);
  res.data.forEach((item: any) => {
    transferDataList.push({
      label: item.name,
      key: item.tagId,
      disabled: item.status === 1,
      color: item.color,
      isOverParentElementWidth: false,
      width: 0
    })
  })
}

const findFirstVaildTag = (tagList: any) => {
  for (let i = 0; i < tagList.length; i++) {
    if (tagList[i].status === 0) {
      return tagList[i];
    }
  }
  return '';
}

const tagDialogState = ref<DialogState>({
  isOpen: false,
  width: computed(() => (useAppStore().device === 'mobile') ? '90%' : '70%'),
  openDialog: (member: Member) => {
    tagDialogState.value.isOpen = true;
    Object.assign(assignMember, member);
    if (member.tagList) {
      assignMember.tagList = Array.from(member.tagList).map((item: any) => item.tagId);
    }
  },
  closeDialog: () => {
    fetchMemberListWithPaginationAndStatus()
    tagDialogState.value.isOpen = false;
  }
});


const submitTagsList = async () => {
  let data = {
    memberId: assignMember.memberId,
    targetTagIdList: assignMember.tagList
  }

  const { res, error }: any = await tryCatch(assignTagsToMember(data));
  if (error || res.code !== 200) {
    ElMessage.error(error || res.msg || '分配標籤失敗');
    return;
  }
  tagDialogState.value.closeDialog();

}

/**====================處理新增與修改RWD================== */

const transferPanelRef = ref();
watch(() => transferPanelRef.value, (newVal) => {
  if (newVal) {
    // 獲取所有的 transfer body 元素
    const transferPanelBodyList = transferPanelRef.value.$el.querySelectorAll('.el-transfer-panel__body');
    // 遍歷 body 元素
    transferPanelBodyList.forEach((transferPanelBody: any) => {
      // 獲取 body 寬度
      const transferPanelBodyWidth: number = Number(getComputedStyle(transferPanelBody).width.split('px')[0]);
      //獲取裡面所有的 tag label
      const transferPanelBodyItemTagContent = transferPanelBody.querySelectorAll('.el-tag__content');
      // 遍歷所有的 tag 元素找出寬度超過父元素的
      transferPanelBodyItemTagContent.forEach((item: any, index: number) => {
        const width = Number(getComputedStyle(item).width.split('px')[0]);
        if (width > transferPanelBodyWidth) {
          let foundTag = transferDataList.find((tag: any) => tag.label === item.textContent);
          foundTag.isOverParentElementWidth = true;
          foundTag.width = width + 40;
        }
      });

    });
  }
});

/**-------------------掛載頁面時執行-------------------- */

onMounted(() => {
  fetchMemberListWithPaginationAndStatus()
  getTagsList()
})


// 狀態選擇
const statusList = ref<{ label: string, value: string }[]>([
  {
    label: '全選',
    value: ''
  }, {
    label: '未繳費',
    value: '0'
  }, {
    label: '待審核',
    value: '1'
  }, {
    label: '繳費成功',
    value: '2'
  }, {
    label: '繳費失敗',
    value: '3'
  }
])

const deleteButtonIsDisabled = computed(() => {
  return selectedDeleteMemberList.value.length > 0 ? false : true;
});

const isDevice = computed(() => useAppStore().device === 'mobile' ? true : false);




</script>

<style scoped lang="scss">
.member-section {
  width: 95%;
  margin: 0 auto;

  .member-card {
    margin-top: 2%;
    margin-bottom: 2%;
  }

  h1 {
    text-align: center;
    font-size: 2rem;
    margin: 1% 0;
  }
}




.function-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1%;

  .total-count {
    font-weight: 600;
  }



}

.search-box {
  display: flex;
  align-items: center;
  gap: 1rem;

  .el-input,
  .el-select {
    width: 15rem;
  }

  @media screen and (max-width: 760px) {
    flex-direction: column;
  }
}

.member-table {
  width: 100%;
  height: auto;
}


.member-pagination {
  margin-top: 1%;
  margin-bottom: 1%;
}

.gender-other {
  width: 100px;
  margin-left: 1rem;
}

.transfer-box {
  display: flex;
  justify-content: center;
}

.tag-item {
  display: flex;
}

/**
  使用Vue3 element plus 專屬的改變UI組件CSS 寫法 '深層覆蓋'
  分頁組件引入盒子,重置分頁組件CSS */
:deep(.el-pagination) {

  justify-content: center;

  //重製將分頁組件背景色調為 '無'
  .el-pager li {
    background: none !important;
  }

  //按鈕背景色改成 '無'
  button {
    background: none !important;
  }

  &+& {
    margin-top: 10px;
  }

  .example-demonstration {
    margin-bottom: 16px;
  }

}

:deep(.el-tag__content) {
  color: white;
  font-size: 14px;
}

:deep(.el-tag__close) {
  color: red;
}

.insert-form {
  padding: 2rem;
  width: 80%;
  margin-inline: auto;

  .el-select {
    width: 100%;
  }

  .el-input {
    width: 100%;
  }

  .category {

    :deep(.el-radio-group) {
      flex-direction: column;
      display: flex;
      justify-content: flex-start;
      align-items: flex-start;
    }

    :deep(.el-form-item__error) {
      position: absolute;
      top: 0.5rem;
      left: 10rem;
      width: 20rem;

      @media screen and (max-width: 768px) {
        left: 13rem;
      }
    }

    :deep(.el-select) {
      width: 150px;
    }

  }

  .phone-section {
    display: flex;
    align-items: center;
    margin-bottom: 1rem;
    gap: 1rem;

    .country-code {
      width: 30%;
    }

    .phone {
      width: 70%;
    }
  }

  .title-form-item {
    width: 100%;

    .title-radio-group {
      width: 100%
    }
  }


}

// 設置 transfer 面板寬度
:deep(.el-transfer-panel) {
  width: 300px;

  .el-transfer-panel__body {
    overflow: hidden;
  }

}

// 設置 transfer 面板內列表為 column 並設置間距
:deep(.el-transfer-panel__list) {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

:deep(.el-transfer__buttons) {
  @media screen and (max-width: 760px) {
    display: flex;
    justify-content: center;
    margin: 1rem 0;

    .el-button {
      &:first-child {
        .el-icon {
          transform: rotate(90deg);
        }
      }

      &:last-child {
        .el-icon {
          transform: rotate(90deg);
        }
      }
    }
  }

}


// 設置 table 內的標籤顯示為可滑動區塊
.tag-popover-box {
  overflow: scroll !important;
}
</style>
