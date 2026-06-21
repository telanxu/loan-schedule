export interface ValidationResult {
  valid: boolean;
  message: string;
}

function ok(): ValidationResult {
  return { valid: true, message: '' };
}

function fail(message: string): ValidationResult {
  return { valid: false, message };
}

export const Validator = {
  loanAmount(value: number): ValidationResult {
    if (Number.isNaN(value) || value <= 0) return fail('贷款金额必须大于 0');
    if (value > 100_000_000) return fail('贷款金额不能超过 1 亿');
    return ok();
  },

  loanTermYears(value: number): ValidationResult {
    if (Number.isNaN(value) || !Number.isInteger(value))
      return fail('贷款期限必须为整数');
    if (value < 1 || value > 30) return fail('贷款期限必须在 1-30 年之间');
    return ok();
  },

  loanTermMonths(value: number): ValidationResult {
    if (Number.isNaN(value) || !Number.isInteger(value))
      return fail('贷款期限必须为整数月');
    if (value < 1) return fail('贷款期限必须大于 0');
    return ok();
  },

  annualInterestRate(value: number): ValidationResult {
    if (Number.isNaN(value) || value <= 0) return fail('年利率必须大于 0');
    if (value > 30) return fail('年利率不能超过 30%');
    return ok();
  },

  repaymentDay(value: number): ValidationResult {
    if (Number.isNaN(value) || !Number.isInteger(value))
      return fail('还款日必须为整数');
    if (value < 1 || value > 28) return fail('还款日必须在 1-28 之间');
    return ok();
  },

  prepayAmount(value: number, remainingLoan: number): ValidationResult {
    if (Number.isNaN(value) || value <= 0)
      return fail('提前还款金额必须大于 0');
    if (value > remainingLoan) return fail('提前还款金额不能超过剩余本金');
    return ok();
  },

  /** 再分期目标期数：整数、大于 0、小于当前剩余期数 */
  targetTerm(value: number, currentRemainingTerm: number): ValidationResult {
    if (Number.isNaN(value) || !Number.isInteger(value))
      return fail('目标期数必须为整数');
    if (value < 1) return fail('目标期数必须大于 0');
    if (value >= currentRemainingTerm)
      return fail(`目标期数需小于当前剩余 ${currentRemainingTerm} 期`);
    return ok();
  },

  /**
   * 目标月供：必须大于 0 且能覆盖当期利息。
   * 传入 currentMonthlyPayment 时（再分期"提高至 X"场景）额外要求高于当前月供；
   * 不传时（自由还款调整月供，允许调低）仅校验覆盖利息。
   */
  targetMonthlyPayment(
    value: number,
    currentInterest: number,
    currentMonthlyPayment?: number,
  ): ValidationResult {
    if (Number.isNaN(value) || value <= 0) return fail('月供必须大于 0');
    if (value <= currentInterest)
      return fail(`月供需大于当期利息 ${currentInterest.toFixed(2)} 元`);
    if (currentMonthlyPayment != null && value <= currentMonthlyPayment)
      return fail('目标月供需高于当前月供才能缩短期限');
    return ok();
  },

  date(value: string): ValidationResult {
    if (!value) return fail('请选择日期');
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return fail('日期格式无效');
    return ok();
  },
};
