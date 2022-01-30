<template>
  <div class="container-fluid">
    <div class="card border-0 shadow-sm p-1 px-2">
      <div
        class="d-flex justify-content-between align-items-baseline flex-wrap"
      >
        <div class="d-flex align-items-baseline">
          <h3 class="card-title me-2">
            {{ $route.meta.name }}
          </h3>
          <h6>
            <span class="text-black-50"
              >( Showing {{ calls && calls.length }} /
              {{ pagination.count }} )</span
            >
          </h6>
        </div>
        <div>
          <paginate
            class="mb-0"
            :page-count="totalPages"
            :page-range="3"
            :margin-pages="2"
            :click-handler="clickCallback"
            :prev-text="'Prev'"
            :next-text="'Next'"
            :container-class="'pagination'"
            :page-class="'page-item'"
            :page-link-class="'page-link'"
            :prev-class="'page-link'"
            :next-class="'page-link'"
          >
          </paginate>
        </div>
      </div>
      <hr class="my-2" />
      <div>
        <div
          class="btn-group flex-wrap"
          role="group"
          aria-label="Basic example"
        >
          <button
            type="button"
            class="btn btn-outline-primary"
            @click="filterKey = 'All'"
          >
            All
          </button>
          <button
            type="button"
            class="btn btn-outline-primary"
            @click="filterKey = 'Archived'"
          >
            Archived
          </button>
          <button
            type="button"
            class="btn btn-outline-primary"
            @click="filterKey = 'Missed'"
          >
            Missed
          </button>
          <button
            type="button"
            class="btn btn-outline-primary"
            @click="filterKey = 'Answered'"
          >
            Answered
          </button>
          <button
            type="button"
            class="btn btn-outline-primary"
            @click="filterKey = 'Voicemail'"
          >
            Voicemail
          </button>
        </div>
      </div>
    </div>

    <div>
      <ag-grid-vue
        style="width: 100%; height: 78vh"
        class="ag-theme-alpine"
        :columnDefs="columnDefs"
        :gridOptions="gridOptions"
        :enableCellTextSelection="true"
        :quickFilterText="$store.state.searchQuery"
        :isExternalFilterPresent="isExternalFilterPresent"
        :doesExternalFilterPass="doesExternalFilterPass"
        :rowData="calls"
      ></ag-grid-vue>
    </div>

    <modal v-show="editCall.value" @close="editCall.value = false">
      <template v-slot:header>
        <div>
          <h5 class="text-black-50">{{ editCall.title }}</h5>
        </div>
      </template>

      <template v-slot:body>
        <div class="card">
          <div class="card-body">
            <div class="d-flex justify-content-between">
              <div>
                <div class="d-flex">
                  <h6 class="me-2"><strong>Date/Time: </strong></h6>
                  <h6>{{ dateTimeValueGetter(editCall.call.created_at) }}</h6>
                </div>
                <div class="d-flex">
                  <h6 class="me-2"><strong>From: </strong></h6>
                  <h6>{{ editCall.call.from }}</h6>
                </div>
                <div class="d-flex">
                  <h6 class="me-2"><strong>Duration: </strong></h6>
                  <h6>{{ editCall.call.duration }}</h6>
                </div>
                <div class="d-flex">
                  <h6 class="me-2"><strong>Via: </strong></h6>
                  <h6>{{ editCall.call.via }}</h6>
                </div>
              </div>

              <div>
                <div class="d-flex">
                  <h6 class="me-2"><strong>Direction: </strong></h6>
                  <h6>{{ editCall.call.direction }}</h6>
                </div>
                <div class="d-flex">
                  <h6 class="me-2"><strong>To: </strong></h6>
                  <h6>{{ editCall.call.to }}</h6>
                </div>
                <div class="d-flex">
                  <h6 class="me-2"><strong>Type: </strong></h6>
                  <h6>{{ editCall.call.call_type }}</h6>
                </div>
                <div class="d-flex">
                  <h6 class="me-2"><strong>Archived: </strong></h6>
                  <input
                    class="form-check-input"
                    type="checkbox"
                    :value="editCall.call.is_archived"
                    :checked="editCall.call.is_archived"
                    @change="updateCall(editCall.call)"
                    id="flexCheckDefault"
                  />
                </div>
              </div>
            </div>

            <div>
              <h6><strong>Notes</strong></h6>
              <div v-if="editCall == true && editCall.call.notes.length > 0">
                <h6 v-for="note in editCall.call.notes" :key="note.id">
                  {{ note.content }}
                </h6>
              </div>
              <div v-else>
                <h6>There are 0 notes to display.</h6>
              </div>
            </div>
          </div>
        </div>
      </template>

      <template v-slot:footer>
        <div class="d-flex justify-content-end">
          <button
            type="button"
            class="btn btn-outline-primary"
            @click="editCall.value = false"
          >
            Close
          </button>
        </div>
      </template>
    </modal>

    <modal v-show="editNote.value" @close="editNote.value = false">
      <template v-slot:header>
        <div>
          <h5 class="text-black-50">{{ editNote.title }}</h5>
        </div>
      </template>

      <template v-slot:body>
        <div class="card border-0">
          <div class="card-body">
            <div>
              <div>
                <h6><strong>Notes</strong></h6>
              </div>
              <h6 v-for="note in editNote.call.notes" :key="note.id">
                {{ note.content }}
              </h6>
              <div>
                <form>
                  <div class="form-floating mb-3">
                    <textarea
                      class="form-control"
                      placeholder="Leave a comment here"
                      id="noteContent"
                    ></textarea>
                    <label for="floatingInput">Notes</label>
                  </div>
                  <div class="d-flex justify-content-end">
                    <button
                      type="button"
                      @click="addNotes(editNote.call)"
                      class="btn btn-primary btn-sm"
                    >
                      Add
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </template>

      <template v-slot:footer>
        <div class="d-flex justify-content-end">
          <button
            type="button"
            class="btn btn-outline-primary"
            @click="editNote.value = false"
          >
            Close
          </button>
        </div>
      </template>
    </modal>

    <!-- <alert  /> -->
  </div>
