<template>
  <v-app>
    <v-toolbar>
      <v-toolbar-title>Accounts</v-toolbar-title>

      <v-toolbar-items>
        <v-btn text @click="$router.push('/')">Go To CashBook</v-btn>
        <v-btn text @click="$router.push('/journal')">Go To Journal</v-btn>
        <v-spacer></v-spacer>
      </v-toolbar-items>
    </v-toolbar>

    <!-- <v-col>
       <v-card max-width="800" class="mx-auto" style="margin-top:50px">
      <v-list max-width="350">
          <v-list-group
            v-for="item in items"
            :key="item.title"
            v-model="item.active"
            :prepend-icon="item.action"
            no-action
          >
            <template v-slot:activator>
              <v-list-item-content>
                <v-list-item-title v-text="item.title"></v-list-item-title>
              </v-list-item-content>
            </template>

            <v-list-item v-for="subItem in item.items" :key="subItem.title">
              <v-list-item-content>
                <v-list-item-title v-text="subItem.title"></v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-group>
        </v-list>
    </v-col>-->

    <v-form ref="form" @submit.prevent="save">
      <div class="heading">
        <h3>Create New Account</h3>
      </div>

      <v-alert v-if="hasErrors" dense outlined type="error">Please fill in all fields.</v-alert>

      <v-card-text>
        <v-text-field v-model="name" label="Name*" placeholder="Customer Name" required></v-text-field>

        <v-text-field v-model="father_name" label="Father Name" placeholder="Father Name" required></v-text-field>

        <v-text-field v-model="address" label="Address" placeholder="Address" required></v-text-field>
        <v-text-field v-model="email" label="Email" placeholder="Email" required></v-text-field>
        <v-text-field v-model="nationality" label="Nationality" placeholder="Nationality" required></v-text-field>
        <v-text-field v-model="cnic" label="Cnic" placeholder="Cnic" required></v-text-field>
        <v-text-field
          v-model="mobile_number"
          label="Mobile Number"
          placeholder="Mobile Number"
          required
        ></v-text-field>
        <v-select
          :items="items"
          item-text="text"
          item-value="value"
          label="Nature Of Account"
          v-model="nature_of_account"
        ></v-select>
      </v-card-text>
      <v-divider class="mt-12"></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <!-- <div v-if="name===''"> -->
        <v-btn color="primary" type="submit" text>Create New Account</v-btn>

        <!-- </div> -->
      </v-card-actions>
    </v-form>
    <div class="list">
      <h1>Accounts</h1>

      <div>
        <v-data-table dense :headers="headers" :items="account" item-key="name" class="data">
          <template v-slot:item.name="{ item }">
            <v-btn text color="primary" @click="showAccount(item.id)">
              {{
              item.name
              }}
            </v-btn>
          </template>
          <template v-slot:item.action="{ item }">
            <v-icon small @click="deleteItem(item)">mdi-delete</v-icon>
          </template>
          <template v-slot:item.view="{ item }">
            <v-icon small @click="showAccount(item.id)">mdi-contactless-payment</v-icon>
          </template>
        </v-data-table>
      </div>
    </div>
  </v-app>
</template>

<script>
import axios from "axios";

export default {
  data: () => ({
    items: [
      { value: "ACCRUED_EXPENSES", text: "Accrued Expenses" },
      { value: "CURRENT_LIABILITIES", text: "Current Liabilities" },
      { value: "DEFERRED_LIABILITIES", text: "Deferred Liabilities" },
      { value: "LONG_TERM_LIABILITIES", text: "Long Term Liabilities" },
      { value: "LONG_TERM_LOAN", text: "Long Term Loan" },
      { value: "BOOKING_RECIEPTS", text: "Booking Reciepts" },
      { value: "OTHER_INCOME", text: "Other Income" },
      { value: "ADMINISTRATION", text: "Administration" },
      { value: "CONSTRUCTION_COST", text: "Construction Cost" },
      { value: "FINANCIAL_CHARGES", text: "Financial Charges" },
      { value: "MARKETING", text: "Marketing" },
      { value: "ACCUMULATED_AMORTIZATION", text: "Accumulated Amortization" },
      { value: "ACCUMULATED_DEPRECIATION", text: "Accumulated Depreciation" },
      { value: "CURRENT_ASSETS", text: "Current Assets" },
      { value: "FIXED_ASSETS", text: "Fixed Assets" },
      { value: "INTANGIBLE_ASSETS", text: "Intangible Assets" },
      { value: "LONG_TERM_LOANS_ADVANCES", text: "Long Term Loans & Advances" },
      { value: "NEW_ASSET_EXAMPLE", text: "New Asset Example" },
      { value: "EQUITY", text: "Equity" },
      { value: "PARTNERS_CAPITAL", text: "Partners' Capital" },
      { value: "PARTNERS_DRAWING", text: "Partners' Drawing" }
    ],

    headers: [
      { text: "Created", value: "created_at" },
      {
        text: "Name",
        align: "left",
        sortable: true,
        value: "name"
      },
      { text: "Father Name", value: "father_name" },
      { text: "Mobile Number", value: "mobile_number" },
      { text: "Email", value: "email" },
      { text: "Nationality", value: "nationality" },
      { text: "Nature Of Account", value: "nature_of_account" },
      { text: "Actions", value: "action", sortable: false },
      { text: "View", value: "view", sortable: false }
    ],
    hasErrors: false,
    account: [],
    name: "",
    father_name: "",
    address: "",
    email: "",
    cnic: "",
    mobile_number: "",
    nationality: "",
    nature_of_account: null
  }),
  methods: {
    showAccount(id) {
      this.$router.push(`/accountdetails/${id}`);
    },
    async deleteItem(item) {
      if (confirm("Are you sure you want to delete this item?")) {
        await axios.delete(`http://localhost:1337/accounts/${item.id}`);

        this.fetch();
      }
    },

    async save() {
      this.hasErrors = false;
      const formData = new FormData();

      formData.append(
        "data",
        JSON.stringify({
          name: this.name,
          father_name: this.father_name,
          address: this.address,
          cnic: this.cnic,
          mobile_number: this.mobile_number,
          email: this.email,
          nationality: this.nationality,
          nature_of_account: this.nature_of_account
        })
      );
      if (this.name === "") {
        this.hasErrors = true;
      } else if (this.father_name === "") {
        this.hasErrors = true;
      } else if (this.email === "") {
        this.hasErrors = true;
      } else if (this.mobile_number === "") {
        this.hasErrors = true;
      } else if (this.nationality === "") {
        this.hasErrors = true;
      } else if (this.address === "") {
        this.hasErrors = true;
      } else if (this.cnic === "") {
        this.hasErrors = true;
      } else if (this.nature_of_account === null) {
        this.hasErrors = true;
      } else {
        await axios.post("http://localhost:1337/accounts", formData);
        this.fetch();
        this.name = "";
        this.father_name = "";
        this.address = "";
        this.cnic = "";
        this.mobile_number = "";
        this.email = "";
        this.nationality = "";
        this.nature_of_account = null;
      }
    },
    async fetch() {
      const response = await axios.get("http://localhost:1337/accounts", {
        params: { _sort: "id:DESC" }
      });
      this.account = response.data;
    }
  },

  async mounted() {
    this.fetch();
  }
};
</script>

<style></style>
