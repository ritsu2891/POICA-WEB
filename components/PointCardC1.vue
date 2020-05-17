<template>
  <div
    :style="{
      height: `${height}px`,
    }"
    v-ripple
  >
    <div
      class="card d-flex flex-column justify-space-around align-center"
      :style="{
        backgroundColor: master.backgroundColor,
        color: master.textColor,
        width: '500px',
        height: '300px',
        transform: `translate(${(width-originalWidth)/2}px, ${(height - originalHeight) / 2}px) scale(${cardSizeRatio}, ${cardSizeRatio}) `,
        // border: 'solid 1px red'
      }"
    >
      <!-- カード名 -->
      <div class="d-flex justify-center align-center">
        <div class="mx-4">
          <LogoImg
            :imgUrl="master.logoUrl"
            :imgType="master.logoType"
            :fillColor="master.primaryColor"
            :width="size.logo"
          ></LogoImg>
        </div>
        <div>
          <span
            class="cardTitle"
            :style="{ fontSize: size.title+'px' }"
          >
            {{master.displayName}}
          </span>
          <br v-if="card.description">
          <span
            v-if="card.description"
            class="cardDesc"
            :style="{ fontSize: size.desc+'px' }"
          >
            {{card.description}}
          </span>
        </div>
      </div>
      <!-- ユーザ名・ポイント -->
      <div>
        <div
          class="userDisplayName"
          :style="{ fontSize: size.userDisplayName+'px' }"
        >
          {{user.displayName}}
        </div>
        <div class="pointRow">
          <span
            class="point"
            :style="{ fontSize: size.point+'px' }"
          >
            {{card.point}}
          </span>
          <span
            class="pointSuffix"
            :style="{ fontSize: size.pointSuffix+'px' }"
          >
            pt
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.card {
  padding: 15px;
  height: 100%;
}
/* .cardTitle {
  
}
.cardDesc {
  
.userDisplayName {
  
} */
.point {
  font-weight: 700;
}
.pointRow {
  line-height: 1;
}
/* .pointSuffix {
  
} */
</style>
<script>
import LogoImg from '~/components/LogoImg.vue';
import BasePointCard from './BasePointCard.vue';

export default {
  components: { LogoImg },
  extends: BasePointCard,
  data() {
    return {
      originalWidth: 500,
      originalHeight: 300,
      size: {
        logo: 80,
        title: 30,
        desc: 20,
        userDisplayName: 30,
        point: 80,
        pointSuffix: 30
      },
    }
  },
}
</script>