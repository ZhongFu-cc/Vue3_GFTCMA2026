<template>
    <section class="main-section">
        <el-card class="main-card">
            <div class="data-section">
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
                    <h1>掃碼槍簽到退系統</h1>

                    <div class="function-bar">
                        <el-form-item label="" label-position="left">
                            <el-input v-model="queryText" placeholder="搜尋參與者資料" @input="handleInput" />
                        </el-form-item>
                        <el-button class="site-on" link type="primary" @click="openDialog">+現場登記</el-button>
                        <el-button class="printer-config-btn" link type="info" @click="openPrinterConfig">
                            <el-icon>
                                <Setting />
                            </el-icon>
                            印表機設定
                        </el-button>
                    </div>

                    <div class="barcode-gun-status">
                        <div class="status-indicator" :class="{ active: isScanning }">
                            <el-icon>
                                <Promotion />
                            </el-icon>
                            <span>{{ isScanning ? '正在監聽掃碼槍...' : '掃碼槍待機中' }}</span>
                        </div>


                        <div class="action-mode">
                            <el-button :class="checkActive === 'checkin' ? 'active' : ''" class="checkin-btn"
                                @click="switchCheckBtn('checkin')">
                                簽到模式
                            </el-button>
                            <el-button :class="checkActive === 'checkout' ? 'active' : ''" class="checkout-btn"
                                @click="switchCheckBtn('checkout')">
                                簽退模式
                            </el-button>
                        </div>
                    </div>

                    <p class="primary">{{ total }} 位參加者</p>
                    <div class="scroll-box">
                        <el-scrollbar ref="scrollRef" @scroll.native="handleScroll">
                            <el-card v-for="item in showAttendeesList" class="checkin-data-card">
                                <div class="member-info" @click="openDrawer(item)">
                                    <p class="attendee-name" v-if="item.member.chineseName">{{ item.member.chineseName
                                        }}</p>
                                    <p class="attendee-name" v-else>{{ item.member.firstName }} {{ item.member.lastName
                                        }}</p>
                                    <p>{{ memberEnums[item.member.category] }}</p>
                                </div>
                                <el-icon class="checkin-icon" :class="item.isCheckedIn ? 'checkin' : ''"
                                    @click="handleClickCheckIcon(item)">
                                    <CircleCheck />
                                </el-icon>
                            </el-card>
                        </el-scrollbar>
                    </div>
                </div>


            </div>

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

        <!-- 印表機設定對話框 -->
        <el-dialog v-model="isPrinterConfigVisible" title="印表機設定" width="60%" class="printer-config-dialog"
            :before-close="closePrinterConfig">
            <div class="printer-config">
                <el-form label-position="left" label-width="120px">
                    <PrinterComponent ref="printComponentRef"></PrinterComponent>
                </el-form>

                <div class="printer-actions">
                    <el-button @click="initializePrinters" :loading="isPrinterLoading">重新整理印表機</el-button>
                    <el-button type="primary" @click="print" :disabled="!isConnected">測試列印</el-button>
                    <el-button type="success" plain @click="temporaryStore">暫存</el-button>
                </div>
            </div>
        </el-dialog>

        <!-- 移除原本的測試組件，改為設定按鈕 -->
        <!-- <TSCPrinterExample></TSCPrinterExample> -->
    </section>
