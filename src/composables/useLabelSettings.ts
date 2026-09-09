import { reactive } from 'vue'
import type { LabelMargins } from '@/utils/labelLayout'

// 名牌標籤多行文字設定的共用資料結構與預設值。
// 過去 barcode-gun-registration/index.vue 與 views/printer/index.vue 各自維護一份幾乎一樣、
// 但座標/尺寸早已不同步的 labelSettings，這裡統一成單一來源，避免兩處再度drift。

export interface LabelTextInfo {
    textType: string
    textShow: string
}

export interface LabelSettingLine {
    text: string
    textType: string
    textInfo: LabelTextInfo
    x: number
    y: number
    fontSize: number
    positionMode: string
}

export interface LabelSettingsShape {
    width: number
    height: number
    lines: LabelSettingLine[]
}

// TSC 印表機安全邊距（單位: mm），三處畫面原本各自寫死同樣的數值，統一放這裡
export const LABEL_MARGINS: LabelMargins = {
    left: 2,
    right: 2,
    top: 1,
    bottom: 1
}

const STORAGE_KEY = 'temporaryLabelSettings'

export function createDefaultLabelSettings(): LabelSettingsShape {
    return {
        width: 95,
        height: 60,
        lines: [
            {
                text: 'English Name',
                textType: 'userName',
                textInfo: {
                    textType: 'userName',
                    textShow: 'English Name'
                },
                x: 12.6,
                y: 19.0,
                fontSize: 155,
                positionMode: ''
            },
            {
                text: '中文名',
                textType: 'chineseName',
                textInfo: {
                    textType: 'chineseName',
                    textShow: '中文名'
                },
                x: 34.6,
                y: 32.0,
                fontSize: 120,
                positionMode: ''
            }
        ]
    }
}

export function useLabelSettings() {
    const labelSettings = reactive<LabelSettingsShape>(createDefaultLabelSettings())

    // 將目前的標籤設定暫存到 localStorage，供其他使用同一份設定的畫面讀取
    const setTempSetting = () => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(labelSettings))
    }

    const getTempSetting = (): LabelSettingsShape | null => {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (!stored) return null
        try {
            return JSON.parse(stored)
        } catch (e) {
            console.warn('無法解析已暫存的標籤設定:', e)
            return null
        }
    }

    // 從 localStorage 載入暫存設定；回傳是否有成功載入，讓呼叫端決定沒有暫存時要不要走預設行為（如自動置中）
    const loadTemporaryStoredSettings = (): boolean => {
        const stored = getTempSetting()
        if (stored) {
            Object.assign(labelSettings, stored)
            return true
        }
        return false
    }

    return {
        labelSettings,
        setTempSetting,
        getTempSetting,
        loadTemporaryStoredSettings
    }
}
