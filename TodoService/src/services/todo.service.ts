import { DocumentNotFoundError } from "couchbase";
import { Todo, User } from "../@types";
import { getCouchbaseConnection } from "../db";
import APIError from "../errors/APIError";

const createTodo = async (userId: string, todo: Todo) => {
    const ONE_DAY_IN_MS = 8.64e7;
    const { users } = await getCouchbaseConnection();
    const result = await users.get(userId)
    console.log('(service) result: ', result);
    const user = result.content;
    console.log('(service) user: ', user);
    todo.createdAt = new Date();
    todo.updatedAt = new Date();
    todo.expireDate = new Date(Date.now() + 3 * ONE_DAY_IN_MS);
    user.todos.push(todo);
    await users.upsert(userId, user);
    const updatedUser = (await users.get(userId)).content;
    return updatedUser.todos;
}

const getAllTodos = async (userId: string) => {
    const { users } = await getCouchbaseConnection();
    const result = await users.get(userId);
    const user = result.content;
    return user.todos;
}

const getDeletedTodos = async (userId: string) => {
    const { deletedUsers } = await getCouchbaseConnection();
    const result = await deletedUsers.get(userId);
    const user = result.content;
    return user.todos;
}

const getById = async (userId: string, todoId: number) => {
    const { users } = await getCouchbaseConnection();
    const result = await users.get(userId);
    console.log("Result: ", result);
    const user = result.content;
    console.log("User: ", user);
    let wantedTodo = null;
    let counter = 0;
    for (let todo of user.todos) {
        counter++;
        console.log(counter, 'todo.id: ', todo.id, todo.id.type, ' todoId: ', todoId, todoId);
        if (todo.id === todoId) {
            wantedTodo = todo;
        }
    }
    console.log("WantedTodo: ", wantedTodo);
    return wantedTodo;
}

const deleteById = async (userId: string, todoId: number) => {

    const wantedTodo = await getById(userId, todoId);

    //Delete todo from users collection
    const { users, deletedUsers } = await getCouchbaseConnection();
    const result = await users.get(userId);
    const user = result.content;
    user.todos = user.todos.filter((todo:Todo)=>todo.id !== todoId);
    

    //add todo to the deleted collection
    console.log("(service.delete) wantedTodo: ", wantedTodo);
    var deletedUser;
    try{
    const resultDeleted = await deletedUsers.get(userId);
    deletedUser = resultDeleted.content;
    }catch(err){
        if(err instanceof DocumentNotFoundError){
            deletedUser = {
                ...user,
                todos: []
            }
        }
    }

    
    console.log("deletedUser: ", deletedUser);

    deletedUser.todos.push(wantedTodo);

    await users.upsert(userId, user);
    await deletedUsers.upsert(userId,deletedUser);
    return null;

}


const TodoService = {
    getAllTodos,
    getById,
    getDeletedTodos,
    createTodo,
    deleteById
};
export default TodoService;