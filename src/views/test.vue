<template>
  <div>
    <el-upload
      class="upload-demo"
      action="http://10.1.12.187:9000/api/upload"
      :headers="headers"
      :limit="1"
      :on-success="suc"
      :on-error="err"
      :file-list="fileList"
      :show-file-list="false"
    >
      <el-button size="small" type="primary">点击上传</el-button>
      <div slot="tip" class="el-upload__tip">
        只能上传jpg/png文件，且不超过500kb
      </div>
    </el-upload>
  </div>
</template>


<script>
import { getCache, getMyself, clearAllCache } from "@/utils/useCache";
import Notify from "@/utils/notify";

export default {
  data() {
    return {
      fileList: [],
      headers: {
        Authorization: getMyself().token,
      },
      userID: getMyself().userID,
    };
  },
  methods: {
    suc(r, file, fileList) {
      this.fileList = [];
      if (r.code === -2) {
        Notify.error(r.msg);
        clearAllCache();
        this.$router.push("/login");
      } else if (r.code === -1) {
        Notify.error(r.msg);
      } else {
        // this.$avatarList.userID = r.data;
        Notify.success("上传头像成功！请刷新页面");
      }
    },
    err(e, file, fileList) {
      this.fileList = [];
      Notify.error(e);
    },
  },
};
</script>