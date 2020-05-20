<template>
  <v-dialog v-model="showWindowItnl" :width="width" eager>
    <div style="background: white;">
      <div
        v-if="cameraAccessDisallowed"
        class="d-flex align-center justify-center"
        :style="{
          width: `${width}px`,
          height: `${height}px`
        }"
      >
        <div align="center">
          <div><v-icon style="font-size: 150px;">mdi-camera-off</v-icon></div>
          <b>カメラを利用できません</b>
        </div>
      </div>
      <video v-if="!cameraAccessDisallowed" ref="preview" :width="width" :height="height"></video>
      <div v-if="!cameraAccessDisallowed" style="padding: 15px">
        <v-select
          v-model="selectedCameraDeviceId"
          :items="cameraDevicesSelectItems"
          label="カメラ"
          prepend-icon="mdi-camera"
        ></v-select>
      </div>
    </div>
  </v-dialog>
</template>
<script>
import jsQR from "jsqr";

export default {
  props: {
    value: {
      type: String,
      default: '',
    },
    showWindow: {
      type: Boolean,
      default: false,
    }
  },
  data() {
    return {
      width: 500,
      height: 500,
      previewTag: null,
      canvasElem: null,
      canvasCtx: null,
      stream: null,
      cameraDevices: [],
      selectedCameraDeviceId: null,
      cameraAccessDisallowed: false,
      qrReadInterval: null,
      dataText: null,
      dataTextCount: 0,
      showWindowItnl: false,
    }
  },
  computed: {
    cameraDevicesSelectItems() {
      return this.cameraDevices.map(device => ({
        text: device.label,
        value: device.deviceId
      }));
    },
    currentCameraDeviceId() {
      return this.stream ? this.stream.getVideoTracks()[0].getSettings().deviceId : null;
    }
  },
  methods: {
    async init() {
      this.previewTag = this.$refs.preview;

      this.canvasElem = document.createElement('canvas');
      this.canvasElem.width = this.width;
      this.canvasElem.height = this.height;
      this.canvasCtx = this.canvasElem.getContext('2d');

      this.dataText = null;
      this.dataTextCount = 0;

      if (navigator.mediaDevices) {
        await this.getMediaDevices();
        if (this.cameraDevices.length > 0) {
          await this.setupPreviewStream();
          this.setupQRReadInterval();
        } else {
          this.cameraAccessDisallowed = true;
        }
      } else {
        this.cameraAccessDisallowed = true;
      }
    },
    tearDown() {
      this.tearDownQRReadInterval();
      this.tearDownPreviewStream();
      this.tearDownMediaDeviceStream();
    },

    async getMediaDevices() {
      this.cameraDevices =
        (await navigator.mediaDevices.enumerateDevices())
        .filter(device => device.kind == 'videoinput')
        .map(device => ({deviceId: device.deviceId, label: device.label}));
    },

    async requireMediaDeviceStream() {
      this.tearDownMediaDeviceStream();

      let videoConstraints = {
        width: this.width,
        height: this.height,
      };
      if (this.selectedCameraDeviceId) {
        videoConstraints.deviceId = this.selectedCameraDeviceId; 
      }
      let constraints = {
        audio: false,
        video: videoConstraints,
      };
      
      try {
        this.stream = await navigator.mediaDevices.getUserMedia(constraints);
      } catch (e) {
        //e.name
        this.cameraAccessDisallowed = true;
      }

      //初回用
      this.selectedCameraDeviceId = this.currentCameraDeviceId;
      return;
    },
    tearDownMediaDeviceStream() {
      if (this.stream) {
        this.stream.getVideoTracks().forEach(track => {
          track.stop();
        });
        this.stream = null;
      }
    },

    async setupPreviewStream() {
      const self = this;
      await this.requireMediaDeviceStream();
      // console.log(this.stream);
      this.previewTag.srcObject = this.stream;
      this.previewTag.addEventListener('loadeddata', function (event) {
        self.previewTag.play();
        // console.log('Play');
      });
    },
    tearDownPreviewStream() {
      this.previewTag.srcObject = null;
    },

    setupQRReadInterval() {
      const self = this;
      this.qrReadInterval = window.setInterval(function() {
        self.canvasCtx.drawImage(self.previewTag, 0, 0);
        const imdata = self.canvasCtx.getImageData(0, 0, self.width, self.height);
        const code = jsQR(imdata.data, self.width, self.height);

        if (!code) return;

        if (self.dataText) {
          if (self.dataText == code.data) {
            self.dataTextCount++;
          } else {
            self.dataTextCount = 0;
            self.dataText = null;
          }
        } else {
          self.dataText = code.data;
        }

        if (self.dataTextCount > 0) {
          self.$emit('input', self.dataText);
          self.showWindowItnl = false;
        }
      }, 300); //[ms]
    },
    tearDownQRReadInterval() {
      window.clearInterval(this.qrReadInterval);
    }
  },
  watch: {
    // 親 <-> 自分 -> V-DIALOG
    showWindow(newShowWindow) {
      if (newShowWindow) {
        this.init();
      } else {
        this.tearDown();
      }
      this.showWindowItnl = newShowWindow;
    },
    // V-DIALOG -> 自分 -> 親
    showWindowItnl(newShowWindowItnl) {
      this.$emit('modalVisiblityChange', newShowWindowItnl);      
    },
    selectedCameraDeviceId(newDeviceId) {
      if (newDeviceId != this.currentCameraDeviceId) {
        this.setupPreviewStream();
      }
    },
    
  }
}
</script>