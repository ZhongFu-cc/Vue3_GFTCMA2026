<template>
  <section class="member-table-section">
    <el-table :data="props.memberData" @selection-change="$emit('mutli-delete-members', $event)" class="member-table">
      <el-table-column type="selection" width="30" />
      <el-table-column v-if="isIndexView" fixed prop="firstName" label="名字" :width="isDevice ? '90' : ''"
        :show-overflow-tooltip="isDevice" />
      <el-table-column v-if="isIndexView" fixed prop="lastName" label="姓氏" width="90" />
      <el-table-column prop="chineseName" label="中文姓名" width="100">
        <template #default="scope">
          <span v-if="scope.row.chineseName">{{ scope.row.chineseName }}</span>
          <span v-else>{{ scope.row.firstName }} {{ scope.row.lastName }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="!isIndexView" label="繳費金額" width="150" prop="amount"></el-table-column>
      <el-table-column prop="email" label="信箱" width="250" />
      <el-table-column prop="country" label="國家" width="100" />
      <el-table-column prop="remitAccountLast5" label="帳戶後五碼" width="100" />
      <!-- <el-table-column v-if="!isIndexView" prop="idCard" label="身分證字號" width="200" /> -->
      <el-table-column v-if="!isIndexView" prop="category" label="會員類別" width="200">
        <template #default="scope">
          {{ memberEnums[scope.row.category] }}
        </template>
      </el-table-column>
      <el-table-column v-if="!isIndexView" prop="phone" label="手機" width="140" />

      <el-table-column v-if="isIndexView" prop="status" label="繳費狀態" width="120">
        <template #default="scope">
          <span v-if="scope.row.status == 1" style="color: gray;">已繳費-待確認</span>
          <span v-else-if="scope.row.status == 2" style="color: green;">繳費成功</span>
          <span v-else-if="scope.row.status == 3" style="color: red;">繳費失敗</span>
          <span v-else>未繳費</span>
        </template>
      </el-table-column>

      <el-table-column v-if="isIndexView" prop="tagList" label="標籤" min-width="40" align="center" width="150">
        <template #default="scope">
          <el-popover v-if="scope.row.tagList.length > 0" placement="left-start" title="標籤" :width="200" trigger="hover"
            class="tag-popover">
            <template #reference>
              <el-tag v-if="findFirstVaildTag(scope.row.tagList)" size="large" round
                :color="findFirstVaildTag(scope.row.tagList).color" effect="light">{{
                  findFirstVaildTag(scope.row.tagList).name }}</el-tag>
              <span v-else></span>
            </template>
            <template #default>
              <div class="tag-popover-box">
                <div v-for="tag in scope.row.tagList" :key="tag.tagId" class="tag-item">
                  <el-tag v-if="tag.status === 0" size="large" round :color="tag.color">{{
                    tag.name }}</el-tag>
                </div>
              </div>

            </template>
          </el-popover>
        </template>
      </el-table-column>


      <el-table-column fixed="right" label="操作" width="200">
        <!-- 透過#default="scope" , 獲取到當前的對象值 , scope.row則是拿到當前那個row的數據  -->
        <template #default="scope">
          <div v-if="isIndexView">
            <el-button link type="success" size="small" @click="emits('open-tag-dialog', scope.row)">
              Tags
            </el-button>
            <el-button link type="primary" size="small" @click="emits('open-edit-dialog', scope.row)">
              Update
            </el-button>
            <el-button link type="danger" size="small" @click="emits('delete-member', scope.row.memberId)">
              Delete</el-button>
          </div>

          <div v-else>
            <el-button type="primary" size="small" @click="emits('update-unpaid-member', scope.row.memberId)">
              通過
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </section>
</template>
<script setup lang='ts'>
import { Member } from '@/api/member/type';
import { memberEnums } from '@/enums/MemberEnum';
import { useAppStore } from '@/store';

const props = defineProps<{
  memberData: Member[],
  viewPage: string
}>()

const emits = defineEmits(['open-tag-dialog', 'open-edit-dialog', 'delete-member', 'mutli-delete-members', 'update-unpaid-member']);

const findFirstVaildTag = (tagList: any) => {
  for (let i = 0; i < tagList.length; i++) {
    if (tagList[i].status === 0) {
      return tagList[i];
    }
  }
  return '';
}

const isDevice = computed(() => useAppStore().device === 'mobile' ? true : false);
const isIndexView = computed(() => props.viewPage === 'index' ? true : false);
</script>
<style scoped lang="scss">
.el-tag {
  color: white;
}
</style>