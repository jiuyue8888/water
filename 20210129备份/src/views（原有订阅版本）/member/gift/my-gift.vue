<template>
  <div class="main">

    <!-- 页头 -->
    <Header metaTitle="我的禮品"/>

    <div class="title my-gift">
      <el-tabs v-model="tab" @tab-click="onTab" :stretch="true">
        <el-tab-pane label="未核銷" name="1"></el-tab-pane>
        <el-tab-pane label="已核銷" name="2"></el-tab-pane>
        <el-tab-pane label="已失效" name="3"></el-tab-pane>
      </el-tabs>
    </div>

    <!-- 列表 -->
    <ul class="list">
      <li v-for="(item,index) in myGiftList">
        <div class="content">
          <img :src="item.giftUrl">
          <div style="padding-left: 10px;" class="right">
            <h3>{{ item.giftTitle }}</h3>
            <p style="padding:8px 0">有效期：{{ item.startTime }} ~ {{ item.endTime }}</p>
            <p v-if="item.giftType!=2">ID：{{ item.sku }}</p>
            <div class="content-button">
              <el-button class="deep-blue" size="mini" round v-if="item.orderState == 1"
                         @click="openVerification(item)">核銷 <i
                      :class="verificationShow == item.id ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
              </el-button>
              <el-button class="baby-blue" size="mini" round v-if="item.orderState == 2"
                         style="margin-top: 7px;">已核銷 {{ item.lastUpdateTime }}
              </el-button>
              <el-button class="baby-blue" size="mini" round v-if="item.orderState == 3">已失效</el-button>
            </div>
          </div>
        </div>
        <el-tabs v-model="getMethod" :stretch="true" v-if="verificationShow == item.id">
          <el-tab-pane label="核銷" name="verification" class="verification">
            <!-- 第一种方式 -->
            <div class="one" v-if="item.writeOffType == 0">
              <div class="statement">請前往澳門自來水公司出示電子兌換劵。</div>
              <el-form :model="form" label-width="70px">
                <el-form-item label="核銷碼：" style="margin-bottom: 0">
                  <el-input class="underline" v-model="form.verification"
                            placeholder="請輸入核銷碼"></el-input>
                  <span class="error">{{ errorMsg }}</span>
                </el-form-item>
              </el-form>
              <div class="button">
                <el-button class="deep-blue" size="mini" round @click="submit(item)">確認</el-button>
              </div>
            </div>
            <!-- 第二种方式 -->
            <div class="two" v-if="item.writeOffType == 1">
              <!-- 普通礼券核销 -->
              <template v-if="item.giftType==1">
                <div class="statement">請前往澳門自來水公司出示電子兌換劵。</div>
                <div style="display: flex;justify-content: center;">
                  <svg id="barcode"></svg>
                </div>
                <el-form :model="form" label-width="70px">
                  <el-form-item label="核銷碼：" style="margin-bottom: 0">
                    <el-input class="underline" v-model="form.verification"
                              placeholder="請輸入核銷碼"></el-input>
                    <span class="error">{{ errorMsg }}</span>
                  </el-form-item>
                </el-form>
                <div class="button">
                  <el-button class="deep-blue" size="mini" round @click="submit(item)">確認</el-button>
                </div>
              </template>
              <!-- 泰丰礼券核销 -->
              <template v-else>
                <div class="statement">請出示二維碼給工作人員核銷，相關注意事項，先查看上方兌換須知。</div>
                <div style="display: flex;justify-content: center;">
                  <img class="qrcode" :src="qrcodeUrl">
                </div>
                <!--                                <div class="qrcode-num">{{item.sku}}</div>-->
              </template>
            </div>
            <!-- 第三种方式 -->
            <div class="three" v-if="item.writeOffType == 2">
              <div class="statement">請完成領取人資料登記，我們將有專人聯繫您領取實體禮品。</div>
              <el-form :key="index" class="my-gift" :rules="rules" ref="form" :model="form"
                       label-width="110px">
                <el-form-item label="姓名：" prop="name">
                  <el-input class="underline" v-model="form.name" placeholder="請輸入真實姓名"></el-input>
                </el-form-item>
                <el-form-item label="身份證號碼：" prop="identity">
                  <el-input class="underline" v-model="form.identity"
                            placeholder="請輸入身份證號碼"></el-input>
                </el-form-item>
                <el-form-item label="聯繫電話：" prop="phone">
                  <el-input class="underline" v-model="form.phone" placeholder="請輸入聯繫電話"></el-input>
                </el-form-item>
                <!--                prop="address"-->
                <el-form-item label="地址：">
                  <el-input class="underline" v-model="form.address" placeholder="請輸入地址"></el-input>
                </el-form-item>
                <el-form-item label="備註：" prop="remark">
                  <el-input class="underline" v-model="form.remark" placeholder="請輸入備註內容"></el-input>
                </el-form-item>
              </el-form>
              <div class="button">
                <el-button class="deep-blue" size="mini" round @click="openInformationShow">確認
                </el-button>
              </div>
            </div>
            <!-- 信息确认弹窗 -->
            <el-dialog
                    title="信息確認"
                    width="80%"
                    custom-class="dialog-common"
                    :visible.sync="informationShow"
                    :show-close="false"
                    @open="noScroll('add')"
                    @close="noScroll('remove')"
                    center>
              <div>信息填寫後無法修改，是否確認保存？</div>
              <span slot="footer">
                <el-button round @click="informationShow = false">取消</el-button>
                <el-button round type="primary" @click="submitContact(item)">確認</el-button>
              </span>
            </el-dialog>
          </el-tab-pane>
          <el-tab-pane label="須知" name="notice" class="notice">
            <h3>兌換須知</h3>

            <div class="remark-div" :class="{'remark-div-cur':item.showAllNotice==1}">
              <p v-html="dealString(item.remark)"></p>
              <div class="see-more-but" v-if="item.showAllNotice==0" @click="seeMore(item)">
                <div>查看更多</div>
                <img src="../../../assets/images/more.png">
              </div>
            </div>
            <!--            <p>請按要求填寫個人資料，屆時將有專人聯繫你領獎。換領獎品時，憑藉身份證並出示給工作人員，即可領取獎品。獎品換領有效日期自兌換當日起至2020年2月21日，請留意電話通知，謝謝！</p>-->
          </el-tab-pane>
        </el-tabs>
      </li>
      <li v-if="myGiftList.length == 0">沒有數據!</li>
    </ul>


  </div>
