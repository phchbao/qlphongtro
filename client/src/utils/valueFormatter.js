import moment from "moment";

export const { format } = new Intl.NumberFormat("vi-VN", {
  style: "decimal",
});

export const dateFormatter = (date) => {
  return moment(date).format("DD/MM/YYYY");
};

export const ageCalculator = (date) => {
  return moment().diff(date, "years");
};

// calculate the total rent amount according to payment plan
export const calculateTotalRent = (contractTerm, price) => {
  return price * contractTerm;

};

// calculate number of months according to payment plan
export const calculateNumberOfMonths = (contractTerm) => {
  return `${contractTerm} tháng`;
};

// calculate the added date according to payment plan
export const calculateAddedDate = (contractTerm, currentRentDate) => {
    return moment(currentRentDate)
      .add(contractTerm - 1, "months")
      .endOf("month")
      .endOf("month")
      .format("YYYY-MM-DD");
};

// calculate the next due date according to last payment date
export const calculateNextDueDate = (lastPaymentDate) => {
  return moment(lastPaymentDate).add(1, "d").format("DD-MM-YYYY");
};
