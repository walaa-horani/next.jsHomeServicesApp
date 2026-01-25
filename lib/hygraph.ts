import request, { gql, GraphQLClient } from "graphql-request";
const HYGRAPH_TOKEN = process.env.HYGRAPH_TOKEN;

const HYGRAPH_ENDPOINT = process.env.NEXT_PUBLIC_HYGRAPH_ENDPOINT || "";
export const hygraphClient = new GraphQLClient(HYGRAPH_ENDPOINT, {
  headers: {
    Authorization: HYGRAPH_TOKEN ? `Bearer ${HYGRAPH_TOKEN}` : "",
  },
});

console.log("Hygraph Token Present:", !!HYGRAPH_TOKEN);






export const GET_CATEGORIES = gql`
 query myCategories {
  categories {
    id
    image {
      url
    }
    bgcolor {
      hex
    }
    name
    slug
  }
}
`;

export const GET_BUSINESSES = gql`
 query bussinessList{
  bussinesses {
    about
    address
    contact
    category {
      name
      slug
    }
    id
    image {
      url
    }
    name
  }
}
`;


export const GET_BUSINESS_BY_ID = gql`

query Business($id: ID!) {
  bussiness(where: {id: $id}) {
    about
    address
    category {
      name
      slug
    }
    contact
    image {
      url
    }
    name
    email
  }
}

`

export const GET_BUSINESSES_BY_CATEGORY = gql`
query GET_BUSINESSES_BY_CATEGORY($slug: String!) {
bussinesses(where: {category: {slug: $slug}}) {
    category {
      slug
      name
    }
    image {
      url
    }
    id
    name
    address
  }
}
`
export const GET_BOOKINGS_BY_BUSINESS = gql`
query GetBookingsByBusiness($businessId: ID!) {
  bookingses(where: {bussiness: { id: $businessId }}) {
    date
    time
  }
}
`

export const CREATE_BOOKING = gql`
mutation CreateBooking ($date: DateTime!, $time: String!, $userEmail: String!, $userName: String!, $businessId: ID!) {
  createBookings(
      data: {
        date: $date, 
        time: $time, 
        userEmail: $userEmail, 
        userName: $userName, 
        bussiness: { connect: { id: $businessId } }
      }
    ) {
      id
    }
     
}
`

export const PUBLISH_BOOKING = gql`
mutation PublishBooking($id: ID!) {
  publishBookings(where: { id: $id }) {
    id
  }
}
`
