<template>
    <div class="container">
      <a v-link="{path: '/'}">HelloWorld</a>
      <div>Enter GraphQL</div>
      <textarea id="gql" rows="20" cols="50" v-model="query" class="form-control"></textarea>
      <p>
        <button class="btn btn-primary" @click="graph">Test</button>
      </p>
    </div>
</template>
<style>
    body {
        background-color: #fff;
    }
    #gql {
      font-family: monospace;
      font-size: 9pt;
    }

</style>
<script>
  import { graphql } from '../vuex/actions'
  export default {
    vuex: {
      actions: { graphql }
    },
    data () {
      return {
        query: ''
      }
    },
    methods: {
      graph () {
        this.graphql(this.$socket, this.query)
      }
    }
  }
</script>
