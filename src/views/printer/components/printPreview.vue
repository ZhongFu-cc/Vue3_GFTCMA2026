<!-- 標籤打印預覽組件 - 支援多行文字設置和即時預覽 -->
<template>
  <div class="content">
    <!-- 預覽畫布區域 -->
    <div class="preview-canvas-container">
      <!-- 標籤預覽畫布 -->
      <div>
        <canvas ref="previewCanvas" width="500" height="300" class="preview-canvas"></canvas>
        <div class="canvas-info">
          <span>標籤尺寸: {{ labelSettings.width }}mm × {{ labelSettings.height }}mm</span>
        </div>
      </div>

      <!-- 標籤尺寸調整 -->
      <div>
        <h4>位置調整</h4>
        <el-form-item label="標籤寬度 (mm)">
          <el-input-number v-model="labelSettings.width" :min="LABEL_CONSTRAINTS.MIN_WIDTH"
            :max="LABEL_CONSTRAINTS.MAX_WIDTH" :step="1" @change="updateLabelSize" />
        </el-form-item>

        <el-form-item label="標籤高度 (mm)">
          <el-input-number v-model="labelSettings.height" :min="LABEL_CONSTRAINTS.MIN_HEIGHT"
            :max="LABEL_CONSTRAINTS.MAX_HEIGHT" :step="1" @change="updateLabelSize" />
        </el-form-item>
      </div>
    </div>

    <!-- 文字控制區域 -->
    <div class="position-controls">
      <!-- 多行文字設定區塊 -->
      <el-divider content-position="left">多行文字設定</el-divider>

      <div v-for="(line, index) in labelSettings.lines" :key="index" class="line-settings"
        :style="{ border: `2px solid ${index === 0 ? '#ff9800' : '#00bcd4'}`, marginBottom: '20px', padding: '15px', borderRadius: '8px' }">

        <h5 :style="{ color: index === 0 ? '#ff9800' : '#00bcd4', marginBottom: '15px' }">
          第{{ Number(index) + 1 }}行設定
        </h5>

        <el-form-item label="文字內容">
          <!-- <el-input v-model="line.text" placeholder="輸入文字內容" @input="updatePreview" /> -->
          <el-select v-model="line.textInfo" placeholder="選擇文字類型" @change="updateShowLabel" value-key="textShow">
            <el-option v-for="option in labelType" :key="option.value" :label="option.label" :value="option" />
          </el-select>
        </el-form-item>

        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="X 軸位置 (mm)">
              <el-input-number v-model="line.x" :min="textBounds.leftMargin"
                :max="textBounds.lines[index]?.maxX || textBounds.leftMargin" :step="0.5" :precision="1" size="small"
                @change="updatePreview" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Y 軸位置 (mm)">
              <el-input-number v-model="line.y" :min="textBounds.topMargin"
                :max="textBounds.lines[index]?.maxY || textBounds.topMargin" :step="0.5" :precision="1" size="small"
                @change="updatePreview" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="字體大小">
              <el-input-number v-model="line.fontSize" :min="FONT_SETTINGS.MIN_SIZE" :step="FONT_SETTINGS.SIZE_STEP"
                size="small" @change="updatePreview" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="10">
          <el-col :span="12">
            <div class="bounds-info">
              <span class="info-text">X範圍: {{ textBounds.leftMargin }}mm ~ {{
                textBounds.lines[index]?.maxX || textBounds.leftMargin }}mm</span>
              <br>
              <span class="size-info">文字寬: {{ textBounds.lines[index]?.textWidthMm ||
                0
              }}mm</span>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="bounds-info">
              <span class="info-text">Y範圍: {{ textBounds.topMargin }}mm ~ {{
                textBounds.lines[index]?.maxY || textBounds.topMargin }}mm</span>
              <br>
              <span class="size-info">文字高: {{ textBounds.lines[index]?.textHeightMm ||
                0
              }}mm</span>
            </div>
          </el-col>
        </el-row>

        <div class="line-actions" style="margin-top: 10px;">
          <el-button size="small" @click="resetLinePlosition(Number(index))">重置此行</el-button>
          <el-button size="small" @click="centerLine(Number(index))">置中此行</el-button>
          <el-button v-if="labelSettings.lines.length > 1" size="small" type="danger"
            @click="removeLine(Number(index))">刪除此行</el-button>
        </div>
      </div>

      <div class="global-actions">
        <el-button @click="addNewLine">+ 新增行</el-button>
        <el-button @click="resetPosition">重置所有位置</el-button>
        <el-button @click="centerText">置中所有文字</el-button>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, computed, watch, nextTick, onMounted } from 'vue'
import { useTSC } from '@/composables/useTSC'
import { ElMessage } from 'element-plus'

/**
 * ==================================================
 * 組件屬性定義
 * ==================================================
 */
// 從父組件接收標籤配置
const props = defineProps({
  labelSettings: {
    type: Object,
    required: true
  },
  labelConfig: {
    type: Object,
    required: true
  }
})

/**
 * ==================================================
 * 常數定義 - 系統配置參數
 * ==================================================
 */
