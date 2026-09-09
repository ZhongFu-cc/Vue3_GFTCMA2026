// TSC 標籤多行文字排版引擎（純函式，不依賴 Vue）
// 供 barcode-gun-registration/index.vue、views/printer/index.vue、printPreview.vue 共用，
// 確保「測試列印」「實際報到列印」「畫布預覽」三處算出來的換行/縮字/座標結果完全一致。

export type FontStyleCode = '0' | '1' | '2' | '3'

export interface LabelLine {
    text: string
    x: number
    y: number
    fontSize: number
    textType: string
    positionMode?: string
}

export interface LayoutSegment {
    text: string
    x: number
    y: number
    fontSize: number
    textType: string
}

export interface LabelMargins {
    left: number
    right: number
    top: number
    bottom: number
}

export interface ComputeLayoutOptions {
    labelWidthMm: number
    labelHeightMm: number
    margins: LabelMargins
    dpi?: number
    minFontSize?: number
    fontDecreaseStep?: number
    blockGapMm?: number
    fontFamily?: string
}

const DEFAULT_DPI = 300
const DEFAULT_MIN_FONT_SIZE = 120
const DEFAULT_FONT_DECREASE_STEP = 15
const DEFAULT_BLOCK_GAP_MM = 0.5
const DEFAULT_FONT_FAMILY = 'Arial'
const INCH_TO_PX = 96
const MM_PER_INCH = 25.4

// 已透過實際印表機列印結果校正過的文字寬度係數，統一取代過去三處各自不同的 0.85 / 0.9 / 1.0
const WIDTH_CALIBRATION = 0.85

// 中日韓文字（含全形標點）Unicode 範圍：用來判斷一段文字是否含有 CJK 字元
const CJK_REGEX = /[一-鿿぀-ヿ가-힣＀-￯]/

// 純英文/數字（不含任何 CJK 字元）的視覺高度比中文矮一截（英文大寫沒有下伸部，
// 中文字身框幾乎被填滿），同一字級印出來英文行會比中文行看起來偏上；
// 這裡把純英文/數字行的 Y 座標往下補償一點，讓視覺上跟中文對齊。
// 這是依常見字型下伸部比例抓的起始估計值，需要用實際印表機列印結果比對後微調。
const LATIN_BASELINE_OFFSET_RATIO = 0.25

function getVerticalOffsetMm(text: string, fontSizeDots: number, dpi: number): number {
    if (CJK_REGEX.test(text)) return 0
    return (fontSizeDots / dpi * MM_PER_INCH) * LATIN_BASELINE_OFFSET_RATIO
}

let measureCanvas: HTMLCanvasElement | null = null
let measureCtx: CanvasRenderingContext2D | null = null

function getMeasureContext(): CanvasRenderingContext2D | null {
    if (!measureCanvas) {
        measureCanvas = document.createElement('canvas')
        measureCtx = measureCanvas.getContext('2d')
    }
    return measureCtx
}

/**
 * 量測文字在指定字級（單位: dot）下的實際寬度（單位: dot）
 */
export function measureTextWidthDots(
    text: string,
    fontHeightDots: number,
    fontStyle: FontStyleCode | string,
    faceName: string,
    dpi: number = DEFAULT_DPI
): number {
    if (!text) return 0
    const ctx = getMeasureContext()
    if (!ctx) return 0

    const pxToDot = dpi / INCH_TO_PX
    const fontHeightPx = fontHeightDots / pxToDot
    const italic = (fontStyle === '1' || fontStyle === '3') ? 'italic ' : ''
    const bold = (fontStyle === '2' || fontStyle === '3') ? 'bold ' : ''

    ctx.font = `${italic}${bold}${fontHeightPx}px "${faceName}"`

    const metrics = ctx.measureText(text)
    const pureWidthPx = (metrics.actualBoundingBoxRight - metrics.actualBoundingBoxLeft) * WIDTH_CALIBRATION

    return Math.round(pureWidthPx * pxToDot)
}

/**
 * 量測文字在指定字級（單位: dot）下的實際寬度（單位: mm）
 */
export function measureTextWidthMm(
    text: string,
    fontHeightDots: number,
    fontStyle: FontStyleCode | string,
    faceName: string,
    dpi: number = DEFAULT_DPI
): number {
    return measureTextWidthDots(text, fontHeightDots, fontStyle, faceName, dpi) / dpi * MM_PER_INCH
}

/**
 * 依可用寬度（mm）將文字換行：優先在空白處斷行，找不到空白才強制斷字
 */
