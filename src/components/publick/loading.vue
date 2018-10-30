<template>
    <div class="loading">
        <div class="model_con" v-if="$store.state.loadingBoole">
            <div class="model">
              <img src="../../assets/img/loading.gif" alt="">
              <p>玩命加载中......</p>
            </div>

        </div>

    </div>
</template>

<script>
    export default {
        name: "loading",
        data(){
            return {
                show:false,
            }
        }
    }
</script>

<style scoped>
  .model_con {
    text-align: center;
    /*position: relative;*/
    width: 100%;
    height: 100%;
  }
  .model{
    width: 100%;
    height: 100%;
    /*background: rgba(225,225,225,.5);*/
    background: #ffffff;
    position: absolute;
    left: 0;
    top: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;

  }
  .model_con img {
    width: 60px;
    /*position: absolute;*/
    /*right: 0;*/
    /*left: 0;*/
    /*bottom: 0;*/
    /*top: 0;*/
    /*margin: auto;*/
  }
  .model_con p{
    font-size: 28px;
    margin-top: 10px;
  }

</style>