// 標籤尺寸限制
const LABEL_CONSTRAINTS = {
  MIN_WIDTH: 20,    // 最小寬度 (mm)
  MAX_WIDTH: 200,   // 最大寬度 (mm) 
  MIN_HEIGHT: 15,   // 最小高度 (mm)
  MAX_HEIGHT: 150   // 最大高度 (mm)
} as const

// 轉換係數 - 用於各種單位轉換
const CONVERSION_FACTORS = {
  INCH_TO_PX: 96,           // 英寸轉像素
  INCH_TO_DOT: 300,         // 英寸轉點數
  MM_TO_INCHES: 25.4,       // 毫米轉英寸
  CANVAS_SCALE: 4,          // 畫布縮放比例 (1mm = 4px)
  HORIZONTAL_SCALE: 0.9     // 水平字體縮放係數
} as const

// 計算像素轉點數係數
const PX_TO_DOT = CONVERSION_FACTORS.INCH_TO_DOT / CONVERSION_FACTORS.INCH_TO_PX

// 標籤安全邊距設定 (TSC印表機邊距要求)
const LABEL_MARGINS = {
  LEFT: 2,      // 左邊距 (mm)
  RIGHT: 2,     // 右邊距 (mm)
  TOP: 1,       // 上邊距 (mm)
  BOTTOM: 1     // 下邊距 (mm)
} as const

// 字體設定
const FONT_SETTINGS = {
  MIN_SIZE: 40,         // 最小字體大小
  SIZE_STEP: 10,        // 字體大小調整步長
  DEFAULT_SIZE: 120,    // 預設字體大小
  LINE_SPACING: 15      // 行間距 (mm)
} as const

/**
 * ==================================================
 * 反應式資料定義
 * ==================================================
 */
const labelConfig = ref<any>(props.labelConfig)
const labelSettings = ref<any>(props.labelSettings)
const previewCanvas = ref<HTMLCanvasElement | null>(null)

// 可測量文字寬度的隱藏畫布
let measureCanvas: HTMLCanvasElement | null = null
let measureCtx: CanvasRenderingContext2D | null = null

// 文字類型選項配置
const labelType = ref([
  { label: '中文名', value: 'chineseName', textType: 'chineseName', textShow: '中文名' },
  { label: '英文名', value: 'userName', textType: 'userName', textShow: 'English Name' },
  { label: '會員編號', value: 'sequenceNo', textType: 'sequenceNo', textShow: '會員編號' },
  { label: '單位', value: 'affiliation', textType: 'affiliation', textShow: '單位' },
  { label: '職稱', value: 'jobTitle', textType: 'jobTitle', textShow: '職稱' },
])

/**
 * ==================================================
 * 監聽器定義 - 處理資料變化和同步
 * ==================================================
 */

// 監聽標籤尺寸變化，同步更新配置物件
watch(
  () => [labelSettings.value.width, labelSettings.value.height],
  ([newWidth, newHeight]) => {
    if (labelConfig.value) {
      labelConfig.value.widthMm = newWidth
      labelConfig.value.heightMm = newHeight
      console.log(`標籤配置已更新: ${newWidth} × ${newHeight}mm`)
    }
  },
  { immediate: true }
)

// 監聽字體大小變化，即時更新預覽
watch(
  () => labelSettings.value.lines.map((line: any) => line.fontSize),
  () => {
    updatePreview()
  },
  { deep: true }
)

/**
 * ==================================================
 * 工具函數 - 文字測量和計算
 * ==================================================
 */

/**
 * 初始化測量畫布 (用於精確計算文字寬度)
 * @returns {CanvasRenderingContext2D | null} 畫布上下文
 */
const initMeasureCanvas = (): CanvasRenderingContext2D | null => {
  if (!measureCanvas) {
    measureCanvas = document.createElement('canvas')
    measureCtx = measureCanvas.getContext('2d')
  }
  return measureCtx
}

/**
 * 精確計算文字寬度 (配合TSC印表機特性)
 * @param {string} text - 要測量的文字
 * @param {number} fontHeightDots - 字體高度(點數)
 * @param {any} fontStyle - 字體樣式 (0:普通, 1:斜體, 2:粗體, 3:粗斜體)
 * @param {string} faceName - 字體名稱
 * @returns {number} 文字寬度(點數)
 */
const getPreciseWidth = (
  text: string,
  fontHeightDots: number,
  fontStyle: any,
  faceName: string
): number => {
  const ctx = initMeasureCanvas()
  if (!ctx) return 0

  // 將點數轉回瀏覽器像素進行測量 (假設 1mm = 3.78px)
  const fontHeightPx = fontHeightDots / PX_TO_DOT
  const italic = (fontStyle === '1' || fontStyle === '3') ? 'italic ' : ''
  const bold = (fontStyle === '2' || fontStyle === '3') ? 'bold ' : ''

  ctx.font = `${italic}${bold}${fontHeightPx}px "${faceName}"`

  const metrics = ctx.measureText(text)
  // 調整係數以匹配TSC印表機實際輸出
  const pureWidthPx = (metrics.actualBoundingBoxRight - metrics.actualBoundingBoxLeft) * 0.85

  return Math.round(pureWidthPx * PX_TO_DOT)
}

