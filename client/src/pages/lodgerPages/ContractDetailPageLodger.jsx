import React from "react";
import { Button } from "@mui/material";

const ContractDetailPageLodger = () => {
  const handleDownload = () => {
    window.open(
      "https://docs.google.com/document/d/1uigw6XCcfeeSg8poMfVRegjfoGhhFsdUqo7Lf9uL_6U/export?format=docx",
      "_blank"
    );
  };

  return (
    <main className="mb-12">
      {/* Hiển thị trang Google Docs */}
      <iframe
        src="https://docs.google.com/document/d/1uigw6XCcfeeSg8poMfVRegjfoGhhFsdUqo7Lf9uL_6U/preview"
        width="100%"
        height="600"
        title="Contract Document"
      ></iframe>

      {/* Nút tải xuống */}
      <div className="flex justify-center mt-6">
        <Button
          variant="contained"
          size="medium"
          color="primary"
          onClick={handleDownload}
        >
          Tải xuống
        </Button>
      </div>
    </main>
  );
};

export default ContractDetailPageLodger;
