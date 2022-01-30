<template>
  <nav class="navbar navbar-expand-lg navbar-light shadow-sm">
    <div class="container-fluid">
      <a class="navbar-brand" href="#">TuringTech Phone App</a>

      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <form>
          <input
            class="form-control me-2"
            type="search"
            placeholder="Search"
            aria-label="Search"
            @input="onQueryChange"
            ref="search"
          />
        </form>
      </div>
      <span class="badge rounded-pill bg-primary">{{user.username}}</span>
    </div>
  </nav>
</template>

<script>
import ApiService from "../services/ApiService";
export default {
  data() {
    return {
      user: {}
    }
  },
  methods: {
    onQueryChange(e) {
      this.$store.commit("setSearchQuery", e);
    },
  },
  created() {
    let body = {
      username: "mehwishasif",
      password: "root1234",
    };
    ApiService.getAuthToken(body).then((resp) => {
      ApiService.getUser(resp.data.access_token).then(resp=>{
        this.user = resp.data
      })
    });
  },
};
</script>

<style>
</style>