/**
 * ==================================================
 * 計算屬性 - 文字邊界和安全區域計算
 * ==================================================
 */

/**
 * 計算文字邊界和安全區域 - 支援多行獨立設定
 * 主要功能:
 * 1. 計算每一行文字的實際尺寸和可用位置範圍
 * 2. 確保文字不會超出標籤邊界  
 * 3. 提供安全區域邊界信息
 */
const textBounds = computed(() => {
  // 取得TSC印表機的安全邊距設定
  const { LEFT: leftMargin, RIGHT: rightMargin, TOP: topMargin, BOTTOM: bottomMargin } = LABEL_MARGINS

  // 計算每一行的邊界資訊
  const linesBounds = labelSettings.value.lines.map((line: any, index: number) => {
    // 將TSC字體大小轉換為毫米單位
    const fontSizeMm = line.fontSize / CONVERSION_FACTORS.INCH_TO_DOT * CONVERSION_FACTORS.MM_TO_INCHES
    const lineHeightMm = fontSizeMm * 0.9   // 單行高度係數調整

    // 計算這一行的實際寬度
    const lineWidthMm = getPreciseWidth(line.text, line.fontSize, '0', 'Arial') / CONVERSION_FACTORS.INCH_TO_DOT * CONVERSION_FACTORS.MM_TO_INCHES

    // 計算安全的最大位置（確保文字不會超出標籤邊界）
    const maxX = Math.max(leftMargin, labelSettings.value.width - lineWidthMm - rightMargin)
    const maxY = Math.max(topMargin, labelSettings.value.height - lineHeightMm - bottomMargin)

    // 防止負值：如果文字太大，至少保持在邊距位置
    const safeMaxX = maxX > leftMargin ? maxX : leftMargin
    const safeMaxY = maxY > topMargin ? maxY : topMargin

    return {
      text: line.text,
      x: line.x,
      y: line.y,
      fontSize: line.fontSize,
      textWidthMm: Math.round(lineWidthMm * 10) / 10,
      textHeightMm: Math.round(lineHeightMm * 10) / 10,
      maxX: Math.round(safeMaxX * 10) / 10,
      maxY: Math.round(safeMaxY * 10) / 10,
      fontSizeMm: Math.round(fontSizeMm * 10) / 10
    }
  })

  // 計算整體邊界框（包含所有行的最小外框）
  let minX = Infinity, minY = Infinity, maxRight = -Infinity, maxBottom = -Infinity

  linesBounds.forEach((lineBound: any) => {
    minX = Math.min(minX, lineBound.x)
    minY = Math.min(minY, lineBound.y)
    maxRight = Math.max(maxRight, lineBound.x + lineBound.textWidthMm)
    maxBottom = Math.max(maxBottom, lineBound.y + lineBound.textHeightMm)
  })

  // 處理無文字行的情況
  if (linesBounds.length === 0) {
    minX = leftMargin
    minY = topMargin
    maxRight = leftMargin
    maxBottom = topMargin
  }

  const totalWidth = maxRight - minX
  const totalHeight = maxBottom - minY

  return {
    lines: linesBounds,
    lineCount: labelSettings.value.lines.length,
    // 整體邊界框資訊
    overallBounds: {
      x: minX,
      y: minY,
      width: Math.round(totalWidth * 10) / 10,
      height: Math.round(totalHeight * 10) / 10
    },
    // 安全區域邊界
    leftMargin,
    rightMargin,
    topMargin,
    bottomMargin
  }
})

/**
 * 計算動態字體大小基準 (用於畫布顯示)
 * 根據標籤設定中的最大字體大小動態調整顯示字體
 */
const canvasFontSizes = computed(() => {
  // 基於標籤設定中最大字體大小計算基準
  const maxFontSize = Math.max(...labelSettings.value.lines.map((line: any) => line.fontSize))
  const baseFontSize = Math.max(8, maxFontSize / 12) // 基準字體大小

  return {
    labelText: (fontSize: number) => Math.max(12, fontSize / 10), // 標籤文字顯示大小
    coordInfo: Math.max(8, baseFontSize * 0.8),                  // 座標資訊顯示大小
    sizeInfo: Math.max(8, baseFontSize * 0.7),                   // 尺寸資訊顯示大小
    warningTitle: Math.max(12, baseFontSize * 1.2),              // 警告標題顯示大小
    warningText: Math.max(10, baseFontSize)                      // 警告文字顯示大小
  }
})

/**
 * ==================================================
 * 事件處理函數 - 用戶交互處理
 * ==================================================
 */

/**
 * 更新顯示標籤文字內容
 * 當使用者選擇不同的文字類型時觸發
 */
const updateShowLabel = () => {
  labelSettings.value.lines.forEach((line: any) => {
    line.text = line.textInfo.textShow
  })
  updatePreview()
}

/**
 * 主要預覽更新函數 - 重新繪製整個標籤預覽
 * 包含標籤背景、邊距線、網格線、文字和警告提示
 */
