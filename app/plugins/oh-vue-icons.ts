import { OhVueIcon, addIcons } from "oh-vue-icons";
import { FaEdit, FaSave, FaArrowLeft, FaStepBackward, FaStepForward, FaPlay, FaPause, FaVolumeUp, FaPlus, FaTimes, FaBackward, FaForward } from "oh-vue-icons/icons";

addIcons(FaEdit, FaSave, FaArrowLeft, FaStepBackward, FaStepForward, FaPlay, FaPause, FaVolumeUp, FaPlus, FaTimes, FaBackward, FaForward);

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component("v-icon", OhVueIcon);
});
