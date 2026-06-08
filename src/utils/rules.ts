import { FormRules } from "element-plus";

const codeMap: Record<string, number> = {
  A: 10,
  B: 11,
  C: 12,
  D: 13,
  E: 14,
  F: 15,
  G: 16,
  H: 17,
  I: 34,
  J: 18,
  K: 19,
  L: 20,
  M: 21,
  N: 22,
  O: 35,
  P: 23,
  Q: 24,
  R: 25,
  S: 26,
  T: 27,
  U: 28,
  V: 29,
  W: 32,
  X: 30,
  Y: 31,
  Z: 33,
};

const checkIdCard = (rule: any, value: string, callback: any) => {
  if (!/^[A-Z][0-9]{9}$/.test(value)) {
    callback({ valid: false, message: "身份證格式不正確" });
  }

  const placeCode = codeMap[value[0]];
  if (!placeCode) {
    callback({ valid: false, message: "首碼無效" });
  }

  const bodyCode = value.substring(1, 9);
  const lastCode = value[9];
  const calHead = (num: number): number =>
    Math.floor(num / 10) * 1 + (num % 10) * 9;
  const calBody = (code: string): number => {
    let sum = 0;
    for (let i = 0; i < code.length; i++) {
      sum += parseInt(code[i]) * (8 - i);
    }
    return sum;
  };
  const idSum =
    calHead(placeCode) + calBody(bodyCode) + parseInt(lastCode) * 1;
  const isValid = idSum % 10 === 0;
  if (!isValid) {
    callback({ valid: false, message: "身分證號不合法" });
  } else {
    callback();
  }
}


/**-------------------------------------------------------------------------- */
export const firstNameRules = [{ required: true, message: "名字不能為空", trigger: "blur" }];

export const lastNameRules = [{ required: true, message: "姓氏不能為空", trigger: "blur" }];

export const countryRules = [{ required: true, message: "國家不能為空", trigger: "blur" }];

export const emailRules = [
  {
    required: true,
    message: 'E-mail不能為空',
    trigger: 'blur',
  },
  {
    validator: (rule: any, value: string, callback: any) => {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
      if (value && !emailRegex.test(value)) {
        callback(new Error('請輸入正確的E-mail格式'))
      } else {
        callback()
      }
    },
    trigger: 'blur',
  },
]

export const affiliationRules = [{ required: false, message: "單位名稱不能為空", trigger: "blur" }];

export const jobTitleRules = [{ required: false, message: "職稱不能為空", trigger: "blur" }];

export const chineseNameRules = [
  { required: false, message: "中文姓名不能為空", trigger: "blur" },
  { min: 2, max: 10, message: "中文姓名長度在 2 到 10 個字", trigger: "blur" },
];

export const passwordRules = [
  { required: true, message: "密碼不能為空", trigger: "blur" },
];

export const passportRules = [
  { required: true, message: "護照號碼不能為空", trigger: "blur" },
];

export const idCardRules = [
  { required: true, validator: checkIdCard, trigger: "blur" },
];

export const categoryRules = [
  { required: true, message: "會員類別不能為空", trigger: "change" },
];

export const countryCodeRules = [
  { required: false, message: "國碼不能為空", trigger: "change" },
];

export const phoneRules = [
  { required: false, message: "電話不能為空", trigger: "blur" },
  { pattern: /^[0-9\-]+$/, message: "電話格式不正確", trigger: "blur" },
];

export const titleRules = [
  { required: true, message: "稱謂不能為空", trigger: "change" },
];