const updatePreview = () => {
  if (!previewCanvas.value) return

  console.log(`更新預覽: ${textBounds.value.lineCount} 行文字`)
  console.log('文字邊界資訊:', labelSettings.value.lines)

  const canvas = previewCanvas.value
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  // 清除畫布並重新繪製
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  // 繪製標籤基本結構
  drawLabelBackground(ctx)
  drawMarginLines(ctx)
  drawGridLines(ctx)

  // 繪製文字內容並檢查邊界
  const hasOutOfBounds = drawTextContent(ctx)

  // 繪製資訊和警告
  drawSizeInfo(ctx)
  if (hasOutOfBounds) {
    drawOutOfBoundsWarning(ctx)
  }
}

/**
 * 繪製標籤背景和外框
 * @param {CanvasRenderingContext2D} ctx - 畫布上下文
 */
const drawLabelBackground = (ctx: CanvasRenderingContext2D) => {
  const canvasMargin = 20
  const labelWidth = labelSettings.value.width * CONVERSION_FACTORS.CANVAS_SCALE
  const labelHeight = labelSettings.value.height * CONVERSION_FACTORS.CANVAS_SCALE

  // 繪製標籤白色背景
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(canvasMargin, canvasMargin, labelWidth, labelHeight)

  // 繪製標籤外框
  ctx.strokeStyle = '#333333'
  ctx.lineWidth = 2
  ctx.strokeRect(canvasMargin, canvasMargin, labelWidth, labelHeight)
}

/**
 * 繪製安全邊距線
 * @param {CanvasRenderingContext2D} ctx - 畫布上下文
 */
const drawMarginLines = (ctx: CanvasRenderingContext2D) => {
  const canvasMargin = 20
  const scale = CONVERSION_FACTORS.CANVAS_SCALE
  const labelWidth = labelSettings.value.width * scale
  const labelHeight = labelSettings.value.height * scale

  const leftMarginPx = textBounds.value.leftMargin * scale
  const rightMarginPx = textBounds.value.rightMargin * scale
  const topMarginPx = textBounds.value.topMargin * scale
  const bottomMarginPx = textBounds.value.bottomMargin * scale

  ctx.strokeStyle = '#e0e0e0'
  ctx.lineWidth = 1
  ctx.setLineDash([3, 3])

  // 繪製四邊的安全邊距線
  const marginLines = [
    // 左邊距線
    [canvasMargin + leftMarginPx, canvasMargin, canvasMargin + leftMarginPx, canvasMargin + labelHeight],
    // 右邊距線
    [canvasMargin + labelWidth - rightMarginPx, canvasMargin, canvasMargin + labelWidth - rightMarginPx, canvasMargin + labelHeight],
    // 上邊距線
    [canvasMargin, canvasMargin + topMarginPx, canvasMargin + labelWidth, canvasMargin + topMarginPx],
    // 下邊距線
    [canvasMargin, canvasMargin + labelHeight - bottomMarginPx, canvasMargin + labelWidth, canvasMargin + labelHeight - bottomMarginPx]
  ]

  marginLines.forEach(([x1, y1, x2, y2]) => {
    ctx.beginPath()
    ctx.moveTo(x1, y1)
    ctx.lineTo(x2, y2)
    ctx.stroke()
  })

  ctx.setLineDash([]) // 重置虛線設定
}

/**
 * 繪製網格線 (每5mm一條線)
 * @param {CanvasRenderingContext2D} ctx - 畫布上下文
 */
const drawGridLines = (ctx: CanvasRenderingContext2D) => {
  const canvasMargin = 20
  const scale = CONVERSION_FACTORS.CANVAS_SCALE
  const labelWidth = labelSettings.value.width * scale
  const labelHeight = labelSettings.value.height * scale

  ctx.strokeStyle = '#f5f5f5'
  ctx.lineWidth = 1

  // 繪製垂直網格線
  for (let i = 5; i < labelSettings.value.width; i += 5) {
    const x = canvasMargin + i * scale
    ctx.beginPath()
    ctx.moveTo(x, canvasMargin)
    ctx.lineTo(x, canvasMargin + labelHeight)
    ctx.stroke()
  }

  // 繪製水平網格線
  for (let i = 5; i < labelSettings.value.height; i += 5) {
    const y = canvasMargin + i * scale
    ctx.beginPath()
    ctx.moveTo(canvasMargin, y)
    ctx.lineTo(canvasMargin + labelWidth, y)
    ctx.stroke()
  }
}

/**
 * 繪製文字內容並檢查邊界
 * @param {CanvasRenderingContext2D} ctx - 畫布上下文
 * @returns {boolean} 是否有文字超出邊界
 */
