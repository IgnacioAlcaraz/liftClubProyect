import React from "react";

const BaseServiceList = ({ children }) => {
  return (
    <div className="d-flex flex-wrap justify-content-center gap-4">
      {children}
    </div>
  );
};

export default BaseServiceList;
