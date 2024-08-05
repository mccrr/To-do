import { Bucket, Scope, Collection, connect, User } from 'couchbase'

export async function getCouchbaseConnection(){
    const DB_CONN_STRING = process.env.DB_CONN_STRING || "";
    const DB_ADMINISTRATOR_USERNAME = process.env.DB_ADMINISTRATOR_USERNAME || "";
    const DB_ADMINISTRATOR_PASSWORD = process.env.DB_ADMINISTRATOR_PASSWORD || "";
    console.log(DB_CONN_STRING + ' ' + DB_ADMINISTRATOR_USERNAME + ' ' + DB_ADMINISTRATOR_PASSWORD);

    console.log("Before connecting to cluster");
    const cluster = await connect(DB_CONN_STRING,{
        username: DB_ADMINISTRATOR_USERNAME,
        password: DB_ADMINISTRATOR_PASSWORD
    });
    console.log("connected to cluster");

    const TodoBucket: Bucket = cluster.bucket("TodoBucket");
    const UserScope: Scope = TodoBucket.scope("UserScope");
    const users: Collection = UserScope.collection("users");

    return {
        users,
        cluster
    };
}    