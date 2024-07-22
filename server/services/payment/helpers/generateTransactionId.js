const generateTransactionReceipt = () => {
  const timeStamp = Date.now();
  const randomNum = Math.floor(Math.random() * 10000000);
  const merchantPrefix = "RECEIPT-";
  const transactionId = `${merchantPrefix}${timeStamp}${randomNum}`;
  return transactionId;
};

export default generateTransactionReceipt;
