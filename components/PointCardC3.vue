<template>
  <div
    :style="{
      height: `${originalHeight * (width/originalWidth)}px`
    }"
    v-ripple
  >
    <div
      class="card"
      :style="{
        backgroundColor: master.backgroundColor,
        color: master.textColor,
        width: originalWidth+'px',
        height: originalHeight+'px',
        transform: `translate(${(width-originalWidth)/2}px, ${originalHeight * (cardSizeRatio - 1) / 2}px) scale(${cardSizeRatio}, ${cardSizeRatio}) `,
        // border: 'solid 1px red'
        overflow: 'hidden',
      }"
    >
      <div
        :style="{
          height: '35%',
          backgroundColor: master.primaryColor,
          position: 'relative',
          padding: '15px',
          overflow: 'hidden',
        }"
      >
        <div 
          class="d-flex justify-space-between align-center"
          style="height: 100%"
        >
          <div style="transform-origin: center center; transform: scale(2,2);">
            <LogoImg
              :imgUrl="master.logoUrl"
              :imgType="master.logoType"
              :fillColor="master.backgroundColor"
              :width="size.logo"
            ></LogoImg>
          </div>
          <div align="right" :style="{color: master.backgroundColor}">
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
      </div>
      <div style="height: 65%; padding: 15px;" class="d-flex flex-column align-center justify-center">
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
  padding: 0px;
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