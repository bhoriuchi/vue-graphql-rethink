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
        <button class="btn btn-primary" @click="graph">Test</button>
      </p>
      <p>
        <code>{{ serverData | json }}</code>
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
        schema: 'users',
        query: '{ users { id } }'
      }
    },
    methods: {
      graph () {
        this.graphql(this.$socket, this.schema, this.query)
      }
    }
  }
</script>
