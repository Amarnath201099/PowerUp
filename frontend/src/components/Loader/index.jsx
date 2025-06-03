import { SyncLoader } from "react-spinners";

import "./index.css";

const overrideStyle = {
  display: "block",
  margin: "0 auto",
  borderColor: "#003366",
};

const Loader = ({ loading = true, color = "#003366", size = 15 }) => {
  return (
    <div className="loader-wrapper">
      <SyncLoader
        color={color}
        loading={loading}
        cssOverride={overrideStyle}
        size={size}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    </div>
  );
};

export default Loader;
