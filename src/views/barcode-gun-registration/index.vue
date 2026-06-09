<template>
    <section class="main-section">
        <el-card class="main-card">
            <div class="data-section">
                <AttendeesStats ref="attendeeStatsRef" />
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
                            <span>{{ isScanListenerEnabled ? '正在監聽掃碼槍...' : '掃碼槍待機中' }}</span>
                            <el-switch v-model="isScanListenerEnabled" active-text="啟用" inactive-text="停用"></el-switch>
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
                        <el-text v-if="attendee.member && attendee.member.chineseName">{{ attendee.member.chineseName
                            }}</el-text>
                        <el-text v-else>{{ attendee.member.firstName }}{{ attendee.member.lastName }}</el-text>
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
import AttendeesStats from "@/components/AttendeesRegistration/index.vue";
import { checkinApi, deleteLastCheckinRecordApi, getCheckDataApi } from "@/api/checkin";
import { useBarcodeGun } from "@/composables/useBarcodeGun";
import { useTSC, type PrintData } from "@/composables/useTSC";
import { ElNotification, ElMessage, FormInstance } from "element-plus";
import {
    Promotion,
    Setting,
    RefreshLeft
} from "@element-plus/icons-vue";

import { memberEnums } from "@/enums/MemberEnum";
import { formRulesTW } from "@/utils/checkSum";


import PrinterComponent from "@/views/printer/index.vue";

const attendeeStatsRef = ref<InstanceType<typeof AttendeesStats>>()
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
const PRINT_X_COMPENSATION_MM = -3.0

