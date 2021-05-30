<template>
  <div class="navbar">
    <hamburger
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />

    <div class="badge">
      <el-badge v-for="s in statis" :key="s.state" :value="s.count" class="item">
        <el-button size="small" @click="handleClick(s)">{{ s.label }}</el-button>
      </el-badge>
    </div>

    <breadcrumb class="breadcrumb-container" />

    <div class="right-menu">
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <!-- <img :src="'/distr/logo.png'" class="user-avatar" /> -->
          <el-avatar>{{ avatar }}</el-avatar>
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <router-link to="/">
            <el-dropdown-item>首页</el-dropdown-item>
          </router-link>
          <!-- <a target="_blank" href="https://github.com/PanJiaChen/vue-admin-template/">
            <el-dropdown-item>Github</el-dropdown-item>
          </a>-->
          <!-- <a target="_blank" href="https://panjiachen.github.io/vue-element-admin-site/#/">
            <el-dropdown-item>Docs</el-dropdown-item>
          </a>-->
          <el-dropdown-item divided @click.native="logout">
            <span style="display:block;">登出</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Breadcrumb from "@/components/Breadcrumb";
import Hamburger from "@/components/Hamburger";
import { getStatis, getStatis2 } from "@/api/order";
import { poll } from "@/api/global";

export default {
  inject: ["reload", "inload", "outload"],
  components: {
    Breadcrumb,
    Hamburger,
  },
  computed: {
    ...mapGetters(["sidebar", "avatar", "role"]),
  },
  data() {
    return {
      statis: {
        state0: { label: "待付款", count: 0, state: "0" },
        state1: { label: "待发货", count: 0, state: "1" },
        state2: { label: "已发货", count: 0, state: "2" },
        state3: { label: "退款中", count: 0, state: "3" },
        state4: { label: "已成功", count: 0, state: "4" },
      },
      poll: null,
    };
  },
  created() {
    this.getStatis();
    this.poll = poll(() => {
      this.getStatis();
    });
  },
  destroyed() {
    clearInterval(this.poll);
  },
  methods: {
    match(s) {},
    toggleSideBar() {
      this.$store.dispatch("app/toggleSideBar");
    },
    async logout() {
      await this.$store.dispatch("user/logout");
      this.$router.push(`/login?redirect=${this.$route.fullPath}`);
      // this.reload();
      // window.location.href = "/login";
    },

    getStatis() {
      getStatis({ is_state_group: true }).then((resp) => {
        // var data = resp.data.buckets;
        var data = resp.data;
        data.forEach((e) => {
          // console.log(e);
          if (e.state >= 0 && e.state <= 4) {
            this.statis["state" + e.state].count = e.count;
            return;
          }
        });
      });
      console.log(this.statis);
    },

    handleClick(s) {
      this.$router.push({ path: "/order/list/" + s.state });
    },
  },
};
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}

.item {
  margin-top: 10px;
  margin-right: 40px;
}

.badge {
  // float: right;
  margin-left: 100px;
  display: inline-block;
}
</style>
