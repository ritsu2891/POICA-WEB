<template>
  <div id="card">
    <div id="title">{{title}}</div>
    <div align="right"><span id="point">{{point}}</span><span id="ptlabel">pt</span></div>
  </div>
</template>
<style scoped>
#card {
  /* border: 1px solid black; */
  /* border-radius: 10px; */
background: #f1f1f1;
  padding: 25px;
}
#title {
  font-size: 20pt;
  text-align: left;
}
#point {
  font-size: 60pt;
  font-weight: 800;
  text-align: right;
}
#ptlabel {
  font-size: 20pt;
  margin-left: 0.25em;
}
</style>
<script>
export default {
  props: {
    title: String,
    point: Number,
  },
}
</script>