</template>
<script lang="ts" setup>
import { ref, reactive, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
import {
    getAttendeeListByTagAndPaginationApi,
    insertAttendeeOnSiteApi,
} from "@/api/attendee";
import { checkinApi, deleteLastCheckinRecordApi, getCheckDataApi } from "@/api/checkin";
import { useBarcodeGun } from "@/composables/useBarcodeGun";
import { useTSC, type PrintData } from "@/composables/useTSC";
import { ElNotification, ElMessage, FormInstance } from "element-plus";
import TSCPrinterExample from "@/components/TSCPrinterExample.vue";
import {
    Promotion,
    Delete,
    Position,
    Setting,
    Printer,
    RefreshLeft
} from "@element-plus/icons-vue";

import { memberEnums } from "@/enums/MemberEnum";
import { formRulesTW } from "@/utils/checkSum";

import { useAppStore } from "@/store";

import PrinterComponent from "@/views/printer/index.vue";

// const closeSidebar = () => {
//     const appStore = useAppStore();
//     appStore.closeSideBar();
// };

/**---------------TSC印表機設置----------------- */
const {
    isConnected,
    isLoading: isPrinterLoading,
    error: printerError,
    printLabel,
    selectedPrinter,
    usbPrinters,
    driverPrinters,
    connectionType,
    setConnectionType,
    initializePrinters,
    labelConfig
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

const printComponentRef = ref<InstanceType<typeof PrinterComponent>>()
const print = () => {
    if (printComponentRef.value) {
        printComponentRef.value.printLabel()
    } else {
        ElNotification({
            title: '錯誤',
            message: '無法找到列印組件，請稍後再試。',
            type: 'error',
        })
    }
}

// 標籤設定和預覽


const INCH_TO_PX = 96
const INCH_TO_DOT = 300
const PX_TO_DOT = INCH_TO_DOT / INCH_TO_PX
const previewCanvas = ref<HTMLCanvasElement | null>(null)
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
            x: 3,           // 第一行 X 軸位置 (mm)
            y: 2,           // 第一行 Y 軸位置 (mm)
            fontSize: 155   // 第一行字體大小
        },
        {
            text: '中文名', // 第二行文字內容
            textType: 'chineseName',
            textInfo: {
                textType: 'chineseName',
                textShow: '中文名'
            },
            x: 8,           // 第二行 X 軸位置 (mm) - 可獨立設定
            y: 15,          // 第二行 Y 軸位置 (mm) - 可獨立設定
            fontSize: 130   // 第二行字體大小 - 可獨立設定
        }
    ]
})

// 監聽 labelSettings 變化並更新 labelConfig
watch(
    () => [labelSettings.width, labelSettings.height],
    ([newWidth, newHeight]) => {
        if (labelConfig) {
            labelConfig.value.widthMm = newWidth
            labelConfig.value.heightMm = newHeight
            console.log(`標籤配置已更新: ${newWidth} × ${newHeight}mm`)
        }
    },
    { immediate: true }
)

// 監聽字體大小變化並更新預覽
watch(
    () => labelSettings.lines.map(line => line.fontSize),
    () => {
        updatePreview()
    },
    { deep: true }
)

let measureCanvas: HTMLCanvasElement | null = null
let measureCtx: CanvasRenderingContext2D | null = null

const getPreciseWidth = (text: string,
    fontHeightDots: number,
    fontStyle: any,
    faceName: string) => {
    if (!measureCanvas) {
        measureCanvas = document.createElement('canvas')
        measureCtx = measureCanvas.getContext('2d')
    }
    if (!measureCtx) return 0

    // 將 mm 轉回瀏覽器像素供測量 (假設 1mm = 3.78px)
    const fontHeightPx = fontHeightDots / PX_TO_DOT
    const italic = (fontStyle === '1' || fontStyle === '3') ? 'italic ' : ''
    const bold = (fontStyle === '2' || fontStyle === '3') ? 'bold ' : ''

    measureCtx.font = `${italic}${bold}${fontHeightPx}px "${faceName}"`

    const metrics = measureCtx.measureText(text)
    const pureWidthPx = (metrics.actualBoundingBoxRight - metrics.actualBoundingBoxLeft) * 0.85

    return Math.round(pureWidthPx * PX_TO_DOT)
}

