<template>
  <v-app>
    <v-row align="center" justify="center">
      <v-col cols="12">
        <v-hover v-slot:default="{ hover }">
          <v-card :elevation="hover ? 12 : 2" class="mx-auto" max-width="350">
            <v-card-title>{{ item.name }}</v-card-title>

            <v-card-text class="text--primary">
              <div style="margin-bottom: 10px">
                <Strong>Father's Name:</Strong>

                <div v-if="!item.selling_price">{{ item.father_name }}</div>
              </div>
              <div style="margin-bottom: 10px">
                <Strong>Address:</Strong>
                <div>{{ item.address }}</div>
              </div>
              <div style="margin-bottom: 10px">
                <Strong>Nationality:</Strong>
                <div>{{ item.nationality }}</div>
              </div>
              <div style="margin-bottom: 10px">
                <Strong>Email</Strong>
                <div>{{ item.email }}</div>
              </div>
              <div style="margin-bottom: 10px">
                <Strong>Mobile Number:</Strong>
                <div>{{ item.mobile_number }}</div>
              </div>

              <div style="margin-bottom: 10px">
                <Strong>CNIC:</Strong>
                <div>{{ item.cnic }}</div>
              </div>
              <div style="margin-bottom: 10px">
                <Strong>Nature of Account:</Strong>
                <div>{{ item.nature_of_account }}</div>
              </div>
            </v-card-text>
          </v-card>
        </v-hover>
      </v-col>
    </v-row>
  </v-app>
</template>

<script>
import axios from "axios";

export default {
  data: () => ({
    item: {}
  }),
  async mounted() {
    this.accountdetails();
  },
  watch: {
    "$route.params.id"() {
      this.accountdetails();
    }
  },
  methods: {
    async accountdetails() {
      const id = this.$route.params.id;
      const response = await axios.get(`http://localhost:1337/accounts/${id}`);
      this.item = response.data;
    }
  }
};
</script>

<style></style>
