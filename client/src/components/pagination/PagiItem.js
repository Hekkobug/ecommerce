import React, { memo } from "react";
import clsx from "clsx";
import {
  createSearchParams,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";

const PagiItem = ({ children }) => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const handlePagination = () => {
    const queries = Object.fromEntries([...params])
    if (Number(children)) queries.page = children;
    navigate({
      pathname: location.pathname,
      search: createSearchParams(queries).toString(),
    });
  };
  return (
    <button
      className={clsx(
        "w-10 h-10 flex justify-center",
        !Number(children) && "items-end pb-2",
        Number(children) && "items-center hover:rounded-full hover:bg-pink-200",
        +params.get('page') === +children && "rounded-full bg-pink-200",
        !+params.get('page') &&
          +children === 1 &&
          "rounded-full bg-pink-200"
      )}
      onClick={handlePagination}
      type="button"
      disabled={!Number(children)}
    >
      {children}
    </button>
  );
};

export default memo(PagiItem);
