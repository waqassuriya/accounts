<template>
  <v-app>
    <v-toolbar>
      <v-toolbar-title>CashBook</v-toolbar-title>

      <v-toolbar-items>
        <v-btn text @click="$router.push('/accounts')">Go To Accounts</v-btn>
        <v-btn text @click="$router.push('/journal')">Go To Journal</v-btn>
        <v-spacer></v-spacer>
      </v-toolbar-items>
    </v-toolbar>

    <v-app>
      <h2>CREATE CASH BOOK</h2>

      <template>
        <div>
          <v-row>
            <v-col>
              <!-- <v-text-field
                v-model="account_name"
                label="Account Name"
                placeholder="Name Of Account"
              ></v-text-field>-->
              <v-select
                :items="items"
                item-text="name"
                item-value="name"
                label="Account Name"
                v-model="nature_of_account"
                placeholder="Account Name"
              ></v-select>
            </v-col>
            <v-col>
              <v-text-field
                v-model="description"
                label="Description"
                placeholder="Cash Book Description  "
              ></v-text-field>
            </v-col>

            <v-col>
              <v-text-field v-model="amount" label="Amount" placeholder="25000"></v-text-field>
            </v-col>
            <v-col>
              <v-btn color="primary" text @click="save">Submit</v-btn>
            </v-col>
          </v-row>
          <v-alert v-if="hasErrors" dense outlined type="error">Please fill in all fields.</v-alert>
          <v-row no-gutters>
            <v-col>
              <div class="list">
                <h1>CASHBOOK</h1>

                <div>
                  <v-data-table
                    dense
                    :headers="headers"
                    :items="files"
                    item-key="name"
                    class="data"
                  >
                    <template v-slot:item.action="{ item }">
                      <v-icon small @click="deleteItem(item)">mdi-delete</v-icon>
                    </template>
                  </v-data-table>
                </div>
              </div>
            </v-col>
          </v-row>
          <!-- <td>
            <strong>Sum</strong>
          </td>
            <td class="text-xs-right">{{ totals.amount }}</td>
          </td>-->
          <span>TOTAL AMOUNT: {{totalAmount}}</span>
        </div>
      </template>
    </v-app>
  </v-app>
</template>

<script>
import axios from "axios";

export default {
  data: () => ({
    items: [],
    // { value: "ACCRUED_EXPENSES", text: "Accrued Expenses" },
    // { value: "CURRENT_LIABILITIES", text: "Current Liabilities" },
    // { value: "DEFERRED_LIABILITIES", text: "Deferred Liabilities" },
    // { value: "LONG_TERM_LIABILITIES", text: "Long Term Liabilities" },
    // { value: "LONG_TERM_LOAN", text: "Long Term Loan" },
    // { value: "BOOKING_RECIEPTS", text: "Booking Reciepts" },
    // { value: "OTHER_INCOME", text: "Other Income" },
    // { value: "ADMINISTRATION", text: "Administration" },
    // { value: "CONSTRUCTION_COST", text: "Construction Cost" },
    // { value: "FINANCIAL_CHARGES", text: "Financial Charges" },
    // { value: "MARKETING", text: "Marketing" },
    // { value: "ACCUMULATED_AMORTIZATION", text: "Accumulated Amortization" },
    // { value: "ACCUMULATED_DEPRECIATION", text: "Accumulated Depreciation" },
    // { value: "CURRENT_ASSETS", text: "Current Assets" },
    // { value: "FIXED_ASSETS", text: "Fixed Assets" },
    // { value: "INTANGIBLE_ASSETS", text: "Intangible Assets" },
    // { value: "LONG_TERM_LOANS_ADVANCES", text: "Long Term Loans & Advances" },
    // { value: "NEW_ASSET_EXAMPLE", text: "New Asset Example" },
    // { value: "EQUITY", text: "Equity" },
    // { value: "PARTNERS_CAPITAL", text: "Partners' Capital" },
    // { value: "PARTNERS_DRAWING", text: "Partners' Drawing" }

    first: "",
    files: [],
    account_name: "",
    description: "",
    amount: 0,
    nature_of_account: null,
    loading: false,
    hasErrors: false,
    headers: [
      { text: "Created", value: "created_at" },
      { text: "Name Of Account", value: "nature_of_account" },
      { text: "Description", value: "description" },
      { text: "Amount", value: "amount" },
      { text: "Actions", value: "action", sortable: false }
    ]
  }),
  methods: {
    async fetchAccounts() {
      const response = await axios.get("http://localhost:1337/accounts");
      this.items = response.data;
    },

    async deleteItem(item) {
      if (confirm("Are you sure you want to delete this item?")) {
        await axios.delete(`http://localhost:1337/cashbooks/${item.id}`);

        this.fetch();
      }
    },
    async save() {
      this.hasErrors = false;
      const formData = new FormData();

      formData.append(
        "data",
        JSON.stringify({
          nature_of_account: this.nature_of_account,
          description: this.description,
          amount: this.amount
        })
      );

      if (this.description === "") {
        this.hasErrors = true;
      } else if (this.amount === "") {
        this.hasErrors = true;
      } else if (this.nature_of_account === null) {
        this.hasErrors = true;
      } else {
        await axios.post("http://localhost:1337/cashbooks", formData);
        // await axios.post("http://localhost:1337/journals", formData);
        this.fetch();
        this.nature_of_account = null;
        this.description = "";
        this.amount = "";
      }
    },
    async fetch() {
      const response = await axios.get("http://localhost:1337/cashbooks", {
        params: { _sort: "id:DESC" }
      });
      this.files = response.data;
    }
  },

  async mounted() {
    this.fetch();
    this.fetchAccounts();
  },
  computed: {
    totalAmount: function() {
      var sum = 0;
      this.files.forEach(e => {
        sum += parseFloat(e.amount);
      });
      return sum;
    }
  }
};
</script>

<style></style>