const drawTextContent = (ctx: CanvasRenderingContext2D): boolean => {
  const canvasMargin = 20
  const scale = CONVERSION_FACTORS.CANVAS_SCALE
  let hasOutOfBounds = false

  // 繪製每一行文字（支援獨立設定）
  textBounds.value.lines.forEach((line: any, index: number) => {
    // 計算字體大小，讓它與邊界框匹配
    const fontSizeMm = line.fontSize / CONVERSION_FACTORS.INCH_TO_DOT * CONVERSION_FACTORS.MM_TO_INCHES
    const fontSize = fontSizeMm * scale

    // 設定字體樣式
    ctx.font = `bold ${fontSize}px Arial`
    ctx.fillStyle = '#000000'
    ctx.textAlign = 'left'
    ctx.textBaseline = 'alphabetic' // 使用基線，與TSC印表機一致

    // 計算文字位置（TSC座標系統：Y座標為基線位置）
    const textX = canvasMargin + line.x * scale
    const fontHeightPx = fontSize
    const textY = canvasMargin + line.y * scale + fontHeightPx

    // 套用水平縮放並繪製文字
    ctx.save()
    ctx.translate(textX, textY)
    ctx.scale(CONVERSION_FACTORS.HORIZONTAL_SCALE, 1)
    ctx.fillText(line.text, 0, 0)
    ctx.restore()

    // 繪製文字邊界框和位置指示器
    drawTextBoundingBox(ctx, line, index, textX, textY, fontHeightPx)
    drawPositionIndicator(ctx, line, index, textX, canvasMargin, scale)

    // 檢查是否超出範圍
    if (isLineOutOfBounds(line)) {
      hasOutOfBounds = true
      logOutOfBoundsWarning(line, index)
    }
  })

  return hasOutOfBounds
}

/**
 * 繪製文字邊界框
 * @param {CanvasRenderingContext2D} ctx - 畫布上下文
 * @param {any} line - 文字行資料
 * @param {number} index - 行索引
 * @param {number} textX - 文字X位置
 * @param {number} textY - 文字Y位置  
 * @param {number} fontHeightPx - 字體高度(像素)
 */
const drawTextBoundingBox = (
  ctx: CanvasRenderingContext2D,
  line: any,
  index: number,
  textX: number,
  textY: number,
  fontHeightPx: number
) => {
  const lineColor = index === 0 ? '#ff9800' : '#00bcd4' // 第一行橙色，其他行青色
  const scale = CONVERSION_FACTORS.CANVAS_SCALE
  const textWidthPx = line.textWidthMm * scale * CONVERSION_FACTORS.HORIZONTAL_SCALE
  const textHeightPx = line.textHeightMm * scale

  ctx.strokeStyle = lineColor
  ctx.lineWidth = 1
  ctx.setLineDash([2, 2])

  // 邊界框從Y座標向上繪製（因為文字是向上延伸的）
  ctx.strokeRect(textX, textY - fontHeightPx, textWidthPx, textHeightPx)
  ctx.setLineDash([])
}

/**
 * 繪製位置指示器
 * @param {CanvasRenderingContext2D} ctx - 畫布上下文
 * @param {any} line - 文字行資料
 * @param {number} index - 行索引
 * @param {number} textX - 文字X位置
 * @param {number} canvasMargin - 畫布邊距
 * @param {number} scale - 縮放係數
 */
const drawPositionIndicator = (
  ctx: CanvasRenderingContext2D,
  line: any,
  index: number,
  textX: number,
  canvasMargin: number,
  scale: number
) => {
  const indicatorColor = index === 0 ? '#ff4d4f' : '#1890ff' // 第一行紅色，其他行藍色
  const tscYIndicator = canvasMargin + line.y * scale

  // 繪製位置指示圓點
  ctx.fillStyle = indicatorColor
  ctx.beginPath()
  ctx.arc(textX, tscYIndicator, 4, 0, 2 * Math.PI)
  ctx.fill()

  // 顯示座標資訊
  ctx.fillStyle = '#333333'
  ctx.font = `bold ${canvasFontSizes.value.coordInfo}px Arial`
  ctx.textAlign = 'left'
  ctx.textBaseline = 'top'

  const yOffset = index * 15 - 20
  ctx.fillText(`第${index + 1}行: (${line.x}, ${line.y})mm`, textX + 8, tscYIndicator + yOffset)
}

/**
 * 檢查文字行是否超出邊界
 * @param {any} line - 文字行資料
 * @returns {boolean} 是否超出邊界
 */
const isLineOutOfBounds = (line: any): boolean => {
  const textRight = line.x + line.textWidthMm
  const textBottom = line.y + line.textHeightMm

  return (
    line.x < textBounds.value.leftMargin ||
    line.y < textBounds.value.topMargin ||
    line.x > line.maxX ||
    line.y > line.maxY ||
    textRight > (labelSettings.value.width - textBounds.value.rightMargin) ||
    textBottom > (labelSettings.value.height - textBounds.value.bottomMargin)
  )
}

/**
 * 記錄超出邊界警告
 * @param {any} line - 文字行資料
 * @param {number} index - 行索引
 */
const logOutOfBoundsWarning = (line: any, index: number) => {
  const textRight = line.x + line.textWidthMm
  const textBottom = line.y + line.textHeightMm

  console.warn(`第${index + 1}行超出標籤範圍:`, {
    position: { x: line.x, y: line.y },
    textSize: { width: line.textWidthMm, height: line.textHeightMm },
    textEnd: { x: textRight, y: textBottom },
    labelSize: { width: labelSettings.value.width, height: labelSettings.value.height },
    line: line.text,
    safeArea: {
      minX: textBounds.value.leftMargin,
      minY: textBounds.value.topMargin,
      maxX: line.maxX,
      maxY: line.maxY
    }
  })
}

