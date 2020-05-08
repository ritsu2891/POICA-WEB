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
      <v-row class="align-stretch" style="height: 100%; margin: 0;" >
        <v-col
          :cols="4"
          :style="{ backgroundColor: master.primaryColor, padding: 0 }"
          class="d-flex align-center"
        >
          <div :style="{
            transform: `scale(2,2)`
          }">
            <LogoImg
              :imgUrl="master.logoUrl"
              :imgType="master.logoType"
              :fillColor="master.backgroundColor"
              :width="size.logo"
            ></LogoImg>
          </div>
        </v-col>
        <v-col :cols="8">
          <div class="d-flex flex-column" style="height: 100%">
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
            <div class="mt-auto">
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
        </v-col>
      </v-row>
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