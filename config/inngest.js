import { Inngest } from "inngest";
import connectDB from "./db";
import User from "@/models/User.model";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "quickcart-next" });

// innjest function to save user data to database

export const syncUserCreation  = inngest.createFunction({
  id:'sync-user-from-clerk'
},
{
  event:'clerk/user.created'
},
async ({event})=>{
  const {id,first_name,last_name,email_addresses,image_url} = event.data
  const userData = {
    _id:id,
    email:email_addresses[0].email_address,
    name: first_name + ' ' +last_name,
    imageUrl:image_url
  }

  await connectDB();
  const userCreated = await User.create(userData);

  try {if(User){
    console.log("User created");
  }}
  catch(error){
    return error
  }

}
)

// inngest function to update user data in database

export const syncUserUpdation  = inngest.createFunction({
  id:'update-user-from-clerk'
},
{
  event:'clerk/user.updated'
},
async ()=>{
  const {id,first_name,last_name,email_addresses,image_url} = event.data
  const userData = {
    _id:id,
    email:email_addresses[0].email_address,
    name: first_name + ' ' +last_name,
    imageUrl:image_url
  }

  await connectDB();
  const userUpdated = await User.findByIdAndUpdate(id,userData)

}
)

// inngest function to delete user from database

export const syncUserDeletion = inngest.createFunction(
  {
    id:'delete-user-with-clerk'
  },
  {event:'clerk/user.deleted'},
  async({event})=>{
    const {id} = event.data

    await connectDB;
    await User.findByIdAndDelete(id)
  }
)