/**
 * 繪製尺寸資訊
 * @param {CanvasRenderingContext2D} ctx - 畫布上下文
 */
const drawSizeInfo = (ctx: CanvasRenderingContext2D) => {
  const canvasMargin = 20
  const scale = CONVERSION_FACTORS.CANVAS_SCALE
  const labelHeight = labelSettings.value.height * scale

  ctx.font = `${canvasFontSizes.value.sizeInfo}px Arial`
  ctx.fillStyle = '#666666'
  ctx.textAlign = 'left'

  ctx.fillText(
    `標籤: ${labelSettings.value.width} × ${labelSettings.value.height}mm (${textBounds.value.lineCount}行文字)`,
    canvasMargin,
    canvasMargin + labelHeight + 15
  )
  ctx.fillText(
    `整體範圍: ${textBounds.value.overallBounds.width} × ${textBounds.value.overallBounds.height}mm`,
    canvasMargin,
    canvasMargin + labelHeight + 30
  )
}

/**
 * 繪製超出邊界警告
 * @param {CanvasRenderingContext2D} ctx - 畫布上下文
 */
const drawOutOfBoundsWarning = (ctx: CanvasRenderingContext2D) => {
  const canvasMargin = 20
  const scale = CONVERSION_FACTORS.CANVAS_SCALE
  const labelWidth = labelSettings.value.width * scale
  const labelHeight = labelSettings.value.height * scale

  // 繪製半透明紅色遮罩
  ctx.fillStyle = 'rgba(255, 0, 0, 0.2)'
  ctx.fillRect(canvasMargin, canvasMargin, labelWidth, labelHeight)

  // 繪製警告文字
  ctx.fillStyle = '#ff0000'
  ctx.textAlign = 'center'

  const centerX = canvasMargin + labelWidth / 2
  const centerY = canvasMargin + labelHeight / 2

  ctx.font = `bold ${canvasFontSizes.value.warningTitle}px Arial`
  ctx.fillText('⚠️ 部分文字超出安全範圍!', centerX, centerY - 8)

  ctx.font = `${canvasFontSizes.value.warningText}px Arial`
  ctx.fillText('請調整文字位置或大小', centerX, centerY + 10)
  ctx.fillText('否則打印會自動調整文字大小', centerX, centerY + 25)
}

/**
 * ==================================================
 * 位置控制函數 - 文字位置調整和管理
 * ==================================================
 */

/**
 * 重置所有文字行位置到預設位置
 * 將所有文字行重置到安全區域內，並垂直排列
 */
const resetPosition = () => {
  labelSettings.value.lines.forEach((line: any, index: number) => {
    line.x = textBounds.value.leftMargin + 1
    line.y = textBounds.value.topMargin + 1 + (index * FONT_SETTINGS.LINE_SPACING)
    line.positionMode = 'fixed'
  })

  console.log('重置所有行位置:', labelSettings.value.lines.map((line: any, index: number) =>
    `第${index + 1}行: (${line.x}, ${line.y})mm`
  ).join(', '))

  updatePreview()
}

/**
 * 多行文字智慧置中功能
 * 計算所有文字行的整體範圍，並將其置於標籤中央
 */
const centerText = () => {
  console.log('開始多行置中計算...')

  if (!previewCanvas.value) {
    console.warn('Canvas 不可用，無法執行置中')
    return
  }

  const canvas = previewCanvas.value
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  // 計算標籤可用區域
  const usableWidth = labelSettings.value.width - textBounds.value.leftMargin - textBounds.value.rightMargin
  const usableHeight = labelSettings.value.height - textBounds.value.topMargin - textBounds.value.bottomMargin
  const usableAreaCenterX = textBounds.value.leftMargin + (usableWidth / 2)
  const usableAreaCenterY = textBounds.value.topMargin + (usableHeight / 2)

  // 計算整體文字區域的高度範圍
  let minY = Infinity, maxBottom = -Infinity
  textBounds.value.lines.forEach((lineBound: any) => {
    minY = Math.min(minY, lineBound.y)
    maxBottom = Math.max(maxBottom, lineBound.y + lineBound.textHeightMm)
  })

  const totalHeightUsed = maxBottom - minY
  const verticalOffset = usableAreaCenterY - totalHeightUsed / 2 - minY

  // 為每一行設定置中位置
  labelSettings.value.lines.forEach((line: any, index: number) => {
    const lineInfo = textBounds.value.lines[index]

    // 使用Canvas精確測量文字寬度
    const actualTextWidthMm = calculateActualTextWidth(ctx, line)

    // 計算水平和垂直置中位置
    const centerX = usableAreaCenterX - (actualTextWidthMm / 2)
    const centerY = line.y + verticalOffset

    // 確保位置在安全範圍內
    line.x = Math.max(textBounds.value.leftMargin, Math.min(centerX, lineInfo.maxX))
    line.y = Math.max(textBounds.value.topMargin, Math.min(centerY, lineInfo.maxY))

    // 四捨五入到小數點後一位
    line.x = Math.round(line.x * 10) / 10
    line.y = Math.round(line.y * 10) / 10
    line.positionMode = 'center'

    console.log(`第${index + 1}行置中後位置: (${line.x}, ${line.y})mm, 文字寬度: ${actualTextWidthMm}mm`)
  })

  updatePreview()
}