// 計算文字邊界和安全區域 - 支援多行獨立設定
const textBounds = computed(() => {
    // 考慮TSC印表機的邊距
    const leftMargin = 2
    const rightMargin = 2
    const topMargin = 1
    const bottomMargin = 1

    // 計算每一行的邊界信息
    const linesBounds = labelSettings.lines.map((line, index) => {
        const fontSizeMm = line.fontSize / 300 * 25.4  // 將字體大小轉換為毫米
        const lineHeightMm = fontSizeMm * 0.9   // 單行高度

        // 計算這一行的寬度
        const lineWidthMm = getPreciseWidth(line.text, line.fontSize, '0', 'Arial') / 300 * 25.4 // 將字體寬度轉換為毫米

        // 計算安全的最大位置（確保文字不會超出標籤邊界）
        const maxX = Math.max(leftMargin, labelSettings.width - lineWidthMm - rightMargin)
        const maxY = Math.max(topMargin, labelSettings.height - lineHeightMm - bottomMargin)

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

    linesBounds.forEach(lineBound => {
        minX = Math.min(minX, lineBound.x)
        minY = Math.min(minY, lineBound.y)
        maxRight = Math.max(maxRight, lineBound.x + lineBound.textWidthMm)
        maxBottom = Math.max(maxBottom, lineBound.y + lineBound.textHeightMm)
    })

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
        lineCount: labelSettings.lines.length,
        // 整體邊界框
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

// 計算動態字體大小基準
const canvasFontSizes = computed(() => {
    // 基於標籤設定中最大字體大小計算基準
    const maxFontSize = Math.max(...labelSettings.lines.map(line => line.fontSize))
    const baseFontSize = Math.max(8, maxFontSize / 12) // 基準字體大小

    return {
        labelText: (fontSize: number) => Math.max(12, fontSize / 10), // 標籤文字
        coordInfo: Math.max(8, baseFontSize * 0.8), // 座標信息
        sizeInfo: Math.max(8, baseFontSize * 0.7), // 尺寸信息  
        warningTitle: Math.max(12, baseFontSize * 1.2), // 警告標題
        warningText: Math.max(10, baseFontSize) // 警告文字
    }
})



// 更新預覽畫面
const updatePreview = () => {
    if (!previewCanvas.value) return

    console.log(`更新預覽: ${textBounds.value.lineCount} 行文字`)
    console.log('文字邊界信息:', labelSettings.lines)

    const canvas = previewCanvas.value
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // 清除畫布
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // 計算縮放比例 (1mm = 4 像素)
    const scale = 4
    const canvasMargin = 20
    const labelWidth = labelSettings.width * scale
    const labelHeight = labelSettings.height * scale

    // 繪製標籤背景
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(canvasMargin, canvasMargin, labelWidth, labelHeight)
    ctx.strokeStyle = '#333333'
    ctx.lineWidth = 2
    ctx.strokeRect(canvasMargin, canvasMargin, labelWidth, labelHeight)

    // 繪製邊距線（顯示安全區域）
    ctx.strokeStyle = '#e0e0e0'
    ctx.lineWidth = 1
    ctx.setLineDash([3, 3])
    const leftMarginPx = textBounds.value.leftMargin * scale
    const rightMarginPx = textBounds.value.rightMargin * scale
    const topMarginPx = textBounds.value.topMargin * scale
    const bottomMarginPx = textBounds.value.bottomMargin * scale

    // 左邊距線
    ctx.beginPath()
    ctx.moveTo(canvasMargin + leftMarginPx, canvasMargin)
    ctx.lineTo(canvasMargin + leftMarginPx, canvasMargin + labelHeight)
    ctx.stroke()

    // 右邊距線
    ctx.beginPath()
    ctx.moveTo(canvasMargin + labelWidth - rightMarginPx, canvasMargin)
    ctx.lineTo(canvasMargin + labelWidth - rightMarginPx, canvasMargin + labelHeight)
    ctx.stroke()

    // 上邊距線
    ctx.beginPath()
    ctx.moveTo(canvasMargin, canvasMargin + topMarginPx)
    ctx.lineTo(canvasMargin + labelWidth, canvasMargin + topMarginPx)
    ctx.stroke()

    // 下邊距線
    ctx.beginPath()
    ctx.moveTo(canvasMargin, canvasMargin + labelHeight - bottomMarginPx)
    ctx.lineTo(canvasMargin + labelWidth, canvasMargin + labelHeight - bottomMarginPx)
    ctx.stroke()

    ctx.setLineDash([]) // 重置虛線

    // 繪製網格線 (每 5mm 一條線)
    ctx.strokeStyle = '#f5f5f5'
    ctx.lineWidth = 1
    for (let i = 5; i < labelSettings.width; i += 5) {
        const x = canvasMargin + i * scale
        ctx.beginPath()
        ctx.moveTo(x, canvasMargin)
        ctx.lineTo(x, canvasMargin + labelHeight)
        ctx.stroke()
    }
    for (let i = 5; i < labelSettings.height; i += 5) {
        const y = canvasMargin + i * scale
        ctx.beginPath()
        ctx.moveTo(canvasMargin, y)
        ctx.lineTo(canvasMargin + labelWidth, y)
        ctx.stroke()
    }

    // 檢查是否有任一行超出範圍
    let hasOutOfBounds = false

    // 繪製每一行文字（支援獨立設定）
    textBounds.value.lines.forEach((line, index) => {
        // 計算正確的字體大小，讓它與邊界框匹配
        const fontSizeMm = line.fontSize / 300 * 25.4  // TSC 字體大小轉換為毫米
        const fontSize = fontSizeMm * scale  // 轉換為 Canvas 像素

        ctx.font = `bold ${fontSize}px Arial`
        ctx.fillStyle = '#000000'
        ctx.textAlign = 'left'
        ctx.textBaseline = 'alphabetic' // 使用基線，與 TSC 印表機一致

        // 計算文字位置（TSC座標系統：Y座標為基線位置）
        const textX = canvasMargin + line.x * scale
        // TSC 的 Y 座標是基線，需要加上字體高度來匹配
        const fontHeightPx = fontSize
        const textY = canvasMargin + line.y * scale + fontHeightPx

        ctx.save()
        const printerScaleX = 0.9 // 水平縮放

        // 繪製文字
        ctx.translate(textX, textY)
        ctx.scale(printerScaleX, 1) // 水平縮放
        ctx.fillText(line.text, 0, 0)
        ctx.restore()
        // ctx.fillText(line.text, textX, textY)

        // 繪製每行的邊界框（顯示實際文字佔用範圍）
        const lineColor = index === 0 ? '#ff9800' : '#00bcd4' // 第一行橙色，第二行青色
        ctx.strokeStyle = lineColor
        ctx.lineWidth = 1
        ctx.setLineDash([2, 2])
        const textWidthPx = line.textWidthMm * scale * printerScaleX // 水平縮放後的寬度
        const textHeightPx = line.textHeightMm * scale
        // 邊界框從 Y 座標向上繪製（因為文字是向上延伸的）
        ctx.strokeRect(textX, textY - fontHeightPx, textWidthPx, textHeightPx)
        ctx.setLineDash([])

        // 繪製位置指示器（顯示 TSC 座標點）
        ctx.fillStyle = index === 0 ? '#ff4d4f' : '#1890ff' // 第一行紅色，第二行藍色
        ctx.beginPath()
        // 指示器顯示在實際 TSC Y 座標位置
        const tscYIndicator = canvasMargin + line.y * scale
        ctx.arc(textX, tscYIndicator, 4, 0, 2 * Math.PI)
        ctx.fill()

        // 顯示座標信息
        ctx.fillStyle = '#333333'
        ctx.font = `bold ${canvasFontSizes.value.coordInfo}px Arial`
        ctx.textAlign = 'left'
        ctx.textBaseline = 'top' // 座標信息使用 top 對齊
        const yOffset = index * 15 - 20
        ctx.fillText(`第${index + 1}行: (${line.x}, ${line.y})mm`, textX + 8, tscYIndicator + yOffset)

        // 檢查是否超出範圍
        const textRight = line.x + line.textWidthMm
        const textBottom = line.y + line.textHeightMm
        const isLineOutOfBounds = (
            line.x < textBounds.value.leftMargin ||
            line.y < textBounds.value.topMargin ||
            line.x > line.maxX ||
            line.y > line.maxY ||
            textRight > (labelSettings.width - textBounds.value.rightMargin) ||
            textBottom > (labelSettings.height - textBounds.value.bottomMargin)
        )

        if (isLineOutOfBounds) {
            hasOutOfBounds = true
            console.warn(`第${index + 1}行超出標籤範圍:`, {
                position: { x: line.x, y: line.y },
                textSize: { width: line.textWidthMm, height: line.textHeightMm },
                textEnd: { x: textRight, y: textBottom },
                labelSize: { width: labelSettings.width, height: labelSettings.height },
                line: line.text,
                safeArea: {
                    minX: textBounds.value.leftMargin,
                    minY: textBounds.value.topMargin,
                    maxX: line.maxX,
                    maxY: line.maxY
                }
            })
        }
    })

    // 顯示尺寸信息
    ctx.font = `${canvasFontSizes.value.sizeInfo}px Arial`
    ctx.fillStyle = '#666666'
    ctx.textAlign = 'left'
    ctx.fillText(`標籤: ${labelSettings.width} × ${labelSettings.height}mm (${textBounds.value.lineCount}行文字)`, canvasMargin, canvasMargin + labelHeight + 15)
    ctx.fillText(`整體範圍: ${textBounds.value.overallBounds.width} × ${textBounds.value.overallBounds.height}mm`, canvasMargin, canvasMargin + labelHeight + 30)

    // 如果有超出範圍的行，顯示警告
    if (hasOutOfBounds) {
        ctx.fillStyle = 'rgba(255, 0, 0, 0.2)'
        ctx.fillRect(canvasMargin, canvasMargin, labelWidth, labelHeight)

        ctx.fillStyle = '#ff0000'
        ctx.font = `bold ${canvasFontSizes.value.warningTitle}px Arial`
        ctx.textAlign = 'center'
        ctx.fillText('⚠️ 部分文字超出安全範圍!', canvasMargin + labelWidth / 2, canvasMargin + labelHeight / 2 - 8)
        ctx.font = `${canvasFontSizes.value.warningText}px Arial`
        ctx.fillText('請調整文字位置或大小', canvasMargin + labelWidth / 2, canvasMargin + labelHeight / 2 + 10)
        ctx.font = `${canvasFontSizes.value.warningText}px Arial`
        ctx.fillText('否則打印會自動調整文字大小', canvasMargin + labelWidth / 2, canvasMargin + labelHeight / 2 + 25)
    }
}

// 文字置中 - 重新設計的置中邏輯
const centerText = () => {
    console.log('開始多行置中計算...')

    if (!previewCanvas.value) {
        console.warn('Canvas 不可用，無法執行置中')
        return
    }

    const canvas = previewCanvas.value
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // 1. 計算標籤的實際可用區域(除去邊距)
    const usableWidth = labelSettings.width - textBounds.value.leftMargin - textBounds.value.rightMargin
    const usableHeight = labelSettings.height - textBounds.value.topMargin - textBounds.value.bottomMargin

    // 2. 計算可用區域的中心點
    const usableAreaCenterX = textBounds.value.leftMargin + (usableWidth / 2)
    const usableAreaCenterY = textBounds.value.topMargin + (usableHeight / 2)

    // 3. 計算整體文字區域的高度（所有行的範圍）
    let minY = Infinity, maxBottom = -Infinity
    textBounds.value.lines.forEach(lineBound => {
        minY = Math.min(minY, lineBound.y)
        maxBottom = Math.max(maxBottom, lineBound.y + lineBound.textHeightMm)
    })

    const totalHeightUsed = maxBottom - minY

    // 4. 計算垂直偏移來置中所有行
    const verticalOffset = usableAreaCenterY - totalHeightUsed / 2 - minY

    // 5. 為每一行設定置中位置
    labelSettings.lines.forEach((line, index) => {
        const lineInfo = textBounds.value.lines[index]

        // 使用 Canvas 測量實際文字寬度以獲得更準確的寬度
        const fontSizeMm = line.fontSize / 300 * 25.4
        const scale = 4 // 與預覽 Canvas 相同的縮放比例
        const fontSize = fontSizeMm * scale

        ctx.font = `bold ${fontSize}px Arial`
        const measuredWidth = ctx.measureText(line.text).width
        const actualTextWidthMm = (measuredWidth / scale) * 0.9// 轉回毫米

        // 水平置中
        const centerX = usableAreaCenterX - (actualTextWidthMm / 2)

        // 垂直位置：保持相對位置並整體置中
        const centerY = line.y + verticalOffset

        // 確保在安全範圍內
        line.x = Math.max(textBounds.value.leftMargin, Math.min(centerX, lineInfo.maxX))
        line.y = Math.max(textBounds.value.topMargin, Math.min(centerY, lineInfo.maxY))

        line.x = Math.round(line.x * 10) / 10
        line.y = Math.round(line.y * 10) / 10

        console.log(`第${index + 1}行置中後位置: (${line.x}, ${line.y})mm, 文字寬度: ${actualTextWidthMm}mm`)
    })
    updatePreview()
}



// 自動打印開關
const isAutoPrintEnabled = ref(true)

// 多行獨立設定打印函數
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

            console.log(`第${index + 1}行: "${line.text}" 原始位置(${line.x.toFixed(1)}, ${line.y.toFixed(1)})mm 補償位置(${xDots}, ${yDots})dots`)

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

// 打印用戶名稱標籤（使用多行自定義位置）
const printUserNameLabel = async (attendee: any) => {
    if (!isAutoPrintEnabled.value || !isConnected.value) {
        console.log('自動打印已關閉或印表機未連接')
        return false
    }

    console.log(labelSettings.lines)

    const memberInfo = attendee.member || {}

    try {
        const lastName = memberInfo.lastName.trim().charAt(0).toUpperCase() + memberInfo.lastName.trim().slice(1).toLowerCase()
        console.log(lastName.trim().charAt(0).toUpperCase())

        // 同理處理 firstName (確保結尾沒有 .toUpperCase())
        const firstName = memberInfo.firstName.trim().toLowerCase().replace(/(^|[- ]+)(.)/g, (match: any, separator: any, letter: any) => {
            return separator + letter.toUpperCase();
        });

        const userName = `${firstName} ${lastName}`
        console.log(`準備打印用戶標籤: ${userName}`)
        labelSettings.lines.forEach((line) => {
            line.text = '' // 先清空所有行文字  
            switch (line.textInfo.textType) {
                case 'userName':
                    line.text = userName
                    break
                case 'chineseName':
                    line.text = memberInfo.chineseName || ''
                    break
                case 'affiliation':
                    line.text = memberInfo.affiliation || ''
                    break
                case 'jobTitle':
                    line.text = memberInfo.jobTitle || ''
                    break
                default:
                    // 保持原有文字或空白
                    break
            }
        }) // 先清空所有行文字

        // labelSettings.lines[0].text = userName
        // if (memberInfo.chineseName) {
        //     labelSettings.lines[1].text = chineseName
        // } else {
        //     labelSettings.lines[1].text = ''
        // }
        // 使用多行設定來打印
        const lines = labelSettings.lines.filter(line => line.text.trim() !== '')

        if (lines.length === 0) {
            // 如果沒有設定，使用預設設定
            const printData: PrintData = {
                text: userName,
                fontSize: 120,
                x: 3,
                y: 2,
                rotation: '0',
                fontStyle: '2', // 粗體
                fontFamily: 'Arial'
            }
            const success = await printLabel(printData, 1)

            if (success) {
                ElMessage.success({
                    message: `已打印 ${userName} 的名牌標籤`,
                    duration: 3000
                })
                console.log(`成功打印用戶標籤: ${userName}`)
            } else {
                ElMessage.warning({
                    message: '標籤列印失敗，請檢查印表機狀態',
                    duration: 3000
                })
            }
            return success
        } else {
            // 使用多行獨立設定打印
            // 暫時更新第一行文字為用戶名以進行置中計算
            const originalFirstLineText = lines[0].text
            // labelSettings.lines[0].text = userName

            console.log(lines)
            // 重新計算置中位置 (基於實際的用戶名)
            centerText()

            // 準備打印資料：第一行使用用戶名，其餘行保持原設定
            const printLines = labelSettings.lines.slice(0, lines.length).map((line, index) => ({
                text: lines[index].text,
                x: line.x,
                y: line.y,
                fontSize: line.fontSize
            }))

            console.log(`多行獨立打印設定 (置中後):`, printLines)

            const success = await printLabelWithMultiLineSettings(printLines)

            // 恢復原始第一行文字
            labelSettings.lines[0].text = originalFirstLineText

            if (success) {
                ElMessage.success({
                    message: `已打印 ${userName} 的名牌標籤 (${lines.length}行)`,
                    duration: 3000
                })
                console.log(`成功打印多行用戶標籤: ${userName}`)
            } else {
                ElMessage.warning({
                    message: '標籤列印失敗，請檢查印表機狀態',
                    duration: 3000
                })
            }

            return success
        }

    } catch (error) {
        console.error('打印標籤時發生錯誤:', error)
        ElMessage.error({
            message: '打印標籤時發生錯誤',
            duration: 3000
        })
        return false
    }
}

/**---------------掃碼槍設置----------------- */
const { startScan, stopScan, isScanning, setScanCallback } = useBarcodeGun({
    enableScanCallback: true,
    debounceTime: 100,
    autoSubmit: true
});

/**---------------checkin || checkout----------------- */

const member = reactive<any>({});
// 簽到退提交資料
const submitCheckData = reactive<any>({
    attendeesId: "",
    location: "",
    actionType: 1, // 默認簽到模式
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
        ElMessage.success({
            message: `會員${clickRecord.member.chineseName}:簽退成功`,
            // duration: 1000,
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
        let res = await checkinApi(submitCheckData);
        Object.assign(member, res.data);
        let category = "";
        switch (res.data.attendeesVO.member.category) {
            case 1:
                category = "一般會員";
                break;
        }

        const type = submitCheckData.actionType == 1 ? "簽到成功" : "簽退成功";
        if (res.data.attendeesVO.isLastYearAttendee) {
            ElNotification({
                title: `會員編號:${res.data.attendeesVO.sequenceNo}`,
                dangerouslyUseHTMLString: true,
                message: `<p style="color:green;font-weight:bold;">${type}</p> 會員: ${res.data.attendeesVO.member.chineseName}<br/>會員類別: ${category}<br/> <p style="color:green;">為去年年會參加會員</p>`,
                duration: 10000,
                type: "success",
            });
        } else {
            ElNotification({
                title: `會員編號:${res.data.attendeesVO.sequenceNo}`,
                dangerouslyUseHTMLString: true,
                message: `<p style="color:green;font-weight:bold;">${type}</p>會員: ${res.data.attendeesVO.member.chineseName}<br/>會員類別: ${category}<br/><p style="color:red;"> 非去年年會參加會員</p>`,
                duration: 10000,
                type: "success",
            });
        }

        handleUpdateList();
        getCheckData();

        // 自動打印用戶名稱標籤（僅簽到成功時）
        if (submitCheckData.actionType === 1 && res.data?.attendeesVO?.member) {
            try {
                // 1. 等待設定載入完成
                await nextTick(() => {
                    loadTemporaryStoredSettings();
                }); // 確保設定更新後 DOM 也更新
                // 2. 設定載入後，可以稍微給予 DOM 或狀態更新一點點時間 (選用)
                // 如果 loadTemporaryStoredSettings 只是純資料存取，這行甚至可以省略
                await new Promise(resolve => setTimeout(resolve, 100));
                console.log(labelSettings.lines)
                // 3. 執行打印
                printUserNameLabel(res.data.attendeesVO);
            } catch (error) {
                console.error("載入設定或列印失敗:", error);
            }
        }

    } catch (error) {
        // console.log(error);
        // ElMessage({
        //   dangerouslyUseHTMLString: true,
        //   message: `<p class='error-msg'>${error}</p>`,
        //   type: "error",
        // });
    }
};

/**---------------掃碼槍回調處理----------------- */
const isScannable = ref(true);

// 掃碼槍掃描成功回調
const handleBarcodeScanned = async (scannedCode: string) => {
    if (!isScannable.value) return;
    isScannable.value = false;

    console.log('掃碼槍掃描成功:', scannedCode);

    try {
        // 解碼 QR 碼內容 (假設是 base64 編碼的 attendeesId)
        submitCheckData.attendeesId = atob(scannedCode);
        await checkin();
    } catch (error) {
        console.error('QR 碼解碼失敗:', error);
        ElMessage({
            message: "QR 碼格式錯誤，請重新掃描",
            type: "error",
        });
    }

    // 防重複掃描
    setTimeout(() => {
        isScannable.value = true;
    }, 500);
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
const isPrinterConfigVisible = ref(false)

const openDialog = () => {
    isDialogVisible.value = true;
    handleSaveLastScrollData();
};

const temporaryStoredSettings = reactive({
    labelSettings: labelSettings
})

const temporaryStore = () => {
    printComponentRef.value?.setTempSetting() // 確保在存儲前先置中，讓用戶看到最佳預覽
    // console.log('臨時存儲當前設定:', JSON.stringify(temporaryStoredSettings.labelSettings))
    // localStorage.setItem('temporaryLabelSettings', JSON.stringify(labelSettings))
}

const loadTemporaryStoredSettings = () => {
    const storedSettings = localStorage.getItem('temporaryLabelSettings')
    if (storedSettings) {
        try {
            const parsedSettings = JSON.parse(storedSettings)
            Object.assign(labelSettings, parsedSettings)
            console.log('載入臨時存儲的設定:', labelSettings)
            updatePreview()
        } catch (error) {
            console.error('載入臨時存儲設定失敗:', error)
        }
    } else {
        console.log('沒有找到臨時存儲的設定')
        centerText() // 如果沒有存儲，則執行置中
        updatePreview()
    }

}

// 開啟印表機設定對話框
const openPrinterConfig = () => {
    isPrinterConfigVisible.value = true

    stopScan()
    // 等待 DOM 更新後初始化預觽
    nextTick(() => {
        // centerText()
        loadTemporaryStoredSettings()
    })
}



const closePrinterConfig = () => {
    isPrinterConfigVisible.value = false
    startScan()
}



// 測試列印（使用當前預觽設定）
// 測試列印（使用當前預覽設定）
const testPrint = async () => {
    console.log('=== 開始測試列印 ===')

    // 基本連接檢查
    if (!isConnected.value) {
        ElMessage.error('印表機未連接，請先連接印表機')
        return false
    }

    // 檢查所有行的邊界
    let needsAdjustment = false

    labelSettings.lines.forEach((line, index) => {
        const lineInfo = textBounds.value.lines[index]
        if (!lineInfo) return

        if (line.x > lineInfo.maxX ||
            line.y > lineInfo.maxY ||
            line.x < textBounds.value.leftMargin ||
            line.y < textBounds.value.topMargin) {

            needsAdjustment = true

            // 自動調整到安全位置
            line.x = Math.max(textBounds.value.leftMargin,
                Math.min(line.x, lineInfo.maxX))
            line.y = Math.max(textBounds.value.topMargin,
                Math.min(line.y, lineInfo.maxY))

            console.log(`調整第${index + 1}行座標: x=${line.x}mm, y=${line.y}mm`)
        }
    })

    if (needsAdjustment) {
        ElMessage.warning('部分座標超出安全範圍，已自動調整到安全位置')
        updatePreview()
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

        console.log(`測試打印多行獨立設定:`, printLines)

        const success = await printLabelWithMultiLineSettings(printLines)

        if (success) {
            ElMessage.success(`測試列印完成！已打印包含 ${validLines.length} 行文字的標籤。`)
        } else {
            ElMessage.error('測試列印失敗！請檢查印表機狀態。')
        }

        console.log('=== 測試列印結束 ===')
        return success

    } catch (error) {
        console.error('測試列印時發生錯誤:', error)
        ElMessage.error('測試列印時發生錯誤')
        return false
    }
}

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

/**---------------簽到退模式切換----------------- */
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


/**---------------生命週期和初始化----------------- */
onMounted(() => {
    // 設置掃碼槍回調
    setScanCallback(handleBarcodeScanned);

    // 初始化數據
    getCheckData();
    // closeSidebar();
    getAttendeeList();
    updateEveryMinute();

    // 初始化印表機
    initializePrinters()

    console.log('掃碼槍簽到系統已啟動');
});

onUnmounted(() => {
    stopScan(); // 確保組件卸載時停止掃碼監聽
});
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

    .barcode-gun-status {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background-color: #f5f7fa;
        padding: 1rem;
        border-radius: 8px;
        margin: 1rem 0;

        .status-indicator {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            color: #909399;

            &.active {
                color: #67c23a;
                animation: pulse 2s infinite;
            }

            @keyframes pulse {
                0% {
                    opacity: 1;
                }

                50% {
                    opacity: 0.6;
                }

                100% {
                    opacity: 1;
                }
            }
        }

        .action-mode {
            display: flex;
            gap: 0;

            .checkin-btn {
                font-size: 1rem;
                border-radius: 5px 0 0 5px;
            }

            .checkout-btn {
                font-size: 1rem;
                border-radius: 0 5px 5px 0;
                margin: 0;
            }

            .active {
                background-color: #409eff;
                color: white;
            }
        }
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

@media (max-width: 768px) {
    .barcode-gun-status {
        flex-direction: column !important;
        gap: 1rem;
    }
}

// 邊界信息樣式
.bounds-info {
    display: flex;
    justify-content: space-between;
    margin-top: 5px;
    font-size: 11px;

    .info-text {
        color: #409eff;
        font-weight: 500;
    }

    .size-info {
        color: #909399;
    }
}

// 位置控制改進
.position-controls {
    .el-form-item {
        margin-bottom: 20px;
    }

    .el-slider {
        margin-bottom: 8px;
    }

    .line-settings {
        background: #fafafa;
        margin-bottom: 20px;

        h5 {
            margin: 0 0 15px 0;
            font-weight: 600;
        }

        .bounds-info {
            font-size: 12px;
            color: #666;
            line-height: 1.4;

            .info-text {
                color: #909399;
            }

            .size-info {
                color: #67c23a;
                font-weight: 500;
            }
        }

        .line-actions {
            display: flex;
            gap: 8px;
            margin-top: 15px;

            .el-button {
                font-size: 12px;
            }
        }
    }

    .global-actions {
        display: flex;
        gap: 10px;
        margin-top: 20px;
        padding-top: 15px;
        border-top: 1px solid #ebeef5;

        .el-button {
            flex: 1;
        }
    }
}

// 印表機整合樣式
.printer-status {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 8px;

    .status-indicator {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 14px;
        color: #909399;

        &.active {
            color: #67C23A;
        }

        &.error {
            color: #F56C6C;
        }

        .el-icon {
            font-size: 16px;
        }
    }
}

.printer-config {
    .printer-actions {
        display: flex;
        justify-content: flex-end;
        gap: 12px;
        margin-top: 20px;
    }

    .error-text {
        color: #F56C6C;
        font-size: 12px;
        margin-left: 8px;
    }
}

.printer-config-btn {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 8px 12px;
    color: #409EFF;

    &:hover {
        background-color: #f0f9ff;
    }
}

// 自動打印狀態樣式
.el-switch {
    &.is-disabled {
        opacity: 0.5;
    }
}

// 打印狀態提示
.print-status-tips {
    background: #f0f9ff;
    border: 1px solid #b3d8ff;
    border-radius: 4px;
    padding: 8px 12px;
    margin-bottom: 16px;
    font-size: 13px;
    color: #409EFF;

    .el-icon {
        margin-right: 6px;
    }
}

.preview-canvas-container {
    display: flex;
}
</style>
