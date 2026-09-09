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
import { useLabelSettings, LABEL_MARGINS } from '@/composables/useLabelSettings';
import { computeMultiLineLayout } from '@/utils/labelLayout';
import { ElNotification, ElMessage } from 'element-plus';

const { labelConfig, isConnected, connectionType, selectedPrinter } = useTSC({
  connectionType: 'usb',
  labelConfig: {
    dpi: 300,
    widthMm: 95,
    heightMm: 60,  // 與 labelSettings 一致！
    marginLeftMm: 2,
    marginRightMm: 2
  }
})

// 多行獨立設定的標籤配置，與 barcode-gun-registration/index.vue 共用同一份預設值/暫存邏輯
const { labelSettings, setTempSetting: persistLabelSettings, getTempSetting } = useLabelSettings()

const printLabelWithMultiLineSettings = async (lines: Array<{ text: string, x: number, y: number, fontSize: number, textType: string, positionMode?: string }>) => {
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

    // 排版計算（縮字/換行/座標）改用與「實際報到列印」「畫布預覽」共用的排版引擎，
    // 確保「測試列印」能真正重現報到時的換行/縮字行為
    const layoutSegments = computeMultiLineLayout(lines, {
      labelWidthMm: width,
      labelHeightMm: height,
      margins: LABEL_MARGINS
    })

    layoutSegments.forEach((seg) => {
      // 將 mm 轉換為 dots (假設 300 DPI)
      const dpi = 300
      const xDots = Math.round(seg.x * dpi / 25.4)
      const yDots = Math.round(seg.y * dpi / 25.4)

      tsc.windowsfont(
        String(xDots),
        String(yDots),
        String(seg.fontSize),
        '0', // rotation
        '2', // fontStyle (粗體)
        '0', // fontUnderline
        'Microsoft JhengHei', // fontFamily
        seg.text
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
      fontSize: line.fontSize,
      textType: line.textInfo.textType,
      positionMode: line.positionMode
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
  persistLabelSettings()
  ElNotification.success({
    title: '保存成功',
    message: `已保存當前標籤設定為臨時設定
    行數: ${labelSettings.lines.length}
    尺寸: ${labelSettings.width}mm x ${labelSettings.height}mm
    `
  })
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