/**
 * 計算實際文字寬度
 * @param {CanvasRenderingContext2D} ctx - 畫布上下文
 * @param {any} line - 文字行資料
 * @returns {number} 實際文字寬度(mm)
 */
const calculateActualTextWidth = (ctx: CanvasRenderingContext2D, line: any): number => {
  // 置中計算改為與列印端一致的精確寬度，避免中文在預覽中偏左
  const textWidthDots = getPreciseWidth(line.text || '', line.fontSize, '0', 'Arial')
  return textWidthDots / CONVERSION_FACTORS.INCH_TO_DOT * CONVERSION_FACTORS.MM_TO_INCHES
}

/**
 * 標籤尺寸更新時的位置修正
 * 確保所有文字行在新尺寸下仍在有效範圍內
 */
const updateLabelSize = () => {
  nextTick(() => {
    labelSettings.value.lines.forEach((line: any, index: number) => {
      const lineInfo = textBounds.value.lines[index]

      // 修正X座標範圍
      line.x = Math.max(textBounds.value.leftMargin, Math.min(line.x, lineInfo.maxX))

      // 修正Y座標範圍
      line.y = Math.max(textBounds.value.topMargin, Math.min(line.y, lineInfo.maxY))

      // 檢查文字右下邊緣是否超出標籤範圍並修正
      const textRight = line.x + lineInfo.textWidthMm
      const textBottom = line.y + lineInfo.textHeightMm
      const labelRightBoundary = labelSettings.value.width - textBounds.value.rightMargin
      const labelBottomBoundary = labelSettings.value.height - textBounds.value.bottomMargin

      if (textRight > labelRightBoundary) {
        line.x = Math.max(textBounds.value.leftMargin, labelRightBoundary - lineInfo.textWidthMm)
      }
      if (textBottom > labelBottomBoundary) {
        line.y = Math.max(textBounds.value.topMargin, labelBottomBoundary - lineInfo.textHeightMm)
      }
    })

    updatePreview()
  })
}

/**
 * ==================================================
 * 文字行管理函數
 * ==================================================
 */

/**
 * 新增文字行
 * 在標籤中加入新的文字行，自動設定預設位置和內容
 */
const addNewLine = () => {
  const newLineIndex = labelSettings.value.lines.length
  const bottomBoundary = labelSettings.value.height - textBounds.value.bottomMargin
  const targetY = textBounds.value.topMargin + 1 + (newLineIndex * FONT_SETTINGS.LINE_SPACING)

  const getLineHeightMm = (fontSize: number) => {
    return (fontSize / CONVERSION_FACTORS.INCH_TO_DOT * CONVERSION_FACTORS.MM_TO_INCHES) * 0.9
  }

  // 找到目標 Y 下方(含同一高度)的所有行，新增時一起往下推
  const affectedIndexes = labelSettings.value.lines
    .map((line: any, index: number) => ({
      index,
      y: Number(line.y) || textBounds.value.topMargin,
      fontSize: Number(line.fontSize) || FONT_SETTINGS.DEFAULT_SIZE
    }))
    .filter((lineInfo: any) => lineInfo.y >= targetY)

  if (affectedIndexes.length > 0) {
    const hasInsufficientSpace = affectedIndexes.some((lineInfo: any) => {
      const maxSafeY = bottomBoundary - getLineHeightMm(lineInfo.fontSize)
      return lineInfo.y + FONT_SETTINGS.LINE_SPACING > maxSafeY
    })

    if (hasInsufficientSpace) {
      ElMessage.warning('下方行數空間不足，無法再插入新行，請先調整位置或刪除部分行')
      return
    }

    // 由下往上推，避免連動覆蓋
    const sortedAffected = [...affectedIndexes].sort((a: any, b: any) => b.y - a.y)
    sortedAffected.forEach((lineInfo: any) => {
      const line = labelSettings.value.lines[lineInfo.index]
      line.y = Math.round((line.y + FONT_SETTINGS.LINE_SPACING) * 10) / 10
    })
  }

  const newLineHeightMm = getLineHeightMm(FONT_SETTINGS.DEFAULT_SIZE)
  const safeY = Math.max(textBounds.value.topMargin, Math.min(targetY, bottomBoundary - newLineHeightMm))

  const newLine = {
    text: `第 ${newLineIndex + 1} 行`,
    textType: '',
    textInfo: {
      textType: '',
      textShow: `第 ${newLineIndex + 1} 行`
    },
    x: textBounds.value.leftMargin + 1,
    y: safeY,
    fontSize: FONT_SETTINGS.DEFAULT_SIZE,
    positionMode: 'fixed'
  }

  // 依 Y 座標插入，讓控制面板順序與實際排版一致
  const insertIndex = labelSettings.value.lines.findIndex((line: any) => (Number(line.y) || 0) >= safeY)
  if (insertIndex >= 0) {
    labelSettings.value.lines.splice(insertIndex, 0, newLine)
  } else {
    labelSettings.value.lines.push(newLine)
  }

  console.log(`新增第${newLineIndex + 1}行:`, newLine)
  updatePreview()
}

