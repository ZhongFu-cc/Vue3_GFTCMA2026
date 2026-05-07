<template>
  <main>
    <el-form label-position="left" label-width="120px">
      <el-form-item label="連接方式">
        <el-radio-group v-model="connectionType" @change="handleConnectionTypeChange">
          <el-radio v-for="type in connectionTypes" :key="type.key" :label="type.label" :value="type.value" />
        </el-radio-group>
      </el-form-item>

      <el-form-item v-if="connectionType === 'usb'" label="USB印表機">
        <el-select v-model="selectedPrinter" placeholder="請選擇印表機">
          <el-option v-for="printer in usbPrinters" :key="printer.path" :label="printer.name" :value="printer" />
        </el-select>
      </el-form-item>

      <el-form-item v-if="connectionType === 'driver'" label="驅動印表機">
        <el-select v-model="selectedPrinter" placeholder="請選擇印表機">
          <el-option v-for="printer in driverPrinters" :key="printer.path" :label="printer.name" :value="printer" />
        </el-select>
      </el-form-item>

      <el-form-item label="連接狀態">
        <el-tag :type="isConnected ? 'success' : 'danger'">
          {{ isConnected ? '已連接' : '未連接' }}
        </el-tag>
        <span v-if="printerError" class="error-text">{{ printerError }}</span>
      </el-form-item>
    </el-form>
  </main>
</template>
<script lang="ts" setup>
import { useTSC } from '@/composables/useTSC';

// 連接方式
const connectionTypes = [
  { key: 1, label: 'USB', value: 'usb' },
  { key: 2, label: '驅動', value: 'driver' },
  { key: 3, label: '網路', value: 'network' },
]

const {
  isConnected, isLoading: isPrinterLoading, error: printerError, printLabel, selectedPrinter, usbPrinters, driverPrinters, connectionType, setConnectionType, initializePrinters, labelConfig
} = useTSC({
  connectionType: 'usb',
  labelConfig: {
    dpi: 300,
    widthMm: 80,
    heightMm: 60,  // 與 labelSettings 一致！
    marginLeftMm: 2,
    marginRightMm: 2
  }
})

const printList = ref<any[]>([])

// 監聽連接方式變化
const handleConnectionTypeChange = (value: string | number | boolean | undefined) => {
  console.log('連接方式變更:', value);
  if (typeof value === 'string') {
    setConnectionType(value as 'usb' | 'network' | 'driver');
    fetchPrinters();
  }
}

const fetchPrinters = () => {
  if (usbPrinters.value.length > 0) {
    printList.value = [...usbPrinters.value];
  } else if (driverPrinters.value.length > 0) {
    printList.value = [...driverPrinters.value];
  }
}

onMounted(async () => {
  await initializePrinters();
  fetchPrinters();
})

</script>