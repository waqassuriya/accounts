<template>
  <v-app>
    <v-toolbar>
      <v-toolbar-title>Journal</v-toolbar-title>

      <v-toolbar-items>
        <v-btn text @click="$router.push('/')">Go To CashBook</v-btn>
        <v-btn text @click="$router.push('/accounts')">Go To Accounts</v-btn>

        <v-spacer></v-spacer>
      </v-toolbar-items>
    </v-toolbar>

    <v-app>
      <h2>CREATE JOURNAL ENTRIES</h2>

      <template>
        <div>
          <v-form @submit.prevent="save">
            <v-row>
              <v-col>
                <v-select
                  :items="items"
                  item-text="name"
                  item-value="id"
                  label="Account Name"
                  v-model="account"
                  placeholder="Account Name"
                ></v-select>
              </v-col>
              <v-col>
                <v-text-field
                  v-model="description"
                  label="Description"
                  placeholder="Description  "
                ></v-text-field>
              </v-col>
              <v-col>
                <v-text-field
                  v-model="debit"
                  label="Debit"
                  placeholder="25000"
                ></v-text-field>
              </v-col>
              <v-col>
                <v-text-field
                  v-model="credit"
                  label="Credit"
                  placeholder="25000"
                ></v-text-field>
              </v-col>
              <v-col>
                <v-btn color="primary" type="submit" text>Submit</v-btn>
              </v-col>
            </v-row>
          </v-form>
          <v-alert v-if="hasErrors" dense outlined type="error"
            >Please fill in all fields.</v-alert
          >
          <v-row no-gutters>
            <v-col>
              <div class="list">
                <h1>General Journal</h1>

                <div>
                  <v-data-table
                    dense
                    :headers="headers"
                    :items="files"
                    item-key="name"
                    class="data"
                  >
                    <template v-slot:item.account="{ item }">
                      <v-btn
                        text
                        color="primary"
                        @click="showAccount(item.account.id)"
                        >{{ item.account ? item.account.name : "N/A" }}</v-btn
                      >
                    </template>
                    <template v-slot:item.action="{ item }">
                      <v-icon small @click="deleteItem(item)"
                        >mdi-delete</v-icon
                      >
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
          <v-col>
            <v-row>TOTAL DEBIT: {{ totalDebit }}</v-row>
            <v-row>TOTAL CREDIT: {{ totalCredit }}</v-row>
            <v-row>TOTAL BALANCE: {{ totalBalance }}</v-row>
          </v-col>
        </div>
      </template>
    </v-app>
  </v-app>
</template>

<script>
import axios from "axios";

export default {
  data: () => ({
    first: "",
    files: [],
    items: [],
    account: null,
    description: "",
    debit: 0,
    credit: 0,
    loading: false,
    hasErrors: false,
    headers: [
      { text: "Created", value: "created_at" },
      { text: "Name Of Account", value: "account" },
      { text: "Description", value: "description" },
      { text: "Debit", value: "debit" },
      { text: "Credit", value: "credit" },
      { text: "Actions", value: "action", sortable: false }
    ]
  }),
  methods: {
    showAccount(id) {
      this.$router.push(`/accountdetails/${id}`);
    },
    async fetchAccounts() {
      const response = await axios.get("http://localhost:1337/accounts");
      this.items = response.data;
    },

    async deleteItem(item) {
      if (confirm("Are you sure you want to delete this item?")) {
        await axios.delete(`http://localhost:1337/journals/${item.id}`);

        this.fetch();
      }
    },
    async save() {
      this.hasErrors = false;
      const formData = new FormData();

      formData.append(
        "data",
        JSON.stringify({
          account: this.account,
          description: this.description,
          debit: this.debit,
          credit: this.credit
        })
      );
      if (this.account === null) {
        this.hasErrors = true;
      } else if (this.description === "") {
        this.hasErrors = true;
      } else if (this.debit === "" && this.credit === "") {
        this.hasErrors = true;
      }
      // } else if (this.credit === "") {
      //   this.hasErrors = true;
      else {
        await axios.post("http://localhost:1337/journals", formData);
        this.fetch();
        this.account = null;
        this.description = "";
        this.debit = 0;
        this.credit = 0;
      }
    },
    async fetch() {
      const response = await axios.get("http://localhost:1337/journals", {
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
    totalDebit: function() {
      var debitTotal = 0;
      this.files.forEach(e => {
        debitTotal += parseFloat(e.debit);
      });
      return debitTotal;
    },
    totalCredit: function() {
      var creditTotal = 0;
      this.files.forEach(f => {
        creditTotal += parseFloat(f.credit);
      });
      return creditTotal;
    },
    totalBalance: function() {
      return this.totalCredit - this.totalDebit;
    }
  }
};
</script>

<style></style>