/**
 * 刪除指定的文字行
 * @param {number} index - 要刪除的行索引
 */
const removeLine = (index: number) => {
  if (labelSettings.value.lines.length > 1 && index >= 0 && index < labelSettings.value.lines.length) {
    const removedLine = labelSettings.value.lines.splice(index, 1)[0]
    console.log(`刪除第${index + 1}行:`, removedLine)
    updatePreview()
  } else {
    console.warn('無法刪除：至少需要保留一行文字')
  }
}

/**
 * 重置指定行的位置到預設位置
 * @param {number} index - 要重置的行索引
 */
const resetLinePlosition = (index: number) => {
  if (index >= 0 && index < labelSettings.value.lines.length) {
    const line = labelSettings.value.lines[index]
    line.x = textBounds.value.leftMargin + 1
    line.y = textBounds.value.topMargin + 1 + (index * FONT_SETTINGS.LINE_SPACING)
    line.positionMode = 'fixed'

    console.log(`重置第${index + 1}行位置: (${line.x}, ${line.y})mm`)
    updatePreview()
  }
}

/**
 * 置中指定的單一文字行
 * @param {number} index - 要置中的行索引
 */
const centerLine = (index: number) => {
  if (index < 0 || index >= labelSettings.value.lines.length || index >= textBounds.value.lines.length) {
    console.warn(`無效的行索引: ${index}`)
    return
  }

  if (!previewCanvas.value) {
    console.warn('Canvas 不可用，無法執行置中')
    return
  }

  const canvas = previewCanvas.value
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const line = labelSettings.value.lines[index]
  const lineInfo = textBounds.value.lines[index]

  // 計算可用區域中心
  const usableWidth = labelSettings.value.width - textBounds.value.leftMargin - textBounds.value.rightMargin
  const usableAreaCenterX = textBounds.value.leftMargin + (usableWidth / 2)

  // 精確計算文字寬度
  const actualTextWidthMm = calculateActualTextWidth(ctx, line)

  // 計算水平置中位置
  const centerX = usableAreaCenterX - (actualTextWidthMm / 2)

  // 確保在安全範圍內並設定位置
  line.x = Math.max(textBounds.value.leftMargin, Math.min(centerX, lineInfo.maxX))
  line.x = Math.round(line.x * 10) / 10
  line.positionMode = 'center'

  console.log(`置中第${index + 1}行: (${line.x}, ${line.y})mm, 寬度: ${actualTextWidthMm}mm`)
  updatePreview()
}

/**
 * ==================================================
 * 組件生命週期
 * ==================================================
 */

// 組件掛載後初始化預覽
onMounted(() => {
  console.log('標籤預覽組件已掛載，開始初始化預覽...')
  updatePreview()
})
</script>

<style scoped>
/**
 * ==================================================
 * 組件樣式定義 - 標籤預覽組件專用樣式
 * ==================================================
 */

/* 主容器樣式 */
.content {
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
}

/* 預覽畫布容器 */
.preview-canvas-container {
  display: flex;
  gap: 30px;
  margin-bottom: 30px;
  align-items: flex-start;
}

/* 畫布樣式 */
.preview-canvas {
  border: 2px solid #ddd;
  border-radius: 8px;
  background-color: #ffffff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease;
}

.preview-canvas:hover {
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

/* 畫布資訊顯示 */
.canvas-info {
  text-align: center;
  margin-top: 10px;
  font-weight: 500;
  color: #666;
  background-color: #f0f0f0;
  padding: 8px;
  border-radius: 4px;
}

/* 位置控制區域 */
.position-controls {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* 文字行設定區塊 */
.line-settings {
  margin-bottom: 20px;
  padding: 15px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.line-settings:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* 邊界資訊顯示 */
.bounds-info {
  background-color: #f8f9fa;
  padding: 8px 12px;
  border-radius: 4px;
  border-left: 4px solid #007bff;
}

.info-text {
  font-size: 12px;
  color: #666;
  font-weight: 500;
}

.size-info {
  font-size: 11px;
  color: #888;
  margin-top: 2px;
}

/* 行操作按鈕區域 */
.line-actions {
  display: flex;
  gap: 8px;
  margin-top: 10px;
}

/* 全域操作按鈕區域 */
.global-actions {
  display: flex;
  gap: 12px;
  margin-top: 20px;
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 8px;
  border: 2px dashed #ddd;
}

/* 響應式設計 */
@media (max-width: 768px) {
  .preview-canvas-container {
    flex-direction: column;
    gap: 20px;
  }

  .global-actions {
    flex-wrap: wrap;
  }
}

/* 按鈕樣式增強 */
.el-button {
  transition: all 0.3s ease;
}

.el-button:hover {
  transform: translateY(-1px);
}

/* 表單項目樣式調整 */
.el-form-item {
  margin-bottom: 15px;
}

.el-form-item__label {
  font-weight: 500;
  color: #333;
}
</style>