const labelSettings = reactive({
    width: 95,      // 標籤寬度 (mm)
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
            fontSize: 155,   // 第一行字體大小
            positionMode: ''
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
            fontSize: 130,   // 第二行字體大小 - 可獨立設定
            positionMode: ''
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
        // updatePreview()
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



// 文字置中 - 重新設計的置中邏輯
const centerText = () => {
    console.log('開始多行置中計算...')

    // 1. 計算標籤的實際可用區域(除去邊距)
    const usableWidth = labelSettings.width - textBounds.value.leftMargin - textBounds.value.rightMargin
    const usableHeight = labelSettings.height - textBounds.value.topMargin - textBounds.value.bottomMargin

    // 2. 計算可用區域的中心點
    const usableAreaCenterX = textBounds.value.leftMargin + (usableWidth / 2)
    const usableAreaCenterY = textBounds.value.topMargin + (usableHeight / 2)

    // 3. 只針對有內容的行做置中，避免空行影響整體位置
    const activeLines = textBounds.value.lines.filter(lineBound => lineBound.text.trim() !== '')

    if (activeLines.length === 0) {
        console.warn('沒有可置中的文字行')
        return
    }

    // 4. 計算整體文字區域的高度（所有行的範圍）
    let minY = Infinity, maxBottom = -Infinity
    activeLines.forEach(lineBound => {
        minY = Math.min(minY, lineBound.y)
        maxBottom = Math.max(maxBottom, lineBound.y + lineBound.textHeightMm)
    })

    const totalHeightUsed = maxBottom - minY

    // 5. 計算垂直偏移來置中所有行
    const verticalOffset = usableAreaCenterY - totalHeightUsed / 2 - minY

    // 6. 為每一行設定置中位置（不依賴 canvas，直接使用 textBounds 的寬高）
    labelSettings.lines.forEach((line, index) => {
        const lineInfo = textBounds.value.lines[index]
        if (!lineInfo || line.text.trim() === '') return

        // 水平置中
        const centerX = usableAreaCenterX - (lineInfo.textWidthMm / 2)

        // 垂直位置：保持相對位置並整體置中
        const centerY = line.y + verticalOffset

        // 確保在安全範圍內
        line.x = Math.max(textBounds.value.leftMargin, Math.min(centerX, lineInfo.maxX))
        line.y = Math.max(textBounds.value.topMargin, Math.min(centerY, lineInfo.maxY))

        line.x = Math.round(line.x * 10) / 10
        line.y = Math.round(line.y * 10) / 10

        console.log(`第${index + 1}行置中後位置: (${line.x}, ${line.y})mm, 文字寬度: ${lineInfo.textWidthMm}mm`)
    })
    // updatePreview()
}



// 自動打印開關

const wrapTextByWidthMm = (text: string, fontSize: number, maxWidthMm: number): string[] => {
    console.log(`開始換行計算 - 字體大小: ${fontSize}, 可用寬度: ${maxWidthMm}mm, 原始文字: "${text}"`)
    const normalizedText = (text || '').trim()
    if (!normalizedText) return []
    if (maxWidthMm <= 0) return [normalizedText]

    const wrappedLines: string[] = []
    let currentLine = ''

    for (const char of Array.from(normalizedText)) {
        if (!currentLine && /\s/.test(char)) {
            continue
        }

        const candidate = currentLine + char
        const candidateWidthMm = getPreciseWidth(candidate, fontSize, '0', 'Arial') / INCH_TO_DOT * 25.4

        if (!currentLine || candidateWidthMm <= maxWidthMm) {
            currentLine = candidate
            continue
        }

        let breakIndex = -1
        for (let i = currentLine.length - 1; i >= 0; i--) {
            if (/\s/.test(currentLine[i])) {
                breakIndex = i
                break
            }
        }

        if (breakIndex >= 0) {
            const linePart = currentLine.slice(0, breakIndex).trimEnd()
            if (linePart) {
                wrappedLines.push(linePart)
            }
            currentLine = (currentLine.slice(breakIndex + 1) + char).trimStart()
        } else {
            wrappedLines.push(currentLine.trimEnd())
            currentLine = char.trimStart()
        }
    }

    if (currentLine.trim()) {
        wrappedLines.push(currentLine.trim())
    }

    return wrappedLines.length > 0 ? wrappedLines : [normalizedText]
}

// 多行獨立設定打印函數
const printLabelWithMultiLineSettings = async (lines: Array<{ text: string, x: number, y: number, fontSize: number, textType: string }>) => {
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
        // 先依 Y 軸排序後進行動態重排：前一行換行時，後續行會自動下推避免重疊
        const sortedLines = lines
            .map((line, order) => ({ ...line, order }))
            .sort((a, b) => a.y - b.y || a.order - b.order)

        const safeLeft = textBounds.value.leftMargin
        const safeRight = labelSettings.width - textBounds.value.rightMargin
        const availableWidthMm = Math.max(1, safeRight - safeLeft) + PRINT_X_COMPENSATION_MM
        const topBoundary = textBounds.value.topMargin
        const bottomBoundary = labelSettings.height - textBounds.value.bottomMargin
        const blockGapMm = 0.5
        const usableHeightMm = bottomBoundary - topBoundary

        let flowCursorY = topBoundary

        const MIN_FONT_SIZE = 120
        const FONT_DECREASE_STEP = 15
        const layoutSegments: Array<{ text: string, fontSize: number, x: number, y: number, textType: string }> = []
        sortedLines.forEach((line, index) => {

            let currentFontSize = line.fontSize
            let wrappedLines: string[] = []

            // ================= 1. X 軸判定：優先縮小字型，縮到極限才折行 =================
            while (currentFontSize >= MIN_FONT_SIZE) {
                // 計算「整行不換行」時的精確寬度 (公釐)
                const fullTextWidthDots = getPreciseWidth(line.text, currentFontSize, '0', 'Arial')
                const fullTextWidthMm = fullTextWidthDots / INCH_TO_DOT * 25.4

                // 如果單行寬度小於可用寬度，完美單行塞下！
                if (fullTextWidthMm <= availableWidthMm) {
                    wrappedLines = [line.text]
                    break // 跳出 while
                }

                // 如果超過寬度，且還能再縮小
                console.log(currentFontSize > MIN_FONT_SIZE, `第 ${index + 1} 行文字寬度 (${fullTextWidthMm.toFixed(1)}mm) 超過可用寬度 (${availableWidthMm.toFixed(1)}mm)，嘗試縮小字型...`)
                if (currentFontSize > MIN_FONT_SIZE) {
                    currentFontSize -= FONT_DECREASE_STEP
                    console.log(`第 ${index + 1} 行文字 X 軸超寬，嘗試縮小字型至: ${currentFontSize}`)
                    wrappedLines = wrapTextByWidthMm(line.text, currentFontSize, availableWidthMm)
                } else {
                    // 已經縮到 12 了還是塞不下，逼不得已，呼叫換行機制
                    console.warn(`第 ${index + 1} 行字型已縮至極限 (${currentFontSize})，仍超寬，啟動換行機制`)
                    wrappedLines = wrapTextByWidthMm(line.text, line.fontSize, availableWidthMm)
                    break // 跳出 while
                }
            }

            // 印出排版前的真實狀態（深拷貝避免 console.log 延遲求值導致的顯示混淆）
            console.log(`第${index + 1}行排版計算 - 字型: ${currentFontSize}, 行數: ${wrappedLines.length}`)

            // ================= 2. 依據最終確定的字型，計算 Y 軸與行高 =================
            const lineHeightMm = (currentFontSize / INCH_TO_DOT * 25.4) * 1.1
            const startY = Math.max(line.y, flowCursorY)

            wrappedLines.forEach((wrappedText, wrappedIndex) => {
                const currentY = startY + wrappedIndex * lineHeightMm

                // 量測縮小/折行後，各子段落文字的精確寬度以進行置中
                const wrappedWidthMm = getPreciseWidth(wrappedText, currentFontSize, '0', 'Arial') / INCH_TO_DOT * 25.4
                const centeredX = Math.max(
                    safeLeft,
                    safeLeft + (availableWidthMm - wrappedWidthMm) / 2
                )

                // 將最終決定的 text, fontSize, x, y 推入排版陣列
                layoutSegments.push({
                    text: wrappedText,
                    fontSize: currentFontSize, // 👈 這裡帶入動態縮小後的字型！
                    x: centeredX,
                    y: currentY,
                    textType: line.textType
                })
            })


            // 更新下一行的 Y 軸游標起點
            flowCursorY = startY + wrappedLines.length * lineHeightMm + blockGapMm
        })

        console.log('布局分段:', layoutSegments)

        if (layoutSegments.length > 0) {
            const minY = layoutSegments.reduce((min, seg) => Math.min(min, seg.y), Number.POSITIVE_INFINITY)
            const maxBottom = layoutSegments.reduce((max, seg) => {
                const segHeight = (seg.fontSize / INCH_TO_DOT * 25.4) * 1.1
                return Math.max(max, seg.y + segHeight)
            }, Number.NEGATIVE_INFINITY)

            const contentHeightMm = Math.max(0, maxBottom - minY)
            const targetTopY = contentHeightMm >= usableHeightMm
                ? topBoundary
                : topBoundary + (usableHeightMm - contentHeightMm) / 2
            const verticalOffset = targetTopY - minY

            layoutSegments.forEach((seg, segIndex) => {
                const adjustedY = seg.y + verticalOffset
                if (adjustedY > bottomBoundary) {
                    console.warn(`第${segIndex + 1}段 Y 軸置中後超出下邊界，略過該段`)
                    return
                }



                // TSC 印表機補償：向左微調（可依機台特性微調）
                const compensatedX = seg.textType === 'chineseName' ? seg.x + 1.5 : seg.x + PRINT_X_COMPENSATION_MM > 0
                    ? seg.x + PRINT_X_COMPENSATION_MM
                    : seg.x

                // 將 mm 轉換為 dots (假設 300 DPI)
                const dpi = 300
                const xDots = Math.round(compensatedX * dpi / 25.4)
                const yDots = Math.round(adjustedY * dpi / 25.4)

                tsc.windowsfont(
                    String(xDots),
                    String(yDots),
                    String(seg.fontSize),
                    '0', // rotation
                    '2', // fontStyle (粗體)
                    '0', // fontUnderline
                    'Arial', // fontFamily
                    seg.text
                )
            })
        }

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
    if (!isConnected.value) {
        console.log('印表機未連接')
        return false
    }
    const memberInfo = attendee.member || {}

    try {

        let lastName = ''
        let firstName = ''
        if (memberInfo.lastName) {
            lastName = memberInfo.lastName.trim().charAt(0).toUpperCase() + memberInfo.lastName.trim().slice(1).toLowerCase()
        }

        if (memberInfo.firstName) {
            firstName = memberInfo.firstName.trim().toLowerCase().replace(/(^|[- ]+)(.)/g, (match: any, separator: any, letter: any) => {
                return separator + letter.toUpperCase();
            }
            )
        }

        // 同理處理 firstName (確保結尾沒有 .toUpperCase())

        const userName = `${firstName} ${lastName}`
        labelSettings.lines.forEach((line) => {
            line.text = '' // 先清空所有行文字  
            switch (line.textInfo.textType) {
                case 'userName':
                    line.text = userName
                    break
                case 'chineseName':
                    line.text = memberInfo.chineseName || ''
                    line.textType = 'chineseName'
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
        })
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
            const success: any = await printLabel(printData, 1)

            if (success) {
                ElMessage.success({
                    message: `已打印 ${userName} 的名牌標籤`,
                    duration: 3000
                })
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
            // 準備打印資料：第一行使用用戶名，其餘行保持原設定
            const printLines = labelSettings.lines.slice(0, lines.length).map((line, index) => ({
                text: lines[index].text,
                x: line.x,
                y: line.y,
                fontSize: line.fontSize,
                positionMode: line.positionMode,
                textType: line.textType
            }))

            const success = await printLabelWithMultiLineSettings(printLines)

            // 恢復原始第一行文字
            labelSettings.lines[0].text = originalFirstLineText

            if (success) {
                ElNotification({
                    message: `已打印 ${userName} 的名牌標籤 (${lines.length}行)`,
                    duration: 3000
                })
            } else {
                ElNotification({
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
const isScanListenerEnabled = ref(true)

watch(
    isScanListenerEnabled,
    (enabled) => {
        if (enabled) {
            startScan()
        } else {
            stopScan()
        }
    },
    { immediate: true }
)

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
        // if (res.data.attendeesVO.isLastYearAttendee) {
        //     ElNotification({
        //         title: `會員編號:${res.data.attendeesVO.sequenceNo}`,
        //         dangerouslyUseHTMLString: true,
        //         message: `<p style="color:green;font-weight:bold;">${type}</p>
        //          會員: ${res.data.attendeesVO.member.chineseName}<br/>
        //          會員類別: ${category}<br/> <p style="color:green;">為去年年會參加會員</p>`,
        //         duration: 10000,
        //         type: "success",
        //     });
        // } else {
        ElNotification({
            title: `會員編號:${res.data.attendeesVO.sequenceNo}`,
            dangerouslyUseHTMLString: true,
            message: `<p style="color:green;font-weight:bold;">${type}</p>
                會員: ${res.data.attendeesVO.member.chineseName ? res.data.attendeesVO.member.chineseName : res.data.attendeesVO.member.firstName + res.data.attendeesVO.member.lastName}<br/>
                會員類別: ${category}<br/>`,
            // <p style="color:red;"> 非去年年會參加會員</p>`,
            duration: 10000,
            type: "success",
        });
        // }

        handleUpdateList();
        getCheckData();
        attendeeStatsRef?.value?.getRegistrationData();

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
    console.log(scrollRef.value.$el);
    if (!scrollContainer) return;
    const el = scrollContainer.$el;
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

const temporaryStore = () => {
    printComponentRef.value?.setTempSetting() // 確保在存儲前先置中，讓用戶看到最佳預覽
}

const loadTemporaryStoredSettings = () => {
    const storedSettings = localStorage.getItem('temporaryLabelSettings')
    if (storedSettings) {
        try {
            const parsedSettings = JSON.parse(storedSettings)
            Object.assign(labelSettings, parsedSettings)
            // updatePreview()
        } catch (error) {
        }
    } else {
        centerText() // 如果沒有存儲，則執行置中
    }

}

// 開啟印表機設定對話框
const openPrinterConfig = () => {
    isPrinterConfigVisible.value = true

    if (isScanListenerEnabled.value) {
        stopScan()
    }
    // 等待 DOM 更新後初始化預觽
    nextTick(() => {
        loadTemporaryStoredSettings()
    })
}



const closePrinterConfig = () => {
    isPrinterConfigVisible.value = false
    if (isScanListenerEnabled.value) {
        startScan()
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

                console.log(res.data.attendeesVO);
                printUserNameLabel(res.data.attendeesVO);
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
        console.log("每分鐘更新1");
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

let timer: any = null;
/**---------------生命週期和初始化----------------- */
onMounted(() => {
    // 設置掃碼槍回調
    setScanCallback(handleBarcodeScanned);

    // 初始化數據
    getCheckData();
    // closeSidebar();
    getAttendeeList();
    timer = updateEveryMinute();

    // 初始化印表機
    initializePrinters()
    console.log('掃碼槍簽到系統已啟動');
});

onUnmounted(() => {
    stopScan(); // 確保組件卸載時停止掃碼監聽
    if (timer) {
        clearInterval(timer);
    }
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
