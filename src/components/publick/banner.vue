<template>
  <div class="wrap">

    <slot name="list">

    </slot>

    <slot name="nav">

    </slot>

  </div>
</template>

<script>
  // import BScroll from 'better-scroll'

  export default {
    name: "banner",
    data() {
      return {

      }
    },
    mounted: function () {
      this.init();
    },
    methods: {
      init() {
        let wrap = document.querySelector('.wrap');
        let list = document.querySelector('.listb');
        let navs = document.querySelectorAll('.nav a');
        let silde = new BScroll(wrap,{
          scrollX: true,
          scrollY: false,
          momentum: false,
          snap: {
            loop: true,
            threshold: .2
          }
        });
        list.style.width = list.children.length + "00%";
        silde.refresh();//修改了dom之后，重新计算一下
        /* BScroll 移动的是 wrap 下第0个子元素 */
        silde.on("scrollEnd",function(){
          navs.forEach((nav)=>{
            nav.classList.remove("active");
          });
          navs[silde.getCurrentPage().pageX].classList.add("active");
        });
        setInterval(function(){
          silde.next();
        },3000);

      }
    }


  }
</script>

<style lang='less' scoped>
  .wrap {
    width: 100vw;
    height: 100%;
    overflow: hidden;
    position: relative;
    top: 0;
    left: 0;
    bottom: 20px;
  }
  ul {
    height: 100%;
  }
  .listb {
    width: 400vw;
    overflow: hidden;
    postion: relative;
  }
  .listb li {
    float:left;
    width: 100vw;
    height: 100%;
    box-sizing: border-box;
    font: 80px/138px "宋体";
    text-align:center;
    background: #f1f1f1;
  }
  .nav {
    position: absolute;
    left: 0;
    bottom: 40px;
    width: 100vw;
    height: 10px;
    text-align: center;
  }
  .nav a {
    display: inline-block;
    width: 40px;
    height: 6px;
    background: #e4e4e4;

  }
  .nav a.active {
    background:#ffffff;
  }
  .listb li img{
    width: 100%;
  }
</style>
