import Vue from "vue";
import App from "./App.vue";
import vuetify from "@/plugins/vuetify"; // path to vuetify export
import Vuelidate from "vuelidate";
import VueRouter from "vue-router";
import Accounts from "../src/Accounts.vue";
import CashBook from "../src/CashBook.vue";
import Journal from "../src/Journal.vue";
import Details from "../src/Details.vue";
import moment from "moment";
import VueHtmlToPaper from "vue-html-to-paper";

Vue.use(VueHtmlToPaper);

// or, using the defaults with no stylesheet

// Vue.use(VueHtmlToPaper);

Vue.filter("formatDate", function(value) {
  if (value) {
    return moment(String(value)).format("MM/DD/YYYY");
  }
});

Vue.use(Vuelidate);
Vue.use(VueRouter);

const routes = [
  { name: "accounts", path: "/accounts", component: Accounts },
  { name: "cashbook", path: "/", component: CashBook },
  { name: "journal", path: "/journal", component: Journal },
  { name: "accountdetails", path: "/accountdetails/:id", component: Details }
];
const router = new VueRouter({
  routes // short for `routes: routes`
});

Vue.config.productionTip = false;
new Vue({
  vuetify,
  router,
  render: h => h(App)
}).$mount("#app");
