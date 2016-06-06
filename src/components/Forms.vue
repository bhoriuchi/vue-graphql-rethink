<template>
    <div class="container">
      <a v-link="{path: '/'}">HelloWorld</a>

      <div>Enter GraphQL</div>
      <p>
        <input type="text" class="mono form-control" v-model="schema" placeholder="schema name">
      </p>
      <p>
        <textarea rows="20" cols="50" v-model="query" class="mono form-control" placeholder="GraphQL Query"></textarea>
      </p>
      <p>
        Test Queries:
        <a href="#" @click.prevent="createUserMutation">Create User</a> |
        <a href="#" @click.prevent="getAllUsersQuery">List Users</a> |
        <a href="#" @click.prevent="deleteUserMutation">Delete User</a> |
        <a href="#" @click.prevent="purgeTableMutation">Purge Table</a> |
        <a href="#" @click.prevent="branchUserMutation">Branch</a> |
        <a href="#" @click.prevent="forkUserMutation">Fork</a> |
        <a href="#" @click.prevent="publishUserMutation">Publish</a>
      </p>
      <p>
        <button class="btn btn-primary" @click="graph">Test</button>
      </p>
      <p>
        <pre>{{ serverData | json }}</pre>
      </p>
    </div>
</template>
<style>
    body {
        background-color: #fff;
    }
    .mono {
      font-family: monospace;
      font-size: 9pt;
    }

</style>
<script>
  import { graphql } from '../vuex/actions'
  export default {
    vuex: {
      getters: {
        serverData: state => state.serverData
      },
      actions: { graphql }
    },
    data () {
      return {
        schema: 'Users',
        query: ''
      }
    },
    methods: {
      purgeTableMutation () {
        this.schema = 'Users'
        this.query = `mutation Mutation {
  purge
}`
      },
      getAllUsersQuery () {
        this.schema = 'Users'
        this.query = `{
  users {
    _metadata {
      recordId,
      version,
      validFrom,
      validTo,
      changeLog {
        date,
        type,
        user,
        message
      }
    },
    id,
    firstName,
    lastName,
    email
  }
}`
      },
      createUserMutation () {
        this.schema = 'Users'
        this.query = `mutation Mutation {
  create(
    firstName: "John",
    lastName: "Doe",
    email: "j@does.com",
    changeLog: {
      user: "jdoe",
      message: "Created Record"
    }
  )
  {
    _metadata {
      recordId,
      version,
      validFrom,
      validTo,
      changeLog {
        date,
        type,
        user,
        message
      }
    },
    id,
    firstName,
    lastName,
    email
  }
}`
      },
      deleteUserMutation () {
        this.schema = 'Users'
        this.query = `mutation Mutation {
  delete(id: "1234")
}`
      },
      branchUserMutation () {
        this.schema = 'Users'
        this.query = `mutation Mutation {
  branch(
    id: ""
  )
  {
    _metadata {
      recordId,
      version,
      validFrom,
      validTo,
      changeLog {
        date,
        type,
        user,
        message
      }
    },
    id,
    firstName,
    lastName,
    email
  }
}`
      },
      forkUserMutation () {
        this.schema = 'Users'
        this.query = `mutation Mutation {
  fork(
    id: ""
  )
  {
    _metadata {
      recordId,
      version,
      validFrom,
      validTo,
      changeLog {
        date,
        type,
        user,
        message
      }
    },
    id,
    firstName,
    lastName,
    email
  }
}`
      },
      publishUserMutation () {
        this.schema = 'Users'
        this.query = `mutation Mutation {
  publish(
    id: "",
    version: "0.1.0"
  )
  {
    _metadata {
      recordId,
      version,
      validFrom,
      validTo,
      changeLog {
        date,
        type,
        user,
        message
      }
    },
    id,
    firstName,
    lastName,
    email
  }
}`
      },
      graph () {
        this.graphql(this.$socket, this.schema, this.query)
      }
    }
  }
</script>