</template>

<script>
  import {getMygift, confirmVerification, getTaiFengVouchersStatus} from '@/api/integral'
  import Header from '@/components/Header'
  import JsBarcode from 'jsbarcode2'
  import QRCode from 'qrcode'
  import {validChinese, validNumber} from '@/utils/validate'

  export default {
    name: 'memberGiftMygift',
    data() {
      let validateName = (rule, value, callback) => {
        if (!validChinese(value)) {
          callback(new Error('請輸入真實姓名'));
        } else {
          callback();
        }
      };
      let validateIdentity = (rule, value, callback) => {
        if (validChinese(value)) {
          callback(new Error('請輸入正確的證件號碼'));
        } else {
          callback();
        }
      };

      let validatePhone = (rule, value, callback) => {
        if (!validNumber(value)) {
          callback(new Error('請輸入正確的手機號碼'));
        } else {
          callback();
        }
      };
      return {
        informationShow: false,
        errorMsg: '',
        verificationShow: '',
        getMethod: 'verification',
        tab: '1',
        myGiftList: [],
        form: {
          verification: '',
          name: '',
          identity: '',
          phone: '',
          address: '',
          remark: '',
        },
        rules: {
          name: [
            {required: true, message: '請輸入姓名', trigger: 'blur'},
            {validator: validateName, trigger: 'blur'},
          ],
          identity: [
            {required: true, message: '請輸入證件號碼', trigger: 'blur'},
            {validator: validateIdentity, trigger: 'blur'},
          ],
          phone: [
            {required: true, message: '請輸入聯繫電話', trigger: 'blur'},
            {validator: validatePhone, trigger: 'blur'},
          ],
          address: [
            {required: true, message: '請輸入地址', trigger: 'blur'},
          ],
        },

        checkTimeInt: null,
        qrcodeUrl:'',

      }
    },
    components: {
      Header: Header,
    },
    created() {
      this.getMygift(this.tab);
      this.$share();
    },
    updated() {

    },
    destroyed() {
      this.endCheckTaiFengVouchersStatus();
    },
    methods: {
      seeMore(item){
        this.myGiftList[item.index].showAllNotice=1
      },

      //开始查询泰丰领券状态
      getTaiFengVouchersStatus(id) {
        let that = this
        clearInterval(that.checkTimeInt)
        if(!id){return false;}
        that.checkTimeInt = setInterval(async function () {
          let result = await getTaiFengVouchersStatus(id)
          if (result.code == 200) {
            if (result.data.status == 1) {
              clearInterval(that.checkTimeInt)
              that.getMygift(that.tab);
            }
          } else {
            clearInterval(that.checkTimeInt)
          }

        }, 2000)
      },
      endCheckTaiFengVouchersStatus(){
        clearInterval(this.checkTimeInt)
      },

      //换行符处理
      dealString(data) {
        return data?data.replace(/\n/g, '<br>'):''
      },
      //获取我的礼品
      async getMygift(tab) {
        let data = {
          orderState: tab
        }
        let res = await getMygift(data);
        if (res.code == 200) {
          let myGiftList=res.result;
          for(let i in myGiftList){
            myGiftList[i].showAllNotice=0
            myGiftList[i].index=Number(i)
          }
          console.log(myGiftList);
          this.myGiftList = myGiftList;
        }
      },

      //点击tab
      onTab() {
        this.verificationShow = '';
        this.getMygift(this.tab);
        this.endCheckTaiFengVouchersStatus();
      },
      //打開核銷
      openVerification(item) {

        this.form.verification = '';
        this.endCheckTaiFengVouchersStatus();
        if (this.verificationShow === item.id) {
          this.verificationShow = '';
        } else {
          this.verificationShow = item.id;
          if (item.writeOffType == 1) {
            this.$nextTick(function () {
              if(item.giftType==1){
                let dom = document.querySelector('#barcode');
                JsBarcode(dom, item.sku, {
                  height: 70
                });
              }else {
                QRCode.toDataURL(item.sku).then(url => {
                  this.qrcodeUrl=url
                })
                this.getTaiFengVouchersStatus(item.id);
              }
            })
          }
        }
      },
      // 確認核銷
      async submit(obj) {
        // console.log(obj);

        if (!this.form.verification) {
          this.errorMsg = '核銷碼不能為空';
          return false;
        } else {
          this.errorMsg = '';
        }

        let data = {
          id: obj.id,
          writeOffType: obj.writeOffType,
          writeOffCode: this.form.verification,
        };
        let res = await confirmVerification(data);
        if (res.code == 200) {
          this.errorMsg = '';
          this.$message('核銷成功');
          for (let i = 0; i < this.myGiftList.length; i++) {
            if (this.myGiftList[i].id === obj.id) {
              this.myGiftList.splice(i, 1);
              break
            }
          }
        } else {
          this.errorMsg = '核銷失敗，核銷碼錯誤！';
        }
      },
      //打开信息确认弹窗
      openInformationShow() {
        let that = this;
        this.$refs['form'][0].validate((valid) => {
          if (valid) {
            that.informationShow = true;
          }
        })
      },
      //确认联系方式
      async submitContact(obj) {
        // console.log(obj)
        let data = {
          id: obj.id,
          writeOffType: 2,
          receiver: this.form.name,
          idCard: this.form.identity,
          contactNumber: this.form.phone,
          address: this.form.address,
          remark: this.form.remark,
        }
        let res = await confirmVerification(data);
        if (res.code == 200) {
          this.informationShow = false;
          this.$message('核销成功');
          for (let i = 0; i < this.myGiftList.length; i++) {
            if (this.myGiftList[i].id === obj.id) {
              this.myGiftList.splice(i, 1);
              break
            }
          }
        }
      }
    }
  }
