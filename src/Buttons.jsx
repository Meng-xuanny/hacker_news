import React from "react";
import { useGlobalContext } from "./context";

const Buttons = () => {
  const { isLoading, page, nbPages, handlePageInc, handlePageDec, dispatch } =
    useGlobalContext();

  return (
    <div className="btn-container">
      <button disabled={isLoading} onClick={() => dispatch(handlePageDec())}>
        prev
      </button>
      <p>
        {page + 1} of {nbPages}
      </p>
      <button disabled={isLoading} onClick={() => dispatch(handlePageInc())}>
        next
      </button>
    </div>
  );
};

export default Buttons;
