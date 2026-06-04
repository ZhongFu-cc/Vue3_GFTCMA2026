<template>
  <section class="update-member-form-section">
    <el-form class="update-member-form" ref="updateFormRef" :model="updateFormData" label-position="top">
      <div class="update-member-form-left">
        <el-form-item label="E-Mail" prop="mail">
          <el-input v-model="props.memberData.email" disabled />
        </el-form-item>

        <!-- <el-form-item label="稱謂" prop="title" :rules="[{ required: true, message: '請輸入稱謂', trigger: 'blur' }]">
          <el-radio-group v-model="updateFormData.title">
            <el-radio v-for="title in titles" :key="title" :label="title" :value="title">{{ title }}</el-radio>
          </el-radio-group>
        </el-form-item> -->

        <el-form-item label="英文名字" prop="firstName" :rules="[{ required: true, message: '請輸入英文名字', trigger: 'blur' }]">
          <el-input v-model="updateFormData.firstName" />
        </el-form-item>

        <el-form-item label="英文姓氏" prop="lastName" :rules="[{ required: true, message: '請輸入英文姓氏', trigger: 'blur' }]">
          <el-input v-model="updateFormData.lastName" />
        </el-form-item>

        <el-form-item label="中文姓名" prop="chineseName">
          <el-input v-model="updateFormData.chineseName" />
        </el-form-item>

        <el-form-item label="身分證/證照號碼" prop="idCard">
          <el-input v-model="updateFormData.idCard" />
        </el-form-item>

        <el-form-item label="國家" prop="country" :rules="[{ required: true, message: '請輸入國家', trigger: 'blur' }]">
          <el-select v-model="updateFormData.country" filterable>
            <el-option v-for="country in countries" :key="country" :label="country" :value="country" />
          </el-select>
        </el-form-item>

        <el-form-item label="職稱" prop="jobTitle">
          <el-input v-model="updateFormData.jobTitle" />
        </el-form-item>
      </div>

      <div class="update-member-form-right">
        <el-form-item label="單位名稱" prop="affiliation">
          <el-input v-model="updateFormData.affiliation" />
        </el-form-item>

        <el-form-item label="電話" prop="phone">
          <el-input v-model="updateFormData.phone" />
        </el-form-item>

        <!-- <el-form-item label="匯款帳號後五碼" prop="remitAccountLast5">
          <el-input v-model="updateFormData.remitAccountLast5" />
        </el-form-item> -->

        <!-- <el-form-item label="抬頭" prop="receipt">
          <el-input v-model="updateFormData.receipt" />
        </el-form-item> -->

        <el-form-item label="會員類別">
          <el-input v-model="memberEnums[props.memberData.category]" disabled />
        </el-form-item>

        <!-- <el-form-item label="補充類別">
          <el-input v-model="updateFormData.categoryExtra" />
        </el-form-item> -->

        <el-form-item label="註冊費">
          <el-input v-model="props.memberData.amount" disabled />
        </el-form-item>

        <el-form-item label="備註" prop="remark">
          <el-input type="textarea" :rows="4" v-model="updateFormData.remark" />
        </el-form-item>
      </div>
    </el-form>
    <div class="btn-box">
      <el-button type="primary" plain @click="handleUpdateSubmit(updateFormRef)">更新會員資料</el-button>
    </div>
  </section>
</template>
<script lang="ts" setup>
import { PutMemberForAdminInterface } from '@/api/member/type';
import { FormInstance } from 'element-plus';
import countriesData from '@/assets/data/countries.json'
import { memberEnums } from '@/enums/MemberEnum';

const countries = ref(countriesData)
const titles = ['Mr.', 'Ms.', 'Mrs.', 'Dr.', 'Prof.'];

const emits = defineEmits(['updateMember']);

const props = defineProps<{
  memberData: any;
}>();


const updateFormRef = ref<FormInstance>();

const updateFormData = ref<PutMemberForAdminInterface>({
  memberId: '',
  idCard: '',
  title: '',
  chineseName: null,
  firstName: '',
  lastName: '',
  country: '',
  remitAccountLast5: null,
  categoryExtra: null,
  affiliation: null,
  jobTitle: null,
  phone: null,
  remark: null,
  receipt: null,
  food: '',
  foodTaboo: '',
})

watch(
  () => props.memberData,
  (newVal) => {
    if (newVal) {
      updateFormData.value = {
        memberId: newVal.memberId,
        idCard: newVal.idCard,
        title: newVal.title,
        chineseName: newVal.chineseName,
        firstName: newVal.firstName,
        lastName: newVal.lastName,
        country: newVal.country,
        remitAccountLast5: newVal.remitAccountLast5,
        categoryExtra: newVal.categoryExtra,
        affiliation: newVal.affiliation,
        jobTitle: newVal.jobTitle,
        phone: newVal.phone,
        remark: newVal.remark,
        receipt: newVal.receipt,
        food: newVal.food,
        foodTaboo: newVal.foodTaboo,
      }
    }
  },
  { immediate: true, deep: true }
);

const handleUpdateSubmit = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate((valid: boolean) => {
    if (valid) {
      emits('updateMember', updateFormData.value);
      updateFormRef.value?.resetFields();
    } else {
      ElMessage.error('表單驗證失敗，請檢查輸入內容');
    }
  });
}



</script>
<style lang="scss" scoped>
.update-member-form-section {
  padding: 1rem;

  .update-member-form {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;

    .update-member-form-left,
    .update-member-form-right {
      flex: 1;
      min-width: 300px;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
  }
}
</style>