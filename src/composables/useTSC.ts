import { ref, computed, watch, onMounted, readonly, type Ref } from 'vue'
import { tsc, TSCCommand, type Rotation, type FontStyle, type FontUnderline } from "@/utils/TSC"
import { Base64 } from 'js-base64'

// 類型定義
export interface PrinterConfiguration {
    connectionType: PrinterConnectionType
    serverUrl?: string
    networkConfig?: NetworkConfig
    labelConfig?: LabelConfiguration
}

export interface NetworkConfig {
    ip: string
    port: string
}

export interface LabelConfiguration {
    dpi?: number
    widthMm?: number
    heightMm?: number
    marginLeftMm?: number
    marginRightMm?: number
}

export interface PrintData {
    text: string
    x?: number | string
    y?: number | string
    fontSize?: number
    rotation?: Rotation
    fontStyle?: FontStyle
    fontUnderline?: FontUnderline
    fontFamily?: string
}

export type PrinterConnectionType = 'usb' | 'network' | 'driver'

export interface PrinterInfo {
    name: string
    path?: string
    type: PrinterConnectionType
}

// 常數定義
const IP_REGEX = /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/gi
const PORT_REGEX = /^[1-9][0-9]*$/gi
const DEFAULT_SERVER_URL = 'ws://127.0.0.1:8888'
const INCH_TO_PX = 96
const INCH_TO_DOT = 300
const PX_TO_DOT = INCH_TO_DOT / INCH_TO_PX

// 預設標籤配置
const DEFAULT_LABEL_CONFIG: Required<LabelConfiguration> = {
    dpi: 300,
    widthMm: 80,
    heightMm: 60,
    marginLeftMm: 1.5,
    marginRightMm: 1.5
}

/**
 * TSC 印表機通用組合式函數
 * 
 * @param config 印表機配置
 * @returns TSC 印表機操作相關方法和狀態
 */
