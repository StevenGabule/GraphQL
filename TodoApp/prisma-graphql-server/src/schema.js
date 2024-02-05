const { gql } = require('apollo-server');
const { prisma } = require('./db');

const typeDefs = gql`
  type User {
    email: String!
    id: ID!
    name: String
    posts: [Post!]!
  }

  type Post {
    id: ID!
    title: String!
    content: String
    published: Boolean!
    author: User
  }

  type Category {
    id: ID!
    name: String!
    description: String!
  }

  type Customer {
    id: ID!
    customerName: String!
    contactName: String!
    address: String!
    city: String!
    postalCode: String!
    country: String!
    order: [Order!]!
  }

  type Employee {
    id: ID!
    lastName: String!
    firstName: String!
    birthDate: DateTime!
    photo: String!
    notes: String!
  }

  type Supplier {
    id: ID!
    name: String!
    contactName: String!
    contactName: String!
    address: String!
    city: String!
    postalCode: String!
    country: String!
    phone: String!
  }
  
  type Product {
    id: ID!
    name: String!
    price: Decimal!
    description: String!
    excerpt: String!
    category: Category
    supplier: Supplier
    unit: String!
  }

  type Shipper {
    id: ID!
    shipperName: String!
    phone: String!
  }

  type Order {
    id: ID!
    customer: [Customer!]!
    employee: [Employee!]!
    orderDate: DateTime!
    shipper: Shipper!
  }
  
  type OrderDetail {
    id: ID!
    order: Order
    product: Product
    quantity: Int
  }

  type Query {
    feed: [Post!]!
    post(id: ID!): Post

    categories: [Category!]!    
    customers: [Customer!]!    
    employees: [Employee!]!    
    suppliers: [Supplier!]!    
    products: [Product!]!    
    shippers: [Shipper!]!    
    orders: [Order!]!    
    orderDetails: [OrderDetail!]!    
  }

  type Mutation {
    createUser(data: UserCreateInput!): User!
    createDraft(authorEmail: String, published: Boolean, content: String, title: String!): Post!
    publish(id: ID!): Post
  }

  input UserCreateInput {
    email: String!
    name: String
    posts: [PostCreateWithoutAuthorInput!]
  }

  input PostCreateWithoutAuthorInput {
    content: String
    published: Boolean
    title: String!
  }
`;

const resolvers = {
  // defines the feed query which returns multiple posts as denoted by the
  // square brackets and the post query which accepts a single argument and
  // returns a single Post.
  Query: {
    feed: (parent, args) => {
      return prisma.post.findMany({
        where: { published: true },
      });
    },
    post: (parent, args) => {
      return prisma.post.findUnique({
        where: { id: Number(args.id) },
      });
    },
    categories: (parent,args) => {
      return prisma.category.findMany()
    },
    customers: (parent,args) => {
      return prisma.customer.findMany()
    },
    employees: (parent,args) => {
      return prisma.employee.findMany()
    },
    suppliers: (parent,args) => {
      return prisma.supplier.findMany()
    },
    products: (parent,args) => {
      return prisma.product.findMany()
    },
    shippers: (parent,args) => {
      return prisma.shipper.findMany()
    },
    orders: (parent,args) => {
      return prisma.shipper.findMany()
    },
  },
  // defines the createDraft mutation for creating a draft Post and the publish
  // mutation which accepts an id and returns a Post.defines the createDraft
  // mutation for creating a draft Post and the publish mutation
  // which accepts an id and returns a Post.
  Mutation: {
    createDraft: (parent, args) => {
     return prisma.post.create({
        data: {
          title: args.title,
          content: args.content,
          published: false,
          author: args.authorEmail && {
            connect: { email: args.authorEmail },
          },
        },
      })
    },
    publish: (parent, args) => {
      return prisma.post.update({
        where: { id: Number(args.id) },
        data: {
          published: true,
        },
      })
    },
    createUser: (parent, args) => {
      return prisma.user.create({
        data: {
          email: args.data.email,
          name: args.data.name,
          posts: {
            create: args.data.posts,
          },
        },
      })
    },
  },
  User: {
    posts: (parent, args) => {
      return prisma.user.findUnique({ where: { id: parent.id } }).posts()
    },
  },
  Post: {
    author: (parent, args) => {
      return prisma.post.findUnique({where: { id: parent.id }}).author()
    },
  },
};

module.exports = {
  resolvers,
  typeDefs,
};
