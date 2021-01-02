<template>
  <div class="goods">
    <div class="nav">
      <div class="w">
        <a
          @click="handleSort(i)"
          :class="{active:i===isIndex}"
          href="javascript:;"
          v-for="(navItem,i) in navList"
          :key="i"
        >{{navItem.title}}</a>
        <div class="price-interval">
          <input type="number" class="input" placeholder="价格" v-model="min" />
          <span style="margin: 0 5px">-</span>
          <input type="number" placeholder="价格" v-model="max" />
          <!-- min 和 max 是双向数据绑定，直接调用reset即可实现范围筛选 -->
          <el-button type="primary" size="small" style="margin-left: 10px;" @click="reset">确定</el-button>
        </div>
      </div>
    </div>
    <div>
      <div class="goods-box w">
        <mall-goods v-for="goods in allGoods" :key="goods.id" :goods="goods"></mall-goods>
      </div>
      <div class="w">
        <div class="block">
          <el-pagination
            style="float:right"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[8, 20, 40, 80]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          ></el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import MallGoods from "@/components/MallGoods";

export default {
  data() {
    return {
      max: "",
      min: "",
      navList: [
        { title: "综合排序" },
        { title: "价格由低到高" },
        { title: "价格由高到低" },
      ],
      isIndex: 0,
      currentPage: 1,
      pageSize: 20,
      sort: "",
      allGoods: [],
      total: 0,
    };
  },
  components: {
    MallGoods,
  },
  created() {
    this.getAllGoods();
  },
  //针对全部和品牌周边的路由切换进行监听
  watch: {
    //路由发生变化，自动调用方法，重新获取数据
    // !!! 注意分清 route 和router
    $route: "getAllGoods",
  },
  methods: {
    async getAllGoods() {
      //有cid则在url上添加cid参数
      const url = this.$route.query.cid
        ? `/api/goods/allGoods?page=${this.currentPage}&size=${this.pageSize}&sort=${this.sort}&priceGt=${this.min}&priceLte=${this.max}&cid=${this.$route.query.cid}`
        : `/api/goods/allGoods?page=${this.currentPage}&size=${this.pageSize}&sort=${this.sort}&priceGt=${this.min}&priceLte=${this.max}`;
      try {
        //需要传参数，使用模板字符串
        const res = await this.$http.get(url);
        this.allGoods = res.data.data;
        this.total = res.data.total;
      } catch (error) {
        console.log(error);
      }
    },
    //排序
    priceSort(v) {
      this.sort = v;
      this.getAllGoods();
    },
    //重置
    reset() {
      this.currentPage = 1;
      this.sort = "";
      this.getAllGoods();
    },
    handleSort(i) {
      this.isIndex = i;
      switch (i) {
        case 0:
          //综合排序
          this.reset();
          break;
        case 1:
          //正序
          this.priceSort(1);
          break;
        case 2:
          //倒序
          this.priceSort(-1);
          break;
        default:
          break;
      }
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getAllGoods();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getAllGoods();
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../../assets/style/mixin";
@import "../../assets/style/theme";

.nav {
  height: 60px;
  line-height: 60px;
  > div {
    display: flex;
    align-items: center;
    a {
      padding: 0 30px 0 0;
      height: 100%;
      @extend %block-center;
      font-size: 12px;
      color: #999;
      &.active {
        color: #5683ea;
      }
      &:hover {
        color: #5683ea;
      }
    }
    input {
      @include wh(80px, 30px);
      border: 1px solid #ccc;
    }
    input + input {
      margin-left: 10px;
    }
  }
  .price-interval {
    padding: 0 15px;
    @extend %block-center;
    input[type="number"] {
      border: 1px solid #ccc;
      text-align: center;
      background: none;
      border-radius: 5px;
    }
  }
}

.goods-box {
  overflow: hidden;
  > div {
    float: left;
    border: 1px solid #efefef;
  }
}

.no-info {
  padding: 100px 0;
  text-align: center;
  font-size: 30px;
  display: flex;
  flex-direction: column;
  .no-data {
    align-self: center;
  }
}

.img-item {
  display: flex;
  flex-direction: column;
}

.el-pagination {
  align-self: flex-end;
  margin: 3vw 10vw 2vw;
}

.section {
  padding-top: 8vw;
  margin-bottom: -5vw;
  width: 1218px;
  align-self: center;
}

.recommend {
  display: flex;
  > div {
    flex: 1;
    width: 25%;
  }
}
</style>