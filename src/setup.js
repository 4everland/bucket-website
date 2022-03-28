import Vue from "vue";
import "./css/style.scss";
import "./components";
import VueClipboards from "vue-clipboards";
import router from "./router";
import { CID } from "multiformats/cid";

Vue.use(VueClipboards);

Vue.prototype.$color1 = "#0F8DFF";

Vue.prototype.$onLoginData = (data) => {
  console.log(data);
  localStorage.clear();
  localStorage.authData = JSON.stringify(data);
  const token = data.accessToken;
  localStorage.token = token;
  localStorage.refreshAt = Date.now();
  let hash = "";
  if (localStorage.loginTo) {
    const storKey = "got_storage_" + token.substr(-5);
    if (localStorage[storKey]) hash = localStorage.loginTo;
    localStorage.loginTo = "";
  }
  location.href = "index.html" + hash;
};

Vue.prototype.$sleep = (msec = 300) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, msec);
  });
};

Vue.prototype.$navTo = (url) => {
  if (/^https?:/.test(url)) {
    window.open(url);
  } else if (/:/.test(url)) {
    location.href = url;
  } else {
    router.push(url);
  }
};

Vue.prototype.$openWindow = (url) => {
  if ("ontouchstart" in window) location.href = url;
  else
    window.open(
      url,
      "n1",
      "height=600,width=900,top=50,left=200,toolbar=no,menubar=no"
    );
};

Vue.prototype.$regMap = {
  email: /^.+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
  domain: /(\w+\.)+\w{2,10}/,
  eth: /^(0x)?[0-9a-fA-F]{40}$/,
};

Vue.prototype.$utils = {
  getNonce(len = 4, radix = 36) {
    let str = "";
    while (str.length < len) {
      str += Math.random().toString(radix).substr(2);
    }
    return str.substring(0, len);
  },
  getFileSize(byte) {
    const mb = Math.pow(1024, 2);
    let size;
    if (byte > mb) size = (byte / mb).toFixed(2) + " MB";
    else if (byte < 1024) return byte + " B";
    else size = (byte / 1024).toFixed(2) + " KB";
    return size;
  },
  getCidV1(cid) {
    if (!cid) return "";
    cid = cid.replace(/"/g, "");
    if (/^Qm/i.test(cid)) {
      return CID.parse(cid).toV1().toString();
    }
    return cid;
  },
  getCidLink(cid) {
    return `https://${this.getCidV1(cid)}.ipfs.dweb.link`;
  },
};
