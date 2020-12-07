<template>
    <div class="poster-div-bg">
        <div class="poster-div">
            <div class="poster-div-box">
                <img class="poster" src="../../assets/mw85/poster.png">
                <div class="but" @click="goGame">{{$t('newFont.font9')}}</div>
                <div class="close" @click="close"></div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: '85poster',
        data() {
            return {}
        },
        mounted() {

        },
        methods: {
            goGame() {
                let url=this.$config.APPID=='wxb364df0830b4a7dd'?"https://mw85.wechattips.com":"https://devmw85.wechattips.com"
                window.location.href=url
            },
            close() {
                this.$emit('close');
            }
        }
    }
</script>

<style lang="scss" scoped>

    .poster-div-bg {
        position: fixed;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        z-index: 999;
    }
    .poster-div {
        width: 8rem;
        height: 13.333333333333334rem;
        position: fixed;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        margin: auto;
        .poster-div-box {
            width: 8rem;
            height: 12rem;
            position: relative;
            .poster {
                width: 8rem;
                height: 12rem;
            }
            .but {
                width: 4.1066666666666665rem;
                height: 1.28rem;
                background: url("../../assets/mw85/but.png") no-repeat;
                background-size: 100%;
                font-size: 0.48rem;
                font-weight: 400;
                color: rgba(255, 255, 255, 1);
                display: flex;
                align-items: center;
                justify-content: center;
                position: absolute;
                left: 0;
                right: 0;
                bottom: 0.9333333333333333rem;
                margin: 0 auto;
                &:active {
                    bottom: 0.9066666666666666rem;
                }
            }
            .close {
                width: 2.6666666666666665rem;
                height: 1.3333333333333333rem;
                background: url("../../assets/mw85/close.png") no-repeat center;
                background-size: 0.8rem;
                margin: 0 auto;
            }
        }
    }

    /*.poster-div {*/
    /*    width: 600px;*/
    /*    height: 1000px;*/
    /*    position: fixed;*/
    /*    left: 0;*/
    /*    top: 0;*/
    /*    right: 0;*/
    /*    bottom: 0;*/
    /*    margin: auto;*/
    /*    .poster-div-box {*/
    /*        width: 600px;*/
    /*        height: 900px;*/
    /*        position: relative;*/
    /*        .poster {*/
    /*            width: 600px;*/
    /*            height: 900px;*/
    /*        }*/
    /*        .but {*/
    /*            width: 308px;*/
    /*            height: 96px;*/
    /*            background: url("../../assets/mw85/but.png") no-repeat;*/
    /*            background-size: 100%;*/
    /*            font-size: 36px;*/
    /*            font-weight: 400;*/
    /*            color: rgba(255, 255, 255, 1);*/
    /*            display: flex;*/
    /*            align-items: center;*/
    /*            justify-content: center;*/
    /*            position: absolute;*/
    /*            left: 0;*/
    /*            right: 0;*/
    /*            bottom: 70px;*/
    /*            margin: 0 auto;*/
    /*            &:active {*/
    /*                bottom: 68px;*/
    /*            }*/
    /*        }*/
    /*        .close {*/
    /*            width: 200px;*/
    /*            height: 100px;*/
    /*            background: url("../../assets/mw85/close.png") no-repeat center;*/
    /*            background-size: 60px;*/
    /*            margin: 0 auto;*/
    /*        }*/
    /*    }*/

    /*}*/

</style>