export function wrapTextByWidthMm(
    text: string,
    fontSizeDots: number,
    maxWidthMm: number,
    dpi: number = DEFAULT_DPI,
    fontFamily: string = DEFAULT_FONT_FAMILY
): string[] {
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
        const candidateWidthMm = measureTextWidthMm(candidate, fontSizeDots, '0', fontFamily, dpi)

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

/**
 * 計算多行獨立設定標籤的最終排版結果：
 * 每一行先嘗試縮小字級塞進可用寬度，縮到最小字級仍放不下才換行；
 * 換行造成的額外行高會往下推動後續行，避免重疊。
 *
 * 注意：即使某一行的 Y 座標超出標籤下邊界，這裡仍會回傳該行——
 * 呼叫端不應再靜默捨棄，避免內容無聲消失（維持「縮字＋換行」策略，不做額外裁切/壓縮處理）。
 */
export function computeMultiLineLayout(
    lines: LabelLine[],
    options: ComputeLayoutOptions
): LayoutSegment[] {
    const {
        labelWidthMm,
        margins,
        dpi = DEFAULT_DPI,
        minFontSize = DEFAULT_MIN_FONT_SIZE,
        fontDecreaseStep = DEFAULT_FONT_DECREASE_STEP,
        blockGapMm = DEFAULT_BLOCK_GAP_MM,
        fontFamily = DEFAULT_FONT_FAMILY
    } = options

    const sortedLines = lines
        .map((line, order) => ({ ...line, order }))
        .sort((a, b) => a.y - b.y || a.order - b.order)

    const safeLeft = margins.left
    const safeRight = labelWidthMm - margins.right
    const usableWidthMm = Math.max(1, safeRight - safeLeft)
    const topBoundary = margins.top

    let flowCursorY = topBoundary

    const layoutSegments: LayoutSegment[] = []

    sortedLines.forEach((line) => {
        // 空白內容的欄位不佔用任何版面、也不推動 flowCursorY，
        // 避免量測空字串時「寬度一定是 0 一定塞得下」直接命中不換行的快速路徑，
        // 產生一個看不到文字卻仍佔一整行高度的空白區段
        if (!line.text || !line.text.trim()) {
            return
        }

        // 'fixed' 的行照設定/預覽的位置印出（靠左對齊，不置中）；
        // 其餘（'center'、預設空字串）的行則依照實際文字內容動態置中
        const isFixed = line.positionMode === 'fixed'

        let currentFontSize = line.fontSize
        let wrappedLines: string[] = []

        const lineAvailableWidthMm = isFixed ? Math.max(1, safeRight - line.x) : usableWidthMm

        // 1. X 軸判定：優先縮小字型，縮到極限才折行
        while (currentFontSize >= minFontSize) {
            const fullTextWidthMm = measureTextWidthMm(line.text, currentFontSize, '0', fontFamily, dpi)

            if (fullTextWidthMm <= lineAvailableWidthMm) {
                wrappedLines = [line.text]
                break
            }

            if (currentFontSize > minFontSize) {
                currentFontSize -= fontDecreaseStep
                wrappedLines = wrapTextByWidthMm(line.text, currentFontSize, lineAvailableWidthMm, dpi, fontFamily)
            } else {
                // 已經縮到最小字級仍塞不下，用「實際會印出的字級」換行（修正過去誤用原始字級的問題）
                wrappedLines = wrapTextByWidthMm(line.text, currentFontSize, lineAvailableWidthMm, dpi, fontFamily)
                break
            }
        }

        // 字體本身就小於 minFontSize，迴圈從未執行，wrappedLines 仍是空陣列 → 用原始字體換行作為保底
        if (wrappedLines.length === 0) {
            wrappedLines = wrapTextByWidthMm(line.text, currentFontSize, lineAvailableWidthMm, dpi, fontFamily)
        }

        // 2. 依據最終確定的字型，計算 Y 軸與行高
        const lineHeightMm = (currentFontSize / dpi * MM_PER_INCH) * 1.1
        const startY = Math.max(line.y, flowCursorY, topBoundary)

        // 若實際列印的 Y 座標跟設定值不一樣（被前面欄位換行/推擠往下移），印出來方便追蹤
        if (Math.abs(startY - line.y) > 0.01) {
            console.log(
                `[labelLayout] 欄位「${line.textType}」Y座標已變更: 設定值 ${line.y}mm → 實際列印 ${startY.toFixed(2)}mm`
            )
        }

        wrappedLines.forEach((wrappedText, wrappedIndex) => {
            const currentY = startY + wrappedIndex * lineHeightMm + getVerticalOffsetMm(wrappedText, currentFontSize, dpi)

            // fixed 行直接用設定的 x；center 行依實際文字寬度即時算出置中位置
            let segX = line.x
            if (!isFixed) {
                const wrappedWidthMm = measureTextWidthMm(wrappedText, currentFontSize, '0', fontFamily, dpi)
                segX = Math.max(safeLeft, safeLeft + (usableWidthMm - wrappedWidthMm) / 2)
            }

            layoutSegments.push({
                text: wrappedText,
                fontSize: currentFontSize,
                x: segX,
                y: currentY,
                textType: line.textType
            })
        })

        // 更新下一行的 Y 軸游標起點
        flowCursorY = startY + wrappedLines.length * lineHeightMm + blockGapMm
    })

    return layoutSegments
}
