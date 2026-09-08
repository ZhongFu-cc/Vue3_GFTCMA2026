import request from "@/utils/request";
import { AxiosPromise } from "axios";

/**
 * 獲取單一會員
 * @param id
 * @returns
 */
export function getMemberApi(id: number): AxiosPromise {
  return request({
    url: `/member/${id}`,
    method: "get",
  });
}

/**
 * 獲取全部會員
 * @returns
 */
export function getAllMemberApi(): AxiosPromise {
  return request({
    url: "/member",
    method: "get",
  });
}

/**
 * 獲取會員(分頁)
 * @param page
 * @param size
 * @returns
 */
export function getMemberByPaginationApi(
  page: number,
  size: number
): AxiosPromise {
  return request({
    url: "/member/tag/pagination",
    method: "get",
    params: {
      page,
      size,
    },
  });
}

/**
 * 根據狀態，獲取符合的會員(分頁)
 * @param page
 * @param size
 * @param status
 * @returns
 */
export function fetchMembersWithPaginationAndStatusApi(
  page: number,
  size: number,
  status: string,
  queryText?: string
  // tags?: number[]
): AxiosPromise {
  return request({
    url: "/member/tag/pagination",
    method: "get",
    params: {
      page,
      size,
      queryText,
      status,
      // tags,
    },
  });
}

/**
 * 獲取會員總數
 *
 * @returns
 */
export function getMemberCountApi(): AxiosPromise {
  return request({
    url: "/member/count",
    method: "get",
  });
}

/**
 * 根據繳費狀態,獲取相符會員的總數
 *
 * @param status
 * @returns
 */
export function getMemberCountByOrderStatusApi(status: string): AxiosPromise {
  return request({
    url: "/member/count-by-order-status",
    method: "get",
    params: {
      status,
    },
  });
}

/**
 * 根據繳費狀態,獲取相符會員的列表
 *
 * @param page - 當前頁碼
 * @param size - 每頁大小
 * @param status - 訂單狀態（可選參數）
 * @returns
 */
export function getMemberOrder(
  page: number,
  size: number,
  status?: string,
  queryText?: string
): AxiosPromise {
  return request({
    url: "/member/member-and-order",
    method: "get",
    params: {
      page,
      size,
      status,
      queryText,
    },
  });
}

/**
 * 新增會員
 * @param data
 * @returns
 */
export function addMemberApi(data: any): AxiosPromise {
  return request({
    url: "/member",
    method: "post",
    data,
  });
}

/**
 * 更新會員
 * @param data
 * @returns
 */
export function updateMemberApi(data: any): AxiosPromise {
  return request({
    url: "/member",
    method: "put",
    data,
  });
}

/**
 * 批量更新會員
 * @param data
 * @returns
 */
export function batchUpdateMemberApi(data: any): AxiosPromise {
  return request({
    url: "/member/batch",
    method: "put",
    data,
  });
}

/**
 * 刪除單一會員
 * @param id
 * @returns
 */
export function deleteMemberApi(id: string): AxiosPromise {
  return request({
    url: `/member/${id}`,
    method: "delete",
  });
}

/**
 * 批量刪除會員
 * @param id
 * @returns
 */
export function batchDeleteMemberApi(data: any): AxiosPromise {
  return request({
    url: `/member`,
    method: "delete",
    data,
  });
}

/**
 * 下載會員Excel資料
 * @returns
 */
export function downloadMemberExcelApi(): AxiosPromise {
  return request({
    url: "/member/download-excel",
    method: "get",
    responseType: "arraybuffer",
  });
}

/**
 * 下載會員名單匯入模板
 * @returns
 */
export function downloadMemberImportExcelTemplateApi(): AxiosPromise {
  return request({
    url: "/member/import-excel-template",
    method: "get",
    responseType: "arraybuffer",
  });
}

/**
 * 匯入會員名單Excel
 * @param data
 * @returns
 */
export function importMemberExcelApi(data: FormData): AxiosPromise {
  return request({
    url: "/member/import-excel",
    method: "post",
    data,
  });
}

export function assignTagsToMember(data: any): AxiosPromise {
  return request({
    url: "/member/tag",
    method: "put",
    data,
  });
}

export function getUnpaidMemberApi(
  page: number,
  country: string,
  queryText: string
): AxiosPromise {
  return request({
    url: "/member/unpaid-member",
    method: "get",
    params: {
      page: page,
      size: 10,
      country: country,
      queryText: queryText,

    },
  });
}

export function updateUnpaidMemberApi(memberId: string): AxiosPromise {
  return request({
    url: "/member/unpaid-member",
    method: "put",
    data: {
      memberId: memberId,
    },
  });
}

export function addVipMemberApi(data: any): AxiosPromise {
  return request({
    url: "/member/admin",
    method: "post",
    data,
  });
}