export function useTSC(config: PrinterConfiguration = { connectionType: 'usb' }) {
    // 響應式狀態
    const isConnected = ref(false)
    const isLoading = ref(false)
    const error = ref<string | null>(null)
    const serverUrl = ref(config.serverUrl || DEFAULT_SERVER_URL)
    const connectionType = ref<PrinterConnectionType>(config.connectionType)
    const networkConfig = ref<NetworkConfig>(config.networkConfig || { ip: '', port: '' })
    const labelConfig = ref<Required<LabelConfiguration>>({ ...DEFAULT_LABEL_CONFIG, ...config.labelConfig })

    // 印表機列表狀態
    const usbPrinters = ref<PrinterInfo[]>([])
    const driverPrinters = ref<PrinterInfo[]>([])
    const selectedPrinter = ref<PrinterInfo | null>(null)

    // 從 localStorage 讀取上次選擇的印表機
    const loadSavedPrinter = () => {
        try {
            const saved = localStorage.getItem('tsc-selected-printer')
            if (saved) {
                const printerData = JSON.parse(saved)
                // 只有在連接類型一致時才恢復選擇
                if (printerData.type === connectionType.value) {
                    return printerData
                }
            }
        } catch (e) {
            console.warn('無法讀取已保存的印表機設定:', e)
        }
        return null
    }

    // 保存選擇的印表機到 localStorage
    const savePrinter = (printer: PrinterInfo | null) => {
        try {
            if (printer) {
                localStorage.setItem('tsc-selected-printer', JSON.stringify(printer))
            } else {
                localStorage.removeItem('tsc-selected-printer')
            }
        } catch (e) {
            console.warn('無法保存印表機設定:', e)
        }
    }

    // 監聽印表機選擇變化，自動保存
    watch(selectedPrinter, (newPrinter) => {
        savePrinter(newPrinter)
    })

    // 計算屬性 - 標籤配置（以點為單位）
    const labelConfigDots = computed(() => ({
        widthDots: Math.round(labelConfig.value.widthMm * labelConfig.value.dpi / 25.4),
        heightDots: Math.round(labelConfig.value.heightMm * labelConfig.value.dpi / 25.4),
        marginLeftDots: Math.round(labelConfig.value.marginLeftMm * labelConfig.value.dpi / 25.4),
        marginRightDots: Math.round(labelConfig.value.marginRightMm * labelConfig.value.dpi / 25.4),
        get printableWidthDots() {
            return this.widthDots - this.marginLeftDots - this.marginRightDots
        }
    }))

    // 文字測量工具
    let measureCanvas: HTMLCanvasElement | null = null
    let measureCtx: CanvasRenderingContext2D | null = null

    // 初始化測量工具
    const initMeasurementTools = () => {
        if (!measureCanvas) {
            measureCanvas = document.createElement('canvas')
            measureCtx = measureCanvas.getContext('2d')
        }
    }

    // 驗證網路配置
    const validateNetworkConfig = (ip: string, port: string): boolean => {
        IP_REGEX.lastIndex = 0
        PORT_REGEX.lastIndex = 0

        if (!IP_REGEX.test(ip)) {
            error.value = '無效的 IP 位址'
            return false
        }

        if (!PORT_REGEX.test(port)) {
            error.value = '無效的端口號'
            return false
        }

        return true
    }

    // 檢查連接介面
    const validateConnection = (): boolean => {
        error.value = null
        switch (connectionType.value) {
            case 'usb':
                if (!selectedPrinter.value || usbPrinters.value.length === 0) {
                    error.value = '請選擇 USB 印表機'
                    return false
                }
                return true
            case 'network':
                return validateNetworkConfig(networkConfig.value.ip, networkConfig.value.port)
            case 'driver':
                if (!selectedPrinter.value || driverPrinters.value.length === 0) {
                    error.value = '請選擇印表機驅動'
                    return false
                }
                return true
            default:
                error.value = '未選擇連接方式'
                return false
        }
    }

    // 文字測量函數
    const measureTextWidth = (
        text: string,
        fontHeightDots: number,
        fontStyle: FontStyle,
        faceName: string
    ): number => {
        initMeasurementTools()

        if (!measureCtx) {
            throw new Error('Cannot get canvas context for measurement')
        }

        // 將標籤機需要的點高度轉回 CSS PX
        const fontHeightPx = fontHeightDots / PX_TO_DOT
        const italic = (fontStyle === '1' || fontStyle === '3') ? 'italic ' : ''
        const bold = (fontStyle === '2' || fontStyle === '3') ? 'bold ' : ''

        measureCtx.font = `${italic}${bold}${fontHeightPx}px "${faceName}"`

        const metrics = measureCtx.measureText(text)
        const pureWidthPx = (metrics.actualBoundingBoxRight - metrics.actualBoundingBoxLeft) * 0.9

        return Math.round(pureWidthPx * PX_TO_DOT)
    }

    // 自動計算適合的字體高度
    const calculateAutoFontHeight = (
        text: string,
        preferredHeight: number,
        fontStyle: FontStyle,
        faceName: string,
        maxWidthDots: number
    ) => {
        let currentHeight = preferredHeight
        let textWidthDot = measureTextWidth(text, currentHeight, fontStyle, faceName)

        while (textWidthDot > maxWidthDots && currentHeight > 10) {
            currentHeight--
            textWidthDot = measureTextWidth(text, currentHeight, fontStyle, faceName)
        }

        return {
            actualHeight: currentHeight,
            actualWidth: textWidthDot
        }
    }

    // 計算文字置中位置
    const calculateCenteredPosition = (
        printData: PrintData & { actualHeight?: number; actualWidth?: number },
        rotation: Rotation = '0'
    ) => {
        const { text, fontSize = 150, fontStyle = '0', fontFamily = 'Arial' } = printData

        const result = calculateAutoFontHeight(
            text,
            fontSize,
            fontStyle as FontStyle,
            fontFamily,
            labelConfigDots.value.printableWidthDots
        )

        const { actualHeight, actualWidth } = result

        // 水平置中計算：(可列印寬度 - 文字寬度) / 2
        const centerOffsetX = Math.round((labelConfigDots.value.printableWidthDots - actualWidth) / 2)

        // 垂直置中計算：(標籤高度 - 字體高度) / 2
        const centerOffsetY = Math.round((labelConfigDots.value.heightDots - actualHeight) / 2)

        let finalX: number
        let finalY: number

        if (rotation === '180') {
            // 180度旋轉時的置中計算
            finalX = labelConfigDots.value.widthDots - labelConfigDots.value.marginLeftDots - centerOffsetX
            finalY = labelConfigDots.value.heightDots - centerOffsetY
        } else {
            // 0度時的置中計算
            finalX = labelConfigDots.value.marginLeftDots + centerOffsetX
            finalY = centerOffsetY
        }

        // 如果用戶明確指定了 X 或 Y 座標，則使用用戶指定的值
        if (printData.x !== undefined) {
            finalX = Number(printData.x)
        }
        if (printData.y !== undefined) {
            finalY = Number(printData.y)
        }

        console.log(`--- 完全置中排版結果 ---`)
        console.log(`文字: "${text}"`)
        console.log(`字體高度: ${actualHeight} dots, 字體寬度: ${actualWidth} dots`)
        console.log(`標籤尺寸: ${labelConfigDots.value.widthDots}x${labelConfigDots.value.heightDots} dots`)
        console.log(`可列印區域寬度: ${labelConfigDots.value.printableWidthDots} dots`)
        console.log(`置中偏移 - X: ${centerOffsetX} dots, Y: ${centerOffsetY} dots`)
        console.log(`旋轉: ${rotation}度`)
        console.log(`最終位置: X=${finalX}, Y=${finalY}`)

        return {
            x: finalX,
            y: finalY,
            actualHeight,
            actualWidth
        }
    }

    // 水平置中（固定 Y 軸）
    const windowsfontCenter = (
        y: number,
        preferredHeight: number,
        rotation: Rotation,
        fontStyle: FontStyle,
        fontUnderline: FontUnderline,
        faceName: string,
        text: string
    ) => {
        // 1. 取得可列印寬度作為上限
        const maxWidth = labelConfigDots.value.printableWidthDots

        // 2. 自動計算字體高度 (若太寬則縮小)
        const { actualHeight, actualWidth } = calculateAutoFontHeight(
            text,
            preferredHeight,
            fontStyle,
            faceName,
            maxWidth
        )

        // 3. 計算置中 X 座標 , X座標要加上margin left (文字寬度計算時已經有計算了)
        const x = Math.round((maxWidth - actualWidth) / 2)
        console.log("x座標:", x)

        let finalX: number
        if (rotation === "180") {
            // 使用轉換邏輯
            finalX = labelConfigDots.value.widthDots - labelConfigDots.value.marginLeftDots - x
        } else {
            // 0 度時：左邊距點數 + 相對位移
            finalX = labelConfigDots.value.marginLeftDots + x
        }

        console.log(`--- 排版結果 ---`);
        console.log(`最終高度: ${actualHeight} dots (原始: ${preferredHeight})`);
        console.log(`最終寬度: ${actualWidth} dots`);
        console.log(`X 座標: ${finalX}, 結束位置: ${finalX + actualWidth}`);

        return {
            x: finalX,
            y,
            actualHeight, //這裡傳回縮小後的高度供印表機指令使用
            actualWidth
        }
    }

    // WebSocket 連接
    const connectToServer = (obj: { functions_inorder: TSCCommand[] }): Promise<any> => {
        return new Promise((resolve, reject) => {
            const websocket = new WebSocket(serverUrl.value)
            let timeoutId: NodeJS.Timeout

            const cleanup = () => {
                if (timeoutId) clearTimeout(timeoutId)
                websocket.close()
            }

            // 設定超時
            timeoutId = setTimeout(() => {
                error.value = '連接超時'
                cleanup()
                reject(new Error('連接超時'))
            }, 10000)

            websocket.onopen = () => {
                console.log('WebSocket 連接已開啟')
                websocket.send(JSON.stringify(obj))
            }

            websocket.onmessage = (event) => {
                if (event.data === 'Finished') {
                    // 當任務完成時，表示 TSC PrintServer 正常運作
                    isConnected.value = true
                    cleanup()
                    resolve('success')
                    return
                }

                try {
                    const responseObj = JSON.parse(event.data)
                    if ('usb_list' in responseObj) {
                        usbPrinters.value = responseObj.usb_list.map((printer: any) => ({
                            name: `${printer.USBName} (Path: ${Base64.decode(printer.USBPath)})`,
                            path: printer.USBPath,
                            type: 'usb' as const
                        }))
                        // 自動選擇印表機：優先恢復保存的選擇，其次選第一台
                        if (connectionType.value === 'usb' && !selectedPrinter.value) {
                            const savedPrinter = loadSavedPrinter()
                            if (savedPrinter && usbPrinters.value.find(p => p.path === savedPrinter.path)) {
                                selectedPrinter.value = usbPrinters.value.find(p => p.path === savedPrinter.path) || null
                            } else if (usbPrinters.value.length > 0) {
                                selectedPrinter.value = usbPrinters.value[0]
                            }
                        }

                        // TSC PrintServer 連接正常
                        isConnected.value = true
                    }

                    if ('driver_list' in responseObj) {
                        driverPrinters.value = responseObj.driver_list.map((printer: any) => ({
                            name: printer.DriverName,
                            path: printer.DriverName,
                            type: 'driver' as const
                        }))

                        // 自動選擇印表機：優先恢復保存的選擇，其次選第一台
                        if (connectionType.value === 'driver' && !selectedPrinter.value) {
                            const savedPrinter = loadSavedPrinter()
                            if (savedPrinter && driverPrinters.value.find(p => p.path === savedPrinter.path)) {
                                selectedPrinter.value = driverPrinters.value.find(p => p.path === savedPrinter.path) || null
                            } else if (driverPrinters.value.length > 0) {
                                selectedPrinter.value = driverPrinters.value[0]
                            }
                        }

                        // TSC PrintServer 連接正常
                        isConnected.value = true
                    }

                    if ('Function_Failed' in responseObj) {
                        error.value = `操作失敗: ${responseObj.Function_Failed}`
                        cleanup()
                        reject(new Error(responseObj.Function_Failed))
                    }

                    if ('printerstatus' in responseObj) {
                        if (responseObj.printerstatus.length > 0) {
                            resolve({ status: responseObj.printerstatus.join('\n') })
                            return
                        }
                    }

                    if ('printername' in responseObj) {
                        resolve({ name: responseObj.printername })
                        return
                    }

                    if ('printerserial' in responseObj) {
                        resolve({ serial: responseObj.printerserial })
                        return
                    }

                    if ('about' in responseObj) {
                        // TSC PrintServer 版本查詢成功，表示連接正常
                        isConnected.value = true
                        resolve({ version: responseObj.about })
                        return
                    }

                } catch (e) {
                    error.value = '無效的回應格式'
                    cleanup()
                    reject(new Error('無效的回應格式'))
                }
            }

            websocket.onerror = () => {
                isConnected.value = false
                error.value = '連接錯誤'
                cleanup()
                reject(new Error('連接錯誤'))
            }

            websocket.onclose = (event) => {
                // 只在異常關閉時標記為未連接
                if (event.code !== 1000) {
                    isConnected.value = false
                    const errorMessages: { [key: number]: string } = {
                        1006: '連接異常中斷，請確認 TSC PrintServer 是否運行',
                        1002: '協定錯誤',
                        1003: '資料類型不支援',
                        1007: '資料格式錯誤',
                        1008: '違反政策',
                        1009: '訊息過大',
                        1011: '伺服器內部錯誤'
                    }

                    const errorMessage = errorMessages[event.code] || `連接關閉，錯誤代碼: ${event.code}`
                    error.value = errorMessage

                    if (!timeoutId) {
                        reject(new Error(errorMessage))
                    }
                }
            }
        })
    }



    // 初始化印表機列表
    const initializePrinters = async () => {
        isLoading.value = true
        error.value = null

        try {
            // 獲取 USB 印表機列表
            const usbListObj = { usb_list: [] } as unknown as { functions_inorder: TSCCommand[] }
            await connectToServer(usbListObj)

            // 獲取驅動印表機列表
            const driverListObj = { driver_list: [] } as unknown as { functions_inorder: TSCCommand[] }
            await connectToServer(driverListObj)

            // 獲取伺服器版本
            const aboutObj = { about: [] } as unknown as { functions_inorder: TSCCommand[] }
            await connectToServer(aboutObj)


        } catch (err) {
            console.error('初始化印表機列表失敗:', err)
        } finally {
            isLoading.value = false
        }
    }

    // 設定印表機連接
    const setupPrinterConnection = () => {
        if (!validateConnection()) return false

        tsc.init()
        console.log('設定印表機連接，連接類型:', connectionType.value)
        switch (connectionType.value) {
            case 'usb':
                if (selectedPrinter.value?.path) {
                    tsc.openport_usb(selectedPrinter.value.path)
                }
                break
            case 'network':
                tsc.openport_net(networkConfig.value.ip, networkConfig.value.port)
                break
            case 'driver':
                if (selectedPrinter.value?.path) {
                    tsc.openport_driver(selectedPrinter.value.path)
                }
                break
        }

        return true
    }

    // 列印標籤
    const printLabel = async (printData: PrintData, copies: number = 1) => {
        if (!setupPrinterConnection()) return false

        isLoading.value = true
        error.value = null

        try {
            // 結束指令
            const endCommand = new Uint8Array([13, 10])
            tsc.sendUint8Array(endCommand)

            // 清空緩存
            tsc.clearbuffer()

            // 設定紙張（確保使用正確的尺寸）
            const { widthMm, heightMm } = labelConfig.value
            console.log(`TSC Setup: 寬度=${widthMm}mm, 高度=${heightMm}mm`)
            tsc.setup(widthMm, heightMm, '4', '12', '0', '3', '0')

            // 使用自定義 x,y 座標（如果有提供），否則使用自動置中
            let finalPosition
            if (printData.x !== undefined && printData.y !== undefined) {
                // 將 mm 轉換為 dots (300 DPI: 1mm = 11.81 dots)
                const dpi = labelConfig.value.dpi
                const xDots = Math.round(Number(printData.x) * dpi / 25.4)
                const yDots = Math.round(Number(printData.y) * dpi / 25.4)
                const fontSize = printData.fontSize || 150

                console.log(`使用自定義位置:`)
                console.log(`  輸入: x=${printData.x}mm, y=${printData.y}mm, 字體=${fontSize}`)
                console.log(`  轉換: x=${xDots} dots, y=${yDots} dots (DPI=${dpi})`)
                console.log(`  標籤尺寸: ${widthMm}mm x ${heightMm}mm`)

                finalPosition = {
                    x: xDots,
                    y: yDots,
                    actualHeight: fontSize,
                    actualWidth: 0 // 不需要精確的寬度計算
                }
            } else {
                // 使用自動置中位置
                console.log('使用自動置中位置')
                finalPosition = calculateCenteredPosition(printData, printData.rotation || '0')
            }

            // 處理多行文字打印
            const textLines = printData.text.split('\n').filter(line => line.trim() !== '')
            if (textLines.length === 0) {
                textLines.push('') // 至少保持一行空行
            }

            console.log(`發送給 TSC 的參數:`)
            console.log(`  起始位置: x=${finalPosition.x} dots, y=${finalPosition.y} dots`)
            console.log(`  字體高度: ${finalPosition.actualHeight} dots`)
            console.log(`  文字內容: ${textLines.length} 行`)
            textLines.forEach((line, index) => {
                console.log(`    第${index + 1}行: "${line}"`)
            })

            // 計算行高（以 dots 為單位）
            const lineHeightDots = Math.round(finalPosition.actualHeight * 1.2) // 行高 = 字體高度 × 1.2

            // 為每一行調用 windowsfont
            textLines.forEach((line, index) => {
                const currentY = finalPosition.y + (index * lineHeightDots)

                console.log(`打印第${index + 1}行: "${line}" 在位置 (${finalPosition.x}, ${currentY})`)

                tsc.windowsfont(
                    String(finalPosition.x),
                    String(currentY),
                    String(finalPosition.actualHeight),
                    (printData.rotation || '0') as Rotation,
                    (printData.fontStyle || '0') as FontStyle,
                    (printData.fontUnderline || '0') as FontUnderline,
                    printData.fontFamily || 'Arial',
                    line
                )
            })

            // 列印標籤
            tsc.printlabel(copies, 1)
            tsc.closeport()

            // 發送指令到印表機
            const commandsObj = { functions_inorder: tsc.getCommands() }
            await connectToServer(commandsObj)

            return true

        } catch (err) {
            error.value = '列印失敗'
            console.error('列印錯誤:', err)
            return false
        } finally {
            isLoading.value = false
        }
    }

    // 執行印表機自檢
    const runSelfTest = async () => {
        if (!setupPrinterConnection()) return false

        isLoading.value = true
        error.value = null

        try {
            tsc.sendcommand_crlf('SELFTEST')
            tsc.closeport()

            const commandsObj = { functions_inorder: tsc.getCommands() }
            await connectToServer(commandsObj)

            return true
        } catch (err) {
            error.value = '自檢失敗'
            console.error('自檢錯誤:', err)
            return false
        } finally {
            isLoading.value = false
        }
    }

    // 獲取印表機狀態
    const getPrinterStatus = async () => {
        if (!setupPrinterConnection()) return null

        isLoading.value = true
        error.value = null

        try {
            tsc.printerstatus()
            tsc.printername()
            tsc.printerserial()
            tsc.closeport()

            const commandsObj = { functions_inorder: tsc.getCommands() }
            const result = await connectToServer(commandsObj)

            return result
        } catch (err) {
            error.value = '獲取狀態失敗'
            console.error('狀態查詢錯誤:', err)
            return null
        } finally {
            isLoading.value = false
        }
    }

    // 設定連接類型
    const setConnectionType = (type: PrinterConnectionType) => {
        connectionType.value = type
        selectedPrinter.value = null
        error.value = null

        // 切換連接類型時嘗試恢復該類型的已保存印表機
        const savedPrinter = loadSavedPrinter()
        if (savedPrinter && savedPrinter.type === type) {
            // 延遲設定，等印表機列表更新後再選擇
            setTimeout(() => {
                const availablePrinters = type === 'usb' ? usbPrinters.value : driverPrinters.value
                const matchedPrinter = availablePrinters.find(p => p.path === savedPrinter.path)
                if (matchedPrinter) {
                    selectedPrinter.value = matchedPrinter
                }
            }, 100)
        }
    }

    // 設定網路配置
    const setNetworkConfig = (config: NetworkConfig) => {
        networkConfig.value = { ...config }
    }

    // 設定標籤配置
    const setLabelConfig = (config: Partial<LabelConfiguration>) => {
        labelConfig.value = { ...labelConfig.value, ...config }
    }

    // 組件掛載時初始化
    onMounted(() => {
        // 嘗試恢復上次的連接類型
        const savedConnectionType = localStorage.getItem('tsc-connection-type') as PrinterConnectionType
        if (savedConnectionType && ['usb', 'network', 'driver'].includes(savedConnectionType)) {
            connectionType.value = savedConnectionType
        }

        // 如果是網路連接，嘗試恢復網路配置
        if (connectionType.value === 'network') {
            const savedNetworkConfig = localStorage.getItem('tsc-network-config')
            if (savedNetworkConfig) {
                try {
                    const config = JSON.parse(savedNetworkConfig)
                    if (config.ip && config.port) {
                        networkConfig.value = config
                    }
                } catch (e) {
                    console.warn('無法恢復網路配置:', e)
                }
            }
        }

        initializePrinters()
    })

    // 監聽連接類型變化，自動保存
    watch(connectionType, (newType) => {
        localStorage.setItem('tsc-connection-type', newType)
    })

    // 監聽網路配置變化，自動保存
    watch(networkConfig, (newConfig) => {
        if (connectionType.value === 'network') {
            localStorage.setItem('tsc-network-config', JSON.stringify(newConfig))
        }
    }, { deep: true })

    return {
        // 狀態
        isConnected: isConnected,
        isLoading: readonly(isLoading),
        error: readonly(error),
        connectionType: connectionType,
        networkConfig: readonly(networkConfig),
        labelConfig: labelConfig,
        labelConfigDots: readonly(labelConfigDots),
        usbPrinters: readonly(usbPrinters),
        driverPrinters: readonly(driverPrinters),
        selectedPrinter,

        // 方法
        initializePrinters,
        printLabel,
        runSelfTest,
        getPrinterStatus,
        setConnectionType,
        setNetworkConfig,
        setLabelConfig,
        calculateCenteredPosition,
        measureTextWidth,
        calculateAutoFontHeight,
        windowsfontCenter,
        validateConnection
    }
}