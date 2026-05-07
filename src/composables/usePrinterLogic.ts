import { ref } from 'vue'
import { ElMessage } from 'element-plus'

interface PrintLineData {
    text: string;
    x: number;
    y: number;
    fontSize: number;
}

interface LabelSettings {
    width: number;
    height: number;
    lines: any[];
}

export function usePrinterLogic() {
    const isAutoPrintEnabled = ref(true)

    // 多行獨立設定打印函數
    const printLabelWithMultiLineSettings = async (
        lines: PrintLineData[],
        labelSettings: LabelSettings,
        connectionType: string,
        selectedPrinter: any
    ): Promise<boolean> => {
        try {
            // 導入 TSC 相關函數來直接操作
            const { tsc } = await import("@/utils/TSC")

            tsc.init()

            // 設定印表機連接
            switch (connectionType) {
                case 'usb':
                    if (selectedPrinter?.path) {
                        tsc.openport_usb(selectedPrinter.path)
                    }
                    break
                case 'driver':
                    if (selectedPrinter?.path) {
                        tsc.openport_driver(selectedPrinter.path)
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
                const compensatedX = line.x

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

    // 測試列印函數
    const testPrint = async (
        labelSettings: LabelSettings,
        isConnected: boolean,
        textBounds: any,
        connectionType: string,
        selectedPrinter: any
    ): Promise<boolean> => {
        console.log('=== 開始測試列印 ===')

        // 基本連接檢查
        if (!isConnected) {
            ElMessage.error('印表機未連接，請先連接印表機')
            return false
        }

        // 檢查所有行的邊界
        let needsAdjustment = false
        const adjustedLines = [...labelSettings.lines]

        adjustedLines.forEach((line, index) => {
            const lineInfo = textBounds.lines[index]
            if (!lineInfo) return

            if (line.x > lineInfo.maxX ||
                line.y > lineInfo.maxY ||
                line.x < textBounds.leftMargin ||
                line.y < textBounds.topMargin) {

                needsAdjustment = true

                // 自動調整到安全位置
                line.x = Math.max(textBounds.leftMargin,
                    Math.min(line.x, lineInfo.maxX))
                line.y = Math.max(textBounds.topMargin,
                    Math.min(line.y, lineInfo.maxY))

                console.log(`調整第${index + 1}行座標: x=${line.x}mm, y=${line.y}mm`)
            }
        })

        if (needsAdjustment) {
            ElMessage.warning('部分座標超出安全範圍，已自動調整到安全位置')
        }

        // 執行測試打印 - 使用多行獨立設定
        try {
            // 過濾空行
            const validLines = adjustedLines.filter(line => line.text.trim() !== '')

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

            const success = await printLabelWithMultiLineSettings(printLines, labelSettings, connectionType, selectedPrinter)

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

    // 打印用戶名稱標籤（使用多行自定義位置）
    const printUserNameLabel = async (
        attendee: any,
        labelSettings: LabelSettings,
        isConnected: boolean,
        connectionType: string,
        selectedPrinter: any,
        centerTextCallback?: () => void
    ): Promise<boolean> => {
        if (!isAutoPrintEnabled.value || !isConnected) {
            console.log('自動打印已關閉或印表機未連接')
            return false
        }

        console.log(labelSettings.lines)

        const memberInfo = attendee.member || {}

        try {
            const lastName = memberInfo.lastName.trim().charAt(0).toUpperCase() + memberInfo.lastName.trim().slice(1).toLowerCase()
            console.log(lastName.trim().charAt(0).toUpperCase())

            // 同理處理 firstName
            const firstName = memberInfo.firstName.trim().toLowerCase().replace(/(^|[- ]+)(.)/g, (match: any, separator: any, letter: any) => {
                return separator + letter.toUpperCase();
            });

            const userName = `${firstName} ${lastName}`
            console.log(`準備打印用戶標籤: ${userName}`)

            // 創建副本以避免修改原始數據
            const workingLines = [...labelSettings.lines]
            
            workingLines.forEach((line) => {
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
                        break
                }
            })

            // 使用多行設定來打印
            const lines = workingLines.filter(line => line.text.trim() !== '')

            if (lines.length === 0) {
                ElMessage.warning('沒有要打印的內容')
                return false
            }

            // 重新計算置中位置 (基於實際的用戶名)
            if (centerTextCallback) {
                centerTextCallback()
            }

            // 準備打印資料
            const printLines = lines.map((line) => ({
                text: line.text,
                x: line.x,
                y: line.y,
                fontSize: line.fontSize
            }))

            console.log(`多行獨立打印設定 (置中後):`, printLines)

            const success = await printLabelWithMultiLineSettings(printLines, labelSettings, connectionType, selectedPrinter)

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

        } catch (error) {
            console.error('打印標籤時發生錯誤:', error)
            ElMessage.error({
                message: '打印標籤時發生錯誤',
                duration: 3000
            })
            return false
        }
    }

    return {
        isAutoPrintEnabled,
        printLabelWithMultiLineSettings,
        testPrint,
        printUserNameLabel
    }
}