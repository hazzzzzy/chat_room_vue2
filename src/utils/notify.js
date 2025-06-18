// utils/notify.js
import { Notification } from "element-ui";
const duration = 2000;

const Notify = {
  success(message, title = "成功") {
    Notification.success({
      title,
      message,
      duration: duration,
    });
  },

  error(message, title = "错误") {
    Notification.error({
      title,
      message,
      duration: 5000,
    });
  },

  warning(message, title = "警告") {
    Notification.warning({
      title,
      message,
      duration: 3000,
    });
  },

  info(message, title = "提示") {
    Notification.info({
      title,
      message,
      duration: duration,
    });
  },
};

export default Notify;
