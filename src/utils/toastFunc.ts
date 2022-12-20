import { toast } from "react-toastify";

export const toastFunc = (toastTyep: "success" | "error", msg: string) => {
  switch (toastTyep) {
    case "success":
      toast.success(msg, {
        position: toast.POSITION.TOP_CENTER,
      });
      break;
    case "error":
      toast.error(msg, {
        position: toast.POSITION.TOP_CENTER,
      });
      break;
  }
};
