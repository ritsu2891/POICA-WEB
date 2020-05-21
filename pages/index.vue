<template>
  <div class="d-flex align-center" style="height: 100%;">
    <div style="width: 100%;">
      <div style="width: 100%;">
        <v-row justify-center align-center>
          <v-col cols="12" xs="12" md="6" class="pb-0" align="center">
            <img src="/logo.png" style="max-height: 100px; max-width: 100%;" />
          </v-col>
          <v-col cols="12" cs="12" md="6" class="pt-0">
            <span style="font-size: 50px; font-weight: 700">ポイカ</span><br>
            あなたの電子ポイントカード作成サービス<br>
            ＊本サービスはアルファ版（試験運用段階）です。
          </v-col>
        </v-row>
      </div>
      <div class="SampleCardWrapper">
        <img class="SampleCard" src="/1.jpg" />
        <img class="SampleCard2" src="/1.jpg" />
        <img class="SampleCard3" src="/1.jpg" />
      </div>
      <div class="SampleCardWrapper">
        <img class="SampleCard LeftOffset" src="/2.jpg" />
        <img class="SampleCard2 LeftOffset" src="/2.jpg" />
        <img class="SampleCard3 LeftOffset" src="/2.jpg" />
      </div>
      <div class="SampleCardWrapper">
        <img class="SampleCard" src="/3.jpg" />
        <img class="SampleCard2" src="/3.jpg" />
        <img class="SampleCard3" src="/3.jpg" />
      </div>
    </div>
  </div>
  
</template>
<style scoped>
.SampleCardWrapper {
  position: relative;
  height: 200px;
}
.SampleCard {
  position: absolute;
  top: 0;
  height: 200px;
  animation: loop 24s -16s linear infinite;
}
.SampleCard2 {
  position: absolute;
  top: 0;
  height: 200px;
  animation: loop 24s -8s linear infinite;
}
.SampleCard3 {
  position: absolute;
  top: 0;
  height: 200px;
  animation: loop 24s linear infinite;
}
.LeftOffset {
  left: 150px;
}

@keyframes loop {
  0% {
    -webkit-transform: translateX(150%);
    -ms-transform: translateX(150%);
    transform: translateX(150%);
  }
  to {
    -webkit-transform: translateX(-150%);
    -ms-transform: translateX(-150%);
    transform: translateX(-150%);
  }
}
</style>