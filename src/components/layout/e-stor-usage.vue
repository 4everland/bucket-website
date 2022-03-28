<template>
  <div>
    <div>
      <v-icon color="#D1DCFC" size="16">mdi-cloud</v-icon>
      <span class="gray fz-14 ml-2">Storage</span>
    </div>
    <v-progress-linear
      rounded
      height="8"
      :value="usagePerc * 100"
      class="mt-3"
    ></v-progress-linear>
    <div class="mt-3 d-flex al-c">
      <span class="gray fz-14">IPFS</span>
      <div class="ml-auto">
        <b class="fz-18">{{ info.usedStorage || "0" }}</b>
        <span class="gray fz-14"> / {{ info.totalStorage }}MB used</span>
      </div>
    </div>

    <v-progress-linear
      color="success"
      rounded
      height="8"
      :value="arUsagePerc * 100"
      class="mt-5"
    ></v-progress-linear>
    <div class="mt-3 d-flex al-c">
      <span class="gray fz-14">AR</span>
      <div class="ml-auto">
        <b class="fz-18">{{ info.arUsed || "0" }}</b>
        <span class="gray fz-14"> / {{ info.arTotal }}MB used</span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  computed: {
    ...mapState({
      info: (s) => s.usageInfo,
      noticeMsg: (s) => s.noticeMsg,
      token: (s) => s.token(),
    }),
    usagePerc() {
      const { usedStorage, totalStorage } = this.info;
      if (!usedStorage) return 0;
      return usedStorage / totalStorage;
    },
    arUsagePerc() {
      const { arUsed, arTotal } = this.info;
      if (!arTotal) return 0;
      return arUsed / arTotal;
    },
  },
  watch: {
    noticeMsg({ name }) {
      if (name == "updateUsage") {
        this.getInfo();
      }
    },
  },
  created() {
    if (this.token) {
      this.getInfo();
    }
  },
  methods: {
    async getInfo() {
      try {
        const { data } = await this.$http.get("/user/resource/usage");
        const {
          arweaveUsedStorage = 0,
          arweaveSyncingStorage = 0,
          arweaveTotalStorage = 0,
        } = data;
        let arUsed =
          (arweaveUsedStorage * 1 + arweaveSyncingStorage * 1) / 1024;
        this.$setState({
          usageInfo: {
            totalStorage: parseInt(data.totalStorage / 1024),
            usedStorage: (data.usedStorage / 1024).toFixed(2),
            arTotal: parseInt(arweaveTotalStorage / 1024),
            arUsed: arUsed.toFixed(2),
            arSyncing: (arweaveSyncingStorage / 1024).toFixed(2),
            arSynced: (arweaveUsedStorage / 1024).toFixed(2),
          },
        });
      } catch (error) {
        //
      }
    },
  },
};
</script>