</template>

<script>
import ApiService from "../../services/ApiService";
import { AgGridVue } from "ag-grid-vue";
import Paginate from "vuejs-paginate";
import moment from "moment";
import axios from "axios";
export default {
  components: {
    AgGridVue,
    Paginate,
  },
  data() {
    return {
      columnDefs: [],
      gridOptions: null,
      access_token: null,
      pagination: {
        page: 1,
        limit: 25,
        offset: 0,
        next: null,
        previous: null,
        count: 0,
      },
      calls: [],
      editCall: {
        value: false,
        title: "",
        call: {},
      },
      editNote: {
        value: false,
        title: "",
        call: {},
      },
      noteText: "",
      isModalVisible: false,
      filterKey: "All",
      filterArray: ["Archived", "Missed", "Answered", "Voicemail"],
    };
  },
  methods: {
    createColumnDefs() {
      this.columnDefs = [
        {
          headerName: "Date",
          field: "created_at",
          valueGetter: this.dateCreatedValueGetter,
          resizable: true,
          sortable: true,
          comparator: this.dateComparator,
          width: 120,
        },
        {
          headerName: "Time",
          field: "created_at",
          valueGetter: this.timeCreatedValueGetter,
          resizable: true,
          width: 100,
        },

        {
          headerName: "Direction",
          cellRenderer: this.getCallTypeChip,
          resizable: true,
          field: "direction",
          width: 135,
        },
        {
          headerName: "From",
          field: "from",
          resizable: true,
          width: 150,
        },
        {
          headerName: "To",
          field: "to",
          resizable: true,
          width: 150,
        },
        {
          headerName: "Duration",
          field: "duration",
          valueGetter: this.durationValueGetter,
          resizable: true,
          width: 250,
        },
        {
          headerName: "Archived",
          field: "is_archived",
          width: 100,
          valueGetter: this.archiveValueGetter,
        },
        {
          headerName: "Call Type",
          field: "call_type",
          cellRenderer: this.callTypeCellRenderer,
          resizable: true,
          width: 145,
        },
        {
          headerName: "Via",
          field: "via",
          cellRenderer: this.shippingAddressCellRenderer,
          resizable: true,
          width: 140,
        },

        {
          headerName: "Notes",
          field: "notes",
          cellRenderer: this.notesCellRenderer,
          onCellClicked: this.notesCellClicked,
          resizable: true,
          width: 100,
        },
        {
          headerName: "",
          field: "id",
          cellRenderer: this.callIDCellRenderer,
          onCellClicked: this.detailCellClicked,
          width: 120,
        },
      ];
    },

    archiveValueGetter(params) {
      return params.data.is_archived ? "YES" : "NO";
    },

    getCallTypeChip(params) {
      switch (params.data.call_type) {
        case "missed":
          return `<span class="badge rounded-pill bg-danger" style="display:flex; align-items:center;">
                    <i class='material-icons' style="font-size: 20px; margin-right:4px;">phone_missed</i>
                      ${params.data.direction}
                  </span>`;
        case "answered":
          return `<span class="badge rounded-pill bg-success" style="display:flex; align-items:center;">
                    <i class='material-icons' style="font-size: 20px; margin-right:4px;">phone</i>
                      ${params.data.direction}
                  </span>`;
        case "voicemail":
          return `<span class="badge rounded-pill bg-secondary" style="display:flex; align-items:center;">
                    <i class='material-icons' style="font-size: 20px; margin-right:4px;">voicemail</i>
                      ${params.data.direction} 
                  </span>`;
        default:
          return "";
      }
    },

    callTypeCellRenderer(params) {
      switch (params.data.call_type) {
        case "missed":
          return `<span class="badge rounded-pill bg-danger" style="display:flex; align-items:center;">
                    <i class='material-icons' style="font-size: 20px; margin-right:4px;">phone_missed</i>
                      ${params.data.call_type}
                  </span>`;
        case "answered":
          return `<span class="badge rounded-pill bg-success" style="display:flex; align-items:center;">
                    <i class='material-icons' style="font-size: 20px; margin-right:4px;">phone</i>
                      ${params.data.call_type}
                  </span>`;
        case "voicemail":
          return `<span class="badge rounded-pill bg-secondary" style="display:flex; align-items:center;">
                    <i class='material-icons' style="font-size: 20px; margin-right:4px;">voicemail</i>
                      ${params.data.call_type} 
                  </span>`;
        default:
          return "";
      }
    },

    dateCreatedValueGetter(params) {
      return moment(params.data.created_at).format("DD/MM/YYYY");
    },

    timeCreatedValueGetter(params) {
      return moment(params.data.created_at).format("h:mm A");
    },

    dateTimeValueGetter(datetime) {
      return moment(datetime).format("DD/MM/YYYY h:mm A");
    },

    durationValueGetter(params) {
      return moment
        .unix(params.data.duration)
        .utc()
        .format("H [hours,] m [minutes,] s [seconds]");
    },
    dateComparator(date1, date2) {
      const date1Number = this.monthToComparableNumber(date1);
      const date2Number = this.monthToComparableNumber(date2);
      if (date1Number === null && date2Number === null) {
        return 0;
      }
      if (date1Number === null) {
        return -1;
      }
      if (date2Number === null) {
        return 1;
      }
      return date1Number - date2Number;
    },
    monthToComparableNumber(date) {
      if (date === undefined || date === null || date.length !== 10) {
        return null;
      }
      const yearNumber = date.substring(6, 10);
      const dayNumber = date.substring(3, 5);
      const monthNumber = date.substring(0, 2);
      const result = yearNumber * 10000 + monthNumber * 100 + dayNumber;
      return result;
    },

    detailCellClicked(params) {
      this.editCall = {
        value: true,
        title: `Call ID: ${params.data.id}`,
        call: Object.assign({}, params.data),
      };
    },
    callIDCellRenderer() {
      const link = document.createElement("a");
      link.innerText = "Veiw Detail";
      const div = document.createElement("div");
      div.style.display = "flex";
      div.style.alignItems = "center";

      div.appendChild(link);
      return div;
    },

    notesCellClicked(params) {
      this.editNote = {
        value: true,
        title: `Call ID: ${params.data.id} Notes`,
        call: Object.assign({}, params.data),
      };
    },

    notesCellRenderer(params) {
      if (params.data.notes.length > 0) {
        return `<i class='material-icons' style='display:flex; justify-content: space-evenly; margin-top: 8px; color: #0d6efd;'>assignment</i>`;
      }
    },

    clickCallback(pageNum) {
      let params = {
        offset: this.pagination.limit * pageNum - this.pagination.limit,
        limit: this.pagination.limit,
      };
      this.getCalls(params, this.access_token);
    },

    getCalls(params, access_token) {
      ApiService.getCalls(params, access_token).then((resp) => {
        this.pagination.count = resp.data.totalCount;
        this.pagination.next = resp.data.hasNextPage;
        this.calls = resp.data.nodes;
      });
    },

    updateCall(call) {
      let body = {
        username: "mehwishasif",
        password: "root1234",
      };
      ApiService.getAuthToken(body).then((resp) => {
        axios
          .post(
            `https://frontend-test-api.aircall.io/calls/${call.id}/archive`,
            call,
            { headers: { Authorization: `Bearer ${resp.data.access_token} ` } }
          )
          .then((resp) => {
            console.log(resp)
            this.callNote.value = false;
          });
      });
    },
    addNotes(call) {
      let body = {
        username: "mehwishasif",
        password: "root1234",
      };
      ApiService.getAuthToken(body).then((resp) => {
        let body = {
          content: document.getElementById("noteContent").value,
        };

        axios
          .post(
            `https://frontend-test-api.aircall.io/calls/${call.id}/note`,
            body,
            { headers: { Authorization: `Bearer ${resp.data.access_token} ` } }
          )
          .then((resp) => {
            console.log(resp);
            document.getElementById("noteContent").value = "";

            call.notes.shift(resp.data.node);
            this.editNote.value = false;
          });
      });
    },

    isExternalFilterPresent() {
      return this.filterKey != "All";
    },
    doesExternalFilterPass(params) {
      switch (this.filterKey) {
        case "Archived":
          return params.data.is_archived == true;
        case "Missed":
          return params.data.call_type == "missed";
        case "Answered":
          return params.data.call_type == "answered";
        case "Voicemail":
          return params.data.call_type == "voicemail";
        default:
          return true;
      }
    },

    extrenalFilterChange() {
      this.gridOptions.api.onFilterChanged();
    },
  },
  computed: {
    totalPages() {
      return Math.ceil(this.pagination.count / this.pagination.limit);
    },
  },
  mounted() {
    this.gridApi = this.gridOptions.api;
  },
  created() {
    this.pagination.page = Number(this.$route.query.page) || 1;
    this.pagination.limit = Number(this.$route.query.limit) || 25;
    this.gridOptions = {};
    this.createColumnDefs();

    let body = {
      username: "mehwishasif",
      password: "root1234",
    };
    ApiService.getAuthToken(body).then((resp) => {
      let params = {
        offset: this.pagination.offset,
        limit: this.pagination.limit,
      };
      this.access_token = resp.data.access_token;
      this.getCalls(params, resp.data.access_token);
    });
  },
};
</script>

<style lang="scss">
.d-flex {
  display: flex;
}
</style>