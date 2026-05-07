<template>
  <div>
    <PrinterSetting />
    <PrintPreview :labelConfig="labelConfig" :labelSettings="labelSettings" />
    <LabelSetting />
  </div>
</template>
<script lang="ts" setup>
import PrinterSetting from './components/printerSetting.vue';
import PrintPreview from './components/printPreview.vue';
import LabelSetting from './components/labelSetting.vue';

import { useTSC } from '@/composables/useTSC';
import { ElNotification } from 'element-plus';

const { labelConfig, isConnected, connectionType, selectedPrinter } = useTSC({
  connectionType: 'usb',
  labelConfig: {
    dpi: 300,
    widthMm: 80,
    heightMm: 60,  // 與 labelSettings 一致！
    marginLeftMm: 2,
    marginRightMm: 2
  }
})

/**
 * 多行獨立設定的標籤配置
 * 每行可以獨立設定文字內容、位置和字體大小
 * lines 陣列中的每個物件代表一行文字的設定，包括:
 * - text: 文字內容
 * - textType: 文字類型 (用於識別和顯示)
 * - textInfo: 顯示用的文字資訊 (可選)
 * - x: X 軸位置 (mm)
 * - y: Y 軸位置 (mm)
 * - fontSize: 字體大小
 */
const labelSettings = reactive({
  width: 80,      // 標籤寬度 (mm)
  height: 60,     // 標籤高度 (mm)
  lines: [
    {
      text: 'English Name', // 第一行文字內容
      textType: 'userName',
      textInfo: {
        textType: 'userName',
        textShow: 'English Name'
      },
      x: 3,
      y: 2,
      fontSize: 155
    },
    {
      text: '中文名',
      textType: 'chineseName',
      textInfo: {
        textType: 'chineseName',
        textShow: '中文名'
      },
      x: 8,
      y: 15,
      fontSize: 130
    }
  ]
})

const printLabelWithMultiLineSettings = async (lines: Array<{ text: string, x: number, y: number, fontSize: number }>) => {
  if (!isConnected.value) {
    console.log('印表機未連接')
    return false
  }

  try {
    // 導入 TSC 相關函數來直接操作
    const { tsc } = await import("@/utils/TSC")

    tsc.init()

    // 設定印表機連接
    switch (connectionType.value) {
      case 'usb':
        if (selectedPrinter.value?.path) {
          tsc.openport_usb(selectedPrinter.value.path)
        }
        break
      case 'driver':
        if (selectedPrinter.value?.path) {
          tsc.openport_driver(selectedPrinter.value.path)
        }
        break
    }

    // 結束指令
    const endCommand = new Uint8Array([13, 10])
    tsc.sendUint8Array(endCommand)

    // 清空緩存
    tsc.clearbuffer()

    // 設定紙張
    const { width, height } = labelSettings
    console.log(`設定紙張尺寸: ${width}mm x ${height}mm`)
    tsc.setup(width, height, '4', '12', '0', '3', '0')

    console.log('開始打印多行獨立設定:', lines)

    // 為每行設定獨立的文字
    lines.forEach((line, index) => {
      // TSC 印表機補償：向右微調以修正偏左問題  
      const compensatedX = line.x // 向右偏移 1mm

      // 將 mm 轉換為 dots (假設 300 DPI)
      const dpi = 300
      const xDots = Math.round(compensatedX * dpi / 25.4)
      const yDots = Math.round(line.y * dpi / 25.4)

      tsc.windowsfont(
        String(xDots),
        String(yDots),
        String(line.fontSize),
        '0', // rotation
        '2', // fontStyle (粗體)
        '0', // fontUnderline
        'Arial', // fontFamily
        line.text
      )
    })

    // 列印標籤
    tsc.printlabel(1, 1)
    tsc.closeport()

    // 發送指令到印表機
    const commandsObj = { functions_inorder: tsc.getCommands() }

    // 重用現有的 WebSocket 連接邏輯
    const websocket = new WebSocket('ws://127.0.0.1:8888')

    return new Promise((resolve) => {
      websocket.onopen = () => {
        websocket.send(JSON.stringify(commandsObj))
      }

      websocket.onmessage = (event) => {
        if (event.data === 'Finished') {
          websocket.close()
          resolve(true)
        }
      }

      websocket.onerror = () => {
        websocket.close()
        resolve(false)
      }
    })

  } catch (error) {
    console.error('多行獨立打印失敗:', error)
    return false
  }
}

const printLabel = async () => {
  console.log('=== 開始測試列印 ===')

  // 基本連接檢查
  if (!isConnected.value) {
    ElMessage.error('印表機未連接，請先連接印表機')
    return false
  }
  // 執行測試打印 - 使用多行獨立設定
  try {
    // 過濾空行
    const validLines = labelSettings.lines.filter(line => line.text.trim() !== '')

    if (validLines.length === 0) {
      ElMessage.warning('沒有要打印的內容')
      return false
    }

    // 準備每行的獨立設定
    const printLines = validLines.map(line => ({
      text: line.text,
      x: line.x,
      y: line.y,
      fontSize: line.fontSize
    }))


    const success = await printLabelWithMultiLineSettings(printLines)

    if (success) {
      ElNotification.success({
        title: '列印成功',
        message: `測試列印完成！已打印包含 ${validLines.length} 行文字的標籤。`
      })
    } else {
      ElNotification.error({
        title: '列印失敗',
        message: '測試列印失敗！請檢查印表機狀態。'
      })
    }

    return success

  } catch (error) {
    console.error('測試列印時發生錯誤:', error)
    ElNotification.error({
      title: '列印錯誤',
      message: '測試列印時發生錯誤'
    })
    return false
  }
}

const setTempSetting = () => {
  localStorage.setItem('temporaryLabelSettings', JSON.stringify(labelSettings))
  ElNotification.success({
    title: '保存成功',
    message: `已保存當前標籤設定為臨時設定
    行數: ${labelSettings.lines.length}
    尺寸: ${labelSettings.width}mm x ${labelSettings.height}mm
    `
  })
}

const getTempSetting = () => {
  const tempSettings = localStorage.getItem('temporaryLabelSettings')
  if (tempSettings) {
    console.log('獲取到臨時設定:', tempSettings)
    return JSON.parse(tempSettings)
  }
}

defineExpose({
  printLabel,
  setTempSetting
})

onMounted(() => {
  const tempSettings = getTempSetting()
  if (tempSettings) {
    Object.assign(labelSettings, tempSettings)
    ElNotification.success({
      title: '恢復臨時設定',
      message: '已恢復上次保存的臨時標籤設定'
    })
  }
})

</script>