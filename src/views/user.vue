<template>
  <div class="main">
    <div class="user-header">
      <el-button type="primary" @click="addForm.dialogVisible = true"
        >添加用户</el-button
      >
    </div>
    <div class="user-table" v-loading="loading.tableLoading">
      <el-table :data="userTable" stripe style="width: 100%" border>
        <el-table-column prop="id" label="#" width="50" align="center">
        </el-table-column>
        <el-table-column prop="account" label="账号" align="center">
        </el-table-column>
        <el-table-column prop="create_at" label="创建日期" align="center">
        </el-table-column>
        <el-table-column prop="username" label="用户名" align="center">
        </el-table-column>
        <el-table-column prop="avatar" label="头像" align="center">
          <template slot-scope="scope">
            <el-avatar :src="scope.row.avatar" shape="square" size="large">
              {{ scope.row.username.charAt(0) }}
            </el-avatar>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="账户状态" align="center">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status"
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-text="启用"
              inactive-text="禁用"
              :active-value="1"
              :inactive-value="2"
              @change="(val) => banUser(scope.row.id, val)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" align="center">
          <template slot-scope="scope">
            <el-link
              icon="el-icon-edit"
              type="primary"
              @click="getUserDetail(scope.row.id)"
              >编辑</el-link
            >
            <span> | </span>
            <el-popconfirm
              title="确认要删除吗？"
              @confirm="delUser(scope.row.id)"
            >
              <el-link slot="reference" icon="el-icon-delete" type="danger"
                >删除</el-link
              ></el-popconfirm
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog
      title="编辑用户信息"
      :visible.sync="editForm.dialogVisible"
      width="30%"
    >
      <el-form
        :model="editForm.data"
        :rules="editForm.rules"
        ref="editForm"
        @submit.native.prevent
        label-width="100px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input
            v-model="editForm.data.username"
            placeholder="请输入用户名"
            clearable
          />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="editForm.data.password"
            placeholder="请输入密码"
            show-password
            clearable
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editForm.dialogVisible = false">放弃更改</el-button>
        <el-button
          type="primary"
          @click="editUser"
          :loading="editForm.subLoading"
          >提交</el-button
        >
      </span>
    </el-dialog>
    <el-dialog
      title="添加用户"
      :visible.sync="addForm.dialogVisible"
      width="30%"
    >
      <el-form
        :model="addForm.data"
        :rules="addForm.rules"
        ref="addForm"
        @submit.native.prevent
        label-width="100px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input
            v-model="addForm.data.username"
            placeholder="请输入用户名"
            clearable
          />
        </el-form-item>
        <el-form-item label="账号" prop="account">
          <el-input
            v-model="addForm.data.account"
            placeholder="请输入账号"
            clearable
          />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="addForm.data.password"
            placeholder="请输入密码"
            show-password
            clearable
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addForm.dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="addUser" :loading="addForm.subloading"
          >提交</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import http from "@/utils/r";
import Notify from "@/utils/notify";
import newForm from "@/utils/newForm";
export default {
  data() {
    return {
      userTable: [],
      loading: {
        tableLoading: false,
      },
      editForm: {
        data: {
          userID: null,
          username: null,
          password: null,
        },
        rules: {
          username: [
            { required: true, message: "请输入用户名", trigger: "blur" },
            {
              min: 3,
              max: 10,
              message: "长度在 3 到 10 个字符",
              trigger: "blur",
            },
          ],
          password: [
            // { required: false, message: "请输入密码", trigger: "blur" },
            {
              min: 6,
              max: 20,
              message: "长度在 6 到 20 个字符",
              trigger: "blur",
            },
          ],
        },
        subLoading: false,
        dialogVisible: false,
      },
      addForm: {
        data: {
          account: null,
          username: null,
          password: null,
        },
        rules: {
          account: [
            { required: true, message: "请输入账号", trigger: "blur" },
            {
              min: 3,
              max: 10,
              message: "长度在 3 到 10 个字符",
              trigger: "blur",
            },
          ],
          username: [
            { required: true, message: "请输入用户名", trigger: "blur" },
            {
              min: 3,
              max: 10,
              message: "长度在 3 到 8 个字符",
              trigger: "blur",
            },
          ],
          password: [
            { required: true, message: "请输入密码", trigger: "blur" },
            {
              min: 6,
              max: 20,
              message: "长度在 6 到 20 个字符",
              trigger: "blur",
            },
          ],
        },
        subloading: false,
        dialogVisible: false,
      },
    };
  },
  mounted() {
    this.getUserList();
  },
  methods: {
    async getUserList() {
      this.loading.tableLoading = true;
      await http
        .get("/user/getList")
        .then((r) => {
          this.userTable = r.data;
        })
        .catch()
        .finally(() => {
          this.loading.tableLoading = false;
        });
    },
    async getUserDetail(userID) {
      this.editForm.dialogVisible = true;
      http
        .get("/user/detail", {
          params: {
            userID: userID,
          },
        })
        .then((r) => {
          this.editForm.data = r.data;
          this.editForm.data.userID = r.data.id;
        })
        .catch((e) => {
          console.error(e);
        });
    },
    async delUser(userID) {
      http
        .post("/user/delete", { userID: userID })
        .then((r) => {
          Notify.success(r.msg);
          this.getUserList();
        })
        .catch((e) => {
          //   console.error(e);
        })
        .finally(() => {});
    },
    async editUser() {
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          this.editForm.subLoading = true;
          http
            .post("/user/edit", newForm(this.editForm.data))
            .then((r) => {
              Notify.success(r.msg);
              this.editForm.dialogVisible = false;
              this.getUserList();
            })
            .catch((e) => {
              console.error(e);
            })
            .finally(() => {
              this.editForm.subLoading = false;
            });
        } else {
          return;
        }
      });
    },
    async addUser() {
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          this.addForm.subloading = true;
          http
            .post("/user/add", newForm(this.addForm.data))
            .then((r) => {
              Notify.success(r.msg);
              this.addForm.dialogVisible = false;
              this.getUserList();
            })
            .catch((e) => {
              console.error(e);
            })
            .finally(() => {
              this.addForm.subloading = false;
            });
        } else {
          return;
        }
      });
    },
    async banUser(userID, status) {
      http
        .post("/user/ban", newForm({ userID: userID, status: status }))
        .then((r) => {
          Notify.success(r.msg);
          //   this.getUserList();
        })
        .catch((e) => {
          //   console.error(e);
        })
        .finally(() => {});
    },
  },
};
</script>

<style lang="less" scoped>
.main {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  > div {
    width: 100%;
  }
  .user-header {
    margin-bottom: 20px;
  }
}
</style>