import {GraphQLClient} from "graphql-request";

export default function tokenChecker() {
    let gql;
    if (localStorage.authToken){
        gql = new GraphQLClient("/graphql", {headers: {Authorization: "Bearer " + localStorage.authToken}})
    } else {
        gql = new GraphQLClient("/graphql", {headers: {}});
    }
    return gql;
}