</script>


<style lang="scss">
  .my-gift {
    .el-tabs__item {
      height: 44px;
      color: #666;
    }
    .el-tabs__item.is-active {
      color: #364973;
    }
    .el-tabs__active-bar {
      background-color: #364973;
    }
    .el-tabs__nav-wrap::after {
      background-color: inherit;
    }
    .el-form-item__label {
      text-align: left;
    }
  }
</style>
<style lang="scss" scoped>
  // 标题
  .title {
    background-color: #fff;
    width: calc(100% - 50px);
    height: 44px;
    padding: 0 25px;
  }
  // 列表
  .list{
    padding-bottom: 30px;
  }
  .list li {
    .content {
      display: flex;
      .right {
        -webkit-box-flex: 1;
        -webkit-flex: 1;
        flex: 1;
      }
    }
    width: 85%;
    padding: 15px;
    margin: 0 auto;
    margin-top: 15px;
    border-radius: 8px;
    background: #fff;
    font-size: 12px;
    color: #666;
    img {
      width: 105px;
      height: 105px;
    }
    .qrcode{
      width: 150px;
      height: 150px;
    }
    .qrcode-num{
      text-align: center;
      font-size: 15px;
      color: #000000;
      margin-top: -10px;
    }
    h3 {
      font-size: 16px;
      color: #333;
    }

    .content-button {
      .el-button {
        float: right;
      }
    }

    .el-tabs {
      border-top: 1px dashed #E4E7ED;
      margin-top: 15px;

      .verification {
        .statement {
          width: 100%;
          box-sizing: border-box;
          background: rgba(255, 245, 231, 1);
          border-radius: 4px;
          font-size: 12px;
          color: #D18822;
          padding: 10px;
        }

        .error {
          color: #EE4E4E;
          font-size: 12px;
        }

        .button {
          display: flex;
          justify-content: center;

          .el-button {
            width: 60%;
            margin-top: 10px;
          }
        }
      }

      .notice {
        h3 {
          text-align: center;
          margin-bottom: 10px;
        }
        .remark-div{
          max-height: 200px;
          overflow: hidden;
          position: relative;
          .see-more-but{
            display: flex;
            align-items: center;
            justify-content: center;
            position: absolute;
            left: 0;
            top: 150px;
            width: 100%;
            text-align: center;
            height: 50px;
            background: linear-gradient(180deg,rgba(255,255,255,0),#fff);/*实现渐变效果，遮罩效果*/
            div{
              font-size: 15px;
              color: #4E8CEF;
              margin-right: 4px;
            }
            img{
              width: 15px;
              height: 15px;
            }
          }
        }
        .remark-div-cur{
          max-height: none;
        }

        p {
          line-height: 20px;
        }
      }
    }
  }

</style>
