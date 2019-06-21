const books = [
    { id: 0, title: 'The Hobbit', authorID: 0 },
    { id: 1, title: 'Harry Potter and Prisoner of Azkaban', authorID: 1 },
    { id: 2, title: 'Harry Potter and the Sorcerers Stone', authorID: 1 },
    { id: 3, title: 'Go Dog Go!', authorID: 2 }
]
const authors = [
    { name: 'JRR Tolkien', id: 0 },
    { name: 'JK Rowling', id: 1 },
    { name: 'PD Eastman', id: 2 }
]

const express = require('express')
const { ApolloServer, gql } = require('apollo-server-express')
const app = express()

const typeDefs = gql`
    type Book {
        title: String
        author: String
    }

    type Author {
        name: String
        books: [Book]
    }

    type Query {
        getBooks: [Book]
        getAuthors: [Author]
        getBook(id: Int!): Book
        getAuthor(id: Int!): Author
    }

    type Mutation {
        addAuthor(name: String!, id: Int!): Author
        addBook(title: String!, authorID: Int!, id: Int!): Book
    }
`

const resolvers = {
    Query: {
        getBooks: () => books,
        getAuthors: () => authors,
        getBook: (_, { id }) => {
            return books.filter((book) => book.id === id)[0]
        },
        getAuthor: (_, { id }) => {
            return authors.filter((author) => author.id === id)[0]
        }
    },
    Mutation: {
        addAuthor: (_, { name, id }) => {
            authors.push({ name, id })
            return authors[authors.length - 1]
    },
    addBook: (_, {title, authorID, id}) => {
      books.push({title, authorID, id})
      return books[books.length - 1]
    }
    },
    Author: {
        books: (parent) => {
            console.log(parent)
            return books.filter((book) => {
                if (book.authorID === parent.id) {
                    return book.title
                }
            })
        }
    },
    Book: {
        author: (parent) => {
            // return authors.filter((author) => {
            //   if(author.id === parent.authorID){
            //     return author.name
            //   }
            // })[0].name
            return authors.filter((author) => author.id === parent.authorID)[0].name
        }
    }
}

const server = new ApolloServer({ typeDefs, resolvers })

server.applyMiddleware({ app, path: '/graphql' })
const PORT = 3333
app.listen(PORT, () => console.log(`magic is happening on ${PORT}/graphql 💋`))