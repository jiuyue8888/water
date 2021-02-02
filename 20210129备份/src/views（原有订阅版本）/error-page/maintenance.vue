<template>
    <div class="main">
        <img class="top-img" src="../../assets/images/maintenance-1.png">
        <div class="info-div">
            <div class="text">服務升級中，請稍後再試</div>
            <div class="box"></div>
        </div>
        <img class="bottom-img" src="../../assets/images/maintenance-2.png">
    </div>
</template>

<script>
    export default {
        name: 'maintenance',
        data() {
            return {}
        },
        mounted() {
        }
    }
</script>



<style lang="scss" scoped>
    .main {
        background: #fff;
        text-align: center;
        width: 100%;
        height: 100vh;
        margin: 0 auto;
        position: relative;

        .top-img{
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: auto;
        }
        .bottom-img{
            position: absolute;
            left: 0;
            bottom: 0;
            width: 100%;
            height: auto;
        }
        .info-div{
            position: absolute;
            width: 100%;
            top: 50%;
            left: 0;
            transform: translateY(-120%);
            -webkit-transform: translateY(-120%);
            padding-bottom: 2vw;
            .text{
                font-size:5vw;
                font-weight:500;
                color:rgba(0,18,94,1);
            }
            .box{
                position: absolute;
                left: 0;
                right: 0;
                bottom: 0;
                width:66.6%;
                margin: 0 auto;
                height:36px;
                background:rgba(157,200,20,1);
                opacity:0.2;
                border-radius:18px;
            }
        }

    }
</style>
