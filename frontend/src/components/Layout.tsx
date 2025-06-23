import { Appbar } from "./Appbar";
import { Outlet } from "react-router-dom";

export default function () {
  return (
    <>
      <Appbar />
      <Outlet />
    </>
  );
}
